import { Octokit } from '@octokit/rest';
import { readFileSync, readdirSync, statSync } from 'fs';
import { join, relative } from 'path';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
config();

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO_OWNER = process.env.GITHUB_OWNER;
const REPO_NAME = process.env.GITHUB_REPO;

if (!GITHUB_TOKEN || !REPO_OWNER || !REPO_NAME) {
  console.error('Missing required environment variables');
  process.exit(1);
}

const octokit = new Octokit({
  auth: GITHUB_TOKEN
});

// Function to get all files recursively
function getAllFiles(dir, arrayOfFiles = []) {
  const files = readdirSync(dir);

  files.forEach(file => {
    const filePath = join(dir, file);
    
    if (statSync(filePath).isDirectory()) {
      // Skip node_modules, .git, and dist directories
      if (file !== 'node_modules' && file !== '.git' && file !== 'dist') {
        arrayOfFiles = getAllFiles(filePath, arrayOfFiles);
      }
    } else {
      // Skip .env file
      if (file !== '.env') {
        arrayOfFiles.push(filePath);
      }
    }
  });

  return arrayOfFiles;
}

async function createRepository() {
  try {
    await octokit.repos.createForAuthenticatedUser({
      name: REPO_NAME,
      private: true,
      auto_init: true
    });
    console.log('Repository created successfully');
  } catch (error) {
    if (error.status !== 422) { // 422 means repo already exists
      throw error;
    }
  }
}

async function syncWithGitHub() {
  try {
    // Try to create the repository (will skip if it already exists)
    await createRepository();

    // Get the current commit SHA or create initial commit
    let currentCommitSha;
    try {
      const { data: ref } = await octokit.git.getRef({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        ref: 'heads/main'
      });
      currentCommitSha = ref.object.sha;
    } catch (error) {
      if (error.status === 404) {
        // Create initial commit if repo is empty
        const { data: commit } = await octokit.git.createCommit({
          owner: REPO_OWNER,
          repo: REPO_NAME,
          message: 'Initial commit',
          tree: (await octokit.git.createTree({
            owner: REPO_OWNER,
            repo: REPO_NAME,
            tree: []
          })).data.sha,
          parents: []
        });
        currentCommitSha = commit.sha;

        // Create main branch
        await octokit.git.createRef({
          owner: REPO_OWNER,
          repo: REPO_NAME,
          ref: 'refs/heads/main',
          sha: currentCommitSha
        });
      } else {
        throw error;
      }
    }

    // Get all files in the project
    const projectRoot = join(__dirname, '..');
    const files = getAllFiles(projectRoot);

    // Create blobs for each file
    const blobs = await Promise.all(
      files.map(async file => {
        const content = readFileSync(file, 'utf8');
        const { data } = await octokit.git.createBlob({
          owner: REPO_OWNER,
          repo: REPO_NAME,
          content,
          encoding: 'utf-8'
        });
        return {
          path: relative(projectRoot, file).replace(/\\/g, '/'),
          mode: '100644',
          type: 'blob',
          sha: data.sha
        };
      })
    );

    // Create a tree
    const { data: tree } = await octokit.git.createTree({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      base_tree: currentCommitSha,
      tree: blobs
    });

    // Create a commit
    const { data: commit } = await octokit.git.createCommit({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      message: 'Auto-sync: Update project files',
      tree: tree.sha,
      parents: [currentCommitSha]
    });

    // Update the reference
    await octokit.git.updateRef({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      ref: 'heads/main',
      sha: commit.sha
    });

    console.log('Successfully synced with GitHub!');
  } catch (error) {
    console.error('Error syncing with GitHub:', error);
    if (error.status === 404) {
      console.error('Repository not found. Please check your GitHub credentials and repository name.');
    } else if (error.status === 401) {
      console.error('Authentication failed. Please check your GitHub token.');
    }
    process.exit(1);
  }
}

syncWithGitHub();
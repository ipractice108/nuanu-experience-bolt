import { supabase } from './supabase';

export async function signUp(email: string, password: string) {
  // First check if user exists in worker_credentials
  const { data: existingUser } = await supabase
    .from('worker_credentials')
    .select('role, manager_type, name, is_active')
    .eq('email', email)
    .single();

  // If user exists in worker_credentials but is inactive, throw error
  if (existingUser && !existingUser.is_active) {
    throw new Error('This account is inactive. Please contact an administrator.');
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        role: email === 'daniel@nuanu.com' ? 'admin' : (existingUser?.role || 'member'),
        name: existingUser?.name || email.split('@')[0],
        managerType: existingUser?.manager_type
      }
    }
  });

  if (error) throw error;
  return data;
}

export async function signIn(email: string, password: string) {
  // First check if this is a test account
  const testAccounts = {
    'experience@nuanu.com': { role: 'manager', managerType: 'experience' },
    'stay@nuanu.com': { role: 'manager', managerType: 'stay' },
    'delicious@nuanu.com': { role: 'manager', managerType: 'delicious' },
    'guide@nuanu.com': { role: 'guide' },
    'daniel@nuanu.com': { role: 'admin' }
  };

  // For test accounts, allow any password
  if (testAccounts[email]) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: password || '108108' // Use provided password or default
    });

    if (error) {
      // If login fails, try signing up the test account
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password: '108108',
        options: {
          data: {
            role: testAccounts[email].role,
            managerType: testAccounts[email].managerType,
            name: email.split('@')[0]
          }
        }
      });

      if (signUpError) throw signUpError;
      
      // Try logging in again
      const { data: retryData, error: retryError } = await supabase.auth.signInWithPassword({
        email,
        password: '108108'
      });

      if (retryError) throw retryError;
      return retryData;
    }

    return data;
  }

  // For non-test accounts, check worker_credentials
  const { data: workerData } = await supabase
    .from('worker_credentials')
    .select('role, manager_type, name, is_active')
    .eq('email', email)
    .single();

  // If user exists in worker_credentials but is inactive, throw error
  if (workerData && !workerData.is_active) {
    throw new Error('This account is inactive. Please contact an administrator.');
  }

  // Proceed with normal sign in
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    if (error.message === 'Invalid login credentials') {
      throw new Error('Invalid email or password. Please try again.');
    }
    throw error;
  }

  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}
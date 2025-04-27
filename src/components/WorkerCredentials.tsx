import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { supabase } from '../lib/supabase';
import { 
  ArrowLeft, Plus, Trash2, Edit, Save, X, 
  User, Mail, Key, Shield, Building2, LogOut
} from 'lucide-react';

interface WorkerCredential {
  id: string;
  email: string;
  role: 'manager' | 'guide';
  manager_type: 'experience' | 'stay' | null;
  name: string;
  is_active: boolean;
}

export function WorkerCredentials() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [credentials, setCredentials] = useState<WorkerCredential[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingCredential, setEditingCredential] = useState<Partial<WorkerCredential> | null>(null);

  useEffect(() => {
    if (!user || !user.role || user.role !== 'admin') {
      navigate('/');
      return;
    }

    fetchCredentials();
  }, [user, navigate]);

  const fetchCredentials = async () => {
    try {
      const { data, error } = await supabase
        .from('worker_credentials')
        .select('*')
        .order('role', { ascending: true })
        .order('manager_type', { ascending: true })
        .order('name', { ascending: true });

      if (error) throw error;
      setCredentials(data || []);
    } catch (err) {
      console.error('Error fetching credentials:', err);
      setError('Failed to load worker credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCredential?.email || !editingCredential?.name || !editingCredential?.role) return;

    try {
      const { error } = await supabase
        .from('worker_credentials')
        .upsert({
          ...editingCredential,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      await fetchCredentials();
      setShowForm(false);
      setEditingCredential(null);
    } catch (err) {
      console.error('Error saving credential:', err);
      setError('Failed to save worker credential');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this worker?')) return;

    try {
      const { error } = await supabase
        .from('worker_credentials')
        .delete()
        .match({ id });

      if (error) throw error;
      await fetchCredentials();
    } catch (err) {
      console.error('Error deleting credential:', err);
      setError('Failed to delete worker credential');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-nuanu"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-nuanu hover:text-nuanu-light font-medium"
        >
          <ArrowLeft className="w-5 h-5 mr-1" />
          Back
        </button>
        <button
          onClick={handleLogout}
          className="flex items-center text-red-600 hover:text-red-700"
        >
          <LogOut className="w-5 h-5 mr-2" />
          Logout
        </button>
      </div>

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Worker Credentials</h1>
          <p className="text-gray-600">Manage login credentials for managers and guides</p>
        </div>
        <button
          onClick={() => {
            setEditingCredential({
              email: '',
              name: '',
              role: 'manager',
              manager_type: 'experience',
              is_active: true
            });
            setShowForm(true);
          }}
          className="flex items-center px-4 py-2 bg-nuanu text-white rounded-lg hover:bg-nuanu-light"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Worker
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
          {error}
        </div>
      )}

      {showForm ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">
              {editingCredential?.id ? 'Edit Worker' : 'Add New Worker'}
            </h2>
            <button
              onClick={() => {
                setShowForm(false);
                setEditingCredential(null);
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              <input
                type="text"
                value={editingCredential?.name || ''}
                onChange={(e) => setEditingCredential(prev => ({ ...prev!, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={editingCredential?.email || ''}
                onChange={(e) => setEditingCredential(prev => ({ ...prev!, email: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role
              </label>
              <select
                value={editingCredential?.role || 'manager'}
                onChange={(e) => {
                  const role = e.target.value as 'manager' | 'guide';
                  setEditingCredential(prev => ({
                    ...prev!,
                    role,
                    manager_type: role === 'guide' ? null : prev?.manager_type || 'experience'
                  }));
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              >
                <option value="manager">Manager</option>
                <option value="guide">Guide</option>
              </select>
            </div>

            {editingCredential?.role === 'manager' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Manager Type
                </label>
                <select
                  value={editingCredential?.manager_type || 'experience'}
                  onChange={(e) => setEditingCredential(prev => ({
                    ...prev!,
                    manager_type: e.target.value as 'experience' | 'stay'
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                >
                  <option value="experience">Experience Manager</option>
                  <option value="stay">Stay Manager</option>
                </select>
              </div>
            )}

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={editingCredential?.is_active ?? true}
                  onChange={(e) => setEditingCredential(prev => ({
                    ...prev!,
                    is_active: e.target.checked
                  }))}
                  className="rounded border-gray-300 text-nuanu focus:ring-nuanu"
                />
                <span className="ml-2">Active Account</span>
              </label>
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingCredential(null);
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-white bg-nuanu rounded-lg hover:bg-nuanu-light"
              >
                {editingCredential?.id ? 'Save Changes' : 'Add Worker'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {credentials.map((credential) => (
            <div
              key={credential.id}
              className={`bg-white rounded-lg shadow-md p-6 ${
                !credential.is_active ? 'opacity-60' : ''
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-nuanu/10 rounded-lg">
                    {credential.role === 'manager' ? (
                      credential.manager_type === 'experience' ? (
                        <User className="w-6 h-6 text-nuanu" />
                      ) : (
                        <Building2 className="w-6 h-6 text-nuanu" />
                      )
                    ) : (
                      <Shield className="w-6 h-6 text-nuanu" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{credential.name}</h3>
                    <p className="text-sm text-gray-500">
                      {credential.role === 'manager'
                        ? `${credential.manager_type} Manager`
                        : 'Guide'}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingCredential(credential);
                      setShowForm(true);
                    }}
                    className="p-1 text-gray-500 hover:text-gray-700"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(credential.id)}
                    className="p-1 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">{credential.email}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Key className="w-4 h-4" />
                  <span className="text-sm">Password: ********</span>
                </div>
              </div>

              {!credential.is_active && (
                <div className="mt-4 text-sm text-gray-500">
                  Account inactive
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
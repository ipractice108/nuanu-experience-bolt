export interface User {
  id: string;
  name: string;
  email: string;
  role: 'member' | 'guide' | 'manager' | 'admin';
  managerType?: 'experience' | 'stay' | 'delicious';
}
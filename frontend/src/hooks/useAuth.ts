import { useContext } from 'react';
import { AuthContext } from '../context/authContext';

export const useAuth = () => {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth phải nằm trong AuthProvider');
  return value;
};

import { useContext } from 'react';
import { AuthContext } from '../../common/contexts';

export const useAuth = () => useContext(AuthContext);

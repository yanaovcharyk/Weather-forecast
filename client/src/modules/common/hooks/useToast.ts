import { ToastContext } from '../contexts/ToastContext';
import { createSafeContext } from '../utils/createSafeContext';

export const useToast = createSafeContext(ToastContext, 'useToast');

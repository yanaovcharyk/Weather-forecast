import { ToastContext } from '@/common/contexts/ToastContext';
import { createSafeContext } from '@/common/utils/createSafeContext';

export const useToast = createSafeContext(ToastContext, 'useToast');

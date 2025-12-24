import type {
  ToastId,
  ToastPropsWithLoading,
  ToastPropsWithVariant
} from '../types/toast.types';
import { openToast, closeToast } from './toaster';

interface ToastFunctions {
  default: (data: ToastPropsWithVariant) => ToastPropsWithVariant;
  success: (data: ToastPropsWithVariant) => ToastPropsWithVariant;
  error: (data: ToastPropsWithVariant) => ToastPropsWithVariant;
  warning: (data: ToastPropsWithVariant) => ToastPropsWithVariant;
  info: (data: ToastPropsWithVariant) => ToastPropsWithVariant;
  loading: <T = unknown>(data: ToastPropsWithLoading<T>) => ToastPropsWithLoading<T>;
  close: (id: ToastId) => void;
}

export const toast: ToastFunctions = {
  default: (data: ToastPropsWithVariant) => {
    openToast({ ...data });
    return data;
  },
  success: (data: ToastPropsWithVariant) => {
    openToast({ ...data, variant: 'success' });
    return data;
  },
  error: (data: ToastPropsWithVariant) => {
    openToast({ ...data, variant: 'error' });
    return data;
  },
  warning: (data: ToastPropsWithVariant) => {
    openToast({ ...data, variant: 'warning' });
    return data;
  },
  info: (data: ToastPropsWithVariant) => {
    openToast({ ...data, variant: 'info' });
    return data;
  },
  loading: <T = unknown>(data: ToastPropsWithLoading<T>) => {
    openToast({ ...data, variant: 'loading' });
    return data;
  },
  close: (id: ToastId) => closeToast(id)
};

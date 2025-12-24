import type { HTMLProps, ReactNode } from "react";

export type Variant = "success" | "error" | "warning" | "info" | "loading";

export type ToastPosition =
  | "top-left"
  | "top-right"
  | "top-center"
  | "bottom-left"
  | "bottom-right"
  | "bottom-center";

export type Theme = "light" | "dark" | "system";

export type ToastAction = {
  content?: string | ReactNode;
  onClick: () => void | (() => Promise<void>);
}

export type ToastIcons = Record<Variant, ReactNode>;

export type ToastId = number | string;

export type ToastProps = {
  /**
   * Optionally set an ID.
   * If the ID exists, it will replace the existing notification
   */
  id?: ToastId;
  text: string;
  description?: string;
  icon?: ReactNode;
  delayDuration?: number;
  theme?: Theme;
  action?: ToastAction;
  /**
   * Set any HTML Attributes to the notification
   */
  attrs?: HTMLProps<HTMLDivElement>;
};

export type ToastLoadingType<T = unknown> = {
  promise: (() => Promise<T>) | Promise<T>;
  success: string;
  error: string;
  autoDismiss: boolean;
  onSuccess?: (data: T, id: ToastId) => void;
  onError?: (error: Error, id: ToastId) => void;
}

type ToastActionsCustomClassnames = {
  container: string;
  closeBtn: string;
  actionBtn: string;
}

export type ToastClassnames = {
  toast?: string;
  container?: string;
  icon?: string;
  content?: string;
  actions?: ToastActionsCustomClassnames;
}

export type ToastAnimations = "slide" | "swipe";

export type ToastOptions = {
  animationOnClose?: ToastAnimations;
  font?: string;
  icons?: ToastIcons;
  headless?: boolean;
  classNames?: ToastClassnames;
  defaultActionContent?: string | ReactNode;
  defaultCloseContent?: string | ReactNode;
};

export type ToasterHTMLElementProperties = Omit<
  HTMLProps<HTMLElement>,
  'aria-role' | 'aria-label' | 'role' | 'className'
>;

export type ToasterProperties = ToasterHTMLElementProperties & {
  theme?: Theme;
  maxToasts?: number;
  position?: ToastPosition;
  toastOptions?: ToastOptions;
};

export type ToastPropsWithVariant = ToastProps & {
  variant?: Variant;
}

export type ToastPropsWithLoading<T = unknown> = ToastPropsWithVariant & {
  options?: ToastLoadingType<T>;
}

export type ToastPropsInternal = ToastPropsWithVariant & {
  /**
   * @internal
   * The {@link _key_} does not change throughout the lifecycle of a toast
   */
  _key_?: string;
  /** 
   * @internal 
   * True when the toast has been updated, as opposed to created
   */
  isUpdate?: boolean;
}
import { useEffect, useState } from "react";

import type {
  ToastId,
  ToastPropsInternal,
  ToastPropsWithVariant,
  ToasterProperties,
} from "../types/toast.types";

import ToastComponent from "./toast";
import { cn, generateRandomId } from "../utils";

// Ensure openToastGlobal is initialized correctly
let openToastGlobal: (data: ToastPropsWithVariant) => void;
// Ensure closeToastGlobal is initialized correctly
let closeToastGlobal: (id: ToastId) => void;

export const Toaster = ({
  maxToasts = 4,
  position = "bottom-right",
  theme = "system",
  toastOptions,
  ...htmlProps
}: ToasterProperties) => {
  const [toasts, setToasts] = useState<ToastPropsInternal[]>([]);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Define the openToast function
  const openToast = (data: ToastPropsWithVariant) => {
    const newToast: ToastPropsInternal = {
      _key_: generateRandomId(),
      id: generateRandomId(),
      ...data,
    };
    setToasts((prevToasts) => {

      // If the `id` exists, update the notification
      let isToastUpdate = false;
      const updatedToasts = prevToasts.map(pt => {
        if (pt.id === newToast.id) {
          isToastUpdate = true;
          return {
            // Previous toast's settings
            ...pt,
            // The updated toast
            ...newToast,
          } satisfies ToastPropsInternal;
        }
        return pt
      })

      if (isToastUpdate) {
        // `newToast` is embedded, array preserves length
        return [...updatedToasts]
      }

      const isTopPosition =
        position === "top-left" ||
        position === "top-right" ||
        position === "top-center";

      if (prevToasts.length >= maxToasts) {
        return isTopPosition
          ? [newToast, ...prevToasts.slice(0, -1)]
          : [...prevToasts.slice(1), newToast];
      }

      return isTopPosition
        ? [newToast, ...prevToasts]
        : [...prevToasts, newToast];
    });
  };

  // Define the closeToast function
  const closeToast = (id: ToastId) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  // Assign openToast to the global variable
  openToastGlobal = openToast;
  // Assign closeToast to the global variable
  closeToastGlobal = closeToast;

  // Render the component
  return (
    isMounted &&
    toasts.length > 0 && (
      <section
        {...htmlProps}
        aria-label="Toast Notifications"
        role="alert"
        aria-live="polite"
        className={cn(
          "t_toasts",
          position === "top-left" ? "t_top-left" : "",
          position === "top-right" ? "t_top-right" : "",
          position === "top-center" ? "t_top-center" : "",
          position === "bottom-left" ? "t_bottom-left" : "",
          position === "bottom-right" ? "t_bottom-right" : "",
          position === "bottom-center" ? "t_bottom-center" : "",
          toastOptions?.font ? toastOptions?.font : "t_default_font",
        )}
      >
        {toasts.map((toast) => (
          <ToastComponent
            key={toast._key_}
            theme={theme}
            toastPosition={position}
            onClose={() => closeToast(toast.id!)}
            toastOptions={toastOptions}
            active={toasts.indexOf(toast) === toasts.length - 1}
            {...toast}
          />
        ))}
      </section>
    )
  );
};

// Export the openToast function:
// eslint-disable-next-line react-refresh/only-export-components
export const openToast = (data: ToastPropsWithVariant): void => {
  if (openToastGlobal) {
    openToastGlobal(data);
  } else {
    console.error(
      "🔔 <Toaster /> component is not mounted. Check toast.pheralb.dev/toaster for more information.",
    );
  }
};

// Export the closeToast function:
// eslint-disable-next-line react-refresh/only-export-components
export const closeToast = (id: ToastId): void => {
  if (closeToastGlobal) {
    closeToastGlobal(id);
  } else {
    console.error(
      "🔔 <Toaster /> component is not mounted. Check toast.pheralb.dev/toaster for more information.",
    );
  }
};

import type {
  ToastPosition,
  ToastIcons,
  ToastOptions,
  ToastPropsWithLoading,
  Variant,
  ToastPropsInternal,
} from "../types/toast.types";

import { useCallback, useEffect, useState } from "react";

import { Error, Info, Loading, Success, Warning } from "../icons";
import { useTimeout } from "../hooks/useTimeout";
import { cn, getSystemTheme, prefersReducedMotion } from "../utils";

import { iconsColors, getAnimationClass } from "./default-options";

type ToastComponentProps = ToastPropsInternal &
  Pick<ToastPropsWithLoading, "options"> & {
    toastPosition: ToastPosition;
    toastOptions?: ToastOptions;
    active?: boolean;
    onClose: () => void;
  };

const DEFAULT_DURATION = 4000;

const Toast = (props: ToastComponentProps) => {
  const [status, setStatus] = useState<Variant>(props.variant || "info");
  const [iconColor, setIconColor] = useState<string>(iconsColors[status]);
  const [toastText, setToastText] = useState<string>(props.text);
  const [isExiting, setIsExiting] = useState<boolean>(false);

  const delayDuration = props.delayDuration || DEFAULT_DURATION;

  const { pause, resume } = useTimeout(() => {
    handleCloseToast();
  }, delayDuration);

  const iconClass = cn(
    "t_icon",
    props.variant === "loading" && status === "loading" ? "t_loading" : "",
  );

  const icons: ToastIcons = {
    success: (
      <Success
        width={18}
        height={18}
        style={{ fill: iconColor }}
        className={iconClass}
      />
    ),
    error: (
      <Error
        width={18}
        height={18}
        style={{ fill: iconColor }}
        className={iconClass}
      />
    ),
    warning: (
      <Warning
        width={18}
        height={18}
        style={{ fill: iconColor }}
        className={iconClass}
      />
    ),
    info: (
      <Info
        width={18}
        height={18}
        style={{ fill: iconColor }}
        className={iconClass}
      />
    ),
    loading: (
      <Loading
        width={18}
        height={18}
        style={{ fill: iconColor }}
        className={iconClass}
      />
    ),
  };

  const IconComponent = props.toastOptions?.icons
    ? props.toastOptions?.icons[status]
    : icons[status];

  const handleCloseToast = useCallback(() => {
    setIsExiting(true);
    const animationDisabled = prefersReducedMotion();
    if (!animationDisabled) {
      setTimeout(() => {
        if (props.onClose) {
          props.onClose();
        }
      }, 300);
    } else if (props.onClose) {
      props.onClose();
    }
  }, [props]);

  const handleMouseLeave = () => {
    resume();
  };

  const handleMouseEnter = () => {
    pause();
  };

  useEffect(() => {
    if (props.variant === "loading" && props.options) {
      pause();

      const executePromise =
        typeof props.options.promise === "function"
          ? props.options.promise()
          : Promise.resolve(props.options.promise);

      executePromise
        .then((data) => {
          resume();
          setStatus("success");
          if (props.options!.autoDismiss) {
            setTimeout(() => {
              handleCloseToast();
            }, delayDuration);
          }
          setToastText(props.options!.success);
          setIconColor(iconsColors.success);
          if (props.options?.onSuccess) {
            props.options.onSuccess(data, props.id!);
          }
        })
        .catch((error) => {
          setStatus("error");
          setToastText(props.options!.error);
          setIconColor(iconsColors.error);
          if (props.options!.autoDismiss) {
            setTimeout(() => {
              handleCloseToast();
            }, delayDuration);
          }
          if (props.options?.onError) {
            props.options.onError(error, props.id!);
          }
        });
    }
  }, [
    delayDuration,
    handleCloseToast,
    pause,
    props.id,
    props.options,
    props.variant,
    resume,
  ]);

  return (
    <div
      {...props.attrs}
      role="alert"
      aria-labelledby={`toast-title-${props.id}`}
      aria-describedby={`toast-description-${props.id}`}
      title={props.text}
      className={cn(
        prefersReducedMotion()
          ? ""
          : getAnimationClass(
              isExiting,
              props.toastOptions?.animationOnClose || "slide",
              props.toastPosition,
            ),
        !props.toastOptions?.headless && props.theme === "system"
          ? getSystemTheme()
          : "",
        !props.toastOptions?.headless && props.theme === "dark"
          ? "t_dark-theme"
          : "",
        !props.toastOptions?.headless && props.theme === "light"
          ? "t_light-theme"
          : "",
        !props.toastOptions?.headless ? "t_global" : "",
        props.toastOptions?.classNames?.toast,
        props.attrs?.className,
      )}
      style={{
        zIndex: props.active ? 1000 : 999,
        ...props.attrs?.style,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
    >
      <div
        className={cn(
          !props.toastOptions?.headless ? "t_container" : "",
          props.toastOptions?.classNames?.container,
        )}
      >
        {props.variant && !props.icon ? (
          <div
            className={cn(
              !props.toastOptions?.headless ? "t_icon" : "",
              props.toastOptions?.classNames?.icon,
            )}
          >
            {IconComponent}
          </div>
        ) : (
          props.icon && (
            <div
              className={cn(
                !props.toastOptions?.headless ? "t_icon" : "",
                props.toastOptions?.classNames?.icon,
              )}
            >
              {props.icon}
            </div>
          )
        )}
        <div
          className={cn(
            !props.toastOptions?.headless ? "t_content" : "",
            props.toastOptions?.classNames?.content,
          )}
        >
          <p id={`toast-title-${props.id}`}>{toastText}</p>
          {props.description && (
            <p id={`toast-description-${props.id}`}>{props.description}</p>
          )}
        </div>
      </div>
      <div
        className={cn(
          !props.toastOptions?.headless ? "t_actions" : "",
          props.toastOptions?.classNames?.actions?.container,
        )}
      >
        {props.action && (
          <button
            onClick={props.action.onClick}
            title={
              typeof props.action.content === "string"
                ? props.action.content
                : "Action Button"
            }
            className={cn(props.toastOptions?.classNames?.actions?.actionBtn)}
          >
            {props.action.content ??
              props.toastOptions?.defaultActionContent ??
              "Action"}
          </button>
        )}
        <button
          onClick={handleCloseToast}
          title="Close toast"
          className={cn(props.toastOptions?.classNames?.actions?.closeBtn)}
        >
          {props.toastOptions?.defaultCloseContent ?? "Close"}
        </button>
      </div>
    </div>
  );
};

export default Toast;

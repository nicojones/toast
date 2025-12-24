import type {
  ToastPosition,
  ToastAnimations,
  Variant,
} from "../types/toast.types";

/* Default icon colors */

export const iconsColors: Record<Variant, string> = {
  success: "#22c55e",
  error: "#ef4444",
  warning: "#eab308",
  info: "#3b82f6",
  loading: "currentColor",
};

/* Default animations */

const ANIMATION_ENTER_MAP: Record<ToastPosition, string> = {
  "top-left": "t_slide-enter-top",
  "top-right": "t_slide-enter-top",
  "top-center": "t_slide-enter-top",
  "bottom-left": "t_slide-enter-bottom",
  "bottom-right": "t_slide-enter-bottom",
  "bottom-center": "t_slide-enter-bottom",
};

const ANIMATION_EXIT_MAP: Record<ToastPosition, string> = {
  "top-left": "t-slide-exit-top",
  "top-right": "t-slide-exit-top",
  "top-center": "t-slide-exit-top",
  "bottom-left": "t-slide-exit-bottom",
  "bottom-right": "t-slide-exit-bottom",
  "bottom-center": "t-slide-exit-bottom",
};

/* Swipe exit animations */

const ANIMATION_SWIPE_EXIT_MAP: Record<ToastPosition, string> = {
  "top-left": "t_swipe-exit-left",
  "top-right": "t_swipe-exit-right",
  "top-center": "t_swipe-exit-center",
  "bottom-left": "t_swipe-exit-left",
  "bottom-right": "t_swipe-exit-right",
  "bottom-center": "t_swipe-exit-center",
};

export const getAnimationClass = (
  isExiting: boolean,
  animationType: ToastAnimations,
  position: ToastPosition,
) => {
  if (!isExiting) {
    return ANIMATION_ENTER_MAP[position];
  }

  if (animationType === "swipe") {
    return ANIMATION_SWIPE_EXIT_MAP[position];
  }

  return ANIMATION_EXIT_MAP[position];
};

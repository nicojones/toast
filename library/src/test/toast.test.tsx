import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, test, expect, vi } from "vitest";

import { toast, Toaster } from "../main";
import {
  ToastVariantComponent,
  ToastActionsComponent,
} from "./toast-test-component";

describe("🚀 Toast notifications", () => {
  /** 📦 Display Single toast with variant: */
  test("should display a success toast", async () => {
    render(
      <>
        <Toaster position="bottom-center" theme="light" />
        <ToastVariantComponent />
      </>,
    );
    // Click the button to show the toast:
    const button = screen.getByText("Show Toast");
    fireEvent.click(button);
    await waitFor(() => {
      expect(screen.getByText("Hello Toast!")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText("This is a success toast")).toBeInTheDocument();
    });
    // Press Close Button to remove the toast:
    const closeButton = screen.getByRole("button", { name: "Close" });
    fireEvent.click(closeButton);
    await waitFor(() => {
      expect(screen.queryByText("Hello Toast!")).not.toBeInTheDocument();
    });
    await waitFor(() => {
      expect(
        screen.queryByText("This is a success toast"),
      ).not.toBeInTheDocument();
    });
  });

  test("should limit the number of visible toasts to maxToasts prop", async () => {
    // Render the toaster with a maximum of 3 toasts
    render(
      <>
        <Toaster position="top-right" theme="light" maxToasts={3} />
      </>,
    );

    // Open 6 toasts programmatically, none with explicit IDs
    await act(async () => {
      for (let i = 0; i < 6; i++) {
        toast.success({
          text: `Toast #${i + 1}`,
          description: "Test toast",
          attrs: { "data-testid": "toast-element" },
        });
      }
    });

    // Only 3 should be visible at the same time (enforced by maxToasts)
    await waitFor(() => {
      const toastContainers = screen.queryAllByTestId("toast-element");
      expect(toastContainers.length).toBe(3);
    });
  });

  /** 📦 Display Toast with Actions: */
  test("should display toast with action and handle interactions", async () => {
    const consoleSpy = vi.spyOn(console, "log");

    render(
      <>
        <Toaster position="bottom-right" theme="dark" />
        <ToastActionsComponent />
      </>,
    );

    const button = screen.getByText("Show Toast");
    fireEvent.click(button);

    // Verify toast content is displayed
    await waitFor(() => {
      expect(screen.getByText("Hello Toast!")).toBeInTheDocument();
      expect(screen.getByText("This is a success toast")).toBeInTheDocument();
    });

    // Click the action button
    const actionButton = screen.getByText("Action");
    fireEvent.click(actionButton);

    // Verify console.log was called
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith("Action clicked");
    });

    // Press Close Button to remove the toast
    const closeButton = screen.getByRole("button", { name: "Close" });
    fireEvent.click(closeButton);

    // Verify toast is removed
    await waitFor(() => {
      expect(screen.queryByText("Hello Toast!")).not.toBeInTheDocument();
      expect(
        screen.queryByText("This is a success toast"),
      ).not.toBeInTheDocument();
    });

    // Restore the original console.log
    consoleSpy.mockRestore();
  });

  /** 📦 Test the HTMLProps: */
  test("should display toast html props", async () => {
    const consoleSpy = vi.spyOn(console, "log");

    render(
      <>
        <Toaster
          position="bottom-right"
          theme="dark"
          data-testid="toast-container"
        />
        <ToastActionsComponent />
      </>,
    );

    const button = screen.getByText("Show Toast");
    fireEvent.click(button);

    // Verify toast content is displayed
    await waitFor(() => {
      expect(screen.getByText("Hello Toast!")).toBeInTheDocument();
      expect(screen.getByText("This is a success toast")).toBeInTheDocument();

      expect(screen.getByTestId("toast-element")).toBeInTheDocument();
      expect(screen.getByTestId("toast-container")).toBeInTheDocument();
    });

    // Restore the original console.log
    consoleSpy.mockRestore();
  });

  test("should update toast content on same id, preserving attrs and only one toast present", async () => {
    render(
      <>
        <Toaster
          position="bottom-right"
          theme="dark"
          data-testid="toast-container"
        />
        <button
          data-testid="success-toast-btn"
          onClick={() =>
            toast.success({
              text: "success text",
              id: "test-id",
              attrs: { "data-testid": "test" },
            })
          }
        >
          Show Success Toast
        </button>
        <button
          data-testid="error-toast-btn"
          onClick={() => toast.error({ text: "other text", id: "test-id" })}
        >
          Show Error Toast
        </button>
      </>,
    );

    // Trigger first toast with attrs
    fireEvent.click(screen.getByTestId("success-toast-btn"));

    // Check for toast using attrs and container
    await waitFor(() => {
      expect(screen.getByTestId("test")).toBeInTheDocument();
      expect(screen.getByTestId("toast-container")).toBeInTheDocument();
      expect(screen.getByText("success text")).toBeInTheDocument();
    });

    // Trigger second toast with same id but without the attrs
    fireEvent.click(screen.getByTestId("error-toast-btn"));

    // Check that the toast updates in place, attrs persist, and container has only one toast
    await waitFor(() => {
      // The test ID attr should persist
      expect(screen.getByTestId("test")).toBeInTheDocument();
      // Error text should replace old text
      expect(screen.queryByText("success text")).not.toBeInTheDocument();
      expect(screen.getByText("other text")).toBeInTheDocument();
      // Only one toast is present in the container
      const container = screen.getByTestId("toast-container");
      // Find all rendered toasts by role 'status' (assuming toast is a <div role="status"> or similar, else fallback to container childNodes)
      const toasts = container.querySelectorAll('[data-testid="test"]');
      expect(toasts.length).toBe(1);
    });
  });

  test("should close toast by id and remove it from the DOM", async () => {
    render(
      <div data-testid="toast-container">
        <Toaster position="bottom-right" theme="dark" />
        <button
          data-testid="success-toast-btn"
          onClick={() =>
            toast.success({
              text: "success text",
              id: "test-id",
              attrs: { "data-testid": "test" },
            })
          }
        >
          Show Success Toast
        </button>
      </div>,
    );

    // Trigger the toast
    fireEvent.click(screen.getByTestId("success-toast-btn"));

    // Verify toast appears and only one is present
    await waitFor(() => {
      expect(screen.getByText("success text")).toBeInTheDocument();
      expect(screen.getByTestId("test")).toBeInTheDocument();
      const container = screen.getByTestId("toast-container");
      const toasts = container.querySelectorAll('[data-testid="test"]');
      expect(toasts.length).toBe(1);
    });

    // Close the toast using its id
    act(() => toast.close("test-id"));

    // Wait for the toast to be removed
    await waitFor(() => {
      const container = screen.getByTestId("toast-container");
      const toasts = container.querySelectorAll('[data-testid="test"]');
      expect(toasts.length).toBe(0);
    });
  });
});

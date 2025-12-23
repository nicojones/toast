import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, test, expect, vi } from "vitest";

import { Toaster } from "../main";
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
          <Toaster position="bottom-right" theme="dark" data-testid='toast-container' />
          <ToastActionsComponent />
        </>,
      );
  
      const button = screen.getByText("Show Toast");
      fireEvent.click(button);
  
      // Verify toast content is displayed
      await waitFor(() => {
        expect(screen.getByText("Hello Toast!")).toBeInTheDocument();
        expect(screen.getByText("This is a success toast")).toBeInTheDocument();

        expect(screen.getByTestId('toast-element')).toBeInTheDocument();
        expect(screen.getByTestId('toast-container')).toBeInTheDocument();
      });

      // Restore the original console.log
      consoleSpy.mockRestore();
    });
});

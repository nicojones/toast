<div align="center">
  <p />
  <p>
    <b>
      An simple notification library for React. Fully customizable and lightweight.
    </b>
  </p>
</div>

<div align="center">

![React Badge](https://img.shields.io/badge/Library-61DAFB?logo=react&logoColor=000&style=flat)
![Vitest Badge](https://img.shields.io/badge/Testing-6E9F18?logo=vitest&logoColor=fff&style=flat)

</div>

## 🌟 Features

- [x] 🪴 Ultra-lightweight core.
- [x] 🦾 Fully accessible (ARIA-friendly).
- [x] 🌓 Built-in light, dark, & system themes.
- [x] 🕶️ Pause dismissal on hover.
- [x] 🌍 Customizable toast position.
- [x] 🪞 Respects user reduced-motion settings.
- [x] 🦄 100% TypeScript.
- [x] 🧩 Can run inside Shadow Root (manually import styles).
- [x] 🎛️ Fully customizable—disable all styles if desired.
- [x] 🔄 Replace/update content of already open toasts by ID.
- [x] 🚦 Close toasts programmatically.

## 🚀 Getting Started

> [!IMPORTANT]
> This library requires **React v18** or higher.

1. Install the library:

```bash
# Using npm:
npm install @nicojones/toast

# Using pnpm:
pnpm add @nicojones/toast

# Using yarn:
yarn install @nicojones/toast
```

2. Add the toast provider:

```tsx
// 📃 root.tsx

import { Toaster } from "@nicojones/toast";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
    <Toaster />
  </React.StrictMode>,
);
```

3. Usage:

```jsx
// 📃 index.tsx

import { toast } from "@nicojones/toast";

export default function Index() {
  return (
    <>
      <button
        onClick={() =>
          toast.success({
            text: "Success!",
            description: "Your action was completed successfully",
          })
        }
      >
        Show Toast
      </button>
    </>
  );
}
```

## 📖 Documentation

### Toast Variants

Show a toast with a specific variant:

```tsx
import { toast } from "@nicojones/toast";

// Default toast
toast.default({
  text: "Hello ✨",
});

// Success toast
toast.success({
  text: "Success!",
  description: "Operation completed successfully",
});

// Error toast
toast.error({
  text: "Error!",
  description: "Something went wrong",
});

// Warning toast
toast.warning({
  text: "Warning!",
  description: "Please check your input",
});

// Info toast
toast.info({
  text: "Info",
  description: "Here's some information",
});
```

### Action Buttons

Show a button and execute a custom function when clicked. The default text for the button is `Action`:

```tsx
toast.default({
  text: "A toast with action button",
  action: {
    content: "Action", // Button label
    onClick: () => {
      // Do something
      console.log("Action clicked!");
    },
  },
});
```

### Replacing Toasts by ID

You can replace an existing toast by providing the same `id`. This is useful for updating progress or preventing duplicate toasts:

```tsx
// First toast with ID
toast.info({
  id: "update-toast",
  text: "Processing...",
});

// Later, replace it with the same ID
toast.success({
  id: "update-toast",
  text: "Completed!",
});
```

### Toast Loading

Show a toast with loading state that automatically updates after a promise resolves or fails:

```tsx
const somePromise = (): Promise<Foo> => { ... }

toast.loading<Foo>({
  // Initial message:
  text: "Loading",
  options: {
    promise: somePromise(),
    success: "Ready",
    error: "Error",
    // Close toast automatically (the duration depends by delayDuration property):
    autoDismiss: true,
    // Optional:
    onSuccess: (data) => {
      // `data is of type Foo`
      console.log("Success", data);
    },
    // Optional:
    onError: (error, id) => {
      console.log("Error", error);
      // Replace the toast and use the error.message
      toast.error({text: error.message, id });
    },
  },
});
```

Example with async function:

```tsx
const fetchData = async () => {
  const response = await fetch("/api/data");
  return response.json();
};

toast.loading({
  text: "Fetching data",
  options: {
    promise: fetchData(),
    success: "Data loaded",
    error: "Failed to load data",
    autoDismiss: true,
    onSuccess: (data) => {
      console.log("Received:", data);
      // Replace the toast and use received data
      toast.success({ text: data.message, id });
    },
  },
});
```

### Closing Toasts

Close a toast programmatically using `toast.close()`:

```tsx
import { toast } from "@nicojones/toast";

// Show a toast and store its ID
const toastData = toast.info({
  text: "This will be closed",
});

// Close it later
toast.close(toastData.id);
```

Or close by the ID you provided:

```tsx
toast.info({
  id: "my-toast",
  text: "This toast has an ID",
});

// Close it using the ID
toast.close("my-toast");
```

### Custom Icon

You can use a custom icon for a toast using the `icon` property and passing
any valid `JSX.Element`.

```tsx
toast.default({
  text: "Party popper!",
  icon: <FontAwesomeIcon width={18} height={18} icon={faPoo} />,
});
```

### Custom Attributes

You can pass custom HTML attributes to the toast:

```tsx
toast.default({
  text: "Custom toast",
  attrs: {
    "aria-customized": "yes",
    "data-testid": "my-test-id",
    style: {
      color: "pink",
    },
  },
});
```

## 🍞 Toaster Component

The `<Toaster />` component is used to show toasts in your application. It accepts several props for customization.

### Position

By default, the position is `bottom-right`. You can customize the position:

```tsx
import { Toaster } from "@nicojones/toast";

<Toaster position="top-left" />
<Toaster position="top-right" />
<Toaster position="top-center" />
<Toaster position="bottom-left" />
<Toaster position="bottom-right" /> {/* default */}
<Toaster position="bottom-center" />
```

### Theme

You can set the theme of the toasts using the `theme` prop:

```tsx
<Toaster theme="light" />
<Toaster theme="dark" />
<Toaster theme="system" /> {/* default */}
```

### Max Toasts

By default, the maximum number of toasts is set to `4`. You can change this value:

```tsx
<Toaster maxToasts={8} />
```

### Toast Options

You can customize all toasts globally using the `toastOptions` prop:

```tsx
<Toaster
  toastOptions={{
    font: "font-sans",
    defaultActionContent: "Close me",
    defaultCloseContent: "Close",
    animationOnClose: "slide", // or "swipe"
  }}
/>
```

#### Custom Icons

Replace the default icons for all toasts:

```tsx
import { Info, CircleX, CircleAlert, CircleCheck, Loader } from "lucide-react";

<Toaster
  toastOptions={{
    icons: {
      info: <Info className="dark:text-blue-500" />,
      error: <CircleX className="text-red-500" />,
      warning: <CircleAlert className="text-yellow-500" />,
      success: <CircleCheck className="text-green-500" />,
      loading: <Loader className="animate-spin text-gray-500" />,
    },
  }}
/>;
```

#### Custom Styles

Extend the default styles using the `classNames` property:

```tsx
<Toaster
  toastOptions={{
    classNames: {
      toast: "bg-zinc-100 dark:bg-zinc-900",
      container: "rounded-lg",
      icon: "text-blue-500",
      content: "text-sm",
      actions: {
        container: "flex gap-2",
        closeBtn: "text-gray-500",
        actionBtn: "text-blue-600",
      },
    },
  }}
/>
```

#### Headless Mode

Disable all default styles using `headless` property. It works together with `classNames`:

```tsx
<Toaster
  toastOptions={{
    headless: true,
    classNames: {
      toast: "bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4",
      // ... other custom styles
    },
  }}
/>
```

## 🔧 Framework Guides

### Next.js

1. Add the `Toaster` to your `layout.tsx`:

```tsx
// 📃 app/layout.tsx

import { Toaster } from "@nicojones/toast";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
```

2. Use the `toast` function in client components:

```tsx
"use client";

import { toast } from "@nicojones/toast";

export default function MyComponent() {
  return (
    <button
      onClick={() =>
        toast.success({
          text: "Ready 🎉",
        })
      }
    >
      Click me!
    </button>
  );
}
```

3. (Optional) Add the styles if needed:

```tsx
// 📄 app/layout.tsx

import "@nicojones/toast/dist/styles.css";
```

### Astro

1. Add the `Toaster` to your layout with `client:load`:

```tsx
// 📄 layouts/Layout.astro

---
import { Toaster } from "@nicojones/toast";
---

<!doctype html>
<html lang="en">
  <body>
    <slot />
    <Toaster client:load />
  </body>
</html>
```

2. Create a component to trigger toasts:

```tsx
// 📄 components/showToast.tsx

import { toast } from "@nicojones/toast";

const ShowToast = () => {
  const handleClick = () => {
    toast.default({
      text: "Hello from Astro!",
    });
  };

  return (
    <button type="button" onClick={handleClick}>
      Show Toast
    </button>
  );
};

export default ShowToast;
```

3. Use the component in your pages:

```tsx
// 📄 pages/index.astro

---
import Layout from "../layouts/Layout.astro";
import ShowToast from "../components/showToast";
---

<Layout title="Welcome">
  <main>
    <ShowToast client:load />
  </main>
</Layout>
```

## 📚 API Reference

### `toast.{variant}()`

The `toast` function accepts the following options:

| Property        | Description                                                                      | Type                                                                      | Required |
| --------------- | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------- | -------- |
| `text`          | Notification title                                                               | `string`                                                                  | ✅       |
| `description`   | Toast's description                                                              | `string`                                                                  | -        |
| `icon`          | Icon to display in the toast                                                     | `ReactNode`                                                               | -        |
| `delayDuration` | Duration before the toast disappears                                             | `number` (default: `4000`)                                                | -        |
| `variant`       | Variant of the toast                                                             | `Variant`: `info`, `success`, `warning`, `error` or `loading`             | -        |
| `theme`         | Theme of the toast                                                               | `Theme` (default: `system`): `light`, `dark` or `system`                  | -        |
| `action`        | Show an _Action_ button and execute a function                                   | `{ content?: string \| ReactNode, onClick: () => void \| Promise<void> }` | -        |
| `id`            | Set a unique `id` to replace an existing toast or ensure there are no duplicates | `string` or `number`                                                      | -        |
| `attrs`         | Custom HTML attributes                                                           | `HTMLProps<HTMLDivElement>`                                               | -        |

### `toast.loading()`

The `toast.loading` function accepts the same options as above, plus:

| Property  | Description              | Type          | Required |
| --------- | ------------------------ | ------------- | -------- |
| `options` | Loading-specific options | `LoadingType` | -        |

#### `LoadingType`

| Property      | Description                                | Type                                  | Required |
| ------------- | ------------------------------------------ | ------------------------------------- | -------- |
| `promise`     | Promise or function that returns a promise | `Promise<T>` or `() => Promise<T>`    | ✅       |
| `success`     | Success message                            | `string`                              | ✅       |
| `error`       | Error message                              | `string`                              | ✅       |
| `autoDismiss` | Close toast automatically after promise    | `boolean`                             | ✅       |
| `onSuccess`   | Callback when promise resolves             | `(data: T, id: ToastId) => void`      | -        |
| `onError`     | Callback when promise rejects              | `(error: Error, id: ToastId) => void` | -        |

### `toast.close()`

Close a toast by its ID:

```tsx
toast.close(id: ToastId): void
```

### `<Toaster />`

The `<Toaster />` component accepts the following options:

| Property       | Description                                 | Type                                                                                                                                      | Required |
| -------------- | ------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| `theme`        | Theme of all toasts                         | `Theme` (default: `system`): `'light'`, `'dark'`, or `'system'`                                                                           | -        |
| `maxToasts`    | Maximum number of toasts to display         | `number` (default: `4`)                                                                                                                   | -        |
| `toastIcons`   | Replace the default icons with custom icons | `Record<Variant, ReactNode>`                                                                                                              | -        |
| `position`     | Position of the toaster on the screen       | `Position` (default: `bottom-right`): `'top-left'`, `'top-right'`, `'top-center'`, `'bottom-left'`, `'bottom-right'` or `'bottom-center'` | -        |
| `toastOptions` | Options to customize all toasts             | `ToastOptions`                                                                                                                            | -        |

### `ToastOptions`

| Property               | Description                                                     | Type                         | Required |
| ---------------------- | --------------------------------------------------------------- | ---------------------------- | -------- |
| `font`                 | Font for all toasts                                             | `string`                     | -        |
| `icons`                | Icons for all toasts                                            | `Record<Variant, ReactNode>` | -        |
| `defaultActionContent` | Default content for the action button                           | `string` or `ReactNode`      | -        |
| `defaultCloseContent`  | Default content for the close button                            | `string` or `ReactNode`      | -        |
| `headless`             | Disable all default styles. It works together with `classNames` | `boolean`                    | -        |
| `animationOnClose`     | Animation when closing toast                                    | `'slide'` or `'swipe'`       | -        |
| `classNames`           | Custom styles for all toasts                                    | `ToastClassnames`            | -        |

### `ToastClassnames`

| Property    | Description                           | Type                           | Required |
| ----------- | ------------------------------------- | ------------------------------ | -------- |
| `toast`     | Global toast style                    | `string`                       | -        |
| `container` | Toast container styles                | `string`                       | -        |
| `icon`      | Styles for the main icon of the toast | `string`                       | -        |
| `content`   | Styles for title and description      | `string`                       | -        |
| `actions`   | Styles for the buttons                | `ToastActionsCustomClassnames` | -        |

### `ToastActionsCustomClassnames`

| Property    | Description              | Type     | Required |
| ----------- | ------------------------ | -------- | -------- |
| `container` | Action buttons container | `string` | -        |
| `closeBtn`  | Close button styles      | `string` | -        |
| `actionBtn` | Action button styles     | `string` | -        |

## 🤝 Contributing

- **Library**: React 19 with tsup + Lightning CSS + Vitest for testing.

1. Fork the repository.

2. Install dependencies:

```bash
# Install pnpm globally if you don't have it:
npm install -g pnpm

# and install dependencies:
pnpm install
```

3. Commands:

```bash
# Run packages:
pnpm dev

# Build the docs & library:
pnpm build

# Test the library:
pnpm test
```

## 📃 License

MIT License - 2026.

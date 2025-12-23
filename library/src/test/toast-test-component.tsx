import { toast } from "../main";

const ToastVariantComponent = () => {
  return (
    <button
      onClick={() =>
        toast.success({
          text: "Hello Toast!",
          description: "This is a success toast",
        })
      }
    >
      Show Toast
    </button>
  );
};

const ToastActionsComponent = () => {
  return (
    <button
      onClick={() =>
        toast.success({
          text: "Hello Toast!",
          description: "This is a success toast",
          attrs: {
            // @ts-ignore valid HTML Prop
            "data-testid": "toast-element"
          },
          action: {
            content: "Action",
            onClick: () => {
              console.log("Action clicked");
            },
          },
        })
      }
    >
      Show Toast
    </button>
  );
};

export { ToastVariantComponent, ToastActionsComponent };

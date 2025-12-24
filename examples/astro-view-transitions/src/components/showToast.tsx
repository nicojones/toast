import { toast } from "@nicojones/toast";

const ShowToast = () => {
  const handleClick = () => {
    toast.default({
      text: "✨ @nicojones/toast",
    });
  };

  return (
    <button type="button" onClick={handleClick}>
      Show Toast
    </button>
  );
};

export default ShowToast;

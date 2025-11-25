import toast, { Toaster } from "react-hot-toast";

export const showSuccess = (msg) => toast.success(msg);
export const showError = (msg) => toast.error(msg);

export function ToastProvider() {
  return <Toaster position="top-right" toastOptions={{
    style: {
      background: "rgba(8,16,24,0.95)",
      color: "#fff",
      border: "1px solid rgba(255,106,0,0.2)",
      backdropFilter: "blur(6px)"
    }
  }} />;
}

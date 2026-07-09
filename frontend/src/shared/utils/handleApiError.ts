import toast from "react-hot-toast";

export function handleApiError(err: unknown, fallback = "Une erreur est survenue.") {
  const message =
    (err as any)?.response?.data?.message ||
    (err as any)?.message ||
    fallback;
  toast.error(message);
}

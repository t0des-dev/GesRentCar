import toast from "react-hot-toast";
import { AxiosError } from "axios";

export function handleApiError(err: unknown, fallback = "Une erreur est survenue.") {
  const axiosErr = err as AxiosError<{ message?: string }>;
  const message =
    axiosErr?.response?.data?.message ||
    (err instanceof Error ? err.message : null) ||
    fallback;
  toast.error(message);
}

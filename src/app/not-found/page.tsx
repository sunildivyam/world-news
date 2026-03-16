import { SectionError } from "@/components/SectionError";
import { AppError } from "@/types/AppError.class";

export default function NotFound() {
  const error: AppError = new AppError(
    "Application Error",
    "The requested resource does not exist.",
    404,
  );
  return <SectionError error={error} />;
}

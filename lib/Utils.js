export const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

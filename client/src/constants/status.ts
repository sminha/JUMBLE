export const STATUS = {
  DEFAULT: "DEFAULT",
  ERROR: "ERROR",
} as const;

export type Status = keyof typeof STATUS;

export const STATUS_STYLE: Record<Status, string> = {
  DEFAULT:
    "border-gray-2 focus:border-primary-3 transition-colors duration-200 ease-in-out",
  ERROR: "border-error",
};

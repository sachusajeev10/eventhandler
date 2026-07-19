import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

import { format } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function safeFormatDate(dateStr: string | Date | undefined | null, formatStr: string = "PPP"): string {
  if (!dateStr) return "TBD";
  try {
    const date = new Date(dateStr);
    // check for invalid date
    if (isNaN(date.getTime())) return "TBD";
    return format(date, formatStr);
  } catch (e) {
    return "TBD";
  }
}

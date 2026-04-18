import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export const TIMEZONES = [
  "Select Time Zone", "EAT (East Africa Time)", "UTC", "GMT"
];

export const YEARS = Array.from({ length: 71 }, (_, i) => (1990 + i).toString());

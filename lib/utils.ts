import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import {AxiosError} from "axios";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatDateToLocal = (
  dateStr: string,
  locale: string = 'en-US',
  formatType: 'full' | 'short' = 'full'
) => {
  const date = new Date(dateStr);
  let options: Intl.DateTimeFormatOptions;

  if (formatType === 'full') {
    options = {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    };
  } else {
    options = {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    };
  }

  const formatter = new Intl.DateTimeFormat(locale, options);
  return formatter.format(date);
};

export function isAxiosError(error: any): error is AxiosError {
  return 'isAxiosError' in error;
}

export const toPusherKey = (key: string) => {
  return key.replace(/:/g, '__')
}

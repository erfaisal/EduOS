import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, parseISO, isValid } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string | Date | null | undefined): string {
  if (!dateString) return 'N/A';
  
  const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
  
  if (!isValid(date)) return 'Invalid Date';
  
  return format(date, 'MMM d, yyyy');
}

export function formatDateTime(dateString: string | Date | null | undefined): string {
  if (!dateString) return 'N/A';
  
  const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
  
  if (!isValid(date)) return 'Invalid Date';
  
  return format(date, 'MMM d, yyyy h:mm a');
}
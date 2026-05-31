import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Conditional class names ko merge karta hai aur conflicting Tailwind classes ko dedupe - jaise cn('px-2', cond && 'px-4') me se sahi wala rehta hai
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

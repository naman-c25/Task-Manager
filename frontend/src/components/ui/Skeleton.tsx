import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

// Shimmer wala placeholder block. Multiple Skeletons jod ke loading ke time content ki shape bana lo (cards, list rows, avatar)
export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-md bg-muted',
        'after:absolute after:inset-0 after:-translate-x-full after:animate-shimmer',
        'after:bg-gradient-to-r after:from-transparent after:via-foreground/5 after:to-transparent',
        className,
      )}
      {...props}
    />
  );
}

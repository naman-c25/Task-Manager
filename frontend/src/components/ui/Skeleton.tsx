import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

/**
 * Shimmering placeholder block. Compose multiple Skeletons to mirror the shape
 * of content while it loads (cards, list rows, avatars).
 */
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

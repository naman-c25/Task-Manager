import { CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/cn';

// Brand logo + naam. Collapsed/compact jagah pe text hide kar dete hain
export function Logo({ showText = true, className }: { showText?: boolean; className?: string }) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <CheckCircle2 className="h-5 w-5" />
      </div>
      {showText && <span className="text-lg font-bold tracking-tight">TaskFlow</span>}
    </div>
  );
}

import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/cn';

interface LoaderProps {
  size?: number;
  className?: string;
  label?: string;
  /** Center the loader in a full-height container (e.g. route fallback). */
  fullScreen?: boolean;
}

/** Spinner used for inline and full-screen loading states. */
export function Loader({ size = 20, className, label, fullScreen = false }: LoaderProps) {
  const spinner = (
    <div className="flex flex-col items-center gap-3 text-muted-foreground">
      <Loader2 className={cn('animate-spin text-primary', className)} style={{ width: size, height: size }} />
      {label && <p className="text-sm">{label}</p>}
    </div>
  );

  if (fullScreen) {
    return <div className="flex min-h-screen w-full items-center justify-center bg-background">{spinner}</div>;
  }
  return spinner;
}

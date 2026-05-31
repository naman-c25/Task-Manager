import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/cn';

interface LoaderProps {
  size?: number;
  className?: string;
  label?: string;
  // Full-height container me center karna ho toh (jaise route fallback)
  fullScreen?: boolean;
}

// Inline aur full-screen loading dono ke liye spinner
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

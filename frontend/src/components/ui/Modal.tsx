import { useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/cn';
import { modalContent } from '@/animations/variants';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children?: ReactNode;
  footer?: ReactNode;
  className?: string;
}

// Accessible animated modal jo portal se render hota hai. Backdrop click aur Escape pe band, aur khule rehne par body scroll lock kar deta hai
export function Modal({ isOpen, onClose, title, description, children, footer, className }: ModalProps) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    if (isOpen) {
      document.addEventListener('keydown', onKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            variants={modalContent}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={cn(
              'relative z-10 w-full max-w-md rounded-lg border border-border bg-card shadow-elevated',
              className,
            )}
          >
            <button
              onClick={onClose}
              aria-label="Close dialog"
              className="absolute right-4 top-4 rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>

            {(title || description) && (
              <div className="flex flex-col gap-1 p-6 pb-2">
                {title && <h2 className="text-lg font-semibold tracking-tight">{title}</h2>}
                {description && <p className="text-sm text-muted-foreground">{description}</p>}
              </div>
            )}

            <div className="p-6 pt-2">{children}</div>

            {footer && <div className="flex justify-end gap-2 border-t border-border p-4">{footer}</div>}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

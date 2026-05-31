import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Logo } from './Logo';
import { UserMenu } from './UserMenu';
import { useUiStore } from '@/store/ui.store';

/** Top bar inside the dashboard. Hosts the mobile menu trigger, theme, and user menu. */
export function Navbar() {
  const setMobileNav = useUiStore((s) => s.setMobileNav);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-md md:px-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={() => setMobileNav(true)}
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="lg:hidden">
          <Logo />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  );
}

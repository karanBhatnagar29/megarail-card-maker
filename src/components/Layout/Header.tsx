import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Train, Plus, Search, LogIn, LogOut } from 'lucide-react';
import { authApi } from '@/lib/api';
import { cn } from '@/lib/utils';

interface HeaderProps {
  isAuthenticated: boolean;
  onAuthChange: () => void;
}

const Header = ({ isAuthenticated, onAuthChange }: HeaderProps) => {
  const location = useLocation();

  const handleLogout = () => {
    authApi.logout();
    onAuthChange();
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg gradient-orange flex items-center justify-center">
            <Train className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-display font-bold text-foreground">Mega-Rail</h1>
            <p className="text-[10px] text-muted-foreground -mt-1">ID Card Generator</p>
          </div>
        </Link>

        <nav className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <Link to="/cards">
                <Button 
                  variant={isActive('/cards') ? 'secondary' : 'ghost'} 
                  size="sm"
                  className="gap-2"
                >
                  <Search className="w-4 h-4" />
                  <span className="hidden sm:inline">All Cards</span>
                </Button>
              </Link>
              <Link to="/create">
                <Button 
                  variant={isActive('/create') ? 'default' : 'outline'} 
                  size="sm"
                  className={cn(
                    "gap-2",
                    isActive('/create') && "bg-primary text-primary-foreground"
                  )}
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">New Card</span>
                </Button>
              </Link>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleLogout}
                className="gap-2 text-muted-foreground hover:text-foreground"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </>
          ) : (
            <Link to="/login">
              <Button variant="default" size="sm" className="gap-2">
                <LogIn className="w-4 h-4" />
                Login
              </Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;

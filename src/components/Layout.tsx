import { Routes, Route, Link, useLocation } from 'react-router';
import { LayoutDashboard, Activity, FileText, Share2, Search, Bell, Settings, Terminal, Map as MapIcon, Database, LogOut, User as UserIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";

export function Navigation() {
  const location = useLocation();
  const { hasRole } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Logs', path: '/logs', icon: FileText },
    { name: 'Traces', path: '/traces', icon: Share2 },
    { name: 'Metrics', path: '/metrics', icon: Activity },
    { name: 'Service Map', path: '/service-map', icon: MapIcon },
  ];

  return (
    <div className="flex z-40 h-screen bg-background border-r">
      <div className="flex w-64 flex-col gap-4 p-4">
        <div className="flex items-center gap-2 mb-6 px-2 text-foreground">
          <div className="bg-primary p-1.5 rounded-md">
            <Terminal className="h-5 w-5 text-primary-foreground" />
          </div>
          <h1 className="font-bold text-lg tracking-tight">Ocular DevEx</h1>
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path}>
                <span
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>

        {hasRole('admin') && (
          <div className="mt-auto space-y-1">
            <Link to="/data-sources">
              <span className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                location.pathname === '/data-sources'
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}>
                <Database className="h-4 w-4" />
                Data Sources
              </span>
            </Link>
            <Link to="/settings">
              <span className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                location.pathname === '/settings'
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}>
                <Settings className="h-4 w-4" />
                Settings
              </span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export function Topbar() {
  const { user, logout } = useAuth();
  
  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background/95 px-6 backdrop-blur w-full">
      <div className="flex flex-1 items-center gap-4">
        <form className="w-full max-w-sm" onSubmit={(e) => e.preventDefault()}>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search traces, logs, or metrics..."
              className="w-full bg-background border rounded-md pl-9 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </form>
      </div>
      <div className="flex items-center gap-4">
        <div className="px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-xs font-medium border border-green-500/20 flex items-center gap-1.5 hidden sm:flex">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          System Healthy
        </div>
        <button className="relative text-muted-foreground hover:text-foreground inline-flex items-center justify-center p-2 rounded-md hover:bg-secondary transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-primary"></span>
        </button>
        
        <DropdownMenu>
          <DropdownMenuTrigger className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-sm font-medium border hover:ring-2 ring-primary/50 transition-all outline-none">
            {getInitials(user?.name || '')}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuGroup>
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <UserIcon className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer" onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

      </div>
    </header>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Navigation />
      <div className="flex flex-1 flex-col overflow-hidden w-full">
        <Topbar />
        <main className="flex-1 overflow-auto bg-muted/30">
          {children}
        </main>
      </div>
    </div>
  );
}

import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MessageSquare, 
  TrendingUp, 
  ClipboardList, 
  Shield, 
  Settings, 
  LogOut,
  Menu,
  X,
  Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/lib/i18n';
import { useAuthStore } from '@/stores/authStore';
import { cn } from '@/lib/utils';

interface AppLayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { key: 'dashboard', path: '/dashboard', icon: LayoutDashboard },
  { key: 'chat', path: '/chat', icon: MessageSquare },
  { key: 'positions', path: '/positions', icon: TrendingUp },
  { key: 'orders', path: '/orders', icon: ClipboardList },
  { key: 'risk', path: '/risk', icon: Shield },
  { key: 'settings', path: '/settings', icon: Settings },
];

export function AppLayout({ children }: AppLayoutProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { logout, connection, lastSyncAt, isSyncing } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const formatLastSync = (time: string | null) => {
    if (!time) return t('common.notAvailable');
    const date = new Date(time);
    return date.toLocaleTimeString();
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside className={cn(
        "fixed lg:static inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border transform transition-transform duration-200 ease-in-out lg:transform-none",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 flex items-center px-4 border-b border-sidebar-border">
            <Activity className="h-6 w-6 text-primary mr-2" />
            <span className="font-semibold text-sidebar-foreground">AI Portfolio</span>
            <button 
              className="ml-auto lg:hidden text-sidebar-foreground"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          {/* Connection status */}
          <div className="px-4 py-3 border-b border-sidebar-border">
            <div className="flex items-center gap-2">
              <div className={cn(
                "status-dot",
                connection && !connection.revokedAt ? "status-connected" : "status-disconnected",
                isSyncing && "status-syncing"
              )} />
              <span className="text-xs text-sidebar-foreground/70">
                {connection && !connection.revokedAt 
                  ? `Bybit ${connection.environment}` 
                  : 'Not connected'}
              </span>
            </div>
            {lastSyncAt && (
              <div className="text-xs text-sidebar-foreground/50 mt-1">
                {t('dashboard.lastSync')}: {formatLastSync(lastSyncAt)}
              </div>
            )}
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <NavLink
                key={item.key}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) => cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-sidebar-accent text-sidebar-primary" 
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {t(`nav.${item.key}`)}
              </NavLink>
            ))}
          </nav>
          
          {/* Logout */}
          <div className="p-4 border-t border-sidebar-border">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              {t('nav.logout')}
            </Button>
          </div>
        </div>
      </aside>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 border-b border-border flex items-center px-4 lg:px-6 bg-card/50 backdrop-blur-sm sticky top-0 z-30">
          <button 
            className="lg:hidden text-foreground mr-4"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>
          
          <div className="flex-1" />
          
          {/* Disclaimer always visible */}
          <div className="disclaimer hidden sm:block">
            {t('chat.disclaimer')}
          </div>
        </header>
        
        {/* Page content */}
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

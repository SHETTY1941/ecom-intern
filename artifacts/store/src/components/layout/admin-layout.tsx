import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { Store, LayoutDashboard, Package, ShoppingCart, Users, LogOut, ArrowLeft } from "lucide-react";
import { useGetMe, useLogout, getGetMeQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [location, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { data: me, isLoading } = useGetMe();

  const logoutMutation = useLogout({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
        toast.success("Logged out successfully");
        setLocation("/");
      }
    }
  });

  if (isLoading) {
    return <div className="min-h-screen bg-muted/20 p-8"><Skeleton className="h-full w-full rounded-2xl" /></div>;
  }

  // Redirect non-admins
  if (!me?.user || me.user.role !== 'admin') {
    setLocation("/");
    return null;
  }

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/products", label: "Products", icon: Package },
    { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  ];

  return (
    <div className="min-h-[100dvh] flex flex-col md:flex-row bg-muted/10">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-card border-r flex flex-col shrink-0">
        <div className="h-16 flex items-center px-6 border-b">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
            <Store className="h-6 w-6" />
            <span>Store Admin</span>
          </Link>
        </div>
        
        <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href || (item.href !== "/admin" && location.startsWith(item.href));
            
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium ${
                  isActive 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t space-y-2">
          <Button variant="outline" className="w-full justify-start gap-2" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4" /> Back to Store
            </Link>
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => logoutMutation.mutate()}
          >
            <LogOut className="h-4 w-4" /> Log out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="h-16 flex items-center px-6 lg:px-8 border-b bg-card shrink-0 shadow-sm">
          <div className="ml-auto flex items-center gap-4">
            <span className="text-sm font-medium text-muted-foreground">
              Signed in as <span className="text-foreground">{me.user.name}</span>
            </span>
          </div>
        </div>
        <div className="flex-1 overflow-auto p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

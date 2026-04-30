import { Link } from "wouter";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { useListMyOrders, getListMyOrdersQueryKey, useGetMe } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Package, ArrowRight, Store } from "lucide-react";
import { format } from "date-fns";

const statusColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  pending: "secondary",
  processing: "default",
  shipped: "default",
  delivered: "outline",
  cancelled: "destructive"
};

const statusLabels: Record<string, string> = {
  pending: "Pending",
  processing: "Processing",
  shipped: "On the way",
  delivered: "Delivered",
  cancelled: "Cancelled"
};

export default function Orders() {
  const { data: me, isLoading: meLoading } = useGetMe();
  
  const { data: orders, isLoading: ordersLoading } = useListMyOrders({
    query: {
      enabled: !!me?.user,
      queryKey: getListMyOrdersQueryKey()
    }
  });

  if (!meLoading && !me?.user) {
    return (
      <div className="min-h-[100dvh] flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 flex items-center justify-center py-20">
          <div className="text-center max-w-md mx-auto p-8 bg-card border rounded-2xl shadow-sm">
            <Store className="w-16 h-16 text-muted-foreground mx-auto mb-6 opacity-50" />
            <h2 className="text-2xl font-bold mb-3">Sign in to view orders</h2>
            <p className="text-muted-foreground mb-8">You need an account to track your order history.</p>
            <Button asChild size="lg" className="w-full"><Link href="/login">Log In</Link></Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const isLoading = ordersLoading || meLoading;
  const hasOrders = orders && orders.length > 0;

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background md:bg-muted/10">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-8">Order History</h1>
        
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 w-full rounded-xl" />
            ))}
          </div>
        ) : !hasOrders ? (
          <div className="text-center py-20 bg-card rounded-2xl border shadow-sm max-w-2xl mx-auto">
            <div className="w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold mb-3">No orders yet</h2>
            <p className="text-muted-foreground mb-8 max-w-sm mx-auto">When you buy from our store, your orders will appear here for easy tracking.</p>
            <Button asChild size="lg" className="px-8"><Link href="/products">Start Shopping</Link></Button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-card border rounded-2xl shadow-sm overflow-hidden hover-elevate transition-shadow">
                <div className="p-4 sm:p-6 border-b bg-muted/20 flex flex-col sm:flex-row gap-4 justify-between sm:items-center">
                  <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
                    <div>
                      <p className="text-muted-foreground mb-0.5">Order Placed</p>
                      <p className="font-medium text-foreground">{format(new Date(order.createdAt), "MMM d, yyyy")}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-0.5">Total</p>
                      <p className="font-medium text-foreground">${order.total.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-0.5">Order #</p>
                      <p className="font-medium text-foreground">{order.id.toString().padStart(6, '0')}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                    <Badge variant={statusColors[order.status]} className="px-3 py-1 text-sm font-medium">
                      {statusLabels[order.status]}
                    </Badge>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/orders/${order.id}`}>
                        View Details <ArrowRight className="ml-2 w-4 h-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
                
                <div className="p-4 sm:p-6">
                  <div className="flex -space-x-4 overflow-hidden mb-4">
                    {order.items.slice(0, 5).map((item, i) => (
                      <div key={i} className="inline-block h-16 w-16 rounded-full ring-2 ring-background bg-muted border overflow-hidden z-10" style={{ zIndex: 10 - i }}>
                        <img 
                          src={item.productImageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.productName)}&background=random`}
                          alt={item.productName}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ))}
                    {order.items.length > 5 && (
                      <div className="inline-flex h-16 w-16 items-center justify-center rounded-full ring-2 ring-background bg-muted z-0 text-xs font-medium text-muted-foreground border">
                        +{order.items.length - 5}
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">{order.items[0].productName}</span>
                    {order.items.length > 1 && ` and ${order.items.length - 1} other item${order.items.length > 2 ? 's' : ''}`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}

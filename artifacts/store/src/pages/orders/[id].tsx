import { useParams, Link, useLocation } from "wouter";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { useGetOrder, getGetOrderQueryKey, useGetMe } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Package, MapPin, CreditCard, Truck, CheckCircle2, Clock, XCircle } from "lucide-react";
import { format } from "date-fns";

const statusColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  pending: "secondary",
  processing: "default",
  shipped: "default",
  delivered: "outline",
  cancelled: "destructive"
};

const statusIcons: Record<string, any> = {
  pending: Clock,
  processing: Package,
  shipped: Truck,
  delivered: CheckCircle2,
  cancelled: XCircle
};

export default function OrderDetail() {
  const params = useParams();
  const orderId = parseInt(params.id || "0");
  const [, setLocation] = useLocation();
  const { data: me, isLoading: meLoading } = useGetMe();

  const { data: order, isLoading: orderLoading, error } = useGetOrder(orderId, {
    query: {
      enabled: !!me?.user && !!orderId,
      queryKey: getGetOrderQueryKey(orderId)
    }
  });

  if (!meLoading && !me?.user) {
    setLocation("/login");
    return null;
  }

  if (error) {
    return (
      <div className="min-h-[100dvh] flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 flex items-center justify-center py-20">
          <div className="text-center max-w-md mx-auto p-8 bg-card border rounded-2xl shadow-sm">
            <XCircle className="w-16 h-16 text-destructive mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-3">Order not found</h2>
            <p className="text-muted-foreground mb-8">We couldn't find this order. It may have been removed or you don't have access to it.</p>
            <Button asChild size="lg"><Link href="/orders">Back to Orders</Link></Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const isLoading = orderLoading || meLoading;
  const StatusIcon = order ? statusIcons[order.status] : Clock;

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background md:bg-muted/10">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <Link href="/orders" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Orders
        </Link>
        
        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-48 w-full rounded-xl" />
              <Skeleton className="h-96 w-full rounded-xl" />
            </div>
            <div className="lg:col-span-1">
              <Skeleton className="h-[500px] w-full rounded-xl" />
            </div>
          </div>
        ) : order ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 space-y-6">
              {/* Status Header */}
              <div className="bg-card border rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-3">
                    Order #{order.id.toString().padStart(6, '0')}
                    <Badge variant={statusColors[order.status]} className="px-3 py-1 text-sm font-medium ml-2">
                      <StatusIcon className="w-3.5 h-3.5 mr-1.5" />
                      <span className="capitalize">{order.status}</span>
                    </Badge>
                  </h1>
                  <p className="text-muted-foreground mt-2">
                    Placed on {format(new Date(order.createdAt), "MMMM d, yyyy 'at' h:mm a")}
                  </p>
                </div>
              </div>

              {/* Items */}
              <div className="bg-card border rounded-2xl shadow-sm overflow-hidden">
                <div className="p-6 border-b bg-muted/20">
                  <h2 className="text-xl font-semibold">Items in this order</h2>
                </div>
                <div className="divide-y">
                  {order.items.map((item) => (
                    <div key={item.id} className="p-6 flex flex-col sm:flex-row gap-6">
                      <Link href={`/products/${item.productId}`} className="shrink-0">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg bg-muted/20 border overflow-hidden">
                          <img 
                            src={item.productImageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.productName)}&background=random`} 
                            alt={item.productName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </Link>
                      
                      <div className="flex-1 flex flex-col justify-center">
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <Link href={`/products/${item.productId}`} className="font-semibold text-lg hover:text-primary transition-colors">
                              {item.productName}
                            </Link>
                            <p className="text-sm text-muted-foreground mt-1">Qty: {item.quantity}</p>
                          </div>
                          <p className="font-bold text-lg text-primary">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar Details */}
            <div className="lg:col-span-1 space-y-6">
              {/* Order Summary */}
              <div className="bg-card border rounded-2xl p-6 shadow-sm">
                <h3 className="font-semibold text-lg mb-6 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-muted-foreground" />
                  Payment Summary
                </h3>
                
                <div className="space-y-4 text-sm mb-6">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">${(order.total - 5 - (order.total - 5) * 0.08 / 1.08).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-medium">$5.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span className="font-medium">${((order.total - 5) * 0.08 / 1.08).toFixed(2)}</span>
                  </div>
                </div>
                
                <Separator className="mb-6" />
                
                <div className="flex justify-between items-end">
                  <span className="font-bold text-base">Total</span>
                  <span className="font-bold text-xl text-primary">${order.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Shipping Details */}
              <div className="bg-card border rounded-2xl p-6 shadow-sm">
                <h3 className="font-semibold text-lg mb-6 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-muted-foreground" />
                  Delivery Details
                </h3>
                
                <div className="space-y-4 text-sm">
                  <div>
                    <p className="text-muted-foreground mb-1">Shipping To</p>
                    <p className="font-medium">{order.shippingName}</p>
                    <p>{order.shippingAddress}</p>
                    <p>{order.shippingCity}, {order.shippingZip}</p>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <p className="text-muted-foreground mb-1">Contact</p>
                    <p>{order.userEmail}</p>
                    <p>{order.shippingPhone}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </main>
      
      <Footer />
    </div>
  );
}

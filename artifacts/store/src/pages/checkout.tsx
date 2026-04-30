import { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { 
  useGetCart, 
  getGetCartQueryKey,
  useCheckout,
  useGetMe,
  getListMyOrdersQueryKey
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Store, ShieldCheck, ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const checkoutSchema = z.object({
  shippingName: z.string().min(2, "Name is required"),
  shippingAddress: z.string().min(5, "Address is required"),
  shippingCity: z.string().min(2, "City is required"),
  shippingZip: z.string().min(4, "ZIP code is required"),
  shippingPhone: z.string().min(10, "Valid phone number is required"),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export default function Checkout() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { data: me, isLoading: meLoading } = useGetMe();
  
  const { data: cart, isLoading: cartLoading } = useGetCart({
    query: {
      enabled: !!me?.user,
      queryKey: getGetCartQueryKey()
    }
  });

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      shippingName: me?.user?.name || "",
      shippingAddress: "",
      shippingCity: "",
      shippingZip: "",
      shippingPhone: "",
    },
  });

  // Update default name if me loads later
  useEffect(() => {
    if (me?.user && !form.getValues().shippingName) {
      form.setValue("shippingName", me.user.name);
    }
  }, [me, form]);

  const checkoutMutation = useCheckout({
    mutation: {
      onSuccess: (order) => {
        queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() });
        queryClient.invalidateQueries({ queryKey: getListMyOrdersQueryKey() });
        toast.success("Order placed successfully!");
        setLocation(`/orders/${order.id}`);
      },
      onError: (error: any) => {
        toast.error(error.message || "Failed to place order");
      }
    }
  });

  const onSubmit = (data: CheckoutFormValues) => {
    if (!cart || cart.items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    
    checkoutMutation.mutate({ data });
  };

  // Redirect if not logged in or cart is empty
  useEffect(() => {
    if (!meLoading && !me?.user) {
      toast.error("Please log in to checkout");
      setLocation("/login");
    } else if (!cartLoading && cart && cart.items.length === 0) {
      setLocation("/cart");
    }
  }, [me, meLoading, cart, cartLoading, setLocation]);

  if (meLoading || cartLoading || !cart || cart.items.length === 0) {
    return (
      <div className="min-h-[100dvh] flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center">
            <Store className="w-12 h-12 text-primary/50 mb-4" />
            <p className="text-muted-foreground font-medium">Preparing checkout...</p>
          </div>
        </main>
      </div>
    );
  }

  const shippingCost = 5.00;
  const tax = cart.subtotal * 0.08; // 8% local tax
  const total = cart.subtotal + shippingCost + tax;

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background md:bg-muted/10">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <Link href="/cart" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Cart
        </Link>
        
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-8">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          {/* Shipping Form */}
          <div className="lg:col-span-3 bg-card border rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary text-sm">1</span>
              Delivery Information
            </h2>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="shippingName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" className="bg-background" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="shippingAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Street Address</FormLabel>
                      <FormControl>
                        <Input placeholder="123 Neighborhood Way" className="bg-background" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="shippingCity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input placeholder="Anytown" className="bg-background" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="shippingZip"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ZIP Code</FormLabel>
                        <FormControl>
                          <Input placeholder="12345" className="bg-background" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="shippingPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="(555) 123-4567" className="bg-background" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="pt-6 border-t mt-8">
                  <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary text-sm">2</span>
                    Payment
                  </h2>
                  <div className="bg-muted/50 p-4 rounded-lg border border-dashed flex items-center justify-center text-muted-foreground text-sm">
                    Payment processing is simulated for this demo. Just place your order!
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full h-14 text-base shadow-sm mt-8"
                  disabled={checkoutMutation.isPending}
                >
                  {checkoutMutation.isPending ? "Processing..." : `Place Order - $${total.toFixed(2)}`}
                </Button>
              </form>
            </Form>
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card border rounded-2xl p-6 shadow-sm sticky top-24">
              <h3 className="font-semibold text-xl mb-6">Order Summary</h3>
              
              <div className="space-y-4 mb-6 overflow-y-auto max-h-60 pr-2">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-md bg-muted/20 border overflow-hidden shrink-0">
                      <img 
                        src={item.product.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.product.name)}&background=random`} 
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm line-clamp-1">{item.product.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium text-sm shrink-0">${(item.product.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              
              <Separator className="mb-6" />
              
              <div className="space-y-3 mb-6 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">${cart.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Local Delivery</span>
                  <span className="font-medium">${shippingCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Estimated Tax</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>
              </div>
              
              <Separator className="mb-6" />
              
              <div className="flex justify-between items-end mb-6">
                <span className="font-bold text-lg">Total</span>
                <span className="font-bold text-2xl text-primary">${total.toFixed(2)}</span>
              </div>
              
              <div className="bg-primary/5 rounded-lg p-4 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-sm text-foreground">Secure Checkout</p>
                  <p className="text-xs text-muted-foreground mt-1">Your data is encrypted and secure.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { 
  useGetCart, 
  getGetCartQueryKey,
  useUpdateCartItem,
  useRemoveCartItem,
  useClearCart,
  useGetMe
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function Cart() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { data: me, isLoading: meLoading } = useGetMe();
  
  // Local state for optimistic updates during typing
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const { data: cart, isLoading: cartLoading } = useGetCart({
    query: {
      enabled: !!me?.user,
      queryKey: getGetCartQueryKey()
    }
  });

  const updateItemMutation = useUpdateCartItem({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() });
        setUpdatingId(null);
      },
      onError: () => {
        toast.error("Failed to update quantity");
        setUpdatingId(null);
      }
    }
  });

  const removeItemMutation = useRemoveCartItem({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() });
        toast.success("Item removed from cart");
      },
      onError: () => {
        toast.error("Failed to remove item");
      }
    }
  });

  const clearCartMutation = useClearCart({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() });
        toast.success("Cart cleared");
      },
      onError: () => {
        toast.error("Failed to clear cart");
      }
    }
  });

  const handleUpdateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setUpdatingId(productId);
    updateItemMutation.mutate({
      id: productId,
      data: { quantity: newQuantity }
    });
  };

  const handleRemove = (productId: number) => {
    removeItemMutation.mutate({ id: productId });
  };

  const handleClear = () => {
    clearCartMutation.mutate(undefined);
  };

  if (!meLoading && !me?.user) {
    return (
      <div className="min-h-[100dvh] flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 flex items-center justify-center py-20">
          <div className="text-center max-w-md mx-auto p-8 bg-card border rounded-2xl shadow-sm">
            <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-6 opacity-50" />
            <h2 className="text-2xl font-bold mb-3">Sign in to view your cart</h2>
            <p className="text-muted-foreground mb-8">You need an account to add items and checkout.</p>
            <div className="flex flex-col gap-3">
              <Button asChild size="lg"><Link href="/login">Log In</Link></Button>
              <Button asChild variant="outline" size="lg"><Link href="/register">Create an Account</Link></Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const isLoading = cartLoading || meLoading;
  const isCartEmpty = !cart || cart.items.length === 0;

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background md:bg-muted/10">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-8">Your Cart</h1>
        
        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <Skeleton className="h-32 w-full rounded-xl" />
              <Skeleton className="h-32 w-full rounded-xl" />
              <Skeleton className="h-32 w-full rounded-xl" />
            </div>
            <div className="lg:col-span-1">
              <Skeleton className="h-80 w-full rounded-xl" />
            </div>
          </div>
        ) : isCartEmpty ? (
          <div className="text-center py-20 bg-card rounded-2xl border shadow-sm max-w-2xl mx-auto">
            <div className="w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold mb-3">Your cart is empty</h2>
            <p className="text-muted-foreground mb-8 max-w-sm mx-auto">Looks like you haven't added anything yet. Discover our fresh neighborhood products.</p>
            <Button asChild size="lg" className="px-8"><Link href="/products">Start Shopping</Link></Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Cart Items */}
            <div className="lg:col-span-2 bg-card border rounded-2xl shadow-sm overflow-hidden">
              <div className="p-4 sm:p-6 border-b bg-muted/20 flex justify-between items-center">
                <span className="font-medium text-foreground">{cart.itemCount} Items</span>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Clear Cart
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Clear your cart?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will remove all items from your cart. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleClear} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        Clear Cart
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
              
              <div className="divide-y">
                {cart.items.map((item) => (
                  <div key={item.id} className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6">
                    <Link href={`/products/${item.productId}`} className="shrink-0">
                      <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-lg bg-muted/20 border overflow-hidden">
                        <img 
                          src={item.product.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.product.name)}&background=random`} 
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </Link>
                    
                    <div className="flex-1 flex flex-col">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <Link href={`/products/${item.productId}`} className="font-semibold text-base sm:text-lg hover:text-primary transition-colors line-clamp-2">
                            {item.product.name}
                          </Link>
                          <p className="text-sm text-muted-foreground mt-1 capitalize">{item.product.category}</p>
                        </div>
                        <p className="font-bold text-base sm:text-lg whitespace-nowrap text-primary">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                      
                      <div className="mt-auto pt-4 flex items-center justify-between">
                        <div className="flex items-center border rounded-md h-9 bg-background">
                          <button 
                            className="w-9 h-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                            onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                            disabled={item.quantity <= 1 || updatingId === item.productId}
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-10 text-center font-medium text-sm">
                            {updatingId === item.productId ? (
                              <span className="opacity-50">...</span>
                            ) : item.quantity}
                          </span>
                          <button 
                            className="w-9 h-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                            onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                            disabled={item.quantity >= item.product.stock || updatingId === item.productId}
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleRemove(item.productId)}
                          disabled={removeItemMutation.isPending}
                        >
                          <Trash2 className="w-4 h-4 sm:mr-2" />
                          <span className="hidden sm:inline">Remove</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card border rounded-2xl p-6 shadow-sm sticky top-24">
                <h3 className="font-semibold text-xl mb-6">Order Summary</h3>
                
                <div className="space-y-4 mb-6 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal ({cart.itemCount} items)</span>
                    <span className="font-medium">${cart.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-medium">Calculated at checkout</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span className="font-medium">Calculated at checkout</span>
                  </div>
                </div>
                
                <Separator className="mb-6" />
                
                <div className="flex justify-between items-end mb-8">
                  <span className="font-bold text-lg">Estimated Total</span>
                  <span className="font-bold text-2xl text-primary">${cart.subtotal.toFixed(2)}</span>
                </div>
                
                <Button asChild size="lg" className="w-full h-14 text-base shadow-sm">
                  <Link href="/checkout">
                    Proceed to Checkout <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
                
                <p className="text-xs text-center text-muted-foreground mt-6 flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" /> Secure local checkout
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}

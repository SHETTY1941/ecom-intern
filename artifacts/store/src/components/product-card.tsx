import { Link } from "wouter";
import { Product } from "@workspace/api-client-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAddToCart, getGetCartQueryKey, useGetMe } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useLocation } from "wouter";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  const { data: me } = useGetMe();
  
  const addToCartMutation = useAddToCart({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() });
        toast.success(`Added ${product.name} to cart`);
      },
      onError: (error: any) => {
        if (error.status === 401) {
          setLocation("/login");
          toast.error("Please log in to add items to your cart");
        } else {
          toast.error("Failed to add to cart");
        }
      }
    }
  });

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent link navigation
    e.stopPropagation();
    
    if (!me?.user) {
      toast.error("Please log in to add items to your cart");
      setLocation("/login");
      return;
    }
    
    addToCartMutation.mutate({
      data: {
        productId: product.id,
        quantity: 1
      }
    });
  };

  return (
    <Link href={`/products/${product.id}`}>
      <Card className="h-full overflow-hidden hover-elevate transition-all duration-300 group flex flex-col border-border/50 bg-card">
        <div className="relative aspect-square overflow-hidden bg-muted/20">
          {product.featured && (
            <Badge className="absolute top-2 left-2 z-10" variant="secondary">Featured</Badge>
          )}
          {product.stock <= 5 && product.stock > 0 && (
            <Badge className="absolute top-2 right-2 z-10 bg-destructive text-destructive-foreground hover:bg-destructive" variant="destructive">Only {product.stock} left!</Badge>
          )}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-background/60 z-10 flex items-center justify-center backdrop-blur-[1px]">
              <Badge variant="outline" className="text-sm font-semibold border-2 bg-background">Out of Stock</Badge>
            </div>
          )}
          <img 
            src={product.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(product.name)}&background=random`} 
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </div>
        
        <CardContent className="p-4 flex-1 flex flex-col">
          <div className="flex justify-between items-start gap-2 mb-2">
            <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">{product.name}</h3>
            <span className="font-bold text-primary">${product.price.toFixed(2)}</span>
          </div>
          
          <div className="flex items-center gap-1 mb-2 text-sm text-muted-foreground">
            <div className="flex items-center text-amber-500">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="ml-1 text-xs font-medium text-foreground">{product.avgRating.toFixed(1)}</span>
            </div>
            <span className="text-xs">({product.reviewCount})</span>
            <span className="mx-1">&bull;</span>
            <span className="text-xs truncate capitalize">{product.category}</span>
          </div>
          
          <p className="text-sm text-muted-foreground line-clamp-2 mt-auto">
            {product.description}
          </p>
        </CardContent>
        
        <CardFooter className="p-4 pt-0">
          <Button 
            className="w-full gap-2" 
            disabled={product.stock === 0 || addToCartMutation.isPending}
            onClick={handleAddToCart}
            variant={product.stock === 0 ? "outline" : "default"}
          >
            <ShoppingCart className="w-4 h-4" />
            {addToCartMutation.isPending ? "Adding..." : product.stock === 0 ? "Out of Stock" : "Add to Cart"}
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}

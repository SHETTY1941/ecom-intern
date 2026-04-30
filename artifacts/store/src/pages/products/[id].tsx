import { useState } from "react";
import { useParams, Link } from "wouter";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { 
  useGetProduct, 
  getGetProductQueryKey,
  useListProductReviews,
  getListProductReviewsQueryKey,
  useCreateProductReview,
  useAddToCart,
  getGetCartQueryKey,
  useGetMe
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Star, Minus, Plus, ShoppingCart, ArrowLeft, Package, Clock, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default function ProductDetail() {
  const params = useParams();
  const productId = parseInt(params.id || "0");
  const queryClient = useQueryClient();
  const { data: me } = useGetMe();
  
  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const { data: product, isLoading: loadingProduct, error: productError } = useGetProduct(productId, {
    query: { enabled: !!productId, queryKey: getGetProductQueryKey(productId) }
  });

  const { data: reviews, isLoading: loadingReviews } = useListProductReviews(productId, {
    query: { enabled: !!productId, queryKey: getListProductReviewsQueryKey(productId) }
  });

  const addToCartMutation = useAddToCart({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() });
        toast.success(`Added ${quantity} ${product?.name} to cart`);
        setQuantity(1);
      },
      onError: (error: any) => {
        if (error.status === 401) {
          toast.error("Please log in to add items to your cart");
        } else {
          toast.error("Failed to add to cart");
        }
      }
    }
  });

  const createReviewMutation = useCreateProductReview({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListProductReviewsQueryKey(productId) });
        queryClient.invalidateQueries({ queryKey: getGetProductQueryKey(productId) });
        toast.success("Review submitted successfully");
        setRating(5);
        setComment("");
      },
      onError: (error: any) => {
        if (error.status === 401) {
          toast.error("Please log in to leave a review");
        } else {
          toast.error(error.message || "Failed to submit review");
        }
      }
    }
  });

  const handleAddToCart = () => {
    if (!me?.user) {
      toast.error("Please log in to add items to your cart");
      return;
    }
    
    addToCartMutation.mutate({
      data: {
        productId,
        quantity
      }
    });
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!me?.user) {
      toast.error("Please log in to leave a review");
      return;
    }
    if (!comment.trim()) {
      toast.error("Please write a comment");
      return;
    }
    
    createReviewMutation.mutate({
      id: productId,
      data: {
        rating,
        comment
      }
    });
  };

  if (productError) {
    return (
      <div className="min-h-[100dvh] flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-8">The product you're looking for doesn't exist or has been removed.</p>
          <Button asChild><Link href="/products">Back to Products</Link></Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <Link href="/products" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to products
        </Link>
        
        {loadingProduct ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <Skeleton className="aspect-square rounded-2xl" />
            <div className="space-y-6">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        ) : product && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
            {/* Product Image */}
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted/20 border">
              {product.featured && (
                <Badge className="absolute top-4 left-4 z-10" variant="secondary">Featured</Badge>
              )}
              {product.stock <= 5 && product.stock > 0 && (
                <Badge className="absolute top-4 right-4 z-10 bg-destructive hover:bg-destructive text-destructive-foreground" variant="destructive">Only {product.stock} left!</Badge>
              )}
              {product.stock === 0 && (
                <div className="absolute inset-0 bg-background/60 z-10 flex items-center justify-center backdrop-blur-[2px]">
                  <Badge variant="outline" className="text-lg px-4 py-1 border-2 bg-background font-bold">Out of Stock</Badge>
                </div>
              )}
              <img 
                src={product.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(product.name)}&background=random`} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Product Info */}
            <div className="flex flex-col">
              <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                <Link href={`/products?category=${product.category}`} className="capitalize hover:text-primary transition-colors">
                  {product.category}
                </Link>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">{product.name}</h1>
              
              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl font-bold text-primary">${product.price.toFixed(2)}</span>
                
                <div className="flex items-center gap-1 bg-muted/50 px-3 py-1 rounded-full">
                  <div className="flex items-center text-amber-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="ml-1.5 font-medium text-foreground">{product.avgRating.toFixed(1)}</span>
                  </div>
                  <span className="text-muted-foreground mx-1">&bull;</span>
                  <span className="text-sm text-muted-foreground">{product.reviewCount} reviews</span>
                </div>
              </div>
              
              <p className="text-base text-muted-foreground mb-8 leading-relaxed">
                {product.description}
              </p>
              
              <Separator className="mb-8" />
              
              <div className="space-y-6 mb-8">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-foreground">Status</span>
                  <span className={product.stock > 0 ? "text-green-600 font-medium flex items-center gap-1.5" : "text-destructive font-medium flex items-center gap-1.5"}>
                    <Package className="w-4 h-4" />
                    {product.stock > 0 ? "In Stock" : "Out of Stock"}
                  </span>
                </div>
                
                {product.stock > 0 && (
                  <div className="flex items-center gap-4">
                    <span className="font-medium text-foreground mr-2">Quantity</span>
                    <div className="flex items-center border rounded-md">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-10 w-10 rounded-r-none" 
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-12 text-center font-medium">{quantity}</span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-10 w-10 rounded-l-none" 
                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                        disabled={quantity >= product.stock}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <span className="text-sm text-muted-foreground ml-2">
                      (Max {product.stock})
                    </span>
                  </div>
                )}
              </div>
              
              <div className="mt-auto pt-4 flex gap-4">
                <Button 
                  size="lg" 
                  className="flex-1 h-14 text-base gap-2" 
                  disabled={product.stock === 0 || addToCartMutation.isPending}
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="w-5 h-5" />
                  {addToCartMutation.isPending ? "Adding to Cart..." : product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 bg-primary/10 p-2 rounded-full text-primary">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-foreground">Same Day Delivery</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Order before 2 PM</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 bg-primary/10 p-2 rounded-full text-primary">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-foreground">Quality Guarantee</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Fresh & local</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Reviews Section */}
        {product && (
          <div className="mt-20 pt-16 border-t">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
              Customer Reviews 
              <Badge variant="secondary" className="text-sm font-normal px-2.5 py-0.5">{product.reviewCount}</Badge>
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Write Review */}
              <div className="lg:col-span-1">
                <div className="bg-muted/30 p-6 rounded-xl border">
                  <h3 className="font-semibold text-lg mb-4">Write a Review</h3>
                  {!me?.user ? (
                    <div className="text-center py-6 bg-background rounded-lg border border-dashed">
                      <p className="text-muted-foreground mb-4 text-sm">You must be logged in to leave a review.</p>
                      <Button asChild size="sm" variant="outline"><Link href="/login">Log in</Link></Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmitReview} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Rating</label>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((r) => (
                            <button
                              key={r}
                              type="button"
                              onClick={() => setRating(r)}
                              className={`p-1 rounded-sm transition-colors ${rating >= r ? "text-amber-500" : "text-muted-foreground/30 hover:text-amber-500/50"}`}
                            >
                              <Star className={`w-6 h-6 ${rating >= r ? "fill-current" : ""}`} />
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">Your Review</label>
                        <Textarea 
                          placeholder="What did you think of this product?" 
                          className="resize-none bg-background"
                          rows={4}
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        />
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="w-full"
                        disabled={createReviewMutation.isPending || !comment.trim()}
                      >
                        {createReviewMutation.isPending ? "Submitting..." : "Submit Review"}
                      </Button>
                    </form>
                  )}
                </div>
              </div>
              
              {/* Review List */}
              <div className="lg:col-span-2">
                {loadingReviews ? (
                  <div className="space-y-6">
                    {[1, 2].map(i => (
                      <Skeleton key={i} className="h-32 w-full rounded-xl" />
                    ))}
                  </div>
                ) : reviews && reviews.length > 0 ? (
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div key={review.id} className="pb-6 border-b last:border-0 last:pb-0">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shadow-sm">
                              {review.userName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-medium text-foreground text-sm">{review.userName}</p>
                              <p className="text-xs text-muted-foreground">{format(new Date(review.createdAt), "MMM d, yyyy")}</p>
                            </div>
                          </div>
                          <div className="flex text-amber-500">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star key={star} className={`w-4 h-4 ${review.rating >= star ? "fill-current" : "text-muted-foreground/20"}`} />
                            ))}
                          </div>
                        </div>
                        <p className="text-muted-foreground pl-13 text-sm leading-relaxed">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 bg-muted/10 rounded-xl border border-dashed h-full flex flex-col items-center justify-center">
                    <Star className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-30" />
                    <p className="text-foreground font-medium mb-1">No reviews yet</p>
                    <p className="text-muted-foreground text-sm">Be the first to review this product.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}

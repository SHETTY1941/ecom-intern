import { Link } from "wouter";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useListFeaturedProducts, useListCategories } from "@workspace/api-client-react";
import { ProductCard } from "@/components/product-card";
import { ArrowRight, Search, ShoppingBag, Truck, HeartHandshake } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const [, setLocation] = useLocation();
  const [search, setSearch] = useState("");
  
  const { data: featuredProducts, isLoading: loadingFeatured } = useListFeaturedProducts();
  const { data: categories, isLoading: loadingCategories } = useListCategories();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      setLocation(`/products?search=${encodeURIComponent(search.trim())}`);
    }
  };

  return (
    <div className="min-h-[100dvh] flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-muted/30 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img 
              src="/images/hero.png" 
              alt="Local Store Interior" 
              className="w-full h-full object-cover opacity-20 dark:opacity-10 mix-blend-multiply"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
          </div>
          
          <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
            <div className="max-w-2xl space-y-6">
              <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary/10 text-primary">
                Your neighborhood shop
              </div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground">
                Fresh goods, <br className="hidden md:block" />
                friendly faces.
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground">
                Skip the big box stores. We've got the everyday essentials you need, curated with care for our local community.
              </p>
              
              <div className="pt-4 flex flex-col sm:flex-row gap-4">
                <form onSubmit={handleSearch} className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Find something..."
                    className="pl-10 h-12 w-full bg-background border-primary/20 focus-visible:ring-primary"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <Button type="submit" className="absolute right-1 top-1 h-10" size="sm">Search</Button>
                </form>
                <Button asChild size="lg" variant="secondary" className="h-12 border border-border">
                  <Link href="/products">Shop All Products</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features / Value Props */}
        <section className="py-12 border-y bg-card">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="flex flex-col items-center space-y-3">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <ShoppingBag className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-lg">Curated Selection</h3>
                <p className="text-sm text-muted-foreground">Handpicked everyday essentials so you don't have to wade through thousands of choices.</p>
              </div>
              <div className="flex flex-col items-center space-y-3">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Truck className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-lg">Quick Local Delivery</h3>
                <p className="text-sm text-muted-foreground">Get your items delivered right to your door within hours, not days.</p>
              </div>
              <div className="flex flex-col items-center space-y-3">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <HeartHandshake className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-lg">Community First</h3>
                <p className="text-sm text-muted-foreground">When you shop with us, you're supporting a local independent business.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-16 container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Shop by Category</h2>
            <Link href="/products" className="text-primary font-medium flex items-center hover:underline">
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          
          {loadingCategories ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-32 rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-4">
              {categories?.map((category) => (
                <Link 
                  key={category.name} 
                  href={`/products?category=${encodeURIComponent(category.name)}`}
                  className="flex-1 min-w-[140px] border bg-card hover:bg-muted/50 transition-colors p-6 rounded-xl flex flex-col items-center justify-center text-center gap-2 hover-elevate"
                >
                  <span className="font-semibold capitalize text-lg">{category.name}</span>
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">{category.productCount} items</span>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Featured Products */}
        <section className="py-16 bg-muted/20">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">Featured Goods</h2>
            </div>
            
            {loadingFeatured ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-80 rounded-xl" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredProducts?.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}

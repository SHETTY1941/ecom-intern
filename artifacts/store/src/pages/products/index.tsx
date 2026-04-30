import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ProductCard } from "@/components/product-card";
import { useListProducts, useListCategories, getListProductsQueryKey } from "@workspace/api-client-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Filter, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

type SortOption = "newest" | "price_asc" | "price_desc" | "rating";

export default function Products() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  
  const initialCategory = searchParams.get("category") || "";
  const initialSearch = searchParams.get("search") || "";
  
  const [category, setCategory] = useState(initialCategory);
  const [search, setSearch] = useState(initialSearch);
  const [searchInput, setSearchInput] = useState(initialSearch);
  const [sort, setSort] = useState<SortOption>("newest");
  
  useEffect(() => {
    setCategory(searchParams.get("category") || "");
    const qSearch = searchParams.get("search") || "";
    setSearch(qSearch);
    setSearchInput(qSearch);
  }, [location]);

  const { data: categories, isLoading: loadingCategories } = useListCategories();
  
  const queryParams = { 
    ...(category ? { category } : {}), 
    ...(search ? { search } : {}), 
    ...(sort ? { sort } : {}) 
  };
  
  const { data: products, isLoading: loadingProducts } = useListProducts(
    queryParams,
    { query: { queryKey: getListProductsQueryKey(queryParams) } }
  );

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
  };

  const clearFilters = () => {
    setCategory("");
    setSearch("");
    setSearchInput("");
    setSort("newest");
  };

  const hasFilters = category !== "" || search !== "";

  return (
    <div className="min-h-[100dvh] flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              {category ? <span className="capitalize">{category}</span> : "All Products"}
            </h1>
            <p className="text-muted-foreground mt-1">
              {products ? `${products.length} products found` : "Loading products..."}
            </p>
          </div>
          
          <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
            <form onSubmit={handleSearchSubmit} className="relative flex-1 sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                className="pl-9 bg-card"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </form>
            
            <Select value={sort} onValueChange={(val) => setSort(val as SortOption)}>
              <SelectTrigger className="w-full sm:w-[180px] bg-card">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest Arrivals</SelectItem>
                <SelectItem value="price_asc">Price: Low to High</SelectItem>
                <SelectItem value="price_desc">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="w-full lg:w-64 flex-shrink-0 space-y-6">
            <div className="bg-card border rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Filter className="w-4 h-4" /> Filters
                </h3>
                {hasFilters && (
                  <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 px-2 text-xs">
                    Clear <X className="ml-1 w-3 h-3" />
                  </Button>
                )}
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-3 text-muted-foreground uppercase tracking-wider">Categories</h4>
                  {loadingCategories ? (
                    <div className="space-y-2">
                      <Skeleton className="h-6 w-full" />
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-6 w-5/6" />
                    </div>
                  ) : (
                    <ul className="space-y-2">
                      <li>
                        <button 
                          onClick={() => setCategory("")}
                          className={`text-sm w-full text-left py-1 px-2 rounded-md transition-colors ${category === "" ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted"}`}
                        >
                          All Categories
                        </button>
                      </li>
                      {categories?.map((cat) => (
                        <li key={cat.name} className="flex items-center justify-between">
                          <button 
                            onClick={() => setCategory(cat.name)}
                            className={`text-sm flex-1 text-left py-1 px-2 rounded-md transition-colors capitalize ${category === cat.name ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted"}`}
                          >
                            {cat.name}
                          </button>
                          <Badge variant="secondary" className="text-[10px] font-normal opacity-70">
                            {cat.productCount}
                          </Badge>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            {loadingProducts ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Skeleton key={i} className="h-80 rounded-xl" />
                ))}
              </div>
            ) : products && products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-muted/20 rounded-xl border border-dashed">
                <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No products found</h3>
                <p className="text-muted-foreground mb-6">
                  We couldn't find anything matching your current filters.
                </p>
                <Button onClick={clearFilters}>Clear Filters</Button>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

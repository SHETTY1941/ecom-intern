import { Store } from "lucide-react";
import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-muted/30 border-t mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl">
              <Store className="h-6 w-6 text-primary" />
              <span>Local Store</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              Your friendly neighborhood shop. We stock the everyday essentials you need, right around the corner.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4 text-foreground">Shop</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/products" className="text-muted-foreground hover:text-primary transition-colors">All Products</Link></li>
              <li><Link href="/products?category=groceries" className="text-muted-foreground hover:text-primary transition-colors">Groceries</Link></li>
              <li><Link href="/products?category=household" className="text-muted-foreground hover:text-primary transition-colors">Household</Link></li>
              <li><Link href="/products?category=kitchen" className="text-muted-foreground hover:text-primary transition-colors">Kitchen</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-foreground">Customer Service</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact Us</Link></li>
              <li><Link href="/orders" className="text-muted-foreground hover:text-primary transition-colors">Track Order</Link></li>
              <li><span className="text-muted-foreground">Shipping Policy</span></li>
              <li><span className="text-muted-foreground">Returns</span></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-foreground">Store Hours</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Mon - Fri: 8am - 9pm</li>
              <li>Saturday: 9am - 8pm</li>
              <li>Sunday: 9am - 6pm</li>
              <li className="pt-2 font-medium text-foreground">123 Neighborhood Way</li>
              <li>Anytown, ST 12345</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Local Store. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

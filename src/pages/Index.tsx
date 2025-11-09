import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { StoreFilter } from "@/components/StoreFilter";
import { ProductCard } from "@/components/ProductCard";
import { MethAIChatbot } from "@/components/MethAIChatbot";
import { Search, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import heroBanners from "@/assets/hero-banners.jpg";
import { apiClient, Product } from "@/lib/api";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiClient.getProducts();
        setProducts(data);
      } catch (err) {
        setError("Failed to load products. Please try again later.");
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const searchProducts = async () => {
      if (searchQuery.trim()) {
        try {
          setLoading(true);
          const data = await apiClient.searchProducts(searchQuery);
          setProducts(data);
        } catch (err) {
          setError("Failed to search products.");
          console.error("Error searching products:", err);
        } finally {
          setLoading(false);
        }
      } else {
        // Reload all products when search is cleared
        const fetchProducts = async () => {
          try {
            setLoading(true);
            const data = await apiClient.getProducts();
            setProducts(data);
          } catch (err) {
            setError("Failed to load products.");
            console.error("Error fetching products:", err);
          } finally {
            setLoading(false);
          }
        };
        fetchProducts();
      }
    };

    const timeoutId = setTimeout(searchProducts, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const filteredProducts = products;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 opacity-90"
          style={{ 
            backgroundImage: `url(${heroBanners})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="relative container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in double-gradient">
              Discover Best Deals Across Top Stores
            </h1>
            <p className="text-lg md:text-xl mb-8 opacity-95 animate-fade-in double-gradient-subtle" style={{ animationDelay: '0.1s' }}>
              Compare prices from Flipkart, Myntra, and Meesho - All in one place
            </p>
            <div className="flex gap-4 justify-center items-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <TrendingUp className="w-6 h-6 animate-pulse" />
              <span className="text-sm font-medium">Trending Products Updated Daily. Only under ₹1000 Price Range Product Listed.</span>
            </div>
          </div>
        </div>
      </section>

      {/* Search & Filter Section */}
      <section className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-md mx-auto mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <StoreFilter />
        </div>
      </section>

      {/* Products Grid */}
      <section className="container mx-auto px-4 py-12">
        <div className="mb-8 animate-fade-in">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            All Products ₹1000 Deals
          </h2>
          <p className="text-muted-foreground">
            Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
          </p>
        </div>

        {loading ? (
          <div className="text-center py-20 animate-fade-in">
            <p className="text-xl text-muted-foreground">Loading products...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20 animate-fade-in">
            <p className="text-xl text-destructive">{error}</p>
            <p className="text-sm text-muted-foreground mt-2">Make sure the backend server is running on https://fullstack-dealshop00.onrender.com/</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 animate-fade-in">
            <p className="text-xl text-muted-foreground">No products found. Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product, index) => (
              <div 
                key={product.id}
                className="animate-fade-in hover-scale"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <ProductCard {...product} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* MethAI Chatbot */}
      <MethAIChatbot />

      {/* Footer */}
      <footer className="bg-muted mt-20 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2024 DealHub. Find the best deals from top e-commerce stores.</p>
          <p className="text-sm mt-2">Affiliate links may earn us a commission at no extra cost to you.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;

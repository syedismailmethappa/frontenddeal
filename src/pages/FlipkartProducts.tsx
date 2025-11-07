import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { ProductCard } from "@/components/ProductCard";
import { Search, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { apiClient, Product } from "@/lib/api";

const FlipkartProducts = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiClient.getProductsByStore("Flipkart");
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

  const filteredProducts = products.filter((product) => {
    if (!searchQuery.trim()) return true;
    return product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
           product.category.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Flipkart Header */}
      <section className="bg-gradient-to-r from-[#FF9900] to-[#FFB84D] text-white py-12">
        <div className="container mx-auto px-4">
          <Button variant="secondary" size="sm" asChild className="mb-4">
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to All Products
            </Link>
          </Button>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center">
              <span className="text-2xl font-bold text-[#FF9900]">a</span>
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold">Flipkart Products</h1>
              <p className="text-lg opacity-95">Discover amazing deals on electronics and more</p>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="sticky top-16 z-40 bg-background/95 backdrop-blur-sm border-b shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                type="text"
                placeholder="Search Flipkart products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            All Flipkart Products
          </h2>
          <p className="text-muted-foreground">
            Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
          </p>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <p className="text-xl text-muted-foreground">Loading products...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-xl text-destructive">{error}</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-muted-foreground">No products found. Try adjusting your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        )}
      </section>

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

export default FlipkartProducts;

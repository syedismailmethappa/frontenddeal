import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";

interface ProductCardProps {
  title: string;
  price: string;
  image: string;
  store: string;
  affiliateLink: string;
  category: string;
}

const storeColors = {
  Flipkart: "bg-[#FF9900] text-white",
  myntra: "bg-[#EE5F73] text-white",
  meesho: "bg-[#9F2089] text-white",
};

export const ProductCard = ({ title, price, image, store, affiliateLink, category }: ProductCardProps) => {
  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-[var(--shadow-card-hover)] bg-gradient-to-b from-card to-card/95">
      <div className="relative overflow-hidden aspect-square bg-muted">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <Badge className={`absolute top-2 right-2 ${storeColors[store as keyof typeof storeColors]}`}>
          {store.charAt(0).toUpperCase() + store.slice(1)}
        </Badge>
      </div>
      <CardContent className="p-4">
        <div className="mb-2">
          <Badge variant="secondary" className="text-xs">
            {category}
          </Badge>
        </div>
        <h3 className="font-semibold line-clamp-2 mb-2 min-h-[3rem] double-gradient">
          {title}
        </h3>
        <p className="text-2xl font-bold text-primary">{price}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button 
          className="w-full gap-2 bg-accent hover:bg-accent/90" 
          asChild
        >
          <a href={affiliateLink} target="_blank" rel="noopener noreferrer">
            View Deal <ExternalLink className="w-4 h-4" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
};

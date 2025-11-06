import myn from '../assets/myn.jpg';
import flip from '../assets/flip.png';
export interface Product {
  id: number;
  title: string;
  price: string;
  image: string;
  store: "Flipkart" | "myntra" | "meesho";
  affiliateLink: string;
  category: string;
}

export const products: Product[] = [
  {
    id: 1,
    title: "GLOBAL Sports shoes, Walking, Lightweight, Trekking, Stylish Running Shoes For Men  (White , 9)",
    price: "₹927",
    image: flip,
    store: "Flipkart",
    affiliateLink: "https://fktr.in/D9EAR1W",
    category: "shoes",
  },
  {
    id: 2,
    title: "Men's Casual Cotton T-Shirt - Pack of 3",
    price: "₹799",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80",
    store: "myntra",
    affiliateLink: "https://myntra.com",
    category: "Fashion",
  },
  {
    id: 3,
    title: "Women's Ethnic Kurta Set with Dupatta",
    price: "₹599",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500&q=80",
    store: "meesho",
    affiliateLink: "https://meesho.com",
    category: "Ethnic Wear",
  },
  {
    id: 4,
    title: "Smart Watch with Fitness Tracker",
    price: "₹3,499",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80",
    store: "Flipkart",
    affiliateLink: "https://Flipkart.in",
    category: "Electronics",
  },
  {
    id: 5,
    title: "HRX by Hrithik Roshan Unisex Back To School Shoes",
    price: "₹999",
  image: myn,
    store: "myntra",
    affiliateLink: "https://myntr.it/4F2uIFi",
    category: "Footwear",
  },
  {
    id: 6,
    title: "Kitchen Cookware Set - Non Stick",
    price: "₹899",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&q=80",
    store: "meesho",
    affiliateLink: "https://meesho.com",
    category: "Home & Kitchen",
  },
  {
    id: 7,
    title: "Backpack Laptop Bag with USB Charging Port",
    price: "₹1,199",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80",
    store: "Flipkart",
    affiliateLink: "https://Flipkart.in",
    category: "Bags",
  },
  {
    id: 8,
    title: "Women's Designer Handbag",
    price: "₹1,599",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500&q=80",
    store: "myntra",
    affiliateLink: "https://myntra.com",
    category: "Accessories",
  },
  {
    id: 9,
    title: "Portable Bluetooth Speaker - Waterproof",
    price: "₹1,899",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&q=80",
    store: "Flipkart",
    affiliateLink: "https://Flipkart.in",
    category: "Electronics",
  },
  {
    id: 10,
    title: "Men's Running Shoes - Lightweight",
    price: "₹1,499",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80",
    store: "myntra",
    affiliateLink: "https://myntra.com",
    category: "Footwear",
  },
  {
    id: 11,
    title: "Bedsheet Set with Pillow Covers",
    price: "₹699",
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=500&q=80",
    store: "meesho",
    affiliateLink: "https://meesho.com",
    category: "Home & Kitchen",
  },
  {
    id: 12,
    title: "Wireless Mouse - Ergonomic Design",
    price: "₹599",
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&q=80",
    store: "Flipkart",
    affiliateLink: "https://Flipkart.in",
    category: "Electronics",
  },
];

export const getProductsByStore = (store: "Flipkart" | "myntra" | "meesho") => {
  return products.filter((product) => product.store === store);
};

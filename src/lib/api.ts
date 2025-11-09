// Remove trailing slash from base URL to avoid double slashes
const getApiBaseUrl = () => {
  const url = import.meta.env.VITE_API_BASE_URL || 'https://fullstack-dealshop2.onrender.com';
  const baseUrl = url.endsWith('/') ? url.slice(0, -1) : url;
  console.log('API Base URL:', baseUrl);
  return baseUrl;
};

const API_BASE_URL = getApiBaseUrl();

export interface Product {
  id: number;
  title: string;
  price: string;
  image: string;
  store: "Flipkart" | "myntra" | "meesho";
  affiliateLink: string;
  category: string;
  created_at?: string;
  updated_at?: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    return response.json();
  }

  async getProducts(): Promise<Product[]> {
    try {
      const data = await this.request<{ results?: Product[]; count?: number } | Product[]>('/products/');
      // Handle paginated response (Django REST Framework pagination)
      if (Array.isArray(data)) {
        return data;
      }
      // Handle paginated response with results key
      if (data && typeof data === 'object' && 'results' in data) {
        return data.results || [];
      }
      return [];
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  async getProduct(id: number): Promise<Product> {
    return this.request<Product>(`/products/${id}/`);
  }

  async getProductsByStore(store: "Flipkart" | "myntra" | "meesho"): Promise<Product[]> {
    return this.request<Product[]>(`/products/by_store/?store=${store}`);
  }

  async searchProducts(query: string): Promise<Product[]> {
    if (!query.trim()) {
      return this.getProducts();
    }
    return this.request<Product[]>(`/products/search/?q=${encodeURIComponent(query)}`);
  }
}

export const apiClient = new ApiClient(API_BASE_URL);


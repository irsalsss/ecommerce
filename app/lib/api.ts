// API client for NestJS backend
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'http://localhost:3001/api' 
  : 'http://localhost:3001/api';

interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    // Get token from localStorage if available
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('auth_token', token);
      } else {
        localStorage.removeItem('auth_token');
      }
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = response.ok ? await response.json() : null;

      return {
        data,
        status: response.status,
        error: response.ok ? undefined : data?.message || 'Request failed',
      };
    } catch (error) {
      return {
        status: 0,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  // Auth methods
  async login(email: string, password: string) {
    const response = await this.request<{
      access_token: string;
      user: {
        id: string;
        email: string;
        name: string;
        role: string;
      };
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.data?.access_token) {
      this.setToken(response.data.access_token);
    }

    return response;
  }

  async register(email: string, password: string, name?: string) {
    const response = await this.request<{
      access_token: string;
      user: {
        id: string;
        email: string;
        name: string;
        role: string;
      };
    }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });

    if (response.data?.access_token) {
      this.setToken(response.data.access_token);
    }

    return response;
  }

  logout() {
    this.setToken(null);
  }

  // User methods
  async getProfile() {
    return this.request('/users/profile');
  }

  // Product methods
  async getProducts(params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.search) searchParams.set('search', params.search);
    if (params?.category) searchParams.set('category', params.category);

    const queryString = searchParams.toString();
    return this.request(`/products${queryString ? `?${queryString}` : ''}`);
  }

  async getProduct(id: string) {
    return this.request(`/products/${id}`);
  }

  async getProductBySlug(slug: string) {
    return this.request(`/products/slug/${slug}`);
  }

  // Category methods
  async getCategories() {
    return this.request('/categories');
  }

  async getCategory(id: string) {
    return this.request(`/categories/${id}`);
  }

  async getCategoryBySlug(slug: string) {
    return this.request(`/categories/slug/${slug}`);
  }

  // Cart methods
  async getCart() {
    return this.request('/cart');
  }

  async addToCart(productId: string, quantity: number) {
    return this.request('/cart/add', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    });
  }

  async updateCartItem(productId: string, quantity: number) {
    return this.request('/cart/update', {
      method: 'PATCH',
      body: JSON.stringify({ productId, quantity }),
    });
  }

  async removeFromCart(productId: string) {
    return this.request(`/cart/remove/${productId}`, {
      method: 'DELETE',
    });
  }

  async clearCart() {
    return this.request('/cart/clear', {
      method: 'DELETE',
    });
  }

  async getCartTotal() {
    return this.request('/cart/total');
  }

  // Order methods
  async createOrder(orderData: {
    shippingAddress: {
      firstName: string;
      lastName: string;
      company?: string;
      address1: string;
      address2?: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
      phone?: string;
    };
    billingAddress?: {
      firstName: string;
      lastName: string;
      company?: string;
      address1: string;
      address2?: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
      phone?: string;
    };
  }) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async getOrders(params?: { page?: number; limit?: number }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());

    const queryString = searchParams.toString();
    return this.request(`/orders${queryString ? `?${queryString}` : ''}`);
  }

  async getOrder(id: string) {
    return this.request(`/orders/${id}`);
  }
}

// Export singleton instance
export const apiClient = new ApiClient(API_BASE_URL);
export default apiClient;

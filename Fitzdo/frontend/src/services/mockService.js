import { mockProducts, mockUser, mockToken } from '../data/mockData';

// Simulate API delay
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

// Mock Auth Service
export const mockAuthService = {
  async signin(email, password) {
    await delay();

    // Check hardcoded admin credentials
    if (email === 'admin@example.com' && password === 'admin1234') {
      return {
        success: true,
        data: {
          token: mockToken,
          user: mockUser
        }
      };
    }

    // For any other credentials, return error
    return {
      success: false,
      error: 'Invalid credentials'
    };
  },

  async signup(name, email, password) {
    await delay();

    // For demo purposes, always succeed with signup
    const newUser = {
      id: 'user-' + Date.now(),
      name,
      email
    };

    return {
      success: true,
      data: {
        token: mockToken,
        user: newUser
      }
    };
  },

  async getMe(token) {
    await delay();

    if (token === mockToken) {
      return {
        success: true,
        data: { user: mockUser }
      };
    }

    return {
      success: false,
      error: 'Invalid token'
    };
  }
};

// Mock Product Service
export const mockProductService = {
  async getProducts(params = {}) {
    await delay();

    let filteredProducts = [...mockProducts];

    // Apply search filter
    if (params.q) {
      const query = params.q.toLowerCase();
      filteredProducts = filteredProducts.filter(p =>
        p.title.toLowerCase().includes(query) ||
        p.brand.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (params.category) {
      filteredProducts = filteredProducts.filter(p =>
        p.category.toLowerCase() === params.category.toLowerCase()
      );
    }

    // Apply price filter
    if (params.minPrice) {
      filteredProducts = filteredProducts.filter(p => p.price >= params.minPrice);
    }
    if (params.maxPrice && params.maxPrice < 999999) {
      filteredProducts = filteredProducts.filter(p => p.price <= params.maxPrice);
    }

    // Apply rating filter
    if (params.minRating) {
      filteredProducts = filteredProducts.filter(p => p.rating >= params.minRating);
    }

    // Apply sponsored filter
    if (params.sponsored === 'true') {
      filteredProducts = filteredProducts.filter(p =>
        p.tags && p.tags.includes('Fitzdo Sponsored')
      );
    }

    // Apply sorting
    if (params.sort) {
      switch (params.sort) {
        case 'price':
          filteredProducts.sort((a, b) => a.price - b.price);
          break;
        case '-price':
          filteredProducts.sort((a, b) => b.price - a.price);
          break;
        case '-rating':
          filteredProducts.sort((a, b) => b.rating - a.rating);
          break;
        case '-discountPercent':
          filteredProducts.sort((a, b) => b.discountPercent - a.discountPercent);
          break;
        case '-createdAt':
        default:
          // Already in default order
          break;
      }
    }

    // Apply pagination
    const page = parseInt(params.page) || 1;
    const limit = parseInt(params.limit) || 12;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
    const totalPages = Math.ceil(filteredProducts.length / limit);

    return {
      success: true,
      data: {
        items: paginatedProducts,
        pagination: {
          page,
          limit,
          total: filteredProducts.length,
          pages: totalPages
        }
      }
    };
  },

  async getProductById(id) {
    await delay();

    const product = mockProducts.find(p => p._id === id);

    if (product) {
      return {
        success: true,
        data: product
      };
    }

    return {
      success: false,
      error: 'Product not found'
    };
  }
};

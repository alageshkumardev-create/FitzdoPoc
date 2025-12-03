# FITZDO - MERN E-commerce Starter

A production-ready MERN stack e-commerce application featuring a complete product listing page with authentication, search, filtering, and pagination.

![FITZDO Logo](https://img.shields.io/badge/FITZDO-Fitness%20%26%20Training-orange)

---

## 🚀 Features

### Backend
- **Express.js** REST API with MongoDB
- **JWT Authentication** (signup, signin, protected routes)
- **Product API** with search, filtering, sorting, and pagination
- **Seed Script** with 50+ realistic fitness products
- Request validation and error handling

### Frontend
- **React 18** with Vite for fast development
- **TailwindCSS** for responsive, modern UI
- **React Router** for navigation
- **AuthContext** for centralized auth state
- **Reusable Components**: ProductCard, SearchBar, FilterPanel, Pagination
- **Optimized Rendering** with useMemo, useCallback, and React.memo
- **Debounced Search** to reduce API calls
- **Loading Skeletons** for better UX

---

## 📁 Project Structure

```
fitzdo-starter/
├─ backend/
│  ├─ server.js                  # Express server
│  ├─ routes/
│  │  ├─ auth.js                 # Authentication routes
│  │  └─ products.js             # Product routes
│  ├─ models/
│  │  ├─ User.js                 # User schema
│  │  └─ Product.js              # Product schema
│  ├─ middleware/
│  │  └─ auth.js                 # JWT verification
│  ├─ data/
│  │  └─ products.json           # Seed data
│  └─ seed.js                    # Database seeder
├─ frontend/
│  └─ src/
│     ├─ api/
│     │  └─ apiClient.js         # Axios client
│     ├─ context/
│     │  └─ AuthContext.jsx      # Auth provider
│     ├─ hooks/
│     │  └─ useAuth.js           # Auth hook
│     ├─ pages/
│     │  ├─ SignIn.jsx
│     │  ├─ SignUp.jsx
│     │  ├─ ProductList.jsx
│     │  └─ ProductDetail.jsx
│     ├─ components/
│     │  ├─ ProductCard.jsx
│     │  ├─ SearchBar.jsx
│     │  ├─ FilterPanel.jsx
│     │  ├─ Pagination.jsx
│     │  ├─ SkeletonCard.jsx
│     │  └─ ProtectedRoute.jsx
│     └─ utils/
│        ├─ token.js             # Token management
│        └─ format.js            # Formatting helpers
└─ README.md
```

---

## 🛠️ Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 18, Vite, TailwindCSS, React Router, Axios |
| **Backend** | Node.js, Express, MongoDB, Mongoose |
| **Authentication** | JWT (jsonwebtoken), bcryptjs |
| **Development** | Nodemon, PostCSS, Autoprefixer |

---

## 📦 Quick Start

### Prerequisites
- Node.js 16+ and npm
- MongoDB running locally or connection string

### 1. Clone and Install

```bash
# Clone the repository
git clone <your-repo-url>
cd fitzdo-starter

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Environment Setup

**Backend** (`backend/.env`):
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/fitzdo
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
```

**Frontend** (`frontend/.env`):
```env
VITE_API_URL=http://localhost:5000
```

### 3. Seed Database

```bash
cd backend
npm run seed
```

Expected output:
```
✓ Connected to MongoDB
✓ Cleared existing products
✓ Inserted 50 products
✓ Database seeding completed successfully!
```

### 4. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 5. Open Application

Navigate to **http://localhost:3000**

---

## 🔐 API Endpoints

### Authentication

| Method | Endpoint | Description | Protected |
|--------|----------|-------------|-----------|
| POST | `/api/auth/signup` | Create new user | No |
| POST | `/api/auth/signin` | Authenticate user | No |
| GET | `/api/auth/me` | Get current user | Yes |

**Example signup request:**
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'
```

### Products

| Method | Endpoint | Description | Query Params |
|--------|----------|-------------|--------------|
| GET | `/api/products` | List products | `q`, `page`, `limit`, `sort`, `category`, `minPrice`, `maxPrice`, `minRating`, `sponsored` |
| GET | `/api/products/:id` | Get product detail | - |

**Example product search:**
```bash
curl "http://localhost:5000/api/products?q=dumbbell&page=1&limit=12"
```

---

## 🎨 UI Features

### Product List Page
- ✅ Search bar with 500ms debouncing
- ✅ Category filters (11 categories)
- ✅ Price range filter
- ✅ Rating filter (minimum 1-4 stars)
- ✅ "Fitzdo Sponsored" filter
- ✅ Sorting (Most Recent, Price, Rating, Discount)
- ✅ Pagination with smart page numbers
- ✅ Loading skeletons during fetch
- ✅ Error handling with retry

### Product Card
- ✅ Product image with sponsored badge
- ✅ Brand and title
- ✅ Star rating with count
- ✅ Price with strikethrough MRP
- ✅ Discount badge
- ✅ Delivery information

### Authentication
- ✅ SignIn/SignUp forms with validation
- ✅ Error messages for invalid input
- ✅ JWT token persistence in localStorage
- ✅ Automatic redirect to products after auth
- ✅ Protected routes for authenticated users only

---

## 🧪 Testing

### Backend API Test

```bash
# Test signup
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@test.com","password":"test123"}'

# Test products list
curl http://localhost:5000/api/products?page=1&limit=12

# Test search
curl "http://localhost:5000/api/products?q=treadmill"
```

### Frontend Manual Test
1. Open http://localhost:3000
2. Sign up with new account
3. Verify redirect to product list
4. Test search functionality
5. Apply filters and verify results update
6. Test pagination
7. Click product card to view details
8. Sign out and verify redirect to signin

---

## 🚢 Deployment

### Backend (Docker)

Create `backend/Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["node", "server.js"]
```

Build and run:
```bash
docker build -t fitzdo-backend .
docker run -p 5000:5000 -e MONGO_URI=<your-mongo-uri> -e JWT_SECRET=<secret> fitzdo-backend
```

### Frontend (Netlify/Vercel)

```bash
cd frontend
npm run build
# Deploy the 'dist' folder
```

Set environment variable:
- `VITE_API_URL`: Your production backend URL

---

## 🔧 Development Notes

### React Performance Optimizations
- **useMemo**: Computed product cards, rating stars, discount badges
- **useCallback**: Stable filter/search handlers
- **useEffect cleanup**: Cancel pending requests on unmount
- **Debounced search**: 500ms delay reduces API calls

### API Client Features
- Request interceptor: Automatically attaches JWT token
- Response interceptor: Handles 401 errors and forces logout
- Base URL from environment variable

### Security
- Passwords hashed with bcrypt (10 salt rounds)
- JWT tokens with 7-day expiration
- Protected routes require valid token
- CORS enabled for cross-origin requests

---

## 📝 Future Enhancements

- [ ] Shopping cart functionality
- [ ] Wishlist feature
- [ ] Product reviews and ratings
- [ ] Order management
- [ ] Payment integration (Stripe/Razorpay)
- [ ] Email verification
- [ ] Password reset flow
- [ ] Admin dashboard
- [ ] Product inventory management
- [ ] Image upload with optimization

---

## 📄 License

MIT License

---

## 👤 Author

Created for FITZDO - Fitness & Training Equipment

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

**Happy Coding! 💪🏋️**

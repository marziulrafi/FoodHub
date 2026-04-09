# FoodHub - Full Stack Food Ordering Platform

FoodHub is a comprehensive food ordering and management platform that connects customers with food providers (restaurants/sellers) through a centralized digital marketplace. The platform enables customers to discover and order meals, providers to manage their menus and orders, and admins to oversee the entire ecosystem.

## Live Links
🔗 [Frontend](https://foodhub-seven-navy.vercel.app)

🔗 [Backend API](https://foodhub-server-seven.vercel.app)

🔗 [Server Repository](https://github.com/marziulrafi/FoodHub-Server)

## Project Overview

### For Customers
- Browse meals from multiple providers
- Add meals to cart and checkout
- Track order status in real-time
- View order history and manage profile
- Rate meals and providers

### For Providers
- Register and get approved by admin
- Add, edit, and manage meal catalog
- Track incoming orders and update status
- View order details and customer information
- Monitor sales and analytics

### For Admins
- Approve/reject provider registrations
- Manage categories and platform content
- Review user and provider lists
- Monitor platform activity

## Core Features
- **Authentication**: Email/password with JWT + session cookies (Better Auth)
- **Role-Based Access Control**: Three distinct user roles (CUSTOMER, PROVIDER, ADMIN)
- **Meal Management**: Create, read, update, delete meals with images
- **Order Processing**: Order creation, tracking, and status management
- **Provider Workflow**: Registration, approval process, and profile management
- **Image Hosting**: Cloudinary integration for meal and profile images
- **Cart Management**: Shopping cart with persistent state
- **Real-Time Notifications**: Toast alerts for all operations
- **Input Validation**: Zod schemas for request validation
- **Error Handling**: Comprehensive error responses and user feedback

## Tech Stack Overview

### Frontend
- React 19 (UI Library)
- Next.js (Full-stack framework)
- TypeScript
- Tailwind CSS (Styling)
- Axios (HTTP Client)
- Zustand (State Management)
- React Query (Data Fetching)
- Better Auth React Client

## Project Structure
```
src/
├── app/
│   ├── (public)/ - Login and registration pages
│   ├── (customer)/ - Customer dashboard, orders, profile, cart
│   ├── (provider)/ - Provider dashboard, menu management, orders
│   ├── (admin)/ - Admin pages for users, providers, categories, orders
│   └── meals/, providers/ - Meal and provider detail pages
├── lib/
│   ├── api.ts - Axios API client with base URL normalization
│   ├── auth-client.ts - Better Auth client configuration
│   └── uploadImage.ts - Cloudinary image upload helpers
├── components/ - Shared UI components
├── hooks/ - Custom React hooks
└── stores/ - Zustand state management (cart)
```

## Key Workflows

### Customer Workflow
1. **Register** → Email verification
2. **Login** → Browse meals
3. **Add to Cart** → Update cart items
4. **Checkout** → Create order
5. **Track Order** → View order status
6. **Manage Profile** → Update info

### Provider Workflow
1. **Register** → Enter restaurant details
2. **Wait for Admin Approval** → Status check
3. **Once Approved** → Access provider dashboard
4. **Add Meals** → Create menu items with images
5. **Manage Orders** → Update order status
6. **View Analytics** → Track sales and ratings

### Admin Workflow
1. **Login** → Use seeded admin credentials
2. **Review Providers** → Approve/reject registrations
3. **Manage Categories** → Create/edit meal categories
4. **Monitor Orders** → Track platform activity
5. **Manage Users** → View and manage user accounts

## Database Schema
- **User**: Email, password hash, role, status, profile info
- **ProviderProfile**: Restaurant details, menu, ratings
- **Meal**: Name, price, category, provider reference
- **Order**: Items, customer, status, delivery info
- **OrderItem**: Individual items in an order
- **Review**: Rating and comments on meals
- **Category**: Meal categories (breakfast, lunch, etc.)
- **Session**: Auth session tracking
- **Account**: OAuth provider accounts

## API Key Endpoints

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/logout` - User logout
- `GET /api/v1/auth/me` - Get current user

### Meals
- `GET /api/v1/meals` - Get all meals (paginated)
- `GET /api/v1/meals/:id` - Get meal details
- `POST /api/v1/meals` - Create meal (provider only)
- `PATCH /api/v1/meals/:id` - Update meal (provider only)
- `DELETE /api/v1/meals/:id` - Delete meal (provider only)

### Orders
- `GET /api/v1/orders` - Get user's orders
- `POST /api/v1/orders` - Create new order
- `GET /api/v1/orders/:id` - Get order details
- `PATCH /api/v1/orders/:id` - Update order status

### Providers
- `GET /api/v1/providers` - List all providers
- `GET /api/v1/providers/:id` - Get provider details

### Categories
- `GET /api/v1/categories` - Get all categories
- `POST /api/v1/admin/categories` - Create category (admin only)

### Image Upload
- `POST /api/v1/cloudinary/upload` - Upload image to Cloudinary

## Deployment
- Deployed on Vercel
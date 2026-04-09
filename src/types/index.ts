export type Role = "CUSTOMER" | "PROVIDER" | "ADMIN";
export type OrderStatus =
  | "PLACED"
  | "PREPARING"
  | "READY"
  | "DELIVERED"
  | "CANCELLED";
export type UserStatus = "ACTIVE" | "SUSPENDED";
export type ProviderStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: UserStatus;
  image?: string;
  phone?: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string;
}

export interface ProviderProfile {
  id: string;
  userId: string;
  restaurantName: string;
  description?: string;
  address?: string;
  banner?: string;
  logo?: string;
  city?: string;
  phone?: string;
  cuisineTypes?: string[];
  status?: ProviderStatus;
  isVerified: boolean;
  rating: number;
  totalOrders?: number;
  totalReviews?: number;
  user?: Pick<User, "id" | "name" | "email" | "image">;
  meals?: Meal[];
}

export interface Meal {
  id: string;
  providerId: string;
  categoryId?: string;
  title: string;
  description?: string;
  price: number;
  image?: string;
  isAvailable: boolean;
  isVegetarian: boolean;
  isVegan: boolean;
  createdAt: string;
  provider?: Pick<ProviderProfile, "restaurantName">;
  category?: Pick<Category, "name" | "slug">;
  reviews?: Review[];
}

export interface OrderItem {
  id: string;
  orderId: string;
  mealId: string;
  quantity: number;
  price: number;
  name: string;
  meal?: Pick<Meal, "id" | "title" | "image">;
}

export interface Order {
  id: string;
  customerId: string;
  providerId: string;
  status: OrderStatus;
  address: string;
  totalAmount: number;
  note?: string;
  createdAt: string;
  updatedAt: string;
  items?: OrderItem[];
  provider?: Pick<ProviderProfile, "restaurantName">;
  customer?: Pick<User, "id" | "name" | "email">;
}

export interface Review {
  id: string;
  userId: string;
  mealId: string;
  rating: number;
  comment?: string;
  createdAt: string;
  customer?: Pick<User, "id" | "name" | "image">;
}

export interface CartItem {
  meal: Meal;
  quantity: number;
}

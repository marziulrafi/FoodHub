export type Role = "customer" | "provider" | "admin";
export type OrderStatus =
  | "placed"
  | "preparing"
  | "ready"
  | "delivered"
  | "cancelled";
export type UserStatus = "active" | "suspended";

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
  coverImage?: string;
  isOpen: boolean;
  user?: Pick<User, "id" | "name" | "email" | "image">;
  meals?: Meal[];
}

export interface Meal {
  id: string;
  providerId: string;
  categoryId?: string;
  name: string;
  description?: string;
  price: string;
  image?: string;
  isAvailable: boolean;
  isVegetarian: boolean;
  isVegan: boolean;
  createdAt: string;
  provider?: Pick<ProviderProfile, "restaurantName" | "isOpen">;
  category?: Pick<Category, "name" | "slug">;
  reviews?: Review[];
}

export interface OrderItem {
  id: string;
  orderId: string;
  mealId: string;
  quantity: number;
  unitPrice: string;
  subtotal: string;
  meal?: Pick<Meal, "id" | "name" | "image">;
}

export interface Order {
  id: string;
  customerId: string;
  providerId: string;
  status: OrderStatus;
  deliveryAddress: string;
  totalAmount: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  items?: OrderItem[];
  provider?: Pick<ProviderProfile, "restaurantName">;
  customer?: Pick<User, "id" | "name" | "email">;
}

export interface Review {
  id: string;
  customerId: string;
  mealId: string;
  orderId: string;
  rating: number;
  comment?: string;
  createdAt: string;
  customer?: Pick<User, "id" | "name" | "image">;
}

export interface CartItem {
  meal: Meal;
  quantity: number;
}

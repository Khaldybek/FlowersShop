export interface Bouquet {
  id: number
  name: string
  description: string
  price: number
  discount_percentage?: number
  category_id: number
  images: string[]
  is_available: boolean
  is_featured: boolean
  created_at: string
  updated_at: string
}

export interface Category {
  id: number
  name: string
  description: string
  image_url: string
  sort_order: number
  is_active: boolean
}

export interface CartItem {
  bouquet_id: number
  name: string
  price: number
  quantity: number
  image: string
  discount_percentage?: number
}

export interface Cart {
  items: CartItem[]
  total: number
  discount: number
  finalTotal: number
}

export interface OrderForm {
  customer_name: string
  phone: string
  email: string
  delivery_address: string
  delivery_date: string
  delivery_time: string
  payment_method: "card" | "cash"
  notes?: string
}

export interface Order extends OrderForm {
  id: number
  items: CartItem[]
  total_amount: number
  status: "pending" | "confirmed" | "delivered" | "cancelled"
  created_at: string
}

export interface UploadResponse {
  url: string
  filename: string
}

export interface PaginationInfo {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
}

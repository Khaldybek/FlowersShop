import type { Bouquet, Category, OrderForm, CartItem, Order, UploadResponse } from "./types"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

class ApiClient {
  private baseUrl: string
  private token: string | null = null

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("admin_token")
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    }

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`
    }

    try {
      console.log(`API Request: ${url}`, options.method || "GET")
      const response = await fetch(url, {
        ...options,
        headers,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error(`API Error (${response.status}):`, errorData)
        throw new Error(errorData.message || `API Error: ${response.status}`)
      }

      const data = await response.json()
      console.log(`API Response:`, data)
      return data
    } catch (error) {
      console.error("API Request failed:", error)
      throw error
    }
  }

  // Authentication
  async login(username: string, password: string) {
    const response = await this.request<{ token: string }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    })

    this.token = response.token
    if (typeof window !== "undefined") {
      localStorage.setItem("admin_token", response.token)
    }

    return response
  }

  // Bouquets
  async getBouquets(params?: {
    page?: number
    limit?: number
    category?: number
    search?: string
    sort?: string
    order?: "asc" | "desc"
  }) {
    const searchParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString())
        }
      })
    }

    try {
      const result = await this.request<{
        bouquets: Bouquet[]
        total: number
        page: number
        totalPages: number
      }>(`/api/bouquets?${searchParams}`)

      return {
        bouquets: result.bouquets || [],
        total: result.total || 0,
        page: result.page || 1,
        totalPages: result.totalPages || 1,
      }
    } catch (error) {
      console.error("getBouquets error:", error)
      return {
        bouquets: [],
        total: 0,
        page: 1,
        totalPages: 1,
      }
    }
  }

  async getBouquet(id: number) {
    return this.request<Bouquet>(`/api/bouquets/${id}`)
  }

  async createBouquet(bouquet: Omit<Bouquet, "id" | "created_at" | "updated_at">) {
    return this.request<Bouquet>("/api/bouquets", {
      method: "POST",
      body: JSON.stringify(bouquet),
    })
  }

  async updateBouquet(id: number, bouquet: Partial<Bouquet>) {
    return this.request<Bouquet>(`/api/bouquets/${id}`, {
      method: "PUT",
      body: JSON.stringify(bouquet),
    })
  }

  async deleteBouquet(id: number) {
    return this.request(`/api/bouquets/${id}`, {
      method: "DELETE",
    })
  }

  // Categories
  async getCategories() {
    try {
      const result = await this.request<Category[] | { categories: Category[] }>("/api/categories")

      // Обрабатываем разные форматы ответа
      if (Array.isArray(result)) {
        return result
      } else if (result && typeof result === "object" && "categories" in result) {
        return result.categories
      } else {
        console.error("Unexpected categories response format:", result)
        return []
      }
    } catch (error) {
      console.error("getCategories error:", error)
      return []
    }
  }

  async createCategory(category: Omit<Category, "id">) {
    return this.request<Category>("/api/categories", {
      method: "POST",
      body: JSON.stringify(category),
    })
  }

  async updateCategory(id: number, category: Partial<Category>) {
    return this.request<Category>(`/api/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(category),
    })
  }

  async deleteCategory(id: number) {
    return this.request(`/api/categories/${id}`, {
      method: "DELETE",
    })
  }

  async getCategory(id: number) {
    return this.request<Category>(`/api/categories/${id}`)
  }

  // Orders
  async createOrder(order: OrderForm & { items: CartItem[]; total_amount: number }) {
    return this.request<Order>("/api/orders", {
      method: "POST",
      body: JSON.stringify(order),
    })
  }

  async getOrders(params?: {
    page?: number
    limit?: number
    status?: string
  }) {
    const searchParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString())
        }
      })
    }

    try {
      const result = await this.request<{
        orders: Order[]
        total: number
        page: number
        totalPages: number
      }>(`/api/orders?${searchParams}`)

      return {
        orders: result.orders || [],
        total: result.total || 0,
        page: result.page || 1,
        totalPages: result.totalPages || 1,
      }
    } catch (error) {
      console.error("getOrders error:", error)
      return {
        orders: [],
        total: 0,
        page: 1,
        totalPages: 1,
      }
    }
  }

  async getOrder(id: number) {
    return this.request<Order>(`/api/orders/${id}`)
  }

  async updateOrder(id: number, order: Partial<Order>) {
    return this.request<Order>(`/api/orders/${id}`, {
      method: "PUT",
      body: JSON.stringify(order),
    })
  }

  async deleteOrder(id: number) {
    return this.request(`/api/orders/${id}`, {
      method: "DELETE",
    })
  }

  // File Upload
  async uploadImage(file: File, type: "bouquets" | "categories"): Promise<UploadResponse> {
    const formData = new FormData()
    formData.append("image", file)

    try {
      console.log(`Uploading image to ${this.baseUrl}/api/upload/${type}`)
      const response = await fetch(`${this.baseUrl}/api/upload/${type}`, {
        method: "POST",
        headers: this.token ? { Authorization: `Bearer ${this.token}` } : {},
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error(`Upload error (${response.status}):`, errorData)
        throw new Error(errorData.message || `Upload failed: ${response.status}`)
      }

      const data = await response.json()
      console.log("Upload response:", data)
      return data
    } catch (error) {
      console.error("uploadImage error:", error)
      throw error
    }
  }

  async uploadMultipleImages(files: File[]): Promise<UploadResponse[]> {
    const formData = new FormData()
    files.forEach((file) => {
      formData.append("images", file)
    })

    try {
      console.log(`Uploading multiple images to ${this.baseUrl}/api/upload/bouquets/multiple`)
      const response = await fetch(`${this.baseUrl}/api/upload/bouquets/multiple`, {
        method: "POST",
        headers: this.token ? { Authorization: `Bearer ${this.token}` } : {},
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error(`Multiple upload error (${response.status}):`, errorData)
        throw new Error(errorData.message || `Upload failed: ${response.status}`)
      }

      const data = await response.json()
      console.log("Multiple upload response:", data)
      return data
    } catch (error) {
      console.error("uploadMultipleImages error:", error)
      throw error
    }
  }
}

export const apiClient = new ApiClient(API_BASE_URL)

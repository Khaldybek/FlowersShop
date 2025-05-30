"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect } from "react"
import type { CartItem, Cart, Bouquet } from "@/types"

interface CartContextType {
  cart: Cart
  addToCart: (bouquet: Bouquet, quantity?: number) => void
  removeFromCart: (bouquetId: number) => void
  updateQuantity: (bouquetId: number, quantity: number) => void
  clearCart: () => void
  getItemCount: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

type CartAction =
  | { type: "ADD_ITEM"; payload: { bouquet: Bouquet; quantity: number } }
  | { type: "REMOVE_ITEM"; payload: { bouquetId: number } }
  | { type: "UPDATE_QUANTITY"; payload: { bouquetId: number; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "LOAD_CART"; payload: Cart }

function calculateTotals(items: CartItem[]): { total: number; discount: number; finalTotal: number } {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const discount = items.reduce((sum, item) => {
    if (item.discount_percentage) {
      return sum + (item.price * item.quantity * item.discount_percentage) / 100
    }
    return sum
  }, 0)
  const finalTotal = total - discount

  return { total, discount, finalTotal }
}

function cartReducer(state: Cart, action: CartAction): Cart {
  switch (action.type) {
    case "ADD_ITEM": {
      const { bouquet, quantity } = action.payload
      const existingItemIndex = state.items.findIndex((item) => item.bouquet_id === bouquet.id)

      let newItems: CartItem[]
      if (existingItemIndex >= 0) {
        newItems = state.items.map((item, index) =>
          index === existingItemIndex ? { ...item, quantity: item.quantity + quantity } : item,
        )
      } else {
        const newItem: CartItem = {
          bouquet_id: bouquet.id,
          name: bouquet.name,
          price: bouquet.price,
          quantity,
          image: bouquet.images[0] || "",
          discount_percentage: bouquet.discount_percentage,
        }
        newItems = [...state.items, newItem]
      }

      const totals = calculateTotals(newItems)
      return { items: newItems, ...totals }
    }

    case "REMOVE_ITEM": {
      const newItems = state.items.filter((item) => item.bouquet_id !== action.payload.bouquetId)
      const totals = calculateTotals(newItems)
      return { items: newItems, ...totals }
    }

    case "UPDATE_QUANTITY": {
      const { bouquetId, quantity } = action.payload
      if (quantity <= 0) {
        const newItems = state.items.filter((item) => item.bouquet_id !== bouquetId)
        const totals = calculateTotals(newItems)
        return { items: newItems, ...totals }
      }

      const newItems = state.items.map((item) => (item.bouquet_id === bouquetId ? { ...item, quantity } : item))
      const totals = calculateTotals(newItems)
      return { items: newItems, ...totals }
    }

    case "CLEAR_CART":
      return { items: [], total: 0, discount: 0, finalTotal: 0 }

    case "LOAD_CART":
      return action.payload

    default:
      return state
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0,
    discount: 0,
    finalTotal: 0,
  })

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("flower-shop-cart")
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart)
        dispatch({ type: "LOAD_CART", payload: parsedCart })
      } catch (error) {
        console.error("Failed to load cart from localStorage:", error)
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("flower-shop-cart", JSON.stringify(cart))
  }, [cart])

  const addToCart = (bouquet: Bouquet, quantity = 1) => {
    dispatch({ type: "ADD_ITEM", payload: { bouquet, quantity } })
  }

  const removeFromCart = (bouquetId: number) => {
    dispatch({ type: "REMOVE_ITEM", payload: { bouquetId } })
  }

  const updateQuantity = (bouquetId: number, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { bouquetId, quantity } })
  }

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" })
  }

  const getItemCount = () => {
    return cart.items.reduce((total, item) => total + item.quantity, 0)
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}

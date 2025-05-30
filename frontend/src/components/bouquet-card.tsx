"use client"

import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Heart } from "lucide-react"
import type { Bouquet } from "@/types"
import { useCart } from "@/contexts/cart-context"
import { useState } from "react"

interface BouquetCardProps {
  bouquet: Bouquet
}

export function BouquetCard({ bouquet }: BouquetCardProps) {
  const { addToCart } = useCart()
  const [isLoading, setIsLoading] = useState(false)

  const handleAddToCart = async () => {
    setIsLoading(true)
    try {
      addToCart(bouquet, 1)
    } finally {
      setIsLoading(false)
    }
  }

  const discountedPrice = bouquet.discount_percentage
      ? bouquet.price * (1 - bouquet.discount_percentage / 100)
      : bouquet.price

  return (
      <Card className="group overflow-hidden hover:shadow-lg transition-shadow">
        <div className="relative aspect-square overflow-hidden">
          <Image
              src={"http://localhost:3001"+bouquet.images[0] || "/placeholder.svg?height=300&width=300"}
              alt={bouquet.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {bouquet.discount_percentage && (
              <Badge className="absolute top-2 left-2 bg-red-500">-{bouquet.discount_percentage}%</Badge>
          )}
          {bouquet.is_featured && <Badge className="absolute top-2 right-2 bg-yellow-500">Хит</Badge>}
          <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Heart className="h-4 w-4" />
          </Button>
        </div>

        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2">{bouquet.name}</h3>
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{bouquet.description}</p>
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg text-pink-600">{discountedPrice.toLocaleString("ru-RU")} ₽</span>
            {bouquet.discount_percentage && (
                <span className="text-sm text-muted-foreground line-through">
              {bouquet.price.toLocaleString("ru-RU")} ₽
            </span>
            )}
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <Button onClick={handleAddToCart} disabled={!bouquet.is_available || isLoading} className="w-full">
            <ShoppingCart className="h-4 w-4 mr-2" />
            {bouquet.is_available ? "В корзину" : "Нет в наличии"}
          </Button>
        </CardFooter>
      </Card>
  )
}

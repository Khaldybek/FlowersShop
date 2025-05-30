"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/contexts/cart-context"
import { ShoppingCart, Plus, Minus, Trash2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function CartPage() {
    const { cart, updateQuantity, removeFromCart, clearCart } = useCart()

    if (cart.items.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Card className="w-full max-w-md text-center">
                    <CardContent className="pt-6">
                        <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold mb-2">Корзина пуста</h2>
                        <p className="text-gray-600 mb-4">Добавьте букеты в корзину для оформления заказа</p>
                        <Link href="/catalog">
                            <Button className="w-full">Перейти в каталог</Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold mb-8">Корзина</h1>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-4">
                            {cart.items.map((item) => (
                                <Card key={item.bouquet_id}>
                                    <CardContent className="p-6">
                                        <div className="flex gap-4">
                                            <div className="relative w-24 h-24 flex-shrink-0">
                                                <Image
                                                    src={item.image || "/placeholder.svg?height=96&width=96"}
                                                    alt={item.name}
                                                    fill
                                                    className="object-cover rounded-lg"
                                                />
                                            </div>

                                            <div className="flex-1">
                                                <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
                                                <div className="flex items-center gap-2 mb-3">
                                                    <span className="font-bold text-pink-600">{item.price.toLocaleString("ru-RU")} ₽</span>
                                                    {item.discount_percentage && (
                                                        <span className="text-sm bg-red-100 text-red-600 px-2 py-1 rounded">
                              -{item.discount_percentage}%
                            </span>
                                                    )}
                                                </div>

                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => updateQuantity(item.bouquet_id, item.quantity - 1)}
                                                            className="h-8 w-8 p-0"
                                                        >
                                                            <Minus className="h-4 w-4" />
                                                        </Button>
                                                        <span className="w-12 text-center font-medium">{item.quantity}</span>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => updateQuantity(item.bouquet_id, item.quantity + 1)}
                                                            className="h-8 w-8 p-0"
                                                        >
                                                            <Plus className="h-4 w-4" />
                                                        </Button>
                                                    </div>

                                                    <div className="flex items-center gap-4">
                            <span className="font-semibold">
                              {(item.price * item.quantity).toLocaleString("ru-RU")} ₽
                            </span>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => removeFromCart(item.bouquet_id)}
                                                            className="text-red-500 hover:text-red-700"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}

                            <div className="flex justify-between items-center pt-4">
                                <Button variant="outline" onClick={clearCart}>
                                    Очистить корзину
                                </Button>
                                <Link href="/catalog">
                                    <Button variant="outline">Продолжить покупки</Button>
                                </Link>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <Card className="sticky top-4">
                                <CardHeader>
                                    <CardTitle>Итого</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span>Товары ({cart.items.reduce((sum, item) => sum + item.quantity, 0)}):</span>
                                            <span>{cart.total.toLocaleString("ru-RU")} ₽</span>
                                        </div>
                                        {cart.discount > 0 && (
                                            <div className="flex justify-between text-sm text-green-600">
                                                <span>Скидка:</span>
                                                <span>-{cart.discount.toLocaleString("ru-RU")} ₽</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between text-sm">
                                            <span>Доставка:</span>
                                            <span className="text-green-600">Бесплатно</span>
                                        </div>
                                        <Separator />
                                        <div className="flex justify-between font-semibold text-lg">
                                            <span>К оплате:</span>
                                            <span>{cart.finalTotal.toLocaleString("ru-RU")} ₽</span>
                                        </div>
                                    </div>

                                    <Link href="/checkout" className="block">
                                        <Button className="w-full bg-pink-600 hover:bg-pink-700">Оформить заказ</Button>
                                    </Link>

                                    <p className="text-xs text-gray-600 text-center">
                                        Бесплатная доставка по городу при заказе от 2000 ₽
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

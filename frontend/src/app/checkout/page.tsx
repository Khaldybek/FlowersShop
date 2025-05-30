"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/contexts/cart-context"
import { apiClient } from "@/lib/api"
import { ShoppingCart, CreditCard, Banknote, MapPin, User } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function CheckoutPage() {
    const { cart, clearCart } = useCart()
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        customer_name: "",
        phone: "",
        email: "",
        delivery_address: "",
        delivery_date: "",
        delivery_time: "",
        payment_method: "card" as "card" | "cash",
        notes: "",
    })

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const orderData = {
                ...formData,
                items: cart.items,
                total_amount: cart.finalTotal,
            }

            const response = await apiClient.createOrder(orderData)

            // Clear cart and redirect to success page
            clearCart()
            router.push(`/order-success?orderId=${response.order.id}`)
        } catch (error) {
            console.error("Failed to create order:", error)
            alert("Произошла ошибка при оформлении заказа. Попробуйте еще раз.")
        } finally {
            setLoading(false)
        }
    }

    // Generate time slots
    const timeSlots = []
    for (let hour = 9; hour <= 21; hour++) {
        timeSlots.push(`${hour.toString().padStart(2, "0")}:00`)
        if (hour < 21) {
            timeSlots.push(`${hour.toString().padStart(2, "0")}:30`)
        }
    }

    // Get minimum date (tomorrow)
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const minDate = tomorrow.toISOString().split("T")[0]

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
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-3xl font-bold mb-8">Оформление заказа</h1>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Order Form */}
                        <div className="lg:col-span-2 space-y-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Customer Information */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <User className="h-5 w-5" />
                                            Контактная информация
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <Label htmlFor="customer_name">Имя и фамилия *</Label>
                                            <Input
                                                id="customer_name"
                                                value={formData.customer_name}
                                                onChange={(e) => handleInputChange("customer_name", e.target.value)}
                                                placeholder="Иван Иванов"
                                                required
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="phone">Телефон *</Label>
                                                <Input
                                                    id="phone"
                                                    type="tel"
                                                    value={formData.phone}
                                                    onChange={(e) => handleInputChange("phone", e.target.value)}
                                                    placeholder="+7 (999) 123-45-67"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="email">Email *</Label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={(e) => handleInputChange("email", e.target.value)}
                                                    placeholder="ivan@example.com"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Delivery Information */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <MapPin className="h-5 w-5" />
                                            Доставка
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <Label htmlFor="delivery_address">Адрес доставки *</Label>
                                            <Input
                                                id="delivery_address"
                                                value={formData.delivery_address}
                                                onChange={(e) => handleInputChange("delivery_address", e.target.value)}
                                                placeholder="ул. Примерная, д. 1, кв. 10"
                                                required
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="delivery_date">Дата доставки *</Label>
                                                <Input
                                                    id="delivery_date"
                                                    type="date"
                                                    value={formData.delivery_date}
                                                    onChange={(e) => handleInputChange("delivery_date", e.target.value)}
                                                    min={minDate}
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="delivery_time">Время доставки *</Label>
                                                <Select
                                                    value={formData.delivery_time}
                                                    onValueChange={(value) => handleInputChange("delivery_time", value)}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Выберите время" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {timeSlots.map((time) => (
                                                            <SelectItem key={time} value={time}>
                                                                {time}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Payment Method */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <CreditCard className="h-5 w-5" />
                                            Способ оплаты
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <RadioGroup
                                            value={formData.payment_method}
                                            onValueChange={(value: "card" | "cash") => handleInputChange("payment_method", value)}
                                        >
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="card" id="card" />
                                                <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer">
                                                    <CreditCard className="h-4 w-4" />
                                                    Банковской картой
                                                </Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="cash" id="cash" />
                                                <Label htmlFor="cash" className="flex items-center gap-2 cursor-pointer">
                                                    <Banknote className="h-4 w-4" />
                                                    Наличными при получении
                                                </Label>
                                            </div>
                                        </RadioGroup>
                                    </CardContent>
                                </Card>

                                {/* Additional Notes */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Комментарий к заказу</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <Textarea
                                            value={formData.notes}
                                            onChange={(e) => handleInputChange("notes", e.target.value)}
                                            placeholder="Дополнительные пожелания к заказу..."
                                            rows={3}
                                        />
                                    </CardContent>
                                </Card>
                            </form>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <Card className="sticky top-4">
                                <CardHeader>
                                    <CardTitle>Ваш заказ</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {/* Cart Items */}
                                    <div className="space-y-3">
                                        {cart.items.map((item) => (
                                            <div key={item.bouquet_id} className="flex gap-3">
                                                <div className="relative w-12 h-12 flex-shrink-0">
                                                    <Image
                                                        src={item.image || "/placeholder.svg?height=48&width=48"}
                                                        alt={item.name}
                                                        fill
                                                        className="object-cover rounded"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-sm font-medium line-clamp-2">{item.name}</h4>
                                                    <div className="flex items-center justify-between text-sm">
                                                        <span className="text-gray-600">{item.quantity} шт.</span>
                                                        <span className="font-medium">
                              {(item.price * item.quantity).toLocaleString("ru-RU")} ₽
                            </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <Separator />

                                    {/* Order Total */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span>Сумма:</span>
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
                                            <span>Итого:</span>
                                            <span>{cart.finalTotal.toLocaleString("ru-RU")} ₽</span>
                                        </div>
                                    </div>

                                    <Button
                                        type="submit"
                                        onClick={handleSubmit}
                                        disabled={loading}
                                        className="w-full bg-pink-600 hover:bg-pink-700"
                                    >
                                        {loading ? "Оформляем заказ..." : "Оформить заказ"}
                                    </Button>

                                    <p className="text-xs text-gray-600 text-center">
                                        Нажимая кнопку, вы соглашаетесь с условиями обработки персональных данных
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

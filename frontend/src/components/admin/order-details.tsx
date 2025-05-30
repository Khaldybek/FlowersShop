"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { apiClient } from "@/lib/api"
import type { Order } from "@/types"
import { ArrowLeft, Package, User, MapPin, Phone, Mail, Calendar, Clock, CreditCard, Banknote } from "lucide-react"
import Image from "next/image"

interface OrderDetailsProps {
    orderId: number
    onBack: () => void
    onUpdate: () => void
}

export function OrderDetails({ orderId, onBack, onUpdate }: OrderDetailsProps) {
    const [order, setOrder] = useState<Order | null>(null)
    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetchOrder()
    }, [orderId])

    const fetchOrder = async () => {
        try {
            setLoading(true)
            setError(null)
            const orderData = await apiClient.getOrder(orderId)
            setOrder(orderData)
        } catch (error) {
            console.error("Failed to fetch order:", error)
            setError("Не удалось загрузить детали заказа")
        } finally {
            setLoading(false)
        }
    }

    const handleStatusUpdate = async (newStatus: string) => {
        if (!order) return

        try {
            setUpdating(true)
            await apiClient.updateOrder(order.id, { status: newStatus })
            setOrder({ ...order, status: newStatus })
            onUpdate()
        } catch (error) {
            console.error("Failed to update order:", error)
            alert("Ошибка при обновлении статуса заказа")
        } finally {
            setUpdating(false)
        }
    }

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            pending: { label: "Ожидает", variant: "secondary" as const, color: "bg-yellow-100 text-yellow-800" },
            confirmed: { label: "Подтвержден", variant: "default" as const, color: "bg-blue-100 text-blue-800" },
            delivered: { label: "Доставлен", variant: "default" as const, color: "bg-green-100 text-green-800" },
            cancelled: { label: "Отменен", variant: "destructive" as const, color: "bg-red-100 text-red-800" },
        }
        const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
        return <Badge variant={config.variant}>{config.label}</Badge>
    }

    const getPaymentIcon = (method: string) => {
        return method === "card" ? <CreditCard className="h-4 w-4" /> : <Banknote className="h-4 w-4" />
    }

    if (loading) {
        return (
            <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded animate-pulse" />
                <div className="h-64 bg-gray-200 rounded animate-pulse" />
            </div>
        )
    }

    if (error || !order) {
        return (
            <Card>
                <CardContent className="p-6 text-center">
                    <p className="text-red-600">{error || "Заказ не найден"}</p>
                    <Button onClick={onBack} className="mt-4">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Назад
                    </Button>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <Button onClick={onBack} variant="outline">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Назад к заказам
                </Button>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">Статус заказа:</span>
                    <Select value={order.status} onValueChange={handleStatusUpdate} disabled={updating}>
                        <SelectTrigger className="w-40">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="pending">Ожидает</SelectItem>
                            <SelectItem value="confirmed">Подтвержден</SelectItem>
                            <SelectItem value="delivered">Доставлен</SelectItem>
                            <SelectItem value="cancelled">Отменен</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Order Overview */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center gap-2">
                                    <Package className="h-5 w-5" />
                                    Заказ #{order.id}
                                </CardTitle>
                                {getStatusBadge(order.status)}
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-gray-400" />
                                    <span>Дата создания: {new Date(order.created_at).toLocaleDateString("ru-RU")}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-gray-400" />
                                    <span>
                    Время доставки: {order.delivery_date} в {order.delivery_time}
                  </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Order Items */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Состав заказа</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {order.items.map((item) => (
                                    <div key={item.bouquet_id} className="flex gap-4 p-4 border rounded-lg">
                                        <div className="relative w-16 h-16 flex-shrink-0">
                                            <Image
                                                src={item.image || "/placeholder.svg?height=64&width=64"}
                                                alt={item.name}
                                                fill
                                                className="object-cover rounded"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-medium">{item.name}</h4>
                                            <div className="flex items-center justify-between mt-2">
                                                <span className="text-sm text-gray-600">{item.quantity} шт.</span>
                                                <span className="font-semibold">{(item.price * item.quantity).toLocaleString("ru-RU")} ₽</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <Separator className="my-4" />

                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span>Итого:</span>
                                    <span className="font-semibold text-lg">{order.total_amount.toLocaleString("ru-RU")} ₽</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Notes */}
                    {order.notes && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Комментарий к заказу</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-700">{order.notes}</p>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Customer Info */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Информация о клиенте
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-600">Имя</label>
                                <p className="font-medium">{order.customer_name}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-gray-400" />
                                <span>{order.phone}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-gray-400" />
                                <span>{order.email}</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MapPin className="h-5 w-5" />
                                Доставка
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-600">Адрес</label>
                                <p>{order.delivery_address}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-600">Дата и время</label>
                                <p>
                                    {order.delivery_date} в {order.delivery_time}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Оплата</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-2">
                                {getPaymentIcon(order.payment_method)}
                                <span>{order.payment_method === "card" ? "Банковской картой" : "Наличными при получении"}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

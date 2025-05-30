"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BouquetForm } from "@/components/admin/bouquet-form"
import { BouquetEdit } from "@/components/admin/bouquet-edit"
import { CategoryForm } from "@/components/admin/category-form"
import { CategoryEdit } from "@/components/admin/category-edit"
import { OrderDetails } from "@/components/admin/order-details"
import { DeleteConfirmation } from "@/components/admin/delete-confirmation"
import { apiClient } from "@/lib/api"
import type { Order, Bouquet, Category } from "@/types"
import { Package, ShoppingCart, Users, TrendingUp, Eye, Edit, Trash2, Plus } from "lucide-react"

type ViewMode = "list" | "create" | "edit" | "view"

export default function AdminPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [loading, setLoading] = useState(false)
    const [orders, setOrders] = useState<Order[]>([])
    const [bouquets, setBouquets] = useState<Bouquet[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [credentials, setCredentials] = useState({ username: "", password: "" })
    const [error, setError] = useState<string | null>(null)

    // View states
    const [orderViewMode, setOrderViewMode] = useState<ViewMode>("list")
    const [bouquetViewMode, setBouquetViewMode] = useState<ViewMode>("list")
    const [categoryViewMode, setCategoryViewMode] = useState<ViewMode>("list")

    // Selected item IDs
    const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null)
    const [selectedBouquetId, setSelectedBouquetId] = useState<number | null>(null)
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null)

    // Delete confirmation
    const [deleteConfirmation, setDeleteConfirmation] = useState<{
        isOpen: boolean
        type: "order" | "bouquet" | "category"
        id: number
        name: string
    } | null>(null)

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            await apiClient.login(credentials.username, credentials.password)
            setIsAuthenticated(true)
            fetchData()
        } catch (error) {
            console.error("Login error:", error)
            const errorMessage = error instanceof Error ? error.message : "Ошибка подключения к серверу"
            setError(errorMessage)
        } finally {
            setLoading(false)
        }
    }

    const fetchData = async () => {
        try {
            setError(null)
            const [ordersResponse, bouquetsResponse, categoriesResponse] = await Promise.all([
                apiClient.getOrders({ limit: 50 }),
                apiClient.getBouquets({ limit: 50 }),
                apiClient.getCategories(),
            ])
            setOrders(ordersResponse.orders || [])
            setBouquets(bouquetsResponse.bouquets || [])
            setCategories(Array.isArray(categoriesResponse) ? categoriesResponse : [])
        } catch (error) {
            console.error("Failed to fetch data:", error)
            setError("Не удалось загрузить данные. Пожалуйста, проверьте подключение к API.")
        }
    }

    const handleDelete = async () => {
        if (!deleteConfirmation) return

        try {
            switch (deleteConfirmation.type) {
                case "order":
                    await apiClient.deleteOrder(deleteConfirmation.id)
                    setOrders(orders.filter((o) => o.id !== deleteConfirmation.id))
                    break
                case "bouquet":
                    await apiClient.deleteBouquet(deleteConfirmation.id)
                    setBouquets(bouquets.filter((b) => b.id !== deleteConfirmation.id))
                    break
                case "category":
                    await apiClient.deleteCategory(deleteConfirmation.id)
                    setCategories(categories.filter((c) => c.id !== deleteConfirmation.id))
                    break
            }
            alert(
                `${deleteConfirmation.type === "order" ? "Заказ" : deleteConfirmation.type === "bouquet" ? "Букет" : "Категория"} успешно удален!`,
            )
        } catch (error) {
            console.error("Failed to delete:", error)
            alert("Ошибка при удалении")
        } finally {
            setDeleteConfirmation(null)
        }
    }

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            pending: { label: "Ожидает", variant: "secondary" as const },
            confirmed: { label: "Подтвержден", variant: "default" as const },
            delivered: { label: "Доставлен", variant: "default" as const },
            cancelled: { label: "Отменен", variant: "destructive" as const },
        }
        const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
        return <Badge variant={config.variant}>{config.label}</Badge>
    }

    const resetViews = () => {
        setOrderViewMode("list")
        setBouquetViewMode("list")
        setCategoryViewMode("list")
        setSelectedOrderId(null)
        setSelectedBouquetId(null)
        setSelectedCategoryId(null)
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle className="text-center">Вход в админ-панель</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-4">
                                <p>{error}</p>
                            </div>
                        )}
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div>
                                <Label htmlFor="username">Логин</Label>
                                <Input
                                    id="username"
                                    value={credentials.username}
                                    onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                                    placeholder="admin"
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="password">Пароль</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={credentials.password}
                                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                                    placeholder="admin123"
                                    required
                                />
                            </div>
                            <Button type="submit" disabled={loading} className="w-full">
                                {loading ? "Вход..." : "Войти"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        )
    }

    // Order Views
    if (orderViewMode === "view" && selectedOrderId) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="container mx-auto px-4">
                    <OrderDetails
                        orderId={selectedOrderId}
                        onBack={() => {
                            setOrderViewMode("list")
                            setSelectedOrderId(null)
                        }}
                        onUpdate={fetchData}
                    />
                </div>
            </div>
        )
    }

    // Bouquet Views
    if (bouquetViewMode === "create") {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="container mx-auto px-4">
                    <BouquetForm
                        categories={categories}
                        onSuccess={() => {
                            setBouquetViewMode("list")
                            fetchData()
                        }}
                        onCancel={() => setBouquetViewMode("list")}
                    />
                </div>
            </div>
        )
    }

    if (bouquetViewMode === "edit" && selectedBouquetId) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="container mx-auto px-4">
                    <BouquetEdit
                        bouquetId={selectedBouquetId}
                        categories={categories}
                        onSuccess={() => {
                            setBouquetViewMode("list")
                            setSelectedBouquetId(null)
                            fetchData()
                        }}
                        onCancel={() => {
                            setBouquetViewMode("list")
                            setSelectedBouquetId(null)
                        }}
                    />
                </div>
            </div>
        )
    }

    // Category Views
    if (categoryViewMode === "create") {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="container mx-auto px-4">
                    <CategoryForm
                        onSuccess={() => {
                            setCategoryViewMode("list")
                            fetchData()
                        }}
                        onCancel={() => setCategoryViewMode("list")}
                    />
                </div>
            </div>
        )
    }

    if (categoryViewMode === "edit" && selectedCategoryId) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="container mx-auto px-4">
                    <CategoryEdit
                        categoryId={selectedCategoryId}
                        onSuccess={() => {
                            setCategoryViewMode("list")
                            setSelectedCategoryId(null)
                            fetchData()
                        }}
                        onCancel={() => {
                            setCategoryViewMode("list")
                            setSelectedCategoryId(null)
                        }}
                    />
                </div>
            </div>
        )
    }

    const totalRevenue = orders.reduce((sum, order) => sum + order.total_amount, 0)
    const pendingOrders = orders.filter((order) => order.status === "pending").length

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Админ-панель</h1>
                    <p className="text-gray-600">Управление заказами и товарами</p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-8">
                        <p>{error}</p>
                    </div>
                )}

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Всего заказов</p>
                                    <p className="text-2xl font-bold">{orders.length}</p>
                                </div>
                                <ShoppingCart className="h-8 w-8 text-blue-500" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Ожидают обработки</p>
                                    <p className="text-2xl font-bold">{pendingOrders}</p>
                                </div>
                                <Package className="h-8 w-8 text-orange-500" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Букетов в каталоге</p>
                                    <p className="text-2xl font-bold">{bouquets.length}</p>
                                </div>
                                <Users className="h-8 w-8 text-green-500" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Общая выручка</p>
                                    <p className="text-2xl font-bold">{totalRevenue.toLocaleString("ru-RU")} ₽</p>
                                </div>
                                <TrendingUp className="h-8 w-8 text-pink-500" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Tabs */}
                <Tabs defaultValue="orders" className="space-y-6">
                    <TabsList>
                        <TabsTrigger value="orders">Заказы</TabsTrigger>
                        <TabsTrigger value="bouquets">Букеты</TabsTrigger>
                        <TabsTrigger value="categories">Категории</TabsTrigger>
                    </TabsList>

                    <TabsContent value="orders">
                        <Card>
                            <CardHeader>
                                <CardTitle>Заказы</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {orders.length > 0 ? (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>ID</TableHead>
                                                <TableHead>Клиент</TableHead>
                                                <TableHead>Телефон</TableHead>
                                                <TableHead>Сумма</TableHead>
                                                <TableHead>Статус</TableHead>
                                                <TableHead>Дата</TableHead>
                                                <TableHead>Действия</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {orders.map((order) => (
                                                <TableRow key={order.id}>
                                                    <TableCell>#{order.id}</TableCell>
                                                    <TableCell>{order.customer_name}</TableCell>
                                                    <TableCell>{order.phone}</TableCell>
                                                    <TableCell>{order.total_amount.toLocaleString("ru-RU")} ₽</TableCell>
                                                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                                                    <TableCell>{new Date(order.created_at).toLocaleDateString("ru-RU")}</TableCell>
                                                    <TableCell>
                                                        <div className="flex gap-2">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => {
                                                                    setSelectedOrderId(order.id)
                                                                    setOrderViewMode("view")
                                                                }}
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => {
                                                                    setDeleteConfirmation({
                                                                        isOpen: true,
                                                                        type: "order",
                                                                        id: order.id,
                                                                        name: `#${order.id} (${order.customer_name})`,
                                                                    })
                                                                }}
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                ) : (
                                    <div className="text-center py-8 text-gray-500">Нет заказов для отображения</div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="bouquets">
                        <Card>
                            <CardHeader>
                                <div className="flex justify-between items-center">
                                    <CardTitle>Букеты</CardTitle>
                                    <Button onClick={() => setBouquetViewMode("create")} className="bg-pink-600 hover:bg-pink-700">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Добавить букет
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {bouquets.length > 0 ? (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>ID</TableHead>
                                                <TableHead>Название</TableHead>
                                                <TableHead>Цена</TableHead>
                                                <TableHead>Скидка</TableHead>
                                                <TableHead>Статус</TableHead>
                                                <TableHead>Действия</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {bouquets.map((bouquet) => (
                                                <TableRow key={bouquet.id}>
                                                    <TableCell>#{bouquet.id}</TableCell>
                                                    <TableCell>{bouquet.name}</TableCell>
                                                    <TableCell>{bouquet.price.toLocaleString("ru-RU")} ₽</TableCell>
                                                    <TableCell>{bouquet.discount_percentage ? `${bouquet.discount_percentage}%` : "—"}</TableCell>
                                                    <TableCell>
                                                        <Badge variant={bouquet.is_available ? "default" : "secondary"}>
                                                            {bouquet.is_available ? "Доступен" : "Недоступен"}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex gap-2">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => {
                                                                    setSelectedBouquetId(bouquet.id)
                                                                    setBouquetViewMode("edit")
                                                                }}
                                                            >
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => {
                                                                    setDeleteConfirmation({
                                                                        isOpen: true,
                                                                        type: "bouquet",
                                                                        id: bouquet.id,
                                                                        name: bouquet.name,
                                                                    })
                                                                }}
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                ) : (
                                    <div className="text-center py-8 text-gray-500">Нет букетов для отображения</div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="categories">
                        <Card>
                            <CardHeader>
                                <div className="flex justify-between items-center">
                                    <CardTitle>Категории</CardTitle>
                                    <Button onClick={() => setCategoryViewMode("create")} className="bg-pink-600 hover:bg-pink-700">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Добавить категорию
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {categories.length > 0 ? (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>ID</TableHead>
                                                <TableHead>Название</TableHead>
                                                <TableHead>Описание</TableHead>
                                                <TableHead>Порядок</TableHead>
                                                <TableHead>Статус</TableHead>
                                                <TableHead>Действия</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {categories.map((category) => (
                                                <TableRow key={category.id}>
                                                    <TableCell>#{category.id}</TableCell>
                                                    <TableCell>{category.name}</TableCell>
                                                    <TableCell className="max-w-xs truncate">{category.description}</TableCell>
                                                    <TableCell>{category.sort_order}</TableCell>
                                                    <TableCell>
                                                        <Badge variant={category.is_active ? "default" : "secondary"}>
                                                            {category.is_active ? "Активна" : "Неактивна"}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex gap-2">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => {
                                                                    setSelectedCategoryId(category.id)
                                                                    setCategoryViewMode("edit")
                                                                }}
                                                            >
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => {
                                                                    setDeleteConfirmation({
                                                                        isOpen: true,
                                                                        type: "category",
                                                                        id: category.id,
                                                                        name: category.name,
                                                                    })
                                                                }}
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                ) : (
                                    <div className="text-center py-8 text-gray-500">Нет категорий для отображения</div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                {/* Delete Confirmation Dialog */}
                {deleteConfirmation && (
                    <DeleteConfirmation
                        isOpen={deleteConfirmation.isOpen}
                        onClose={() => setDeleteConfirmation(null)}
                        onConfirm={handleDelete}
                        title={`Удалить ${deleteConfirmation.type === "order" ? "заказ" : deleteConfirmation.type === "bouquet" ? "букет" : "категорию"}?`}
                        description={`Вы уверены, что хотите удалить ${deleteConfirmation.type === "order" ? "заказ" : deleteConfirmation.type === "bouquet" ? "букет" : "категорию"}:`}
                        itemName={deleteConfirmation.name}
                    />
                )}
            </div>
        </div>
    )
}

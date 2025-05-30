"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ImageUpload } from "@/components/image-upload"
import { apiClient } from "@/lib/api"
import type { Category } from "@/types"
import { ArrowLeft } from "lucide-react"

interface BouquetEditProps {
    bouquetId: number
    categories: Category[]
    onSuccess: () => void
    onCancel: () => void
}

export function BouquetEdit({ bouquetId, categories, onSuccess, onCancel }: BouquetEditProps) {
    const [loading, setLoading] = useState(false)
    const [fetchLoading, setFetchLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        discount_percentage: "",
        category_id: "",
        images: [] as string[],
        is_available: true,
        is_featured: false,
    })

    useEffect(() => {
        fetchBouquet()
    }, [bouquetId])

    const fetchBouquet = async () => {
        try {
            setFetchLoading(true)
            setError(null)
            const bouquet = await apiClient.getBouquet(bouquetId)
            setFormData({
                name: bouquet.name,
                description: bouquet.description,
                price: bouquet.price.toString(),
                discount_percentage: bouquet.discount_percentage?.toString() || "",
                category_id: bouquet.category_id.toString(),
                images: bouquet.images,
                is_available: bouquet.is_available,
                is_featured: bouquet.is_featured,
            })
        } catch (error) {
            console.error("Failed to fetch bouquet:", error)
            setError("Не удалось загрузить данные букета")
        } finally {
            setFetchLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            await apiClient.updateBouquet(bouquetId, {
                name: formData.name,
                description: formData.description,
                price: Number(formData.price),
                discount_percentage: formData.discount_percentage ? Number(formData.discount_percentage) : 0,
                category_id: Number(formData.category_id),
                images: formData.images,
                is_available: formData.is_available,
                is_featured: formData.is_featured,
            })

            alert("Букет успешно обновлен!")
            onSuccess()
        } catch (error) {
            console.error("Failed to update bouquet:", error)
            alert("Ошибка при обновлении букета")
        } finally {
            setLoading(false)
        }
    }

    const handleInputChange = (field: string, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    if (fetchLoading) {
        return (
            <Card className="w-full max-w-2xl mx-auto">
                <CardContent className="p-6">
                    <div className="space-y-4">
                        <div className="h-8 bg-gray-200 rounded animate-pulse" />
                        <div className="h-32 bg-gray-200 rounded animate-pulse" />
                        <div className="h-8 bg-gray-200 rounded animate-pulse" />
                    </div>
                </CardContent>
            </Card>
        )
    }

    if (error) {
        return (
            <Card className="w-full max-w-2xl mx-auto">
                <CardContent className="p-6 text-center">
                    <p className="text-red-600 mb-4">{error}</p>
                    <Button onClick={onCancel}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Назад
                    </Button>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <div className="flex items-center gap-4">
                    <Button onClick={onCancel} variant="outline" size="sm">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <CardTitle>Редактировать букет</CardTitle>
                </div>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="name">Название букета *</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => handleInputChange("name", e.target.value)}
                                placeholder="Букет роз 'Классика'"
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="category">Категория *</Label>
                            <Select value={formData.category_id} onValueChange={(value) => handleInputChange("category_id", value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Выберите категорию" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((category) => (
                                        <SelectItem key={category.id} value={category.id.toString()}>
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="description">Описание</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => handleInputChange("description", e.target.value)}
                            placeholder="Описание букета..."
                            rows={3}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="price">Цена (₽) *</Label>
                            <Input
                                id="price"
                                type="number"
                                value={formData.price}
                                onChange={(e) => handleInputChange("price", e.target.value)}
                                placeholder="2500"
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="discount">Скидка (%)</Label>
                            <Input
                                id="discount"
                                type="number"
                                min="0"
                                max="100"
                                value={formData.discount_percentage}
                                onChange={(e) => handleInputChange("discount_percentage", e.target.value)}
                                placeholder="10"
                            />
                        </div>
                    </div>

                    <div>
                        <Label>Изображения</Label>
                        <ImageUpload
                            onUpload={(urls) => handleInputChange("images", urls)}
                            multiple={true}
                            type="bouquets"
                            maxFiles={5}
                        />
                    </div>

                    <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-2">
                            <Switch
                                id="available"
                                checked={formData.is_available}
                                onCheckedChange={(checked) => handleInputChange("is_available", checked)}
                            />
                            <Label htmlFor="available">Доступен для заказа</Label>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Switch
                                id="featured"
                                checked={formData.is_featured}
                                onCheckedChange={(checked) => handleInputChange("is_featured", checked)}
                            />
                            <Label htmlFor="featured">Рекомендуемый</Label>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <Button type="submit" disabled={loading} className="flex-1">
                            {loading ? "Обновление..." : "Обновить букет"}
                        </Button>
                        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
                            Отмена
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}

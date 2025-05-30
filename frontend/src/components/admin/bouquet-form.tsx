"use client"

import type React from "react"

import { useState } from "react"
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

interface BouquetFormProps {
    categories: Category[]
    onSuccess: () => void
    onCancel: () => void
}

export function BouquetForm({ categories, onSuccess, onCancel }: BouquetFormProps) {
    const [loading, setLoading] = useState(false)
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            await apiClient.createBouquet({
                name: formData.name,
                description: formData.description,
                price: Number(formData.price),
                discount_percentage: formData.discount_percentage ? Number(formData.discount_percentage) : 0,
                category_id: Number(formData.category_id),
                images: formData.images,
                is_available: formData.is_available,
                is_featured: formData.is_featured,
            })

            alert("Букет успешно создан!")
            onSuccess()
        } catch (error) {
            console.error("Failed to create bouquet:", error)
            alert("Ошибка при создании букета")
        } finally {
            setLoading(false)
        }
    }

    const handleInputChange = (field: string, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Добавить новый букет</CardTitle>
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
                            {loading ? "Создание..." : "Создать букет"}
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

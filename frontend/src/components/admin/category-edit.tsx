"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ImageUpload } from "@/components/image-upload"
import { apiClient } from "@/lib/api"
import { ArrowLeft } from "lucide-react"

interface CategoryEditProps {
    categoryId: number
    onSuccess: () => void
    onCancel: () => void
}

export function CategoryEdit({ categoryId, onSuccess, onCancel }: CategoryEditProps) {
    const [loading, setLoading] = useState(false)
    const [fetchLoading, setFetchLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        image_url: "",
        sort_order: "",
        is_active: true,
    })

    useEffect(() => {
        fetchCategory()
    }, [categoryId])

    const fetchCategory = async () => {
        try {
            setFetchLoading(true)
            setError(null)
            const category = await apiClient.getCategory(categoryId)
            setFormData({
                name: category.name,
                description: category.description,
                image_url: category.image_url,
                sort_order: category.sort_order.toString(),
                is_active: category.is_active,
            })
        } catch (error) {
            console.error("Failed to fetch category:", error)
            setError("Не удалось загрузить данные категории")
        } finally {
            setFetchLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            await apiClient.updateCategory(categoryId, {
                name: formData.name,
                description: formData.description,
                image_url: formData.image_url,
                sort_order: formData.sort_order ? Number(formData.sort_order) : 1,
                is_active: formData.is_active,
            })

            alert("Категория успешно обновлена!")
            onSuccess()
        } catch (error) {
            console.error("Failed to update category:", error)
            alert("Ошибка при обновлении категории")
        } finally {
            setLoading(false)
        }
    }

    const handleInputChange = (field: string, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    const handleImageUpload = (urls: string[]) => {
        if (urls.length > 0) {
            handleInputChange("image_url", urls[0])
        }
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
                    <CardTitle>Редактировать категорию</CardTitle>
                </div>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="name">Название категории *</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => handleInputChange("name", e.target.value)}
                                placeholder="Розы"
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="sort_order">Порядок сортировки</Label>
                            <Input
                                id="sort_order"
                                type="number"
                                value={formData.sort_order}
                                onChange={(e) => handleInputChange("sort_order", e.target.value)}
                                placeholder="1"
                            />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="description">Описание</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => handleInputChange("description", e.target.value)}
                            placeholder="Описание категории..."
                            rows={3}
                        />
                    </div>

                    <div>
                        <Label>Изображение категории</Label>
                        <ImageUpload onUpload={handleImageUpload} multiple={false} type="categories" />
                    </div>

                    <div className="flex items-center space-x-2">
                        <Switch
                            id="active"
                            checked={formData.is_active}
                            onCheckedChange={(checked) => handleInputChange("is_active", checked)}
                        />
                        <Label htmlFor="active">Активная категория</Label>
                    </div>

                    <div className="flex gap-4">
                        <Button type="submit" disabled={loading} className="flex-1">
                            {loading ? "Обновление..." : "Обновить категорию"}
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

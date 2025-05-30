"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ImageUpload } from "@/components/image-upload"
import { apiClient } from "@/lib/api"

interface CategoryFormProps {
    onSuccess: () => void
    onCancel: () => void
}

export function CategoryForm({ onSuccess, onCancel }: CategoryFormProps) {
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        image_url: "",
        sort_order: "",
        is_active: true,
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            await apiClient.createCategory({
                name: formData.name,
                description: formData.description,
                image_url: formData.image_url,
                sort_order: formData.sort_order ? Number(formData.sort_order) : 1,
                is_active: formData.is_active,
            })

            alert("Категория успешно создана!")
            onSuccess()
        } catch (error) {
            console.error("Failed to create category:", error)
            alert("Ошибка при создании категории")
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

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Добавить новую категорию</CardTitle>
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
                            {loading ? "Создание..." : "Создать категорию"}
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

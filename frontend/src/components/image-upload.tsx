"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, X } from "lucide-react"
import { apiClient } from "@/lib/api"
import Image from "next/image"

interface ImageUploadProps {
    onUpload: (urls: string[]) => void
    multiple?: boolean
    type: "bouquets" | "categories"
    maxFiles?: number
}

export function ImageUpload({ onUpload, multiple = false, type, maxFiles = 5 }: ImageUploadProps) {
    const [uploading, setUploading] = useState(false)
    const [uploadedImages, setUploadedImages] = useState<string[]>([])

    const handleFileSelect = useCallback(
        async (event: React.ChangeEvent<HTMLInputElement>) => {
            const files = Array.from(event.target.files || [])
            if (files.length === 0) return

            setUploading(true)
            try {
                if (multiple && files.length > 1) {
                    const responses = await apiClient.uploadMultipleImages(files)
                    const urls = responses.map((r) => r.url)
                    setUploadedImages((prev) => [...prev, ...urls])
                    onUpload([...uploadedImages, ...urls])
                } else {
                    const response = await apiClient.uploadImage(files[0], type)
                    const newImages = [...uploadedImages, response.url]
                    setUploadedImages(newImages)
                    onUpload(newImages)
                }
            } catch (error) {
                console.error("Upload failed:", error)
                alert("Ошибка загрузки изображения")
            } finally {
                setUploading(false)
            }
        },
        [multiple, type, uploadedImages, onUpload],
    )

    const removeImage = (index: number) => {
        const newImages = uploadedImages.filter((_, i) => i !== index)
        setUploadedImages(newImages)
        onUpload(newImages)
    }

    return (
        <div className="space-y-4">
            <Card className="border-dashed border-2 border-gray-300 hover:border-gray-400 transition-colors">
                <CardContent className="p-6">
                    <div className="text-center">
                        <input
                            type="file"
                            accept="image/*"
                            multiple={multiple}
                            onChange={handleFileSelect}
                            className="hidden"
                            id="image-upload"
                            disabled={uploading || (!multiple && uploadedImages.length >= 1)}
                        />
                        <label htmlFor="image-upload" className="cursor-pointer">
                            <div className="flex flex-col items-center space-y-2">
                                <Upload className="h-8 w-8 text-gray-400" />
                                <div className="text-sm text-gray-600">
                                    {uploading ? "Загрузка..." : "Нажмите для выбора изображений"}
                                </div>
                                <div className="text-xs text-gray-500">{multiple ? `Максимум ${maxFiles} файлов` : "Один файл"}</div>
                            </div>
                        </label>
                    </div>
                </CardContent>
            </Card>

            {uploadedImages.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {uploadedImages.map((url, index) => (
                        <div key={index} className="relative group">
                            <div className="aspect-square relative overflow-hidden rounded-lg border">
                                <Image src={url || "/placeholder.svg"} alt={`Uploaded ${index + 1}`} fill className="object-cover" />
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => removeImage(index)}
                                >
                                    <X className="h-3 w-3" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

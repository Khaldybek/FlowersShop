"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { BouquetCard } from "@/components/bouquet-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, SlidersHorizontal } from "lucide-react"
import { apiClient } from "@/lib/api"
import type { Bouquet, Category } from "@/types"

export default function CatalogPage() {
    const [bouquets, setBouquets] = useState<Bouquet[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedCategory, setSelectedCategory] = useState<string>("all")
    const [sortBy, setSortBy] = useState("created_at")
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [error, setError] = useState<string | null>(null)

    const fetchBouquets = async () => {
        try {
            setLoading(true)
            setError(null)
            const params = {
                page: currentPage,
                limit: 12,
                ...(selectedCategory !== "all" && { category: Number.parseInt(selectedCategory) }),
                ...(searchQuery && { search: searchQuery }),
                sort: sortBy,
                order: sortOrder,
            }

            const response = await apiClient.getBouquets(params)
            setBouquets(response.bouquets || [])
            setTotalPages(response.totalPages || 1)
        } catch (error) {
            console.error("Failed to fetch bouquets:", error)
            setError("Не удалось загрузить букеты. Пожалуйста, попробуйте позже.")
            setBouquets([])
        } finally {
            setLoading(false)
        }
    }

    const fetchCategories = async () => {
        try {
            setError(null)
            const response = await apiClient.getCategories()
            // Проверяем структуру ответа и устанавливаем категории
            if (Array.isArray(response)) {
                setCategories(response)
            } else if (response && Array.isArray(response.categories)) {
                setCategories(response.categories)
            } else {
                console.error("Unexpected categories response format:", response)
                setCategories([])
            }
        } catch (error) {
            console.error("Failed to fetch categories:", error)
            setError("Не удалось загрузить категории. Пожалуйста, попробуйте позже.")
            setCategories([])
        }
    }

    useEffect(() => {
        fetchCategories()
    }, [])

    useEffect(() => {
        fetchBouquets()
    }, [currentPage, selectedCategory, sortBy, sortOrder])

    const handleSearch = () => {
        setCurrentPage(1)
        fetchBouquets()
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSearch()
        }
    }

    const clearFilters = () => {
        setSearchQuery("")
        setSelectedCategory("all")
        setSortBy("created_at")
        setSortOrder("desc")
        setCurrentPage(1)
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold mb-4">Каталог букетов</h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">Выберите идеальный букет из нашей коллекции свежих цветов</p>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                    <div className="flex flex-col lg:flex-row gap-4 items-center">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Поиск букетов..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyPress={handleKeyPress}
                                className="pl-10"
                            />
                        </div>

                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                            <SelectTrigger className="w-full lg:w-48">
                                <SelectValue placeholder="Все категории" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Все категории</SelectItem>
                                {categories && categories.length > 0 ? (
                                    categories.map((category) => (
                                        <SelectItem key={category.id} value={category.id.toString()}>
                                            {category.name}
                                        </SelectItem>
                                    ))
                                ) : (
                                    <SelectItem value="loading" disabled>
                                        Загрузка категорий...
                                    </SelectItem>
                                )}
                            </SelectContent>
                        </Select>

                        <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger className="w-full lg:w-48">
                                <SelectValue placeholder="Сортировка" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="created_at">По дате</SelectItem>
                                <SelectItem value="price">По цене</SelectItem>
                                <SelectItem value="name">По названию</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={sortOrder} onValueChange={(value: "asc" | "desc") => setSortOrder(value)}>
                            <SelectTrigger className="w-full lg:w-32">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="asc">↑ По возр.</SelectItem>
                                <SelectItem value="desc">↓ По убыв.</SelectItem>
                            </SelectContent>
                        </Select>

                        <div className="flex gap-2">
                            <Button onClick={handleSearch} className="bg-pink-600 hover:bg-pink-700">
                                <Search className="h-4 w-4 mr-2" />
                                Найти
                            </Button>
                            <Button variant="outline" onClick={clearFilters}>
                                Сбросить
                            </Button>
                        </div>
                    </div>

                    {/* Active Filters */}
                    <div className="flex flex-wrap gap-2 mt-4">
                        {searchQuery && (
                            <Badge variant="secondary" className="flex items-center gap-1">
                                Поиск: {searchQuery}
                                <button onClick={() => setSearchQuery("")} className="ml-1 hover:text-red-500">
                                    ×
                                </button>
                            </Badge>
                        )}
                        {selectedCategory !== "all" && categories && categories.length > 0 && (
                            <Badge variant="secondary" className="flex items-center gap-1">
                                Категория: {categories.find((c) => c.id.toString() === selectedCategory)?.name || ""}
                                <button onClick={() => setSelectedCategory("all")} className="ml-1 hover:text-red-500">
                                    ×
                                </button>
                            </Badge>
                        )}
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-8">
                        <p>{error}</p>
                    </div>
                )}

                {/* Results */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="bg-white rounded-lg shadow-sm animate-pulse">
                                <div className="aspect-square bg-gray-200 rounded-t-lg" />
                                <div className="p-4 space-y-3">
                                    <div className="h-4 bg-gray-200 rounded" />
                                    <div className="h-3 bg-gray-200 rounded w-3/4" />
                                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : bouquets && bouquets.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                            {bouquets.map((bouquet) => (
                                <BouquetCard key={bouquet.id} bouquet={bouquet} />
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                    disabled={currentPage === 1}
                                >
                                    Назад
                                </Button>
                                <span className="px-4 py-2 text-sm text-gray-600">
                  Страница {currentPage} из {totalPages}
                </span>
                                <Button
                                    variant="outline"
                                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                    disabled={currentPage === totalPages}
                                >
                                    Вперед
                                </Button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-12">
                        <div className="text-gray-400 mb-4">
                            <SlidersHorizontal className="h-12 w-12 mx-auto" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Букеты не найдены</h3>
                        <p className="text-gray-600 mb-4">Попробуйте изменить параметры поиска</p>
                        <Button variant="outline" onClick={clearFilters}>
                            Сбросить фильтры
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}

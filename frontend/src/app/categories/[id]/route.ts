import { type NextRequest, NextResponse } from "next/server"

// Mock data - same as in route.ts
const mockCategories = [
    {
        id: 1,
        name: "Розы",
        description: "Классические букеты из роз",
        image_url: "/placeholder.svg?height=200&width=200&text=Розы",
        sort_order: 1,
        is_active: true,
    },
    {
        id: 2,
        name: "Тюльпаны",
        description: "Весенние букеты из тюльпанов",
        image_url: "/placeholder.svg?height=200&width=200&text=Тюльпаны",
        sort_order: 2,
        is_active: true,
    },
    {
        id: 3,
        name: "Пионы",
        description: "Роскошные букеты из пионов",
        image_url: "/placeholder.svg?height=200&width=200&text=Пионы",
        sort_order: 3,
        is_active: true,
    },
    {
        id: 4,
        name: "Хризантемы",
        description: "Осенние букеты из хризантем",
        image_url: "/placeholder.svg?height=200&width=200&text=Хризантемы",
        sort_order: 4,
        is_active: true,
    },
]

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const id = Number.parseInt(params.id)
        const category = mockCategories.find((c) => c.id === id)

        if (!category) {
            return NextResponse.json({ success: false, message: "Category not found" }, { status: 404 })
        }

        return NextResponse.json({
            success: true,
            category,
        })
    } catch (error) {
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
    }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        // Check authentication
        const authHeader = request.headers.get("authorization")
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
        }

        const id = Number.parseInt(params.id)
        const categoryIndex = mockCategories.findIndex((c) => c.id === id)

        if (categoryIndex === -1) {
            return NextResponse.json({ success: false, message: "Category not found" }, { status: 404 })
        }

        const updateData = await request.json()
        const updatedCategory = {
            ...mockCategories[categoryIndex],
            ...updateData,
        }

        mockCategories[categoryIndex] = updatedCategory

        return NextResponse.json({
            success: true,
            category: updatedCategory,
        })
    } catch (error) {
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
    }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        // Check authentication
        const authHeader = request.headers.get("authorization")
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
        }

        const id = Number.parseInt(params.id)
        const categoryIndex = mockCategories.findIndex((c) => c.id === id)

        if (categoryIndex === -1) {
            return NextResponse.json({ success: false, message: "Category not found" }, { status: 404 })
        }

        mockCategories.splice(categoryIndex, 1)

        return NextResponse.json({
            success: true,
            message: "Category deleted successfully",
        })
    } catch (error) {
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
    }
}

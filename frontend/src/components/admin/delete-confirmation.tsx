"use client"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface DeleteConfirmationProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    title: string
    description: string
    itemName: string
    loading?: boolean
}

export function DeleteConfirmation({
                                       isOpen,
                                       onClose,
                                       onConfirm,
                                       title,
                                       description,
                                       itemName,
                                       loading = false,
                                   }: DeleteConfirmationProps) {
    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {description}
                        <br />
                        <strong>"{itemName}"</strong>
                        <br />
                        Это действие нельзя отменить.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={loading}>Отмена</AlertDialogCancel>
                    <AlertDialogAction onClick={onConfirm} disabled={loading} className="bg-red-600 hover:bg-red-700">
                        {loading ? "Удаление..." : "Удалить"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

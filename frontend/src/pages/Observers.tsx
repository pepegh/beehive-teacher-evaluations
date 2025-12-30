import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, ArrowUpDown, Pencil, Trash2 } from 'lucide-react'
import type { ColumnDef } from '@tanstack/react-table'
import { observerService } from '@/services/observerService'
import type { Observer, CreateObserverData } from '@/types/observer'
import AddObserverModal from '@/components/observers/AddObserverModal'
import DeleteObserverModal from '@/components/observers/DeleteObserverModal'
import { DataTable } from '@/components/ui/data-table'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export default function Observers() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingObserver, setEditingObserver] = useState<Observer | null>(null)
  const [deletingObserver, setDeletingObserver] = useState<Observer | null>(null)
  const queryClient = useQueryClient()

  const handleOpenEditModal = (observer: Observer) => {
    setEditingObserver(observer)
    setIsDialogOpen(true)
  }

  const handleOpenAddModal = () => {
    setEditingObserver(null)
    setIsDialogOpen(true)
  }

  const handleCloseModal = () => {
    setIsDialogOpen(false)
    setEditingObserver(null)
  }

  const handleOpenDeleteModal = (observer: Observer) => {
    setDeletingObserver(observer)
  }

  const handleCloseDeleteModal = () => {
    setDeletingObserver(null)
  }

  const handleConfirmDelete = () => {
    if (deletingObserver) {
      deleteMutation.mutate(deletingObserver.id)
    }
  }

  const columns: ColumnDef<Observer>[] = [
    {
      accessorKey: 'name',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className="text-sm font-medium text-gray-900">{row.getValue('name')}</div>
      ),
    },
    {
      accessorKey: 'department',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Department
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <span className="text-sm text-gray-600 capitalize">
          {row.getValue('department')}
        </span>
      ),
    },
    {
      id: 'actions',
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => (
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-yellow-600 hover:text-yellow-700 hover:bg-yellow-100"
            title="Edit observer"
            onClick={() => handleOpenEditModal(row.original)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-100"
            title="Delete observer"
            onClick={() => handleOpenDeleteModal(row.original)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  // Fetch observers using React Query
  const { data: observers = [], isLoading, error } = useQuery({
    queryKey: ['observers'],
    queryFn: observerService.getAll,
  })

  // Create observer mutation
  const createMutation = useMutation({
    mutationFn: observerService.create,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['observers'] })
      setIsDialogOpen(false)
      toast.success('Observer added successfully', {
        description: `${data.name} has been added to the system.`,
      })
    },
    onError: (error: any) => {
      console.error('Failed to create observer:', error)
      toast.error('Failed to add observer', {
        description: error.response?.data?.message || 'Please try again.',
      })
    },
  })

  // Update observer mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: CreateObserverData }) =>
      observerService.update(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['observers'] })
      setEditingObserver(null)
      setIsDialogOpen(false)
      toast.success('Observer updated successfully', {
        description: `${data.name} has been updated.`,
      })
    },
    onError: (error: any) => {
      console.error('Failed to update observer:', error)
      toast.error('Failed to update observer', {
        description: error.response?.data?.message || 'Please try again.',
      })
    },
  })

  // Delete observer mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => observerService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['observers'] })
      setDeletingObserver(null)
      toast.success('Observer deleted successfully', {
        description: 'The observer has been removed from the system.',
      })
    },
    onError: (error: any) => {
      console.error('Failed to delete observer:', error)
      toast.error('Failed to delete observer', {
        description: error.response?.data?.message || 'Please try again.',
      })
    },
  })

  const handleAddObserver = (data: CreateObserverData) => {
    createMutation.mutate(data)
  }

  const handleEditObserver = (data: CreateObserverData) => {
    if (editingObserver) {
      updateMutation.mutate({ id: editingObserver.id, data })
    }
  }

  const handleSubmit = (data: CreateObserverData) => {
    if (editingObserver) {
      handleEditObserver(data)
    } else {
      handleAddObserver(data)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Observers</h1>
        <Button onClick={handleOpenAddModal}>
          <Plus className="mr-2 h-4 w-4" />
          Add Observer
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        {isLoading && (
          <div className="p-8 text-center">
            <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Loading observers...</p>
          </div>
        )}

        {error && (
          <div className="p-8 text-center">
            <div className="text-red-600 mb-2">Error loading observers</div>
            <p className="text-gray-600">
              {error instanceof Error ? error.message : 'An error occurred'}
            </p>
          </div>
        )}

        {!isLoading && !error && (
          <DataTable
            columns={columns}
            data={observers}
            searchKey="name"
            searchPlaceholder="Search observers by name..."
          />
        )}
      </div>

      {/* Add/Edit Observer Modal */}
      <AddObserverModal
        isOpen={isDialogOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
        observer={editingObserver}
      />

      {/* Delete Confirmation Modal */}
      <DeleteObserverModal
        isOpen={!!deletingObserver}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        isDeleting={deleteMutation.isPending}
        observerName={deletingObserver?.name || ''}
      />
    </div>
  )
}

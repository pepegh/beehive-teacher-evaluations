import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, ArrowUpDown, Pencil, Trash2 } from 'lucide-react'
import type { ColumnDef } from '@tanstack/react-table'
import { evaluationToolService } from '@/services/evaluationToolService'
import type { EvaluationTool, CreateEvaluationToolData } from '@/types/evaluationTool'
import AddEvaluationToolModal from '@/components/evaluation-tools/AddEvaluationToolModal'
import DeleteEvaluationToolModal from '@/components/evaluation-tools/DeleteEvaluationToolModal'
import { DataTable } from '@/components/ui/data-table'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export default function EvaluationTools() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTool, setEditingTool] = useState<EvaluationTool | null>(null)
  const [deletingTool, setDeletingTool] = useState<EvaluationTool | null>(null)
  const queryClient = useQueryClient()

  const handleOpenEditModal = (tool: EvaluationTool) => {
    setEditingTool(tool)
    setIsDialogOpen(true)
  }

  const handleOpenAddModal = () => {
    setEditingTool(null)
    setIsDialogOpen(true)
  }

  const handleCloseModal = () => {
    setIsDialogOpen(false)
    setEditingTool(null)
  }

  const handleOpenDeleteModal = (tool: EvaluationTool) => {
    setDeletingTool(tool)
  }

  const handleCloseDeleteModal = () => {
    setDeletingTool(null)
  }

  const handleConfirmDelete = () => {
    if (deletingTool) {
      deleteMutation.mutate(deletingTool.id)
    }
  }

  const columns: ColumnDef<EvaluationTool>[] = [
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
      accessorKey: 'description',
      header: 'Description',
      cell: ({ row }) => {
        const description = row.getValue('description') as string | null
        return (
          <div className="text-sm text-gray-600 max-w-md truncate">
            {description || '-'}
          </div>
        )
      },
    },
    {
      accessorKey: 'dimensions',
      header: 'Dimensions',
      cell: ({ row }) => {
        const dimensions = row.getValue('dimensions') as string[] | null
        if (!dimensions || dimensions.length === 0) {
          return <span className="text-sm text-gray-400">No dimensions</span>
        }
        return (
          <div className="flex flex-wrap gap-1">
            {dimensions.slice(0, 3).map((dimension, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs font-medium bg-yellow-500 text-white rounded-full"
              >
                {dimension}
              </span>
            ))}
            {dimensions.length > 3 && (
              <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                +{dimensions.length - 3} more
              </span>
            )}
          </div>
        )
      },
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
            title="Edit tool"
            onClick={() => handleOpenEditModal(row.original)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-100"
            title="Delete tool"
            onClick={() => handleOpenDeleteModal(row.original)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  // Fetch evaluation tools using React Query
  const { data: tools = [], isLoading, error } = useQuery({
    queryKey: ['evaluation-tools'],
    queryFn: evaluationToolService.getAll,
  })

  // Create tool mutation
  const createMutation = useMutation({
    mutationFn: evaluationToolService.create,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['evaluation-tools'] })
      setIsDialogOpen(false)
      toast.success('Evaluation tool added successfully', {
        description: `${data.name} has been added to the system.`,
      })
    },
    onError: (error: any) => {
      console.error('Failed to create evaluation tool:', error)
      toast.error('Failed to add evaluation tool', {
        description: error.response?.data?.message || 'Please try again.',
      })
    },
  })

  // Update tool mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: CreateEvaluationToolData }) =>
      evaluationToolService.update(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['evaluation-tools'] })
      setEditingTool(null)
      setIsDialogOpen(false)
      toast.success('Evaluation tool updated successfully', {
        description: `${data.name} has been updated.`,
      })
    },
    onError: (error: any) => {
      console.error('Failed to update evaluation tool:', error)
      toast.error('Failed to update evaluation tool', {
        description: error.response?.data?.message || 'Please try again.',
      })
    },
  })

  // Delete tool mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => evaluationToolService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['evaluation-tools'] })
      setDeletingTool(null)
      toast.success('Evaluation tool deleted successfully', {
        description: 'The tool has been removed from the system.',
      })
    },
    onError: (error: any) => {
      console.error('Failed to delete evaluation tool:', error)
      toast.error('Failed to delete evaluation tool', {
        description: error.response?.data?.message || 'Please try again.',
      })
    },
  })

  const handleAddTool = (data: CreateEvaluationToolData) => {
    createMutation.mutate(data)
  }

  const handleEditTool = (data: CreateEvaluationToolData) => {
    if (editingTool) {
      updateMutation.mutate({ id: editingTool.id, data })
    }
  }

  const handleSubmit = (data: CreateEvaluationToolData) => {
    if (editingTool) {
      handleEditTool(data)
    } else {
      handleAddTool(data)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Evaluation Tools</h1>
        <Button onClick={handleOpenAddModal}>
          <Plus className="mr-2 h-4 w-4" />
          Add Tool
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        {isLoading && (
          <div className="p-8 text-center">
            <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Loading evaluation tools...</p>
          </div>
        )}

        {error && (
          <div className="p-8 text-center">
            <div className="text-red-600 mb-2">Error loading evaluation tools</div>
            <p className="text-gray-600">
              {error instanceof Error ? error.message : 'An error occurred'}
            </p>
          </div>
        )}

        {!isLoading && !error && (
          <DataTable
            columns={columns}
            data={tools}
            searchKey="name"
            searchPlaceholder="Search tools by name..."
          />
        )}
      </div>

      {/* Add/Edit Tool Modal */}
      <AddEvaluationToolModal
        isOpen={isDialogOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
        tool={editingTool}
      />

      {/* Delete Confirmation Modal */}
      <DeleteEvaluationToolModal
        isOpen={!!deletingTool}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        isDeleting={deleteMutation.isPending}
        toolName={deletingTool?.name || ''}
      />
    </div>
  )
}

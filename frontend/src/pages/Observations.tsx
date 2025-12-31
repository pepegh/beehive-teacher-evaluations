import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { Plus, ArrowUpDown, Eye, Pencil, Trash2 } from 'lucide-react'
import type { ColumnDef } from '@tanstack/react-table'
import { observationService } from '@/services/observationService'
import type { Observation } from '@/types/observation'
import DeleteObservationModal from '@/components/observations/DeleteObservationModal'
import { DataTable } from '@/components/ui/data-table'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { format } from 'date-fns'

export default function Observations() {
  const [deletingObservation, setDeletingObservation] = useState<Observation | null>(null)
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const getScorePillColor = (score: number) => {
    if (score < 3.0) {
      return 'bg-red-100 text-red-800 border-red-200'
    } else if (score >= 3.0 && score <= 3.5) {
      return 'bg-green-100 text-green-800 border-green-200'
    } else {
      return 'bg-blue-100 text-blue-800 border-blue-200'
    }
  }

  const handleOpenDeleteModal = (observation: Observation) => {
    setDeletingObservation(observation)
  }

  const handleCloseDeleteModal = () => {
    setDeletingObservation(null)
  }

  const handleConfirmDelete = () => {
    if (deletingObservation) {
      deleteMutation.mutate(deletingObservation.id)
    }
  }

  const handleViewObservation = (observation: Observation) => {
    navigate(`/observations/view/${observation.id}`)
  }

  const handleEditObservation = (observation: Observation) => {
    navigate(`/observations/edit/${observation.id}`)
  }

  const handleCreateObservation = () => {
    navigate('/observations/create')
  }

  const columns: ColumnDef<Observation>[] = [
    {
      accessorKey: 'observation_date',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const date = row.getValue('observation_date') as string
        try {
          // Extract just the date part (before 'T' if present)
          const datePart = date.split('T')[0]
          // Parse date as local date to avoid timezone issues
          const [year, month, day] = datePart.split('-').map(Number)
          const parsed = new Date(year, month - 1, day)
          return (
            <div className="text-sm text-gray-900">
              {format(parsed, 'dd-MM-yyyy')}
            </div>
          )
        } catch {
          return <div className="text-sm text-gray-900">{date}</div>
        }
      },
    },
    {
      accessorFn: (row) => {
        if (!row.teacher) return ''
        return `${row.teacher.first_name} ${row.teacher.last_name}`
      },
      id: 'teacher',
      header: 'Teacher',
      cell: ({ row }) => {
        const teacher = row.original.teacher
        if (!teacher) return <span className="text-sm text-gray-400">-</span>
        return (
          <div className="text-sm text-gray-900">
            {teacher.first_name} {teacher.last_name}
          </div>
        )
      },
    },
    {
      accessorFn: (row) => row.evaluation_tool?.name || '',
      id: 'evaluation_tool',
      header: 'Evaluation Tool',
      cell: ({ row }) => {
        const tool = row.original.evaluation_tool
        if (!tool) return <span className="text-sm text-gray-400">-</span>
        return <div className="text-sm text-gray-900">{tool.name}</div>
      },
    },
    {
      accessorKey: 'average_score',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Avg Score
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const score = row.getValue('average_score') as number
        return (
          <div className="flex justify-start">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getScorePillColor(score)}`}>
              {score.toFixed(2)}
            </span>
          </div>
        )
      },
    },
    {
      accessorKey: 'lowest_dimension',
      header: 'Lowest Dimension',
      cell: ({ row }) => {
        const dimension = row.getValue('lowest_dimension') as string | null
        if (!dimension) return <span className="text-sm text-gray-400">-</span>
        return <div className="text-sm text-gray-900">{dimension}</div>
      },
    },
    {
      accessorKey: 'lowest_score',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Lowest Score
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const score = row.getValue('lowest_score') as number | null
        if (score === null || score === undefined) return <span className="text-sm text-gray-400">-</span>
        return (
          <div className="flex justify-start">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getScorePillColor(score)}`}>
              {score.toFixed(2)}
            </span>
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
            className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-100"
            title="View observation details"
            onClick={() => handleViewObservation(row.original)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-yellow-600 hover:text-yellow-700 hover:bg-yellow-100"
            title="Edit observation"
            onClick={() => handleEditObservation(row.original)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-100"
            title="Delete observation"
            onClick={() => handleOpenDeleteModal(row.original)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  // Fetch observations using React Query
  const { data: observations = [], isLoading, error } = useQuery({
    queryKey: ['observations'],
    queryFn: observationService.getAll,
  })

  // Delete observation mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => observationService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['observations'] })
      setDeletingObservation(null)
      toast.success('Observation deleted successfully', {
        description: 'The observation has been removed from the system.',
      })
    },
    onError: (error: any) => {
      console.error('Failed to delete observation:', error)
      toast.error('Failed to delete observation', {
        description: error.response?.data?.message || 'Please try again.',
      })
    },
  })

  // Get unique values for filters
  const filters = useMemo(() => {
    const evaluationTools = Array.from(
      new Set(
        observations
          .map((o) => o.evaluation_tool?.name)
          .filter((name): name is string => !!name)
      )
    )

    return [
      { columnKey: 'evaluation_tool', label: 'Evaluation Tool', options: evaluationTools },
    ]
  }, [observations])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Observations</h1>
        <Button onClick={handleCreateObservation}>
          <Plus className="mr-2 h-4 w-4" />
          Add Observation
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        {isLoading && (
          <div className="p-8 text-center">
            <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Loading observations...</p>
          </div>
        )}

        {error && (
          <div className="p-8 text-center">
            <div className="text-red-600 mb-2">Error loading observations</div>
            <p className="text-gray-600">
              {error instanceof Error ? error.message : 'An error occurred'}
            </p>
          </div>
        )}

        {!isLoading && !error && (
          <DataTable
            columns={columns}
            data={observations}
            searchKey="teacher"
            searchPlaceholder="Search by teacher name..."
            filters={filters}
          />
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteObservationModal
        isOpen={!!deletingObservation}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        isDeleting={deleteMutation.isPending}
        observationInfo={
          deletingObservation
            ? (() => {
                const date = deletingObservation.observation_date
                let formattedDate = date
                try {
                  const datePart = date.split('T')[0]
                  const [year, month, day] = datePart.split('-').map(Number)
                  const parsed = new Date(year, month - 1, day)
                  formattedDate = format(parsed, 'dd-MM-yyyy')
                } catch {
                  formattedDate = date
                }
                const teacherName = `${deletingObservation.teacher?.first_name || ''} ${deletingObservation.teacher?.last_name || ''}`
                const toolName = deletingObservation.evaluation_tool?.name || ''
                return `${teacherName} / ${toolName} / ${formattedDate}`
              })()
            : ''
        }
      />
    </div>
  )
}

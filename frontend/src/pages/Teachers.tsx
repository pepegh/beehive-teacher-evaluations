import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, ArrowUpDown, Pencil, Trash2, Eye } from 'lucide-react'
import type { ColumnDef } from '@tanstack/react-table'
import { teacherService } from '@/services/teacherService'
import type { Teacher, CreateTeacherData } from '@/types/teacher'
import AddTeacherModal from '@/components/teachers/AddTeacherModal'
import DeleteConfirmationModal from '@/components/teachers/DeleteConfirmationModal'
import { DataTable } from '@/components/ui/data-table'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export default function Teachers() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null)
  const [deletingTeacher, setDeletingTeacher] = useState<Teacher | null>(null)
  const queryClient = useQueryClient()

  const handleOpenEditModal = (teacher: Teacher) => {
    setEditingTeacher(teacher)
    setIsDialogOpen(true)
  }

  const handleOpenAddModal = () => {
    setEditingTeacher(null)
    setIsDialogOpen(true)
  }

  const handleCloseModal = () => {
    setIsDialogOpen(false)
    setEditingTeacher(null)
  }

  const handleOpenDeleteModal = (teacher: Teacher) => {
    setDeletingTeacher(teacher)
  }

  const handleCloseDeleteModal = () => {
    setDeletingTeacher(null)
  }

  const handleConfirmDelete = () => {
    if (deletingTeacher) {
      deleteMutation.mutate(deletingTeacher.id)
    }
  }

  const handleViewTeacher = (teacher: Teacher) => {
    // TODO: Navigate to teacher detail/view page
    console.log('View teacher:', teacher)
  }

  const columns: ColumnDef<Teacher>[] = [
  {
    accessorFn: (row) => `${row.first_name} ${row.middle_name} ${row.last_name}`,
    id: 'name',
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
    cell: ({ row }) => {
      const teacher = row.original
      return (
        <div>
          <div className="text-sm font-medium text-gray-900">
            {teacher.first_name} {teacher.middle_name} {teacher.last_name}
          </div>
          {teacher.subject && <div className="text-sm text-gray-500">{teacher.subject}</div>}
        </div>
      )
    },
  },
  {
    accessorKey: 'email',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <span className="text-sm text-gray-600">{row.getValue('email')}</span>,
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
    accessorKey: 'level',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Level
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const level = row.getValue('level') as string
      return <span className="text-sm text-gray-600 capitalize">{level.replace('_', ' ')}</span>
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const status = row.getValue('status') as string
      return (
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${
            status === 'active'
              ? 'bg-green-100 text-green-800'
              : status === 'inactive'
              ? 'bg-gray-100 text-gray-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}
        >
          {status.replace('_', ' ')}
        </span>
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
          title="View teacher details"
          onClick={() => handleViewTeacher(row.original)}
        >
          <Eye className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-yellow-600 hover:text-yellow-700 hover:bg-yellow-100"
          title="Edit teacher"
          onClick={() => handleOpenEditModal(row.original)}
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-100"
          title="Delete teacher"
          onClick={() => handleOpenDeleteModal(row.original)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
]

  // Fetch teachers using React Query
  const { data: teachers = [], isLoading, error } = useQuery({
    queryKey: ['teachers'],
    queryFn: teacherService.getAll,
  })

  // Create teacher mutation
  const createMutation = useMutation({
    mutationFn: teacherService.create,
    onSuccess: (data) => {
      // Refetch teachers after successful creation
      queryClient.invalidateQueries({ queryKey: ['teachers'] })
      setIsDialogOpen(false)
      toast.success('Teacher added successfully', {
        description: `${data.first_name} ${data.last_name} has been added to the system.`,
      })
    },
    onError: (error: any) => {
      console.error('Failed to create teacher:', error)
      toast.error('Failed to add teacher', {
        description: error.response?.data?.message || 'Please try again.',
      })
    },
  })

  // Update teacher mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: CreateTeacherData }) =>
      teacherService.update(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] })
      setEditingTeacher(null)
      setIsDialogOpen(false)
      toast.success('Teacher updated successfully', {
        description: `${data.first_name} ${data.last_name} has been updated.`,
      })
    },
    onError: (error: any) => {
      console.error('Failed to update teacher:', error)
      toast.error('Failed to update teacher', {
        description: error.response?.data?.message || 'Please try again.',
      })
    },
  })

  // Delete teacher mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => teacherService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] })
      setDeletingTeacher(null)
      toast.success('Teacher deleted successfully', {
        description: 'The teacher has been removed from the system.',
      })
    },
    onError: (error: any) => {
      console.error('Failed to delete teacher:', error)
      toast.error('Failed to delete teacher', {
        description: error.response?.data?.message || 'Please try again.',
      })
    },
  })

  const handleAddTeacher = (data: CreateTeacherData) => {
    createMutation.mutate(data)
  }

  const handleEditTeacher = (data: CreateTeacherData) => {
    if (editingTeacher) {
      updateMutation.mutate({ id: editingTeacher.id, data })
    }
  }

  const handleSubmit = (data: CreateTeacherData) => {
    if (editingTeacher) {
      handleEditTeacher(data)
    } else {
      handleAddTeacher(data)
    }
  }

  // Get unique values for filters
  const filters = useMemo(() => {
    const departments = Array.from(new Set(teachers.map((t) => t.department).filter(Boolean)))
    const levels = Array.from(new Set(teachers.map((t) => t.level).filter(Boolean)))
    const statuses = Array.from(new Set(teachers.map((t) => t.status).filter(Boolean)))

    return [
      { columnKey: 'department', label: 'Department', options: departments },
      { columnKey: 'level', label: 'Level', options: levels },
      { columnKey: 'status', label: 'Status', options: statuses },
    ]
  }, [teachers])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Teachers</h1>
        <Button onClick={handleOpenAddModal}>
          <Plus className="mr-2 h-4 w-4" />
          Add Teacher
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        {isLoading && (
          <div className="p-8 text-center">
            <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Loading teachers...</p>
          </div>
        )}

        {error && (
          <div className="p-8 text-center">
            <div className="text-red-600 mb-2">Error loading teachers</div>
            <p className="text-gray-600">
              {error instanceof Error ? error.message : 'An error occurred'}
            </p>
          </div>
        )}

        {!isLoading && !error && (
          <DataTable
            columns={columns}
            data={teachers}
            searchKey="name"
            searchPlaceholder="Search teachers by name..."
            filters={filters}
          />
        )}
      </div>

      {/* Add/Edit Teacher Modal */}
      <AddTeacherModal
        isOpen={isDialogOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
        teacher={editingTeacher}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={!!deletingTeacher}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        isDeleting={deleteMutation.isPending}
        teacherName={
          deletingTeacher
            ? `${deletingTeacher.first_name} ${deletingTeacher.middle_name || ''} ${deletingTeacher.last_name}`.trim()
            : ''
        }
      />
    </div>
  )
}

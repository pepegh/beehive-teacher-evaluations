import { useForm, Controller } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X, CalendarIcon } from 'lucide-react'
import type { CreateTeacherData, Teacher } from '@/types/teacher'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { format, parseISO, isValid } from 'date-fns'
import { cn } from '@/lib/utils'

const teacherSchema = z.object({
  first_name: z.string().min(1, 'First name is required').max(255),
  middle_name: z.string().max(255).optional(),
  last_name: z.string().min(1, 'Last name is required').max(255),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  subject: z.string().max(255).optional(),
  department: z.enum(['english', 'spanish'], {
    errorMap: () => ({ message: 'Department is required' }),
  }),
  level: z.enum(['preprimaria', 'primaria', 'bys', 'areas_practicas', 'especialidad'], {
    errorMap: () => ({ message: 'Level is required' }),
  }),
  hire_date: z.string().optional(),
  status: z.enum(['active', 'inactive', 'on_leave']).optional().default('active'),
})

type TeacherFormData = z.infer<typeof teacherSchema>

interface AddTeacherModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CreateTeacherData) => void
  isSubmitting?: boolean
  teacher?: Teacher | null
}

export default function AddTeacherModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
  teacher = null,
}: AddTeacherModalProps) {
  const isEditMode = !!teacher
  const [isFormReady, setIsFormReady] = useState(false)

  // Transform teacher data for form initialization
  const getDefaultValues = (): TeacherFormData => {
    if (teacher) {
      return {
        first_name: teacher.first_name,
        middle_name: teacher.middle_name || '',
        last_name: teacher.last_name,
        email: teacher.email || '',
        subject: teacher.subject || '',
        department: teacher.department,
        level: teacher.level,
        hire_date: teacher.hire_date || '',
        status: teacher.status,
      }
    }
    return {
      first_name: '',
      middle_name: '',
      last_name: '',
      email: '',
      subject: '',
      department: 'english',
      level: 'preprimaria',
      hire_date: '',
      status: 'active',
    }
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<TeacherFormData>({
    resolver: zodResolver(teacherSchema),
    defaultValues: getDefaultValues(),
  })

  // Reset form when teacher data changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setIsFormReady(false)
      // Use setTimeout to ensure the reset happens after render
      const timer = setTimeout(() => {
        const values = getDefaultValues()
        reset(values)
        setIsFormReady(true)
      }, 100)
      return () => clearTimeout(timer)
    } else {
      setIsFormReady(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teacher, isOpen])

  const handleFormSubmit = (data: TeacherFormData) => {
    onSubmit(data)
    if (!isEditMode) {
      reset()
    }
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Dialog Container */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          key={teacher ? `teacher-${teacher.id}` : 'new-teacher'}
          className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">
              {isEditMode ? 'Edit Teacher' : 'Add New Teacher'}
            </h2>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              type="button"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Form */}
          {!isFormReady ? (
            <div className="p-6">
              <div className="flex items-center justify-center py-12">
                <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="ml-4 text-gray-600">Loading form...</p>
              </div>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit(handleFormSubmit)}
              className="p-6"
            >
              <div className="space-y-6">
              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    First Name <span className="text-red-600">*</span>
                  </label>
                  <Input
                    type="text"
                    {...register('first_name')}
                  />
                  {errors.first_name && (
                    <p className="mt-1 text-sm text-red-600">{errors.first_name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Middle Name
                  </label>
                  <Input
                    type="text"
                    {...register('middle_name')}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Last Name <span className="text-red-600">*</span>
                  </label>
                  <Input
                    type="text"
                    {...register('last_name')}
                  />
                  {errors.last_name && (
                    <p className="mt-1 text-sm text-red-600">{errors.last_name.message}</p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Email
                </label>
                <Input
                  type="email"
                  {...register('email')}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Subject
                </label>
                <Input
                  type="text"
                  {...register('subject')}
                  placeholder="e.g., Mathematics, Science, etc."
                />
              </div>

              {/* Department and Level */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Department <span className="text-red-600">*</span>
                  </label>
                  <Controller
                    name="department"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="english">English</SelectItem>
                          <SelectItem value="spanish">Spanish</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.department && (
                    <p className="mt-1 text-sm text-red-600">{errors.department.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Level <span className="text-red-600">*</span>
                  </label>
                  <Controller
                    name="level"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="preprimaria">Preprimaria</SelectItem>
                          <SelectItem value="primaria">Primaria</SelectItem>
                          <SelectItem value="bys">BYS</SelectItem>
                          <SelectItem value="areas_practicas">Areas Practicas</SelectItem>
                          <SelectItem value="especialidad">Especialidad</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.level && (
                    <p className="mt-1 text-sm text-red-600">{errors.level.message}</p>
                  )}
                </div>
              </div>

              {/* Hire Date and Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Hire Date
                  </label>
                  <Controller
                    name="hire_date"
                    control={control}
                    render={({ field }) => {
                      let dateValue: Date | undefined = undefined

                      if (field.value && field.value !== '') {
                        try {
                          // Parse as local date to avoid timezone issues
                          // Format: YYYY-MM-DD
                          const parts = field.value.split('-')
                          if (parts.length === 3) {
                            const year = parseInt(parts[0], 10)
                            const month = parseInt(parts[1], 10)
                            const day = parseInt(parts[2], 10)

                            if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
                              // Create date in local timezone (month is 0-indexed)
                              const parsed = new Date(year, month - 1, day)
                              if (isValid(parsed)) {
                                dateValue = parsed
                              }
                            }
                          }
                        } catch (error) {
                          console.error('Error parsing date:', field.value, error)
                        }
                      }

                      return (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !dateValue && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {dateValue
                                ? format(dateValue, 'dd/MM/yyyy')
                                : <span>Pick a date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={dateValue}
                              onSelect={(date) => field.onChange(date ? format(date, 'yyyy-MM-dd') : '')}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      )
                    }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Status
                  </label>
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                          <SelectItem value="on_leave">On Leave</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? (isEditMode ? 'Updating...' : 'Adding...')
                  : (isEditMode ? 'Update Teacher' : 'Add Teacher')}
              </button>
            </div>
          </form>
          )}
        </div>
      </div>
    </div>
  )
}

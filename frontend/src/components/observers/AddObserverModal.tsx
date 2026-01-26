import { useForm, Controller } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X } from 'lucide-react'
import type { CreateObserverData, Observer } from '@/types/observer'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const observerSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  department: z.enum(['english', 'spanish'] as const, {
    message: 'Department is required',
  }),
})

type ObserverFormData = z.infer<typeof observerSchema>

interface AddObserverModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CreateObserverData) => void
  isSubmitting?: boolean
  observer?: Observer | null
}

export default function AddObserverModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
  observer = null,
}: AddObserverModalProps) {
  const isEditMode = !!observer
  const [isFormReady, setIsFormReady] = useState(false)

  // Transform observer data for form initialization
  const getDefaultValues = (): ObserverFormData => {
    if (observer) {
      return {
        name: observer.name,
        department: observer.department,
      }
    }
    return {
      name: '',
      department: 'english',
    }
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<ObserverFormData>({
    resolver: zodResolver(observerSchema),
    defaultValues: getDefaultValues(),
  })

  // Reset form when observer data changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setIsFormReady(false)
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
  }, [observer, isOpen])

  const handleFormSubmit = (data: ObserverFormData) => {
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
          key={observer ? `observer-${observer.id}` : 'new-observer'}
          className="relative bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">
              {isEditMode ? 'Edit Observer' : 'Add New Observer'}
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
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Name <span className="text-red-600">*</span>
                  </label>
                  <Input
                    type="text"
                    {...register('name')}
                    placeholder="e.g., John Doe"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>

                {/* Department */}
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
                    : (isEditMode ? 'Update Observer' : 'Add Observer')}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

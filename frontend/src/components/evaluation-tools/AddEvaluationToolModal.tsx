import { useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X, Plus, Trash2 } from 'lucide-react'
import type { CreateEvaluationToolData, EvaluationTool } from '@/types/evaluationTool'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const evaluationToolSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  description: z.string().optional(),
  dimensions: z.array(z.string()).optional(),
})

type EvaluationToolFormData = z.infer<typeof evaluationToolSchema>

interface AddEvaluationToolModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CreateEvaluationToolData) => void
  isSubmitting?: boolean
  tool?: EvaluationTool | null
}

export default function AddEvaluationToolModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
  tool = null,
}: AddEvaluationToolModalProps) {
  const isEditMode = !!tool
  const [isFormReady, setIsFormReady] = useState(false)
  const [dimensions, setDimensions] = useState<string[]>([])
  const [newDimension, setNewDimension] = useState('')

  // Transform tool data for form initialization
  const getDefaultValues = (): EvaluationToolFormData => {
    if (tool) {
      return {
        name: tool.name,
        description: tool.description || '',
        dimensions: tool.dimensions || [],
      }
    }
    return {
      name: '',
      description: '',
      dimensions: [],
    }
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<EvaluationToolFormData>({
    resolver: zodResolver(evaluationToolSchema),
    defaultValues: getDefaultValues(),
  })

  // Reset form when tool data changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setIsFormReady(false)
      const timer = setTimeout(() => {
        const values = getDefaultValues()
        reset(values)
        setDimensions(values.dimensions || [])
        setIsFormReady(true)
      }, 100)
      return () => clearTimeout(timer)
    } else {
      setIsFormReady(false)
      setDimensions([])
      setNewDimension('')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tool, isOpen])

  const handleFormSubmit = (data: EvaluationToolFormData) => {
    onSubmit({
      ...data,
      dimensions: dimensions.length > 0 ? dimensions : undefined,
    })
    if (!isEditMode) {
      reset()
      setDimensions([])
      setNewDimension('')
    }
  }

  const handleClose = () => {
    reset()
    setDimensions([])
    setNewDimension('')
    onClose()
  }

  const handleAddDimension = () => {
    if (newDimension.trim()) {
      const updatedDimensions = [...dimensions, newDimension.trim()]
      setDimensions(updatedDimensions)
      setValue('dimensions', updatedDimensions)
      setNewDimension('')
    }
  }

  const handleRemoveDimension = (index: number) => {
    const updatedDimensions = dimensions.filter((_, i) => i !== index)
    setDimensions(updatedDimensions)
    setValue('dimensions', updatedDimensions)
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddDimension()
    }
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
          key={tool ? `tool-${tool.id}` : 'new-tool'}
          className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">
              {isEditMode ? 'Edit Evaluation Tool' : 'Add New Evaluation Tool'}
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
                    placeholder="e.g., Classroom Observation Tool"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Description
                  </label>
                  <textarea
                    {...register('description')}
                    rows={3}
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Brief description of this evaluation tool"
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                  )}
                </div>

                {/* Dimensions */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Dimensions
                  </label>
                  <div className="space-y-3">
                    {/* Add dimension input */}
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        value={newDimension}
                        onChange={(e) => setNewDimension(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Enter a dimension (e.g., Classroom Management)"
                      />
                      <Button
                        type="button"
                        onClick={handleAddDimension}
                        className="flex-shrink-0"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add
                      </Button>
                    </div>

                    {/* Dimensions list */}
                    {dimensions.length > 0 && (
                      <div className="space-y-2">
                        {dimensions.map((dimension, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                          >
                            <span className="text-sm text-gray-700">{dimension}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveDimension(index)}
                              className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
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
                    : (isEditMode ? 'Update Tool' : 'Add Tool')}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

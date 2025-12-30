import { useState, useEffect, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { teacherService } from '@/services/teacherService'
import { evaluationToolService } from '@/services/evaluationToolService'
import { observerService } from '@/services/observerService'
import { observationService } from '@/services/observationService'
import { Combobox } from '@/components/ui/combobox'
import type { ComboboxOption } from '@/components/ui/combobox'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import type { CreateObservationData } from '@/types/observation'

export default function CreateEditObservation() {
  const navigate = useNavigate()
  const location = useLocation()
  const { id } = useParams<{ id: string }>()
  const queryClient = useQueryClient()
  const isViewMode = location.pathname.includes('/view/')
  const isEditMode = location.pathname.includes('/edit/')
  const isCreateMode = !isViewMode && !isEditMode

  const [selectedTeacherId, setSelectedTeacherId] = useState<string | number>('')
  const [selectedEvaluationToolId, setSelectedEvaluationToolId] = useState<string | number>('')
  const [selectedObserverId, setSelectedObserverId] = useState<string | number>('')
  const [dimensionScores, setDimensionScores] = useState<Record<string, number>>({})
  const [notes, setNotes] = useState<string>('')

  // Fetch teachers
  const { data: teachers = [], isLoading: loadingTeachers } = useQuery({
    queryKey: ['teachers'],
    queryFn: teacherService.getAll,
  })

  // Fetch evaluation tools
  const { data: evaluationTools = [], isLoading: loadingTools } = useQuery({
    queryKey: ['evaluationTools'],
    queryFn: evaluationToolService.getAll,
  })

  // Fetch observers
  const { data: observers = [], isLoading: loadingObservers } = useQuery({
    queryKey: ['observers'],
    queryFn: observerService.getAll,
  })

  // Fetch existing observation if in edit or view mode
  const { data: existingObservation, isLoading: loadingObservation } = useQuery({
    queryKey: ['observation', id],
    queryFn: () => observationService.getById(Number(id)),
    enabled: isEditMode || isViewMode,
  })

  // Transform teachers to combobox options
  const teacherOptions: ComboboxOption[] = teachers.map((teacher) => ({
    value: teacher.id,
    label: `${teacher.first_name} ${teacher.last_name}`,
  }))

  // Transform evaluation tools to combobox options
  const evaluationToolOptions: ComboboxOption[] = evaluationTools.map((tool) => ({
    value: tool.id,
    label: tool.name,
  }))

  // Transform observers to combobox options
  const observerOptions: ComboboxOption[] = observers.map((observer) => ({
    value: observer.id,
    label: observer.name,
  }))

  // Create observation mutation
  const createObservationMutation = useMutation({
    mutationFn: (data: CreateObservationData) => observationService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['observations'] })
      toast.success('Observation created successfully', {
        description: 'The observation has been added to the system.',
      })
      navigate('/observations')
    },
    onError: (error: any) => {
      toast.error('Failed to create observation', {
        description: error.response?.data?.message || 'Please try again.',
      })
    },
  })

  // Update observation mutation
  const updateObservationMutation = useMutation({
    mutationFn: (data: CreateObservationData) =>
      observationService.update(Number(id), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['observations'] })
      queryClient.invalidateQueries({ queryKey: ['observation', id] })
      toast.success('Observation updated successfully', {
        description: 'The changes have been saved.',
      })
      navigate('/observations')
    },
    onError: (error: any) => {
      toast.error('Failed to update observation', {
        description: error.response?.data?.message || 'Please try again.',
      })
    },
  })

  // Get the selected evaluation tool
  const selectedEvaluationTool = useMemo(() => {
    return evaluationTools.find((tool) => tool.id === selectedEvaluationToolId)
  }, [evaluationTools, selectedEvaluationToolId])

  // Populate form with existing observation data in edit or view mode
  useEffect(() => {
    if ((isEditMode || isViewMode) && existingObservation) {
      setSelectedTeacherId(existingObservation.teacher_id)
      setSelectedEvaluationToolId(existingObservation.evaluation_tool_id)
      setSelectedObserverId(existingObservation.observer_id || '')
      setDimensionScores(existingObservation.scores)
      setNotes(existingObservation.notes || '')
    }
  }, [isEditMode, isViewMode, existingObservation])

  // Reset dimension scores when evaluation tool changes (only in create mode)
  useEffect(() => {
    if (isCreateMode && selectedEvaluationTool?.dimensions) {
      const initialScores: Record<string, number> = {}
      selectedEvaluationTool.dimensions.forEach((dimension) => {
        initialScores[dimension] = 0
      })
      setDimensionScores(initialScores)
    } else if (isCreateMode) {
      setDimensionScores({})
    }
  }, [selectedEvaluationTool, isCreateMode])

  const handleDimensionScoreChange = (dimension: string, value: string) => {
    const numValue = parseFloat(value)
    if (!isNaN(numValue)) {
      setDimensionScores((prev) => ({
        ...prev,
        [dimension]: numValue,
      }))
    }
  }

  const handleBack = () => {
    navigate('/observations')
  }

  const handleSubmit = () => {
    // Validation
    if (!selectedTeacherId) {
      toast.error('Validation Error', {
        description: 'Please select a teacher',
      })
      return
    }

    if (!selectedEvaluationToolId) {
      toast.error('Validation Error', {
        description: 'Please select an evaluation tool',
      })
      return
    }

    // Check if all dimension scores are filled
    if (selectedEvaluationTool?.dimensions) {
      const missingDimensions = selectedEvaluationTool.dimensions.filter(
        (dim) => dimensionScores[dim] === undefined || dimensionScores[dim] === null
      )
      if (missingDimensions.length > 0) {
        toast.error('Validation Error', {
          description: 'Please fill in all dimension scores',
        })
        return
      }
    }

    // Use current date for new observations, keep existing date for edits
    const observationDate = isEditMode
      ? existingObservation?.observation_date || new Date().toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0]

    const observationData: CreateObservationData = {
      teacher_id: Number(selectedTeacherId),
      evaluation_tool_id: Number(selectedEvaluationToolId),
      observation_date: observationDate,
      scores: dimensionScores,
      notes: notes || undefined,
    }

    // Add observer_id if selected
    if (selectedObserverId) {
      observationData.observer_id = Number(selectedObserverId)
    }

    if (isEditMode) {
      updateObservationMutation.mutate(observationData)
    } else {
      createObservationMutation.mutate(observationData)
    }
  }

  const isLoading = loadingTeachers || loadingTools || loadingObservers || ((isEditMode || isViewMode) && loadingObservation)
  const isSaving = createObservationMutation.isPending || updateObservationMutation.isPending

  if ((isEditMode || isViewMode) && loadingObservation) {
    return (
      <div className="p-8 text-center">
        <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600">Loading observation...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleBack}
          className="h-8 w-8"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">
          {isViewMode ? 'View Observation' : isEditMode ? 'Edit Observation' : 'Create Observation'}
        </h1>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="space-y-6">
          {/* 3-column layout for dropdowns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Teacher Dropdown */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Teacher {!isViewMode && <span className="text-red-500">*</span>}
              </label>
              <Combobox
                options={teacherOptions}
                value={selectedTeacherId}
                onValueChange={setSelectedTeacherId}
                placeholder="Select teacher..."
                searchPlaceholder="Search teachers..."
                emptyText="No teachers found."
                disabled={isLoading || isViewMode}
              />
            </div>

            {/* Evaluation Tool Dropdown */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Evaluation Tool {!isViewMode && <span className="text-red-500">*</span>}
              </label>
              <Combobox
                options={evaluationToolOptions}
                value={selectedEvaluationToolId}
                onValueChange={setSelectedEvaluationToolId}
                placeholder="Select evaluation tool..."
                searchPlaceholder="Search tools..."
                emptyText="No evaluation tools found."
                disabled={isLoading || isViewMode}
              />
            </div>

            {/* Observer Dropdown */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Observer
              </label>
              <Combobox
                options={observerOptions}
                value={selectedObserverId}
                onValueChange={setSelectedObserverId}
                placeholder="Select observer..."
                searchPlaceholder="Search observers..."
                emptyText="No observers found."
                disabled={isLoading || isViewMode}
              />
            </div>
          </div>

          {/* Dimension Scores Section - shown only when evaluation tool is selected */}
          {selectedEvaluationTool && selectedEvaluationTool.dimensions && selectedEvaluationTool.dimensions.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Dimension Scores</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {selectedEvaluationTool.dimensions.map((dimension) => (
                  <div key={dimension} className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      {dimension} {!isViewMode && <span className="text-red-500">*</span>}
                    </label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      value={dimensionScores[dimension] || 0}
                      onChange={(e) => handleDimensionScoreChange(dimension, e.target.value)}
                      className="w-full"
                      placeholder="0.00"
                      disabled={isViewMode}
                      readOnly={isViewMode}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Observation Notes Section - always visible */}
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Observation Notes</h3>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter any additional notes or observations..."
              rows={6}
              className="w-full"
              disabled={isViewMode}
              readOnly={isViewMode}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            {isViewMode ? (
              <Button
                type="button"
                onClick={handleBack}
              >
                Close
              </Button>
            ) : (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSaving}
                >
                  {isSaving ? (isEditMode ? 'Saving...' : 'Creating...') : (isEditMode ? 'Save' : 'Create')}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

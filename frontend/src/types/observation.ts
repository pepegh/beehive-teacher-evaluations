import type { Teacher } from './teacher'
import type { EvaluationTool } from './evaluationTool'
import type { Observer } from './observer'

export interface Observation {
  id: number
  teacher_id: number
  evaluation_tool_id: number
  observer_id?: number | null
  observation_date: string
  scores: Record<string, number>
  notes?: string | null
  average_score: number
  lowest_dimension?: string | null
  lowest_score?: number | null
  created_at: string
  updated_at: string
  // Relationships
  teacher?: Teacher
  evaluation_tool?: EvaluationTool
  observer?: Observer
}

export interface CreateObservationData {
  teacher_id: number
  evaluation_tool_id: number
  observer_id?: number
  observation_date: string
  scores: Record<string, number>
  notes?: string
}

export interface UpdateObservationData extends Partial<CreateObservationData> {}

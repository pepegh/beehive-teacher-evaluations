export interface EvaluationTool {
  id: number
  name: string
  description?: string | null
  dimensions?: string[] | null
  created_at: string
  updated_at: string
}

export interface CreateEvaluationToolData {
  name: string
  description?: string
  dimensions?: string[]
}

export interface UpdateEvaluationToolData extends Partial<CreateEvaluationToolData> {}

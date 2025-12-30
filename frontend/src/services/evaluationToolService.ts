import api from '@/lib/api'
import type { EvaluationTool, CreateEvaluationToolData, UpdateEvaluationToolData } from '@/types/evaluationTool'

export const evaluationToolService = {
  // Get all evaluation tools
  getAll: async (): Promise<EvaluationTool[]> => {
    const response = await api.get<EvaluationTool[]>('/evaluation-tools')
    return response.data
  },

  // Get single evaluation tool
  getById: async (id: number): Promise<EvaluationTool> => {
    const response = await api.get<EvaluationTool>(`/evaluation-tools/${id}`)
    return response.data
  },

  // Create new evaluation tool
  create: async (data: CreateEvaluationToolData): Promise<EvaluationTool> => {
    const response = await api.post<EvaluationTool>('/evaluation-tools', data)
    return response.data
  },

  // Update evaluation tool
  update: async (id: number, data: UpdateEvaluationToolData): Promise<EvaluationTool> => {
    const response = await api.put<EvaluationTool>(`/evaluation-tools/${id}`, data)
    return response.data
  },

  // Delete evaluation tool
  delete: async (id: number): Promise<void> => {
    await api.delete(`/evaluation-tools/${id}`)
  },
}

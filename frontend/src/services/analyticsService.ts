import api from '@/lib/api'

export interface WeakTeacher {
  name: string
  score: number
}

export interface DimensionWeaknessData {
  dimension: string
  averageScore: number
  weakCount: number
  weakTeachers: WeakTeacher[]
  strongCount: number
  strongTeachers: WeakTeacher[]
}

export interface DimensionWeaknessParams {
  startDate?: string
  endDate?: string
  evaluationToolId?: number | 'all'
}

export const analyticsService = {
  // Get dimension weakness analysis
  getDimensionWeakness: async (params: DimensionWeaknessParams): Promise<DimensionWeaknessData[]> => {
    const queryParams = new URLSearchParams()

    if (params.startDate) {
      queryParams.append('start_date', params.startDate)
    }
    if (params.endDate) {
      queryParams.append('end_date', params.endDate)
    }
    if (params.evaluationToolId && params.evaluationToolId !== 'all') {
      queryParams.append('evaluation_tool_id', params.evaluationToolId.toString())
    }

    const url = `/analytics/dimension-weakness${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    const response = await api.get<DimensionWeaknessData[]>(url)
    return response.data
  },
}

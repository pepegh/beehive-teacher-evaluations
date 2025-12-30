import api from '@/lib/api'
import type { Observation, CreateObservationData, UpdateObservationData } from '@/types/observation'

export const observationService = {
  // Get all observations
  getAll: async (): Promise<Observation[]> => {
    const response = await api.get<Observation[]>('/observations')
    return response.data
  },

  // Get single observation
  getById: async (id: number): Promise<Observation> => {
    const response = await api.get<Observation>(`/observations/${id}`)
    return response.data
  },

  // Create new observation
  create: async (data: CreateObservationData): Promise<Observation> => {
    const response = await api.post<Observation>('/observations', data)
    return response.data
  },

  // Update observation
  update: async (id: number, data: UpdateObservationData): Promise<Observation> => {
    const response = await api.put<Observation>(`/observations/${id}`, data)
    return response.data
  },

  // Delete observation
  delete: async (id: number): Promise<void> => {
    await api.delete(`/observations/${id}`)
  },
}

import api from '@/lib/api'
import type { Observer, CreateObserverData, UpdateObserverData } from '@/types/observer'

export const observerService = {
  // Get all observers
  getAll: async (): Promise<Observer[]> => {
    const response = await api.get<Observer[]>('/observers')
    return response.data
  },

  // Get single observer
  getById: async (id: number): Promise<Observer> => {
    const response = await api.get<Observer>(`/observers/${id}`)
    return response.data
  },

  // Create new observer
  create: async (data: CreateObserverData): Promise<Observer> => {
    const response = await api.post<Observer>('/observers', data)
    return response.data
  },

  // Update observer
  update: async (id: number, data: UpdateObserverData): Promise<Observer> => {
    const response = await api.put<Observer>(`/observers/${id}`, data)
    return response.data
  },

  // Delete observer
  delete: async (id: number): Promise<void> => {
    await api.delete(`/observers/${id}`)
  },
}

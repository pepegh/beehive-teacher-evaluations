import api from '@/lib/api'
import type { Teacher, CreateTeacherData, UpdateTeacherData } from '@/types/teacher'

export const teacherService = {
  // Get all teachers
  getAll: async (): Promise<Teacher[]> => {
    const response = await api.get<Teacher[]>('/teachers')
    return response.data
  },

  // Get single teacher
  getById: async (id: number): Promise<Teacher> => {
    const response = await api.get<Teacher>(`/teachers/${id}`)
    return response.data
  },

  // Create new teacher
  create: async (data: CreateTeacherData): Promise<Teacher> => {
    const response = await api.post<Teacher>('/teachers', data)
    return response.data
  },

  // Update teacher
  update: async (id: number, data: UpdateTeacherData): Promise<Teacher> => {
    const response = await api.put<Teacher>(`/teachers/${id}`, data)
    return response.data
  },

  // Delete teacher
  delete: async (id: number): Promise<void> => {
    await api.delete(`/teachers/${id}`)
  },
}

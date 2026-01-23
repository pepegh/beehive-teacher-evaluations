import { describe, it, expect, vi, beforeEach } from 'vitest'
import { teacherService } from '../teacherService'
import api from '@/lib/api'
import type { Teacher, CreateTeacherData } from '@/types/teacher'

vi.mock('@/lib/api')

const mockTeacher: Teacher = {
  id: 1,
  first_name: 'John',
  middle_name: null,
  last_name: 'Doe',
  email: 'john.doe@example.com',
  subject: 'Mathematics',
  department: 'english',
  level: 'primaria',
  hire_date: '2023-01-15',
  status: 'active',
  created_at: '2024-01-01T00:00:00.000Z',
  updated_at: '2024-01-01T00:00:00.000Z',
}

describe('teacherService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getAll', () => {
    it('should fetch all teachers', async () => {
      const mockTeachers = [mockTeacher]
      vi.mocked(api.get).mockResolvedValue({ data: mockTeachers })

      const result = await teacherService.getAll()

      expect(api.get).toHaveBeenCalledWith('/teachers')
      expect(result).toEqual(mockTeachers)
    })
  })

  describe('getById', () => {
    it('should fetch a single teacher by id', async () => {
      vi.mocked(api.get).mockResolvedValue({ data: mockTeacher })

      const result = await teacherService.getById(1)

      expect(api.get).toHaveBeenCalledWith('/teachers/1')
      expect(result).toEqual(mockTeacher)
    })
  })

  describe('create', () => {
    it('should create a new teacher', async () => {
      const createData: CreateTeacherData = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        department: 'english',
        level: 'primaria',
      }
      vi.mocked(api.post).mockResolvedValue({ data: mockTeacher })

      const result = await teacherService.create(createData)

      expect(api.post).toHaveBeenCalledWith('/teachers', createData)
      expect(result).toEqual(mockTeacher)
    })
  })

  describe('update', () => {
    it('should update an existing teacher', async () => {
      const updateData = { first_name: 'Jane' }
      const updatedTeacher = { ...mockTeacher, first_name: 'Jane' }
      vi.mocked(api.put).mockResolvedValue({ data: updatedTeacher })

      const result = await teacherService.update(1, updateData)

      expect(api.put).toHaveBeenCalledWith('/teachers/1', updateData)
      expect(result).toEqual(updatedTeacher)
    })
  })

  describe('delete', () => {
    it('should delete a teacher', async () => {
      vi.mocked(api.delete).mockResolvedValue({ data: null })

      await teacherService.delete(1)

      expect(api.delete).toHaveBeenCalledWith('/teachers/1')
    })
  })
})

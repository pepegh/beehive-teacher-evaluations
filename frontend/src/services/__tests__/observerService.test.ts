import { describe, it, expect, vi, beforeEach } from 'vitest'
import { observerService } from '../observerService'
import api from '@/lib/api'
import type { Observer, CreateObserverData } from '@/types/observer'

vi.mock('@/lib/api')

const mockObserver: Observer = {
  id: 1,
  name: 'Test Observer',
  department: 'english',
  created_at: '2024-01-01T00:00:00.000Z',
  updated_at: '2024-01-01T00:00:00.000Z',
}

describe('observerService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getAll', () => {
    it('should fetch all observers', async () => {
      const mockObservers = [mockObserver]
      vi.mocked(api.get).mockResolvedValue({ data: mockObservers })

      const result = await observerService.getAll()

      expect(api.get).toHaveBeenCalledWith('/observers')
      expect(result).toEqual(mockObservers)
    })
  })

  describe('getById', () => {
    it('should fetch a single observer by id', async () => {
      vi.mocked(api.get).mockResolvedValue({ data: mockObserver })

      const result = await observerService.getById(1)

      expect(api.get).toHaveBeenCalledWith('/observers/1')
      expect(result).toEqual(mockObserver)
    })
  })

  describe('create', () => {
    it('should create a new observer', async () => {
      const createData: CreateObserverData = {
        name: 'Test Observer',
        department: 'english',
      }
      vi.mocked(api.post).mockResolvedValue({ data: mockObserver })

      const result = await observerService.create(createData)

      expect(api.post).toHaveBeenCalledWith('/observers', createData)
      expect(result).toEqual(mockObserver)
    })
  })

  describe('update', () => {
    it('should update an existing observer', async () => {
      const updateData = { name: 'Updated Observer' }
      const updatedObserver = { ...mockObserver, name: 'Updated Observer' }
      vi.mocked(api.put).mockResolvedValue({ data: updatedObserver })

      const result = await observerService.update(1, updateData)

      expect(api.put).toHaveBeenCalledWith('/observers/1', updateData)
      expect(result).toEqual(updatedObserver)
    })
  })

  describe('delete', () => {
    it('should delete an observer', async () => {
      vi.mocked(api.delete).mockResolvedValue({ data: null })

      await observerService.delete(1)

      expect(api.delete).toHaveBeenCalledWith('/observers/1')
    })
  })
})

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { observationService } from '../observationService'
import api from '@/lib/api'
import type { Observation, CreateObservationData } from '@/types/observation'

vi.mock('@/lib/api')

const mockObservation: Observation = {
  id: 1,
  teacher_id: 1,
  evaluation_tool_id: 1,
  observer_id: 1,
  observation_date: '2024-03-15',
  scores: { 'Clarity': 3.5, 'Engagement': 4.0 },
  notes: 'Good observation',
  average_score: 3.75,
  lowest_dimension: 'Clarity',
  lowest_score: 3.5,
  created_at: '2024-01-01T00:00:00.000Z',
  updated_at: '2024-01-01T00:00:00.000Z',
}

describe('observationService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getAll', () => {
    it('should fetch all observations', async () => {
      const mockObservations = [mockObservation]
      vi.mocked(api.get).mockResolvedValue({ data: mockObservations })

      const result = await observationService.getAll()

      expect(api.get).toHaveBeenCalledWith('/observations')
      expect(result).toEqual(mockObservations)
    })
  })

  describe('getById', () => {
    it('should fetch a single observation by id', async () => {
      vi.mocked(api.get).mockResolvedValue({ data: mockObservation })

      const result = await observationService.getById(1)

      expect(api.get).toHaveBeenCalledWith('/observations/1')
      expect(result).toEqual(mockObservation)
    })
  })

  describe('create', () => {
    it('should create a new observation', async () => {
      const createData: CreateObservationData = {
        teacher_id: 1,
        evaluation_tool_id: 1,
        observer_id: 1,
        observation_date: '2024-03-15',
        scores: { 'Clarity': 3.5, 'Engagement': 4.0 },
        notes: 'Good observation',
      }
      vi.mocked(api.post).mockResolvedValue({ data: mockObservation })

      const result = await observationService.create(createData)

      expect(api.post).toHaveBeenCalledWith('/observations', createData)
      expect(result).toEqual(mockObservation)
    })
  })

  describe('update', () => {
    it('should update an existing observation', async () => {
      const updateData = { notes: 'Updated notes' }
      const updatedObservation = { ...mockObservation, notes: 'Updated notes' }
      vi.mocked(api.put).mockResolvedValue({ data: updatedObservation })

      const result = await observationService.update(1, updateData)

      expect(api.put).toHaveBeenCalledWith('/observations/1', updateData)
      expect(result).toEqual(updatedObservation)
    })
  })

  describe('delete', () => {
    it('should delete an observation', async () => {
      vi.mocked(api.delete).mockResolvedValue({ data: null })

      await observationService.delete(1)

      expect(api.delete).toHaveBeenCalledWith('/observations/1')
    })
  })
})

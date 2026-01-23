import { describe, it, expect, vi, beforeEach } from 'vitest'
import { evaluationToolService } from '../evaluationToolService'
import api from '@/lib/api'
import type { EvaluationTool, CreateEvaluationToolData } from '@/types/evaluationTool'

vi.mock('@/lib/api')

const mockEvaluationTool: EvaluationTool = {
  id: 1,
  name: 'Test Tool',
  description: 'A test evaluation tool',
  dimensions: ['Clarity', 'Engagement', 'Management'],
  created_at: '2024-01-01T00:00:00.000Z',
  updated_at: '2024-01-01T00:00:00.000Z',
}

describe('evaluationToolService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getAll', () => {
    it('should fetch all evaluation tools', async () => {
      const mockTools = [mockEvaluationTool]
      vi.mocked(api.get).mockResolvedValue({ data: mockTools })

      const result = await evaluationToolService.getAll()

      expect(api.get).toHaveBeenCalledWith('/evaluation-tools')
      expect(result).toEqual(mockTools)
    })
  })

  describe('getById', () => {
    it('should fetch a single evaluation tool by id', async () => {
      vi.mocked(api.get).mockResolvedValue({ data: mockEvaluationTool })

      const result = await evaluationToolService.getById(1)

      expect(api.get).toHaveBeenCalledWith('/evaluation-tools/1')
      expect(result).toEqual(mockEvaluationTool)
    })
  })

  describe('create', () => {
    it('should create a new evaluation tool', async () => {
      const createData: CreateEvaluationToolData = {
        name: 'Test Tool',
        description: 'A test evaluation tool',
        dimensions: ['Clarity', 'Engagement', 'Management'],
      }
      vi.mocked(api.post).mockResolvedValue({ data: mockEvaluationTool })

      const result = await evaluationToolService.create(createData)

      expect(api.post).toHaveBeenCalledWith('/evaluation-tools', createData)
      expect(result).toEqual(mockEvaluationTool)
    })
  })

  describe('update', () => {
    it('should update an existing evaluation tool', async () => {
      const updateData = { name: 'Updated Tool' }
      const updatedTool = { ...mockEvaluationTool, name: 'Updated Tool' }
      vi.mocked(api.put).mockResolvedValue({ data: updatedTool })

      const result = await evaluationToolService.update(1, updateData)

      expect(api.put).toHaveBeenCalledWith('/evaluation-tools/1', updateData)
      expect(result).toEqual(updatedTool)
    })
  })

  describe('delete', () => {
    it('should delete an evaluation tool', async () => {
      vi.mocked(api.delete).mockResolvedValue({ data: null })

      await evaluationToolService.delete(1)

      expect(api.delete).toHaveBeenCalledWith('/evaluation-tools/1')
    })
  })
})

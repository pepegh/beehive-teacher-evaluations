import { describe, it, expect, vi, beforeEach } from 'vitest'
import { analyticsService, type DimensionWeaknessData } from '../analyticsService'
import api from '@/lib/api'

vi.mock('@/lib/api')

const mockDimensionWeaknessData: DimensionWeaknessData[] = [
  {
    dimension: 'Clarity',
    averageScore: 3.2,
    weakCount: 2,
    weakTeachers: [
      { name: 'Teacher A', score: 2.5 },
      { name: 'Teacher B', score: 2.8 },
    ],
    strongCount: 1,
    strongTeachers: [
      { name: 'Teacher C', score: 3.7 },
    ],
  },
  {
    dimension: 'Engagement',
    averageScore: 3.5,
    weakCount: 0,
    weakTeachers: [],
    strongCount: 2,
    strongTeachers: [
      { name: 'Teacher D', score: 3.8 },
      { name: 'Teacher E', score: 3.6 },
    ],
  },
]

describe('analyticsService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getDimensionWeakness', () => {
    it('should fetch dimension weakness data without filters', async () => {
      vi.mocked(api.get).mockResolvedValue({ data: mockDimensionWeaknessData })

      const result = await analyticsService.getDimensionWeakness({})

      expect(api.get).toHaveBeenCalledWith('/analytics/dimension-weakness')
      expect(result).toEqual(mockDimensionWeaknessData)
    })

    it('should fetch dimension weakness data with date filters', async () => {
      vi.mocked(api.get).mockResolvedValue({ data: mockDimensionWeaknessData })

      const result = await analyticsService.getDimensionWeakness({
        startDate: '2024-01-01',
        endDate: '2024-12-31',
      })

      expect(api.get).toHaveBeenCalledWith(
        '/analytics/dimension-weakness?start_date=2024-01-01&end_date=2024-12-31'
      )
      expect(result).toEqual(mockDimensionWeaknessData)
    })

    it('should fetch dimension weakness data with evaluation tool filter', async () => {
      vi.mocked(api.get).mockResolvedValue({ data: mockDimensionWeaknessData })

      const result = await analyticsService.getDimensionWeakness({
        evaluationToolId: 1,
      })

      expect(api.get).toHaveBeenCalledWith(
        '/analytics/dimension-weakness?evaluation_tool_id=1'
      )
      expect(result).toEqual(mockDimensionWeaknessData)
    })

    it('should not include evaluation tool id when set to all', async () => {
      vi.mocked(api.get).mockResolvedValue({ data: mockDimensionWeaknessData })

      const result = await analyticsService.getDimensionWeakness({
        evaluationToolId: 'all',
      })

      expect(api.get).toHaveBeenCalledWith('/analytics/dimension-weakness')
      expect(result).toEqual(mockDimensionWeaknessData)
    })

    it('should fetch dimension weakness data with all filters combined', async () => {
      vi.mocked(api.get).mockResolvedValue({ data: mockDimensionWeaknessData })

      const result = await analyticsService.getDimensionWeakness({
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        evaluationToolId: 2,
      })

      expect(api.get).toHaveBeenCalledWith(
        '/analytics/dimension-weakness?start_date=2024-01-01&end_date=2024-12-31&evaluation_tool_id=2'
      )
      expect(result).toEqual(mockDimensionWeaknessData)
    })
  })
})

import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { DimensionWeaknessChart } from '../DimensionWeaknessChart'
import type { DimensionWeaknessData } from '@/services/analyticsService'

// Mock recharts to avoid rendering issues in tests
vi.mock('recharts', async () => {
  const actual = await vi.importActual('recharts')
  return {
    ...actual,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
      <div style={{ width: 800, height: 300 }}>{children}</div>
    ),
  }
})

const mockData: DimensionWeaknessData[] = [
  {
    dimension: 'Clarity',
    averageScore: 2.8,
    weakCount: 2,
    weakTeachers: [
      { name: 'Teacher A', score: 2.5 },
      { name: 'Teacher B', score: 2.8 },
    ],
    strongCount: 0,
    strongTeachers: [],
  },
  {
    dimension: 'Engagement',
    averageScore: 3.5,
    weakCount: 0,
    weakTeachers: [],
    strongCount: 2,
    strongTeachers: [
      { name: 'Teacher C', score: 3.8 },
      { name: 'Teacher D', score: 3.6 },
    ],
  },
  {
    dimension: 'Management',
    averageScore: 3.2,
    weakCount: 0,
    weakTeachers: [],
    strongCount: 0,
    strongTeachers: [],
  },
]

describe('DimensionWeaknessChart', () => {
  it('should render the chart with data', () => {
    render(<DimensionWeaknessChart data={mockData} />)

    expect(screen.getByText('Teachers Below 3.0 by Dimension')).toBeInTheDocument()
    expect(screen.getByText('Teachers above 3.5 by Dimension')).toBeInTheDocument()
  })

  it('should display legend items', () => {
    render(<DimensionWeaknessChart data={mockData} />)

    expect(screen.getByText('Below 3.0')).toBeInTheDocument()
    expect(screen.getByText('3.0 - 3.5')).toBeInTheDocument()
    expect(screen.getByText('Above 3.5')).toBeInTheDocument()
  })

  it('should display weak teachers section when there are weak performers', () => {
    render(<DimensionWeaknessChart data={mockData} />)

    expect(screen.getByText('Clarity')).toBeInTheDocument()
    // Use getAllByText since "2 teachers" appears in both weak and strong sections
    const teacherBadges = screen.getAllByText('2 teachers')
    expect(teacherBadges.length).toBeGreaterThanOrEqual(1)
  })

  it('should display strong teachers section when there are strong performers', () => {
    render(<DimensionWeaknessChart data={mockData} />)

    expect(screen.getByText('Engagement')).toBeInTheDocument()
    // Use getAllByText since "2 teachers" appears in both weak and strong sections
    const teacherBadges = screen.getAllByText('2 teachers')
    expect(teacherBadges.length).toBeGreaterThanOrEqual(1)
  })

  it('should handle empty data gracefully', () => {
    render(<DimensionWeaknessChart data={[]} />)

    expect(screen.getByText('No teachers with scores below 3.0 in any dimension')).toBeInTheDocument()
    expect(screen.getByText('No teachers with scores between 3.5 and 4.0 in any dimension')).toBeInTheDocument()
  })

  it('should show empty state messages when no weak or strong performers', () => {
    const dataWithoutWeakOrStrong: DimensionWeaknessData[] = [
      {
        dimension: 'Test',
        averageScore: 3.2,
        weakCount: 0,
        weakTeachers: [],
        strongCount: 0,
        strongTeachers: [],
      },
    ]

    render(<DimensionWeaknessChart data={dataWithoutWeakOrStrong} />)

    expect(screen.getByText('No teachers with scores below 3.0 in any dimension')).toBeInTheDocument()
    expect(screen.getByText('No teachers with scores between 3.5 and 4.0 in any dimension')).toBeInTheDocument()
  })

  it('should display singular teacher text when count is 1', () => {
    const dataWithOneTeacher: DimensionWeaknessData[] = [
      {
        dimension: 'Clarity',
        averageScore: 2.5,
        weakCount: 1,
        weakTeachers: [{ name: 'Teacher A', score: 2.5 }],
        strongCount: 0,
        strongTeachers: [],
      },
    ]

    render(<DimensionWeaknessChart data={dataWithOneTeacher} />)

    expect(screen.getByText('1 teacher')).toBeInTheDocument()
  })
})

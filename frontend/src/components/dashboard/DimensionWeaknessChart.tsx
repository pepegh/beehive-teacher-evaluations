import { Bar, BarChart, XAxis, YAxis, Cell } from 'recharts'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { AlertTriangle } from 'lucide-react'
import type { DimensionWeaknessData } from '@/services/analyticsService'

interface DimensionWeaknessChartProps {
  data: DimensionWeaknessData[]
}

export function DimensionWeaknessChart({ data }: DimensionWeaknessChartProps) {
  const chartConfig = {
    averageScore: {
      label: 'Average Score',
      color: 'hsl(var(--primary))',
    },
  }

  const getBarColor = (score: number) => {
    if (score < 3.0) {
      return '#ef4444' // red for scores below 3.0
    } else if (score >= 3.0 && score <= 3.5) {
      return '#10b981' // green for scores 3.0-3.5
    } else {
      return '#3b82f6' // blue for scores above 3.5
    }
  }

  return (
    <div className="space-y-6">
      {/* Bar Chart */}
      <ChartContainer config={chartConfig} className="h-[300px] w-full">
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
        >
          <XAxis
            dataKey="dimension"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 11 }}
          />
          <YAxis
            domain={[0, 5]}
            ticks={[0, 1, 2, 3, 4, 5]}
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 11 }}
          />
          <ChartTooltip
            content={({ active, payload }) => {
              if (!active || !payload || payload.length === 0) return null
              const data = payload[0].payload as DimensionWeaknessData
              return (
                <div className="rounded-lg border bg-background p-2 shadow-md">
                  <div className="space-y-1">
                    <div className="font-semibold text-sm">{data.dimension}</div>
                    <div className="text-xs text-muted-foreground">
                      Average Score: <span className="font-medium text-foreground">{data.averageScore.toFixed(2)}</span>
                    </div>
                    {data.weakCount > 0 && (
                      <div className="text-xs text-muted-foreground">
                        Below 3.0: <span className="font-medium text-foreground">{data.weakCount}</span>
                      </div>
                    )}
                  </div>
                </div>
              )
            }}
          />
          <Bar dataKey="averageScore" radius={[6, 6, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(entry.averageScore)} />
            ))}
          </Bar>
        </BarChart>
      </ChartContainer>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: '#ef4444' }}></div>
          <span className="text-muted-foreground">Below 3.0</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: '#10b981' }}></div>
          <span className="text-muted-foreground">3.0 - 3.5</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: '#3b82f6' }}></div>
          <span className="text-muted-foreground">Above 3.5</span>
        </div>
      </div>

      {/* Accordion for detailed view */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-red-500" />
          Teachers Below 3.0 by Dimension
        </h3>
        <Accordion type="single" collapsible className="w-full border rounded-lg overflow-hidden">
          {data
            .filter((item) => item.weakCount > 0)
            .map((item, index, array) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-b last:border-b-0">
                <AccordionTrigger className={`px-4 hover:bg-accent hover:text-accent-foreground ${index === 0 ? 'rounded-t-lg' : ''} ${index === array.length - 1 ? 'rounded-b-lg' : ''}`}>
                  <div className="flex items-center justify-between w-full pr-4">
                    <span className="font-medium">{item.dimension}</span>
                    <span className="text-sm bg-red-100 text-red-800 px-2 py-1 rounded-full">
                      {item.weakCount} {item.weakCount === 1 ? 'teacher' : 'teachers'}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="overflow-hidden rounded-lg border">
                    <table className="w-full text-sm">
                      <thead className="bg-accent">
                        <tr>
                          <th className="text-left py-2 px-3 font-medium">Teacher</th>
                          <th className="text-right py-2 px-3 font-medium">Score</th>
                        </tr>
                      </thead>
                      <tbody>
                        {item.weakTeachers.map((teacher, idx) => (
                          <tr key={idx} className="border-t">
                            <td className="py-2 px-3">{teacher.name}</td>
                            <td className="text-right py-2 px-3">
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                {teacher.score.toFixed(2)}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
        </Accordion>
        {data.filter((item) => item.weakCount > 0).length === 0 && (
          <div className="text-center py-8 border rounded-lg bg-muted/20">
            <p className="text-muted-foreground text-sm">
              No teachers with scores below 3.0 in any dimension
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

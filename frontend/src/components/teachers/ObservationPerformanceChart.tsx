import { Line, LineChart, XAxis, YAxis, CartesianGrid, Legend } from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartLegendContent,
} from '@/components/ui/chart'
import { format } from 'date-fns'
import type { Observation } from '@/types/observation'

interface ObservationPerformanceChartProps {
  observations: Observation[]
}

export function ObservationPerformanceChart({ observations }: ObservationPerformanceChartProps) {
  // Get unique evaluation tools
  const evaluationTools = Array.from(
    new Set(observations.map((obs) => obs.evaluation_tool?.name).filter(Boolean))
  )

  // Transform data for the chart
  // Each observation becomes a data point with date and scores for each tool
  const chartData = observations
    .sort((a, b) => new Date(a.observation_date).getTime() - new Date(b.observation_date).getTime())
    .map((obs) => {
      const date = new Date(obs.observation_date)
      const formattedDate = format(date, 'dd MMM yyyy')

      const dataPoint: any = {
        date: formattedDate,
        timestamp: date.getTime(), // for sorting
      }

      // Add score for this observation's tool
      if (obs.evaluation_tool?.name) {
        dataPoint[obs.evaluation_tool.name] = obs.average_score
      }

      return dataPoint
    })

  // Color palette for different tools
  const colors = [
    'hsl(220, 70%, 50%)', // Blue
    'hsl(142, 71%, 45%)', // Green
    'hsl(262, 83%, 58%)', // Purple
    'hsl(31, 97%, 54%)', // Orange
    'hsl(346, 77%, 50%)', // Red
  ]

  // Create chart config
  const chartConfig: any = {}
  evaluationTools.forEach((tool, index) => {
    if (tool) {
      chartConfig[tool] = {
        label: tool,
        color: colors[index % colors.length],
      }
    }
  })

  if (observations.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] text-gray-500">
        No observation data available
      </div>
    )
  }

  return (
    <ChartContainer config={chartConfig} className="h-[400px] w-full">
      <LineChart
        data={chartData}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 11 }}
          angle={-45}
          textAnchor="end"
          height={80}
        />
        <YAxis
          domain={[0, 4]}
          ticks={[0, 1, 2, 3, 4]}
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 11 }}
        />
        <ChartTooltip
          content={({ active, payload }) => {
            if (!active || !payload || payload.length === 0) return null
            return (
              <div className="rounded-lg border bg-background p-3 shadow-md">
                <div className="font-semibold text-sm mb-2">{payload[0]?.payload?.date}</div>
                <div className="space-y-1">
                  {payload.map((entry: any) => (
                    entry.value !== undefined && (
                      <div key={entry.dataKey} className="flex items-center gap-2 text-xs">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: entry.color }}
                        />
                        <span className="text-muted-foreground">{entry.dataKey}:</span>
                        <span className="font-medium">{entry.value.toFixed(2)}</span>
                      </div>
                    )
                  ))}
                </div>
              </div>
            )
          }}
        />
        <Legend content={<ChartLegendContent />} />
        {evaluationTools.map((tool, index) => (
          tool && (
            <Line
              key={tool}
              type="monotone"
              dataKey={tool}
              stroke={colors[index % colors.length]}
              strokeWidth={2}
              dot={{ r: 4, strokeWidth: 2, fill: colors[index % colors.length] }}
              activeDot={{ r: 6, strokeWidth: 2 }}
              connectNulls={false}
            />
          )
        ))}
      </LineChart>
    </ChartContainer>
  )
}

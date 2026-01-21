import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DatePicker } from '@/components/ui/date-picker'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { evaluationToolService } from '@/services/evaluationToolService'
import { analyticsService, type DimensionWeaknessData } from '@/services/analyticsService'
import type { EvaluationTool } from '@/types/evaluationTool'
import { DimensionWeaknessChart } from '@/components/dashboard/DimensionWeaknessChart'
import { format } from 'date-fns'

export default function Dashboard() {
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [selectedTool, setSelectedTool] = useState<string>('all')
  const [evaluationTools, setEvaluationTools] = useState<EvaluationTool[]>([])
  const [weaknessData, setWeaknessData] = useState<DimensionWeaknessData[]>([])
  const [isLoadingWeakness, setIsLoadingWeakness] = useState(false)

  useEffect(() => {
    const fetchEvaluationTools = async () => {
      try {
        const tools = await evaluationToolService.getAll()
        setEvaluationTools(tools)
      } catch (error) {
        console.error('Failed to fetch evaluation tools:', error)
      }
    }

    fetchEvaluationTools()
  }, [])

  useEffect(() => {
    const fetchWeaknessData = async () => {
      setIsLoadingWeakness(true)
      try {
        const data = await analyticsService.getDimensionWeakness({
          startDate: startDate ? format(startDate, 'yyyy-MM-dd') : undefined,
          endDate: endDate ? format(endDate, 'yyyy-MM-dd') : undefined,
          evaluationToolId: selectedTool === 'all' ? 'all' : parseInt(selectedTool),
        })
        setWeaknessData(data)
      } catch (error) {
        console.error('Failed to fetch dimension weakness data:', error)
        setWeaknessData([])
      } finally {
        setIsLoadingWeakness(false)
      }
    }

    fetchWeaknessData()
  }, [startDate, endDate, selectedTool])

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>

      {/* Stats Cards - TODO: Implement with real data */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm font-medium text-gray-600 mb-1">Total Teachers</div>
          <div className="text-3xl font-bold text-gray-900">24</div>
          <div className="text-sm text-green-600 mt-2">↑ 12% from last month</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm font-medium text-gray-600 mb-1">Observations</div>
          <div className="text-3xl font-bold text-gray-900">156</div>
          <div className="text-sm text-green-600 mt-2">↑ 8% from last month</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm font-medium text-gray-600 mb-1">Avg Score</div>
          <div className="text-3xl font-bold text-gray-900">4.2</div>
          <div className="text-sm text-gray-500 mt-2">Out of 5.0</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm font-medium text-gray-600 mb-1">Evaluators</div>
          <div className="text-3xl font-bold text-gray-900">8</div>
          <div className="text-sm text-gray-500 mt-2">Active observers</div>
        </div>
      </div> */}

      {/* Dimension Analysis */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Dimension Analysis</CardTitle>
          <CardDescription>
            Analyze performance trends across evaluation dimensions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Start Date
              </label>
              <DatePicker
                date={startDate}
                onDateChange={setStartDate}
                placeholder="Select start date"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                End Date
              </label>
              <DatePicker
                date={endDate}
                onDateChange={setEndDate}
                placeholder="Select end date"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Evaluation Tool
              </label>
              <Select value={selectedTool} onValueChange={setSelectedTool}>
                <SelectTrigger>
                  <SelectValue placeholder="Select evaluation tool" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tools</SelectItem>
                  {evaluationTools.map((tool) => (
                    <SelectItem key={tool.id} value={tool.id.toString()}>
                      {tool.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Chart and Analysis */}
          {isLoadingWeakness ? (
            <div className="flex items-center justify-center p-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
                <p className="text-gray-500">Loading analysis...</p>
              </div>
            </div>
          ) : weaknessData.length > 0 ? (
            <DimensionWeaknessChart data={weaknessData} />
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <p className="text-gray-500">
                No data available for the selected filters
              </p>
              <p className="text-sm text-gray-400 mt-2">
                Try adjusting the date range or evaluation tool selection
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

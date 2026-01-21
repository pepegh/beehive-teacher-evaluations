import { useQuery } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { teacherService } from '@/services/teacherService'
import { observationService } from '@/services/observationService'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DataTable } from '@/components/ui/data-table'
import { ObservationPerformanceChart } from '@/components/teachers/ObservationPerformanceChart'
import { ArrowLeft, ClipboardList, Trophy, TrendingDown, Target, ArrowUpDown, Eye } from 'lucide-react'
import { format } from 'date-fns'
import type { ColumnDef } from '@tanstack/react-table'
import type { Observation } from '@/types/observation'

export default function ViewTeacher() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  // Fetch teacher data
  const { data: teacher, isLoading } = useQuery({
    queryKey: ['teacher', id],
    queryFn: () => teacherService.getById(Number(id)),
    enabled: !!id,
  })

  // Fetch all observations and filter by teacher
  const { data: allObservations = [] } = useQuery({
    queryKey: ['observations'],
    queryFn: observationService.getAll,
  })

  // Filter observations for this teacher and sort by date descending
  const teacherObservations = allObservations
    .filter((obs) => obs.teacher_id === Number(id))
    .sort((a, b) => new Date(b.observation_date).getTime() - new Date(a.observation_date).getTime())

  // Get the last observation (most recent - first in sorted array)
  const lastObservation = teacherObservations.length > 0 ? teacherObservations[0] : null

  const handleBack = () => {
    navigate('/teachers')
  }

  const handleViewObservation = (observation: Observation) => {
    navigate(`/observations/view/${observation.id}`)
  }

  const getScorePillColor = (score: number) => {
    if (score < 3.0) {
      return 'bg-red-100 text-red-800 border-red-200'
    } else if (score >= 3.0 && score <= 3.5) {
      return 'bg-green-100 text-green-800 border-green-200'
    } else {
      return 'bg-blue-100 text-blue-800 border-blue-200'
    }
  }

  const getScoreCardColor = (score: number | undefined | null) => {
    if (score === undefined || score === null) {
      return {
        gradient: 'from-gray-50 to-gray-100',
        border: 'border-gray-200',
        text: 'text-gray-900',
        label: 'text-gray-600',
        icon: 'text-gray-700',
        iconBg: 'bg-gray-200',
      }
    }
    if (score < 3.0) {
      return {
        gradient: 'from-red-50 to-red-100',
        border: 'border-red-200',
        text: 'text-red-900',
        label: 'text-red-600',
        icon: 'text-red-700',
        iconBg: 'bg-red-200',
      }
    } else if (score >= 3.0 && score <= 3.5) {
      return {
        gradient: 'from-green-50 to-green-100',
        border: 'border-green-200',
        text: 'text-green-900',
        label: 'text-green-600',
        icon: 'text-green-700',
        iconBg: 'bg-green-200',
      }
    } else {
      return {
        gradient: 'from-blue-50 to-blue-100',
        border: 'border-blue-200',
        text: 'text-blue-900',
        label: 'text-blue-600',
        icon: 'text-blue-700',
        iconBg: 'bg-blue-200',
      }
    }
  }

  const formatDepartment = (department: string) => {
    return department.charAt(0).toUpperCase() + department.slice(1)
  }

  const formatLevel = (level: string) => {
    const levelMap: Record<string, string> = {
      preprimaria: 'Preprimaria',
      primaria: 'Primaria',
      bys: 'BYS',
      areas_practicas: 'Áreas Prácticas',
      especialidad: 'Especialidad',
    }
    return levelMap[level] || level
  }

  const formatStatus = (status: string) => {
    const statusMap: Record<string, string> = {
      active: 'Active',
      inactive: 'Inactive',
      on_leave: 'On Leave',
    }
    return statusMap[status] || status
  }

  // Define columns for observations table
  const columns: ColumnDef<Observation>[] = [
    {
      accessorKey: 'observation_date',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const date = row.getValue('observation_date') as string
        try {
          const datePart = date.split('T')[0]
          const [year, month, day] = datePart.split('-').map(Number)
          const parsed = new Date(year, month - 1, day)
          return (
            <div className="text-sm text-gray-900">
              {format(parsed, 'dd-MM-yyyy')}
            </div>
          )
        } catch {
          return <div className="text-sm text-gray-900">{date}</div>
        }
      },
    },
    {
      accessorFn: (row) => row.evaluation_tool?.name || '',
      id: 'evaluation_tool',
      header: 'Evaluation Tool',
      cell: ({ row }) => {
        const tool = row.original.evaluation_tool
        if (!tool) return <span className="text-sm text-gray-400">-</span>
        return <div className="text-sm text-gray-900">{tool.name}</div>
      },
    },
    {
      accessorKey: 'average_score',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Avg Score
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const score = row.getValue('average_score') as number
        return (
          <div className="flex justify-start">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getScorePillColor(score)}`}>
              {score.toFixed(2)}
            </span>
          </div>
        )
      },
    },
    {
      accessorKey: 'lowest_dimension',
      header: 'Lowest Dimension',
      cell: ({ row }) => {
        const dimension = row.getValue('lowest_dimension') as string | null
        if (!dimension) return <span className="text-sm text-gray-400">-</span>
        return <div className="text-sm text-gray-900">{dimension}</div>
      },
    },
    {
      accessorKey: 'lowest_score',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Lowest Score
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const score = row.getValue('lowest_score') as number | null
        if (score === null || score === undefined) return <span className="text-sm text-gray-400">-</span>
        return (
          <div className="flex justify-start">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getScorePillColor(score)}`}>
              {score.toFixed(2)}
            </span>
          </div>
        )
      },
    },
    {
      id: 'actions',
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => (
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-100"
            title="View observation details"
            onClick={() => handleViewObservation(row.original)}
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600">Loading teacher...</p>
      </div>
    )
  }

  if (!teacher) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600">Teacher not found</p>
        <Button onClick={handleBack} className="mt-4">
          Back to Teachers
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleBack}
          className="h-8 w-8"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">View Teacher</h1>
      </div>

      {/* Teacher Information */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">
            Teacher Information
          </h2>

          {/* 3-column layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* First Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                First Name
              </label>
              <Input
                value={teacher.first_name}
                readOnly
                disabled
                className="bg-gray-50"
              />
            </div>

            {/* Middle Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Middle Name
              </label>
              <Input
                value={teacher.middle_name || ''}
                readOnly
                disabled
                className="bg-gray-50"
                placeholder="N/A"
              />
            </div>

            {/* Last Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Last Name
              </label>
              <Input
                value={teacher.last_name}
                readOnly
                disabled
                className="bg-gray-50"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Email
              </label>
              <Input
                value={teacher.email || ''}
                readOnly
                disabled
                className="bg-gray-50"
                placeholder="N/A"
              />
            </div>

            {/* Subject */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Subject
              </label>
              <Input
                value={teacher.subject || ''}
                readOnly
                disabled
                className="bg-gray-50"
                placeholder="N/A"
              />
            </div>

            {/* Department */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Department
              </label>
              <Input
                value={formatDepartment(teacher.department)}
                readOnly
                disabled
                className="bg-gray-50"
              />
            </div>

            {/* Level */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Level
              </label>
              <Input
                value={formatLevel(teacher.level)}
                readOnly
                disabled
                className="bg-gray-50"
              />
            </div>

            {/* Hire Date */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Hire Date
              </label>
              <Input
                value={
                  teacher.hire_date
                    ? format(new Date(teacher.hire_date), 'dd-MM-yyyy')
                    : ''
                }
                readOnly
                disabled
                className="bg-gray-50"
                placeholder="N/A"
              />
            </div>

            {/* Status */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Status
              </label>
              <Input
                value={formatStatus(teacher.status)}
                readOnly
                disabled
                className="bg-gray-50"
              />
            </div>
          </div>

          {/* Action Button */}
          <div className="flex justify-end pt-4 border-t border-gray-200">
            <Button onClick={handleBack}>Close</Button>
          </div>
        </div>
      </div>

      {/* Statistics Cards Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 border-b pb-2 mb-6">
          Observation Statistics
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Observations Card */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 mb-1">
                  Total Observations
                </p>
                <p className="text-3xl font-bold text-blue-900">
                  {teacherObservations.length}
                </p>
              </div>
              <div className="bg-blue-200 rounded-full p-3">
                <ClipboardList className="h-6 w-6 text-blue-700" />
              </div>
            </div>
          </div>

          {/* Evaluation Tool Card */}
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6 border border-orange-200">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-orange-600 mb-1">
                  Last Evaluation Tool
                </p>
                <p className="text-lg font-bold text-orange-900 truncate" title={lastObservation?.evaluation_tool?.name || 'N/A'}>
                  {lastObservation?.evaluation_tool?.name || 'N/A'}
                </p>
              </div>
              <div className="bg-orange-200 rounded-full p-3 flex-shrink-0 ml-2">
                <Target className="h-6 w-6 text-orange-700" />
              </div>
            </div>
          </div>

          {/* Average Score Card */}
          <div className={`bg-gradient-to-br ${getScoreCardColor(lastObservation?.average_score).gradient} rounded-lg p-6 border ${getScoreCardColor(lastObservation?.average_score).border}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${getScoreCardColor(lastObservation?.average_score).label} mb-1`}>
                  Last Avg Score
                </p>
                <p className={`text-3xl font-bold ${getScoreCardColor(lastObservation?.average_score).text}`}>
                  {lastObservation?.average_score?.toFixed(2) || 'N/A'}
                </p>
              </div>
              <div className={`${getScoreCardColor(lastObservation?.average_score).iconBg} rounded-full p-3`}>
                <Trophy className={`h-6 w-6 ${getScoreCardColor(lastObservation?.average_score).icon}`} />
              </div>
            </div>
          </div>

          {/* Lowest Score Card */}
          <div className={`bg-gradient-to-br ${getScoreCardColor(lastObservation?.lowest_score).gradient} rounded-lg p-6 border ${getScoreCardColor(lastObservation?.lowest_score).border}`}>
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${getScoreCardColor(lastObservation?.lowest_score).label} mb-1`}>
                  Last Lowest Score
                </p>
                <p className={`text-3xl font-bold ${getScoreCardColor(lastObservation?.lowest_score).text} mb-1`}>
                  {lastObservation?.lowest_score?.toFixed(2) || 'N/A'}
                </p>
                <p className={`text-xs font-medium ${getScoreCardColor(lastObservation?.lowest_score).label} truncate`} title={lastObservation?.lowest_dimension || ''}>
                  {lastObservation?.lowest_dimension || 'No dimension'}
                </p>
              </div>
              <div className={`${getScoreCardColor(lastObservation?.lowest_score).iconBg} rounded-full p-3 flex-shrink-0 ml-2`}>
                <TrendingDown className={`h-6 w-6 ${getScoreCardColor(lastObservation?.lowest_score).icon}`} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Over Time Chart */}
      {teacherObservations.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 border-b pb-2 mb-6">
            Performance Over Time
          </h2>
          <ObservationPerformanceChart observations={teacherObservations} />
        </div>
      )}

      {/* Observations History Table */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 border-b pb-2 mb-6">
          Observation History
        </h2>

        {teacherObservations.length === 0 ? (
          <div className="text-center py-12">
            <ClipboardList className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No observations recorded yet for this teacher.</p>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={teacherObservations}
            searchKey="evaluation_tool"
            searchPlaceholder="Search by evaluation tool..."
          />
        )}
      </div>
    </div>
  )
}

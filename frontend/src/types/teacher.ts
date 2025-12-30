export type Department = 'english' | 'spanish'
export type Level = 'preprimaria' | 'primaria' | 'bys' | 'areas_practicas' | 'especialidad'
export type Status = 'active' | 'inactive' | 'on_leave'

export interface Teacher {
  id: number
  first_name: string
  middle_name?: string | null
  last_name: string
  email?: string | null
  subject?: string | null
  department: Department
  level: Level
  hire_date?: string | null
  status: Status
  created_at: string
  updated_at: string
}

export interface CreateTeacherData {
  first_name: string
  middle_name?: string
  last_name: string
  email?: string
  subject?: string
  department: Department
  level: Level
  hire_date?: string
  status?: Status
}

export interface UpdateTeacherData extends Partial<CreateTeacherData> {}

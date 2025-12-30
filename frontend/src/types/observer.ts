export type Department = 'english' | 'spanish'

export interface Observer {
  id: number
  name: string
  department: Department
  created_at: string
  updated_at: string
}

export interface CreateObserverData {
  name: string
  department: Department
}

export interface UpdateObserverData extends Partial<CreateObserverData> {}

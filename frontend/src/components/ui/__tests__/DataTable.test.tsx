import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DataTable } from '../data-table'
import type { ColumnDef } from '@tanstack/react-table'

interface TestData {
  id: number
  name: string
  email: string
  status: string
}

const testData: TestData[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com', status: 'active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'inactive' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', status: 'active' },
]

const columns: ColumnDef<TestData>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'status',
    header: 'Status',
  },
]

describe('DataTable', () => {
  it('should render table with data', () => {
    render(<DataTable columns={columns} data={testData} />)

    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('jane@example.com')).toBeInTheDocument()
    expect(screen.getByText('Bob Johnson')).toBeInTheDocument()
  })

  it('should render column headers', () => {
    render(<DataTable columns={columns} data={testData} />)

    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Email')).toBeInTheDocument()
    expect(screen.getByText('Status')).toBeInTheDocument()
  })

  it('should display empty state when no data', () => {
    render(<DataTable columns={columns} data={[]} />)

    expect(screen.getByText('No results.')).toBeInTheDocument()
  })

  it('should render search input when searchKey is provided', () => {
    render(
      <DataTable
        columns={columns}
        data={testData}
        searchKey="name"
        searchPlaceholder="Search by name..."
      />
    )

    expect(screen.getByPlaceholderText('Search by name...')).toBeInTheDocument()
  })

  it('should filter data when searching', async () => {
    const user = userEvent.setup()

    render(
      <DataTable
        columns={columns}
        data={testData}
        searchKey="name"
        searchPlaceholder="Search..."
      />
    )

    const searchInput = screen.getByPlaceholderText('Search...')
    await user.type(searchInput, 'John')

    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument()
  })

  it('should render pagination buttons', () => {
    render(<DataTable columns={columns} data={testData} />)

    expect(screen.getByRole('button', { name: 'Previous' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument()
  })

  it('should disable previous button on first page', () => {
    render(<DataTable columns={columns} data={testData} />)

    expect(screen.getByRole('button', { name: 'Previous' })).toBeDisabled()
  })

  it('should render filter button when filters are provided', () => {
    const filters = [
      {
        columnKey: 'status',
        label: 'Status',
        options: ['active', 'inactive'],
      },
    ]

    render(<DataTable columns={columns} data={testData} filters={filters} />)

    expect(screen.getByRole('button', { name: /Filters/i })).toBeInTheDocument()
  })

  it('should show all rows when data fits on one page', () => {
    render(<DataTable columns={columns} data={testData} />)

    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
    expect(screen.getByText('Bob Johnson')).toBeInTheDocument()
  })
})

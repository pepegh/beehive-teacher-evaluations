import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AddTeacherModal from '../AddTeacherModal'

describe('AddTeacherModal', () => {
  const mockOnClose = vi.fn()
  const mockOnSubmit = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should not render when isOpen is false', () => {
    render(
      <AddTeacherModal
        isOpen={false}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    )

    expect(screen.queryByText('Add New Teacher')).not.toBeInTheDocument()
  })

  it('should render form when isOpen is true', async () => {
    render(
      <AddTeacherModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    )

    await waitFor(() => {
      expect(screen.getByText('Add New Teacher')).toBeInTheDocument()
    })
  })

  it('should render edit title when teacher is provided', async () => {
    const teacher = {
      id: 1,
      first_name: 'John',
      middle_name: null,
      last_name: 'Doe',
      email: 'john@example.com',
      subject: 'Math',
      department: 'english' as const,
      level: 'primaria' as const,
      hire_date: '2023-01-15',
      status: 'active' as const,
      created_at: '2024-01-01',
      updated_at: '2024-01-01',
    }

    render(
      <AddTeacherModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        teacher={teacher}
      />
    )

    await waitFor(() => {
      expect(screen.getByText('Edit Teacher')).toBeInTheDocument()
    })
  })

  it('should call onClose when cancel button is clicked', async () => {
    const user = userEvent.setup()

    render(
      <AddTeacherModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    )

    // Wait for form to finish loading (100ms delay + render)
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
    }, { timeout: 500 })

    await user.click(screen.getByRole('button', { name: 'Cancel' }))

    expect(mockOnClose).toHaveBeenCalled()
  })

  it('should call onClose when close button is clicked', async () => {
    const user = userEvent.setup()

    render(
      <AddTeacherModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    )

    await waitFor(() => {
      expect(screen.getByText('Add New Teacher')).toBeInTheDocument()
    })

    await user.click(screen.getByLabelText('Close dialog'))

    expect(mockOnClose).toHaveBeenCalled()
  })

  it('should display required field indicators', async () => {
    render(
      <AddTeacherModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    )

    // Wait for form to finish loading (100ms delay + render)
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
    }, { timeout: 500 })

    expect(screen.getByText(/First Name/)).toBeInTheDocument()
    expect(screen.getByText(/Last Name/)).toBeInTheDocument()
  })

  it('should disable submit button when isSubmitting is true', async () => {
    render(
      <AddTeacherModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        isSubmitting={true}
      />
    )

    await waitFor(() => {
      expect(screen.getByText('Adding...')).toBeInTheDocument()
    })

    expect(screen.getByText('Adding...')).toBeDisabled()
  })

  it('should show updating text when editing and submitting', async () => {
    const teacher = {
      id: 1,
      first_name: 'John',
      middle_name: null,
      last_name: 'Doe',
      email: 'john@example.com',
      subject: 'Math',
      department: 'english' as const,
      level: 'primaria' as const,
      hire_date: '2023-01-15',
      status: 'active' as const,
      created_at: '2024-01-01',
      updated_at: '2024-01-01',
    }

    render(
      <AddTeacherModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        teacher={teacher}
        isSubmitting={true}
      />
    )

    await waitFor(() => {
      expect(screen.getByText('Updating...')).toBeInTheDocument()
    })
  })
})

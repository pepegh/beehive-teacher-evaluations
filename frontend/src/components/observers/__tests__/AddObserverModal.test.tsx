import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AddObserverModal from '../AddObserverModal'

describe('AddObserverModal', () => {
  const mockOnClose = vi.fn()
  const mockOnSubmit = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should not render when isOpen is false', () => {
    render(
      <AddObserverModal
        isOpen={false}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    )

    expect(screen.queryByText('Add New Observer')).not.toBeInTheDocument()
  })

  it('should render form when isOpen is true', async () => {
    render(
      <AddObserverModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    )

    await waitFor(() => {
      expect(screen.getByText('Add New Observer')).toBeInTheDocument()
    })
  })

  it('should render edit title when observer is provided', async () => {
    const observer = {
      id: 1,
      name: 'Test Observer',
      department: 'english' as const,
      created_at: '2024-01-01',
      updated_at: '2024-01-01',
    }

    render(
      <AddObserverModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        observer={observer}
      />
    )

    await waitFor(() => {
      expect(screen.getByText('Edit Observer')).toBeInTheDocument()
    })
  })

  it('should call onClose when cancel button is clicked', async () => {
    const user = userEvent.setup()

    render(
      <AddObserverModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    )

    // Wait for form to finish loading (100ms delay + render)
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
    }, { timeout: 1000 })

    await user.click(screen.getByRole('button', { name: 'Cancel' }))

    expect(mockOnClose).toHaveBeenCalled()
  })

  it('should call onClose when close button is clicked', async () => {
    const user = userEvent.setup()

    render(
      <AddObserverModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    )

    await waitFor(() => {
      expect(screen.getByText('Add New Observer')).toBeInTheDocument()
    })

    await user.click(screen.getByLabelText('Close dialog'))

    expect(mockOnClose).toHaveBeenCalled()
  })

  it('should display name input field', async () => {
    render(
      <AddObserverModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    )

    // Wait for form to finish loading (100ms delay + render)
    await waitFor(() => {
      expect(screen.getByPlaceholderText('e.g., John Doe')).toBeInTheDocument()
    }, { timeout: 500 })
  })

  it('should disable submit button when isSubmitting is true', async () => {
    render(
      <AddObserverModal
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
    const observer = {
      id: 1,
      name: 'Test Observer',
      department: 'english' as const,
      created_at: '2024-01-01',
      updated_at: '2024-01-01',
    }

    render(
      <AddObserverModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        observer={observer}
        isSubmitting={true}
      />
    )

    await waitFor(() => {
      expect(screen.getByText('Updating...')).toBeInTheDocument()
    })
  })
})

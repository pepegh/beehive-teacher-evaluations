import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Layout } from '@/components/layout'
import Dashboard from '@/pages/Dashboard'
import Teachers from '@/pages/Teachers'
import ViewTeacher from '@/pages/ViewTeacher'
import Observations from '@/pages/Observations'
import CreateEditObservation from '@/pages/CreateEditObservation'
import EvaluationTools from '@/pages/EvaluationTools'
import Observers from '@/pages/Observers'
import { Toaster } from '@/components/ui/sonner'
import { ErrorBoundary, PageErrorBoundary } from '@/components/ui/error-boundary'

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
})

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<PageErrorBoundary><Dashboard /></PageErrorBoundary>} />
              <Route path="/teachers" element={<PageErrorBoundary><Teachers /></PageErrorBoundary>} />
              <Route path="/teachers/view/:id" element={<PageErrorBoundary><ViewTeacher /></PageErrorBoundary>} />
              <Route path="/observations" element={<PageErrorBoundary><Observations /></PageErrorBoundary>} />
              <Route path="/observations/create" element={<PageErrorBoundary><CreateEditObservation /></PageErrorBoundary>} />
              <Route path="/observations/edit/:id" element={<PageErrorBoundary><CreateEditObservation /></PageErrorBoundary>} />
              <Route path="/observations/view/:id" element={<PageErrorBoundary><CreateEditObservation /></PageErrorBoundary>} />
              <Route path="/evaluation-tools" element={<PageErrorBoundary><EvaluationTools /></PageErrorBoundary>} />
              <Route path="/observers" element={<PageErrorBoundary><Observers /></PageErrorBoundary>} />
            </Routes>
          </Layout>
        </BrowserRouter>
        <Toaster />
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

export default App

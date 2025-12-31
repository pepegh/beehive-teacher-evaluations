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
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/teachers" element={<Teachers />} />
            <Route path="/teachers/view/:id" element={<ViewTeacher />} />
            <Route path="/observations" element={<Observations />} />
            <Route path="/observations/create" element={<CreateEditObservation />} />
            <Route path="/observations/edit/:id" element={<CreateEditObservation />} />
            <Route path="/observations/view/:id" element={<CreateEditObservation />} />
            <Route path="/evaluation-tools" element={<EvaluationTools />} />
            <Route path="/observers" element={<Observers />} />
          </Routes>
        </Layout>
      </BrowserRouter>
      <Toaster />
    </QueryClientProvider>
  )
}

export default App

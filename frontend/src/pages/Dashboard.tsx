export default function Dashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Stats Cards */}
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
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <p className="text-gray-600">Recent observations and evaluations will appear here.</p>
      </div>
    </div>
  )
}

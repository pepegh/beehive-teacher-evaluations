import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  FileText,
  UserCheck
} from 'lucide-react'
import { cn } from '@/lib/utils'
import logo from '@/assets/beehive-logos/black-logo.png'

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/', icon: LayoutDashboard },
  { label: 'Teachers', href: '/teachers', icon: Users },
  { label: 'Observations', href: '/observations', icon: ClipboardList },
  { label: 'Evaluation Tools', href: '/evaluation-tools', icon: FileText },
  { label: 'Observers', href: '/observers', icon: UserCheck },
]

interface SidebarProps {
  className?: string
}

export default function Sidebar({ className }: SidebarProps = {}) {
  const location = useLocation()

  return (
    <aside className={cn("flex flex-col w-64 h-full bg-gray-900 border-r border-gray-800", className)}>
      {/* Logo Section */}
      <div className="h-16 flex items-center justify-center px-3 border-b border-gray-800">
        <img
          src={logo}
          alt="Beehive Teacher Evaluations"
          className="w-auto h-auto max-w-[60%] object-contain brightness-0 invert"
        />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.href

          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-800">
        <div className="px-3 py-2 text-xs text-gray-500">
          v1.0.0
        </div>
      </div>
    </aside>
  )
}

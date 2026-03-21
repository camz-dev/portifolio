'use client'

import { useState } from 'react'
import { useAdminStore } from '@/store/admin-store'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  FolderKanban,
  Code2,
  User,
  Link2,
  Sparkles,
  Briefcase,
  GraduationCap,
  Palette,
  Settings,
  MessageSquare,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'projects', label: 'Projetos', icon: FolderKanban },
  { id: 'skills', label: 'Skills', icon: Code2 },
  { id: 'profile', label: 'Sobre Mim', icon: User },
  { id: 'contacts', label: 'Contatos', icon: Link2 },
  { id: 'hero', label: 'Página Inicial', icon: Sparkles },
  { id: 'experiences', label: 'Experiências', icon: Briefcase },
  { id: 'education', label: 'Educação', icon: GraduationCap },
  { id: 'themes', label: 'Temas', icon: Palette },
  { id: 'messages', label: 'Mensagens', icon: MessageSquare },
  { id: 'settings', label: 'Configurações', icon: Settings },
]

export function Sidebar() {
  const { currentSection, setCurrentSection, setAuthenticated } = useAdminStore()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const handleLogout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' })
    setAuthenticated(false)
  }

  return (
    <aside
      className={cn(
        'h-screen bg-slate-900 border-r border-slate-800 flex flex-col transition-all duration-300',
        isCollapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-slate-800">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <Settings className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-white">Portfolio Admin</span>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 overflow-y-auto">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setCurrentSection(item.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all',
                  currentSection === item.id
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                )}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && <span className="text-sm font-medium">{item.label}</span>}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-2 border-t border-slate-800">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:bg-red-500/20 hover:text-red-400 transition-all"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span className="text-sm font-medium">Sair</span>}
        </button>
      </div>
    </aside>
  )
}

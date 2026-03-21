'use client'

import { useAdminStore } from '@/store/admin-store'
import { Sidebar } from './Sidebar'
import { Dashboard } from './Dashboard'
import { ProjectsManager } from './ProjectsManager'
import { SkillsManager } from './SkillsManager'
import { ProfileManager } from './ProfileManager'
import { ContactsManager } from './ContactsManager'
import { HeroManager } from './HeroManager'
import { ExperiencesManager } from './ExperiencesManager'
import { EducationManager } from './EducationManager'
import { ThemesManager } from './ThemesManager'
import { MessagesManager } from './MessagesManager'
import { SettingsManager } from './SettingsManager'

export function AdminPanel() {
  const { currentSection } = useAdminStore()

  const renderSection = () => {
    switch (currentSection) {
      case 'dashboard':
        return <Dashboard />
      case 'projects':
        return <ProjectsManager />
      case 'skills':
        return <SkillsManager />
      case 'profile':
        return <ProfileManager />
      case 'contacts':
        return <ContactsManager />
      case 'hero':
        return <HeroManager />
      case 'experiences':
        return <ExperiencesManager />
      case 'education':
        return <EducationManager />
      case 'themes':
        return <ThemesManager />
      case 'messages':
        return <MessagesManager />
      case 'settings':
        return <SettingsManager />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="flex h-screen bg-slate-950">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6">
        {renderSection()}
      </main>
    </div>
  )
}

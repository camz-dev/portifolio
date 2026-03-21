import { create } from 'zustand'
import type { 
  Project, Skill, Profile, Contact, Hero, 
  Experience, Education, Theme, Settings, 
  Category, Message 
} from '@/types/portfolio'

interface AdminState {
  // Auth
  isAuthenticated: boolean
  setAuthenticated: (value: boolean) => void
  
  // Current section
  currentSection: string
  setCurrentSection: (section: string) => void
  
  // Data
  projects: Project[]
  setProjects: (projects: Project[]) => void
  
  skills: Skill[]
  setSkills: (skills: Skill[]) => void
  
  profile: Profile | null
  setProfile: (profile: Profile | null) => void
  
  contacts: Contact[]
  setContacts: (contacts: Contact[]) => void
  
  hero: Hero | null
  setHero: (hero: Hero | null) => void
  
  experiences: Experience[]
  setExperiences: (experiences: Experience[]) => void
  
  education: Education[]
  setEducation: (education: Education[]) => void
  
  themes: Theme[]
  setThemes: (themes: Theme[]) => void
  
  settings: Settings | null
  setSettings: (settings: Settings | null) => void
  
  categories: Category[]
  setCategories: (categories: Category[]) => void
  
  messages: Message[]
  setMessages: (messages: Message[]) => void
  
  // Loading states
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
  
  // Editing
  editingItem: string | null
  setEditingItem: (id: string | null) => void
}

export const useAdminStore = create<AdminState>((set) => ({
  // Auth
  isAuthenticated: false,
  setAuthenticated: (value) => set({ isAuthenticated: value }),
  
  // Current section
  currentSection: 'dashboard',
  setCurrentSection: (section) => set({ currentSection: section }),
  
  // Data
  projects: [],
  setProjects: (projects) => set({ projects }),
  
  skills: [],
  setSkills: (skills) => set({ skills }),
  
  profile: null,
  setProfile: (profile) => set({ profile }),
  
  contacts: [],
  setContacts: (contacts) => set({ contacts }),
  
  hero: null,
  setHero: (hero) => set({ hero }),
  
  experiences: [],
  setExperiences: (experiences) => set({ experiences }),
  
  education: [],
  setEducation: (education) => set({ education }),
  
  themes: [],
  setThemes: (themes) => set({ themes }),
  
  settings: null,
  setSettings: (settings) => set({ settings }),
  
  categories: [],
  setCategories: (categories) => set({ categories }),
  
  messages: [],
  setMessages: (messages) => set({ messages }),
  
  // Loading states
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),
  
  // Editing
  editingItem: null,
  setEditingItem: (id) => set({ editingItem: id }),
}))

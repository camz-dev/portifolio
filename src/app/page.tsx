'use client'

import { useState, useEffect } from 'react'
import { useAdminStore } from '@/store/admin-store'
import { LoginForm } from '@/components/admin/LoginForm'
import { AdminPanel } from '@/components/admin/AdminPanel'

export default function AdminPage() {
  const { isAuthenticated, setAuthenticated } = useAdminStore()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/admin/auth')
        const data = await response.json()
        setAuthenticated(data.authenticated)
      } catch (error) {
        console.error('Error checking auth:', error)
      } finally {
        setIsLoading(false)
      }
    }
    checkAuth()
  }, [setAuthenticated])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <LoginForm />
  }

  return <AdminPanel />
}

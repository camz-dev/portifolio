import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseClient } from '@/lib/supabase/server-client'
import { checkAuth } from '@/lib/auth'
import type { Project, ProjectInput } from '@/types/portfolio'

// GET - List all projects
export async function GET() {
  const authError = await checkAuth()
  if (authError) return authError

  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('order_index', { ascending: true })

    if (error) {
      // If table doesn't exist, return empty array
      if (error.code === '42P01') {
        return NextResponse.json([])
      }
      throw error
    }

    return NextResponse.json(data as Project[])
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}

// POST - Create new project
export async function POST(request: NextRequest) {
  const authError = await checkAuth()
  if (authError) return authError

  try {
    const body = await request.json() as ProjectInput
    const supabase = getSupabaseClient()
    
    const { data, error } = await supabase
      .from('projects')
      .insert([body])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data as Project, { status: 201 })
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    )
  }
}

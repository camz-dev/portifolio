import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseClient } from '@/lib/supabase/server-client'
import { checkAuth } from '@/lib/auth'
import type { Theme, ThemeInput } from '@/types/portfolio'

// GET - List all themes
export async function GET() {
  const authError = await checkAuth()
  if (authError) return authError

  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('themes')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      if (error.code === '42P01') {
        return NextResponse.json([])
      }
      throw error
    }

    return NextResponse.json(data as Theme[])
  } catch (error) {
    console.error('Error fetching themes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch themes' },
      { status: 500 }
    )
  }
}

// POST - Create new theme
export async function POST(request: NextRequest) {
  const authError = await checkAuth()
  if (authError) return authError

  try {
    const body = await request.json() as ThemeInput
    const supabase = getSupabaseClient()
    
    // If setting as active, deactivate others first
    if (body.active) {
      await supabase
        .from('themes')
        .update({ active: false })
        .eq('active', true)
    }
    
    const { data, error } = await supabase
      .from('themes')
      .insert([body])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data as Theme, { status: 201 })
  } catch (error) {
    console.error('Error creating theme:', error)
    return NextResponse.json(
      { error: 'Failed to create theme' },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseClient } from '@/lib/supabase/server-client'
import { checkAuth } from '@/lib/auth'
import type { Experience, ExperienceInput } from '@/types/portfolio'

// GET - List all experiences
export async function GET() {
  const authError = await checkAuth()
  if (authError) return authError

  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('experiences')
      .select('*')
      .order('order_index', { ascending: true })

    if (error) {
      if (error.code === '42P01') {
        return NextResponse.json([])
      }
      throw error
    }

    return NextResponse.json(data as Experience[])
  } catch (error) {
    console.error('Error fetching experiences:', error)
    return NextResponse.json(
      { error: 'Failed to fetch experiences' },
      { status: 500 }
    )
  }
}

// POST - Create new experience
export async function POST(request: NextRequest) {
  const authError = await checkAuth()
  if (authError) return authError

  try {
    const body = await request.json() as ExperienceInput
    const supabase = getSupabaseClient()
    
    const { data, error } = await supabase
      .from('experiences')
      .insert([body])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data as Experience, { status: 201 })
  } catch (error) {
    console.error('Error creating experience:', error)
    return NextResponse.json(
      { error: 'Failed to create experience' },
      { status: 500 }
    )
  }
}

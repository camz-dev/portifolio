import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseClient } from '@/lib/supabase/server-client'
import { checkAuth } from '@/lib/auth'
import type { Education, EducationInput } from '@/types/portfolio'

// GET - List all education
export async function GET() {
  const authError = await checkAuth()
  if (authError) return authError

  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('education')
      .select('*')
      .order('order_index', { ascending: true })

    if (error) {
      if (error.code === '42P01') {
        return NextResponse.json([])
      }
      throw error
    }

    return NextResponse.json(data as Education[])
  } catch (error) {
    console.error('Error fetching education:', error)
    return NextResponse.json(
      { error: 'Failed to fetch education' },
      { status: 500 }
    )
  }
}

// POST - Create new education
export async function POST(request: NextRequest) {
  const authError = await checkAuth()
  if (authError) return authError

  try {
    const body = await request.json() as EducationInput
    const supabase = getSupabaseClient()
    
    const { data, error } = await supabase
      .from('education')
      .insert([body])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data as Education, { status: 201 })
  } catch (error) {
    console.error('Error creating education:', error)
    return NextResponse.json(
      { error: 'Failed to create education' },
      { status: 500 }
    )
  }
}

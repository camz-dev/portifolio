import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseClient } from '@/lib/supabase/server-client'
import { checkAuth } from '@/lib/auth'
import type { Skill, SkillInput } from '@/types/portfolio'

// GET - List all skills
export async function GET() {
  const authError = await checkAuth()
  if (authError) return authError

  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .order('order_index', { ascending: true })

    if (error) {
      if (error.code === '42P01') {
        return NextResponse.json([])
      }
      throw error
    }

    return NextResponse.json(data as Skill[])
  } catch (error) {
    console.error('Error fetching skills:', error)
    return NextResponse.json(
      { error: 'Failed to fetch skills' },
      { status: 500 }
    )
  }
}

// POST - Create new skill
export async function POST(request: NextRequest) {
  const authError = await checkAuth()
  if (authError) return authError

  try {
    const body = await request.json() as SkillInput
    const supabase = getSupabaseClient()
    
    const { data, error } = await supabase
      .from('skills')
      .insert([body])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data as Skill, { status: 201 })
  } catch (error) {
    console.error('Error creating skill:', error)
    return NextResponse.json(
      { error: 'Failed to create skill' },
      { status: 500 }
    )
  }
}

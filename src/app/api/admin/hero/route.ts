import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseClient } from '@/lib/supabase/server-client'
import { checkAuth } from '@/lib/auth'
import type { Hero, HeroInput } from '@/types/portfolio'

// GET - Get hero
export async function GET() {
  const authError = await checkAuth()
  if (authError) return authError

  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('hero')
      .select('*')
      .limit(1)
      .single()

    if (error) {
      if (error.code === '42P01' || error.code === 'PGRST116') {
        return NextResponse.json(null)
      }
      throw error
    }

    return NextResponse.json(data as Hero)
  } catch (error) {
    console.error('Error fetching hero:', error)
    return NextResponse.json(
      { error: 'Failed to fetch hero' },
      { status: 500 }
    )
  }
}

// POST - Create hero
export async function POST(request: NextRequest) {
  const authError = await checkAuth()
  if (authError) return authError

  try {
    const body = await request.json() as HeroInput
    const supabase = getSupabaseClient()
    
    const { data, error } = await supabase
      .from('hero')
      .insert([body])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data as Hero, { status: 201 })
  } catch (error) {
    console.error('Error creating hero:', error)
    return NextResponse.json(
      { error: 'Failed to create hero' },
      { status: 500 }
    )
  }
}

// PUT - Update hero
export async function PUT(request: NextRequest) {
  const authError = await checkAuth()
  if (authError) return authError

  try {
    const body = await request.json() as Partial<HeroInput>
    const supabase = getSupabaseClient()
    
    const { data: existing } = await supabase
      .from('hero')
      .select('id')
      .limit(1)
      .single()

    if (!existing) {
      const { data, error } = await supabase
        .from('hero')
        .insert([body])
        .select()
        .single()
      
      if (error) throw error
      return NextResponse.json(data as Hero)
    }

    const { data, error } = await supabase
      .from('hero')
      .update({ ...body, updated_at: new Date().toISOString() })
      .eq('id', existing.id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data as Hero)
  } catch (error) {
    console.error('Error updating hero:', error)
    return NextResponse.json(
      { error: 'Failed to update hero' },
      { status: 500 }
    )
  }
}

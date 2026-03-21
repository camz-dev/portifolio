import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseClient } from '@/lib/supabase/server-client'
import { checkAuth } from '@/lib/auth'
import type { Profile, ProfileInput } from '@/types/portfolio'

// GET - Get profile
export async function GET() {
  const authError = await checkAuth()
  if (authError) return authError

  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('profile')
      .select('*')
      .limit(1)
      .single()

    if (error) {
      if (error.code === '42P01' || error.code === 'PGRST116') {
        return NextResponse.json(null)
      }
      throw error
    }

    return NextResponse.json(data as Profile)
  } catch (error) {
    console.error('Error fetching profile:', error)
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}

// POST - Create profile
export async function POST(request: NextRequest) {
  const authError = await checkAuth()
  if (authError) return authError

  try {
    const body = await request.json() as ProfileInput
    const supabase = getSupabaseClient()
    
    const { data, error } = await supabase
      .from('profile')
      .insert([body])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data as Profile, { status: 201 })
  } catch (error) {
    console.error('Error creating profile:', error)
    return NextResponse.json(
      { error: 'Failed to create profile' },
      { status: 500 }
    )
  }
}

// PUT - Update profile
export async function PUT(request: NextRequest) {
  const authError = await checkAuth()
  if (authError) return authError

  try {
    const body = await request.json() as Partial<ProfileInput>
    const supabase = getSupabaseClient()
    
    // Get existing profile
    const { data: existing } = await supabase
      .from('profile')
      .select('id')
      .limit(1)
      .single()

    if (!existing) {
      // Create if doesn't exist
      const { data, error } = await supabase
        .from('profile')
        .insert([body])
        .select()
        .single()
      
      if (error) throw error
      return NextResponse.json(data as Profile)
    }

    const { data, error } = await supabase
      .from('profile')
      .update({ ...body, updated_at: new Date().toISOString() })
      .eq('id', existing.id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data as Profile)
  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}

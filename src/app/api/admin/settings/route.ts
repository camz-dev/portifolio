import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseClient } from '@/lib/supabase/server-client'
import { checkAuth } from '@/lib/auth'
import type { Settings, SettingsInput } from '@/types/portfolio'

// GET - Get settings
export async function GET() {
  const authError = await checkAuth()
  if (authError) return authError

  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .limit(1)
      .single()

    if (error) {
      if (error.code === '42P01' || error.code === 'PGRST116') {
        return NextResponse.json(null)
      }
      throw error
    }

    return NextResponse.json(data as Settings)
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}

// POST - Create settings
export async function POST(request: NextRequest) {
  const authError = await checkAuth()
  if (authError) return authError

  try {
    const body = await request.json() as SettingsInput
    const supabase = getSupabaseClient()
    
    const { data, error } = await supabase
      .from('settings')
      .insert([body])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data as Settings, { status: 201 })
  } catch (error) {
    console.error('Error creating settings:', error)
    return NextResponse.json(
      { error: 'Failed to create settings' },
      { status: 500 }
    )
  }
}

// PUT - Update settings
export async function PUT(request: NextRequest) {
  const authError = await checkAuth()
  if (authError) return authError

  try {
    const body = await request.json() as Partial<SettingsInput>
    const supabase = getSupabaseClient()
    
    const { data: existing } = await supabase
      .from('settings')
      .select('id')
      .limit(1)
      .single()

    if (!existing) {
      const { data, error } = await supabase
        .from('settings')
        .insert([body])
        .select()
        .single()
      
      if (error) throw error
      return NextResponse.json(data as Settings)
    }

    const { data, error } = await supabase
      .from('settings')
      .update({ ...body, updated_at: new Date().toISOString() })
      .eq('id', existing.id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data as Settings)
  } catch (error) {
    console.error('Error updating settings:', error)
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    )
  }
}

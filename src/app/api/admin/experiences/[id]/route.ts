import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseClient } from '@/lib/supabase/server-client'
import { checkAuth } from '@/lib/auth'
import type { Experience, ExperienceInput } from '@/types/portfolio'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await checkAuth()
  if (authError) return authError

  try {
    const { id } = await params
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('experiences')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return NextResponse.json(data as Experience)
  } catch (error) {
    console.error('Error fetching experience:', error)
    return NextResponse.json({ error: 'Failed to fetch experience' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await checkAuth()
  if (authError) return authError

  try {
    const { id } = await params
    const body = await request.json() as Partial<ExperienceInput>
    const supabase = getSupabaseClient()
    
    const { data, error } = await supabase
      .from('experiences')
      .update({ ...body, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data as Experience)
  } catch (error) {
    console.error('Error updating experience:', error)
    return NextResponse.json({ error: 'Failed to update experience' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await checkAuth()
  if (authError) return authError

  try {
    const { id } = await params
    const supabase = getSupabaseClient()
    
    const { error } = await supabase
      .from('experiences')
      .delete()
      .eq('id', id)

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting experience:', error)
    return NextResponse.json({ error: 'Failed to delete experience' }, { status: 500 })
  }
}

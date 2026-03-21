import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseClient } from '@/lib/supabase/server-client'
import { checkAuth } from '@/lib/auth'
import type { Theme, ThemeInput } from '@/types/portfolio'

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
      .from('themes')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return NextResponse.json(data as Theme)
  } catch (error) {
    console.error('Error fetching theme:', error)
    return NextResponse.json({ error: 'Failed to fetch theme' }, { status: 500 })
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
    const body = await request.json() as Partial<ThemeInput>
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
      .update({ ...body, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data as Theme)
  } catch (error) {
    console.error('Error updating theme:', error)
    return NextResponse.json({ error: 'Failed to update theme' }, { status: 500 })
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
      .from('themes')
      .delete()
      .eq('id', id)

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting theme:', error)
    return NextResponse.json({ error: 'Failed to delete theme' }, { status: 500 })
  }
}

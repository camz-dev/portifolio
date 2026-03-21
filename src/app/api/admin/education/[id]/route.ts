import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseClient } from '@/lib/supabase/server-client'
import { checkAuth } from '@/lib/auth'
import type { Education, EducationInput } from '@/types/portfolio'

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
      .from('education')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return NextResponse.json(data as Education)
  } catch (error) {
    console.error('Error fetching education:', error)
    return NextResponse.json({ error: 'Failed to fetch education' }, { status: 500 })
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
    const body = await request.json() as Partial<EducationInput>
    const supabase = getSupabaseClient()
    
    const { data, error } = await supabase
      .from('education')
      .update({ ...body, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data as Education)
  } catch (error) {
    console.error('Error updating education:', error)
    return NextResponse.json({ error: 'Failed to update education' }, { status: 500 })
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
      .from('education')
      .delete()
      .eq('id', id)

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting education:', error)
    return NextResponse.json({ error: 'Failed to delete education' }, { status: 500 })
  }
}

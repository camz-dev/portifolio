import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseClient } from '@/lib/supabase/server-client'
import { checkAuth } from '@/lib/auth'
import type { Message } from '@/types/portfolio'

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
      .from('messages')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return NextResponse.json(data as Message)
  } catch (error) {
    console.error('Error fetching message:', error)
    return NextResponse.json({ error: 'Failed to fetch message' }, { status: 500 })
  }
}

// PUT - Mark as read/unread
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await checkAuth()
  if (authError) return authError

  try {
    const { id } = await params
    const body = await request.json() as { read?: boolean; replied?: boolean }
    const supabase = getSupabaseClient()
    
    const { data, error } = await supabase
      .from('messages')
      .update(body)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data as Message)
  } catch (error) {
    console.error('Error updating message:', error)
    return NextResponse.json({ error: 'Failed to update message' }, { status: 500 })
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
      .from('messages')
      .delete()
      .eq('id', id)

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting message:', error)
    return NextResponse.json({ error: 'Failed to delete message' }, { status: 500 })
  }
}

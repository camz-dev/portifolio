import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseClient } from '@/lib/supabase/server-client'
import { checkAuth } from '@/lib/auth'
import type { Message } from '@/types/portfolio'

// GET - List all messages
export async function GET() {
  const authError = await checkAuth()
  if (authError) return authError

  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      if (error.code === '42P01') {
        return NextResponse.json([])
      }
      throw error
    }

    return NextResponse.json(data as Message[])
  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseClient } from '@/lib/supabase/server-client'
import { checkAuth } from '@/lib/auth'
import type { Contact, ContactInput } from '@/types/portfolio'

// GET - List all contacts
export async function GET() {
  const authError = await checkAuth()
  if (authError) return authError

  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .order('order_index', { ascending: true })

    if (error) {
      if (error.code === '42P01') {
        return NextResponse.json([])
      }
      throw error
    }

    return NextResponse.json(data as Contact[])
  } catch (error) {
    console.error('Error fetching contacts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch contacts' },
      { status: 500 }
    )
  }
}

// POST - Create new contact
export async function POST(request: NextRequest) {
  const authError = await checkAuth()
  if (authError) return authError

  try {
    const body = await request.json() as ContactInput
    const supabase = getSupabaseClient()
    
    const { data, error } = await supabase
      .from('contacts')
      .insert([body])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data as Contact, { status: 201 })
  } catch (error) {
    console.error('Error creating contact:', error)
    return NextResponse.json(
      { error: 'Failed to create contact' },
      { status: 500 }
    )
  }
}

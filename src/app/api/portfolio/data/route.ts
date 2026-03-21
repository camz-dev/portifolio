import { NextResponse } from 'next/server'
import { getSupabaseClient } from '@/lib/supabase/server-client'

// API pública para o portfolio consumir os dados
export async function GET() {
  try {
    const supabase = getSupabaseClient()
    
    // Buscar todos os dados em paralelo
    const [
      profileResult,
      heroResult,
      projectsResult,
      skillsResult,
      contactsResult,
      experiencesResult,
      educationResult,
      themeResult,
      settingsResult
    ] = await Promise.all([
      supabase.from('profile').select('*').single(),
      supabase.from('hero').select('*').single(),
      supabase.from('projects').select('*').eq('status', 'published').order('order_index'),
      supabase.from('skills').select('*').order('order_index'),
      supabase.from('contacts').select('*').eq('visible', true).order('order_index'),
      supabase.from('experiences').select('*').order('order_index', { ascending: false }),
      supabase.from('education').select('*').order('order_index', { ascending: false }),
      supabase.from('themes').select('*').eq('active', true).single(),
      supabase.from('settings').select('*').single(),
    ])

    // Montar resposta
    const portfolioData = {
      profile: profileResult.data || null,
      hero: heroResult.data || null,
      projects: projectsResult.data || [],
      skills: skillsResult.data || [],
      contacts: contactsResult.data || [],
      experiences: experiencesResult.data || [],
      education: educationResult.data || [],
      theme: themeResult.data || null,
      settings: settingsResult.data || null,
    }

    return NextResponse.json(portfolioData, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
        'Access-Control-Allow-Origin': '*',
      }
    })
  } catch (error) {
    console.error('Error fetching portfolio data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch portfolio data' },
      { status: 500 }
    )
  }
}

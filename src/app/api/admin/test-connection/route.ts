import { NextResponse } from 'next/server'
import { getSupabaseClient } from '@/lib/supabase/server-client'

export async function GET() {
  try {
    const supabase = getSupabaseClient()
    
    // Test connection by checking if tables exist
    const tables = ['projects', 'skills', 'profile', 'contacts', 'hero', 'experiences', 'education', 'themes', 'settings', 'messages']
    const results: Record<string, { exists: boolean; count?: number; error?: string }> = {}
    
    for (const table of tables) {
      try {
        const { count, error } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true })
        
        if (error) {
          results[table] = { exists: false, error: error.message }
        } else {
          results[table] = { exists: true, count: count ?? 0 }
        }
      } catch (e) {
        results[table] = { exists: false, error: String(e) }
      }
    }

    const allTablesExist = Object.values(results).every(r => r.exists)

    return NextResponse.json({
      status: allTablesExist ? 'success' : 'partial',
      message: allTablesExist 
        ? '✅ Todas as tabelas estão funcionando!' 
        : '⚠️ Algumas tabelas podem estar faltando',
      tables: results
    })
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: '❌ Erro de conexão',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

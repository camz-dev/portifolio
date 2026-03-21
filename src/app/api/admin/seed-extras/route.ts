import { NextResponse } from 'next/server'
import { getSupabaseClient } from '@/lib/supabase/server-client'

export async function POST() {
  try {
    const supabase = getSupabaseClient()
    
    // Insert skills
    const skills = [
      { name: 'React', category: 'frontend', level: 90, order_index: 0 },
      { name: 'TypeScript', category: 'frontend', level: 85, order_index: 1 },
      { name: 'Next.js', category: 'frontend', level: 85, order_index: 2 },
      { name: 'Tailwind CSS', category: 'frontend', level: 90, order_index: 3 },
      { name: 'Node.js', category: 'backend', level: 80, order_index: 4 },
      { name: 'Python', category: 'backend', level: 75, order_index: 5 },
      { name: 'PostgreSQL', category: 'database', level: 80, order_index: 6 },
      { name: 'MongoDB', category: 'database', level: 75, order_index: 7 },
      { name: 'Docker', category: 'devops', level: 70, order_index: 8 },
      { name: 'Git', category: 'devops', level: 90, order_index: 9 },
      { name: 'Figma', category: 'design', level: 65, order_index: 10 },
    ]
    
    const { error: skillsError } = await supabase.from('skills').insert(skills)
    if (skillsError) console.log('Skills error:', skillsError)

    // Insert contacts
    const contacts = [
      { platform: 'GitHub', url: 'https://github.com/seuusuario', username: '@seuusuario', visible: true, order_index: 0 },
      { platform: 'LinkedIn', url: 'https://linkedin.com/in/seuusuario', username: 'seuusuario', visible: true, order_index: 1 },
      { platform: 'Email', url: 'mailto:seu@email.com', username: 'seu@email.com', visible: true, order_index: 2 },
    ]
    
    const { error: contactsError } = await supabase.from('contacts').insert(contacts)
    if (contactsError) console.log('Contacts error:', contactsError)

    return NextResponse.json({
      status: 'success',
      message: 'Skills e contatos inseridos!',
      skillsError: skillsError?.message,
      contactsError: contactsError?.message
    })
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

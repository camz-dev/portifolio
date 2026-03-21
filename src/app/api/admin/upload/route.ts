import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseClient } from '@/lib/supabase/server-client'
import { checkAuth } from '@/lib/auth'

// POST - Upload image to Supabase Storage
export async function POST(request: NextRequest) {
  const authError = await checkAuth()
  if (authError) return authError

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const folder = formData.get('folder') as string || 'projects'

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Allowed: JPEG, PNG, GIF, WebP' },
        { status: 400 }
      )
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Max size: 5MB' },
        { status: 400 }
      )
    }

    const supabase = getSupabaseClient()

    // Generate unique filename
    const timestamp = Date.now()
    const randomStr = Math.random().toString(36).substring(7)
    const extension = file.name.split('.').pop()
    const fileName = `${folder}/${timestamp}-${randomStr}.${extension}`

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('portfolio-images')
      .upload(fileName, file, {
        contentType: file.type,
        upsert: false,
      })

    if (error) {
      // Try to create bucket if it doesn't exist
      if (error.message.includes('Bucket not found')) {
        const { error: createError } = await supabase.storage.createBucket('portfolio-images', {
          public: true,
          fileSizeLimit: 5242880, // 5MB
        })
        
        if (createError) {
          console.error('Error creating bucket:', createError)
          return NextResponse.json(
            { error: 'Failed to create storage bucket. Please create it manually in Supabase.' },
            { status: 500 }
          )
        }

        // Try upload again
        const { data: retryData, error: retryError } = await supabase.storage
          .from('portfolio-images')
          .upload(fileName, file, {
            contentType: file.type,
            upsert: false,
          })

        if (retryError) throw retryError

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('portfolio-images')
          .getPublicUrl(retryData.path)

        return NextResponse.json({
          url: urlData.publicUrl,
          path: retryData.path,
        })
      }
      throw error
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('portfolio-images')
      .getPublicUrl(data.path)

    return NextResponse.json({
      url: urlData.publicUrl,
      path: data.path,
    })
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    )
  }
}

// DELETE - Remove image from Supabase Storage
export async function DELETE(request: NextRequest) {
  const authError = await checkAuth()
  if (authError) return authError

  try {
    const { path } = await request.json()

    if (!path) {
      return NextResponse.json(
        { error: 'No path provided' },
        { status: 400 }
      )
    }

    const supabase = getSupabaseClient()

    const { error } = await supabase.storage
      .from('portfolio-images')
      .remove([path])

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting file:', error)
    return NextResponse.json(
      { error: 'Failed to delete file' },
      { status: 500 }
    )
  }
}

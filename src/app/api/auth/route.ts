import { NextRequest, NextResponse } from 'next/server'

const ADMIN_SECRET = process.env.ADMIN_SECRET || 'camz2024admin'

// POST - Verificar senha do admin
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { secret } = body

    if (secret === ADMIN_SECRET) {
      return NextResponse.json({ 
        success: true, 
        token: Buffer.from(ADMIN_SECRET).toString('base64') 
      })
    }

    return NextResponse.json({ 
      success: false, 
      error: 'Senha incorreta' 
    }, { status: 401 })
  } catch {
    return NextResponse.json({ error: 'Erro na autenticação' }, { status: 500 })
  }
}

// GET - Verificar se o token é válido
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json({ valid: false }, { status: 401 })
    }

    const decodedToken = Buffer.from(token, 'base64').toString()
    
    if (decodedToken === ADMIN_SECRET) {
      return NextResponse.json({ valid: true })
    }

    return NextResponse.json({ valid: false }, { status: 401 })
  } catch {
    return NextResponse.json({ valid: false }, { status: 401 })
  }
}

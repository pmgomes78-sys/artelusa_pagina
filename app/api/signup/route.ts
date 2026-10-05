export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, password, name } = body ?? {}

    if (!email || !password) {
      return NextResponse.json({ error: 'Email e password são obrigatórios' }, { status: 400 })
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: 'Email já registado' }, { status: 409 })
    }

    const passwordHash = await bcrypt.hash(password, 12)
    const user = await prisma.user.create({
      data: { email, name: name ?? '', passwordHash, role: 'visitante' },
    })

    return NextResponse.json({ id: user.id, email: user.email, name: user.name, role: user.role }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Erro interno' }, { status: 500 })
  }
}

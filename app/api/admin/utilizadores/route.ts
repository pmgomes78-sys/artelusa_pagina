export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getAuthUser, unauthorized, forbidden } from '@/lib/permissions'
import bcrypt from 'bcryptjs'

export async function GET() {
  try {
    const authUser = await getAuthUser()
    if (!authUser) return unauthorized()
    if (authUser.role !== 'admin') return forbidden('Apenas administradores')

    const users = await prisma.user.findMany({
      select: { id: true, email: true, name: true, role: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(users)
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Erro interno' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const authUser = await getAuthUser()
    if (!authUser) return unauthorized()
    if (authUser.role !== 'admin') return forbidden('Apenas administradores')

    const body = await req.json()
    const { email, password, name, role } = body ?? {}

    if (!email || !password) {
      return NextResponse.json({ error: 'Email e password obrigatórios' }, { status: 400 })
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: 'Email já registado' }, { status: 409 })
    }

    const passwordHash = await bcrypt.hash(password, 12)
    const user = await prisma.user.create({
      data: { email, name: name ?? '', passwordHash, role: role ?? 'visitante' },
    })

    return NextResponse.json({ id: user.id, email: user.email, name: user.name, role: user.role }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Erro interno' }, { status: 500 })
  }
}

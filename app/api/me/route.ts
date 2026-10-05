export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/permissions'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const authUser = await getAuthUser()
    if (!authUser) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: authUser.userId },
      select: { id: true, email: true, name: true, role: true },
    })

    if (!user) {
      return NextResponse.json({ error: 'Utilizador não encontrado' }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Erro interno' }, { status: 500 })
  }
}

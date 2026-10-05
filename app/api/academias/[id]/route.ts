export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getAuthUser } from '@/lib/permissions'

export async function GET() {
  try {
    const authUser = await getAuthUser()

    if (!authUser) {
      // Public: return all active academies (basic info)
      const academies = await prisma.academy.findMany({
        where: { ativo: true },
        select: { id: true, nome: true, localidade: true, descricao: true },
        orderBy: { nome: 'asc' },
      })
      return NextResponse.json(academies)
    }

    if (authUser.role === 'admin') {
      const academies = await prisma.academy.findMany({ orderBy: { nome: 'asc' } })
      return NextResponse.json(academies)
    }

    // Responsavel: only assigned
    const assignments = await prisma.academyAssignment.findMany({
      where: { userId: authUser.userId },
      include: { academy: true },
    })
    const academies = assignments.map((a: any) => a.academy)
    return NextResponse.json(academies)
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Erro interno' }, { status: 500 })
  }
}

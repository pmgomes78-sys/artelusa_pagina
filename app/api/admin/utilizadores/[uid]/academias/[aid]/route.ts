export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getAuthUser, unauthorized, forbidden } from '@/lib/permissions'

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ uid: string; aid: string }> }
) {
  const { uid, aid } = await params
  try {
    const authUser = await getAuthUser()
    if (!authUser) return unauthorized()
    if (authUser.role !== 'admin') return forbidden('Apenas administradores')

    const assignment = await prisma.academyAssignment.findFirst({
      where: { userId: uid, academyId: aid },
    })
    if (!assignment) {
      return NextResponse.json({ error: 'Atribuição não encontrada' }, { status: 404 })
    }

    await prisma.academyAssignment.delete({ where: { id: assignment.id } })
    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Erro interno' }, { status: 500 })
  }
}

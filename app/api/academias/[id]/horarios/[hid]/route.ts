export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getAuthUser, verificarPermissaoAcademia, forbidden, unauthorized } from '@/lib/permissions'

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; hid: string }> }
) {
  const { id, hid } = await params
  try {
    const authUser = await getAuthUser()
    if (!authUser) return unauthorized()

    const allowed = await verificarPermissaoAcademia(authUser.userId, authUser.role, id)
    if (!allowed) return forbidden()

    await prisma.horario.findFirstOrThrow({ where: { id: hid, academyId: id } })
    await prisma.horario.delete({ where: { id: hid } })
    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Erro interno' }, { status: 500 })
  }
}

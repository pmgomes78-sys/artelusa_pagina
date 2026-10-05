export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getAuthUser, verificarPermissaoAcademia, forbidden, unauthorized } from '@/lib/permissions'

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; eid: string }> }
) {
  const { id, eid } = await params
  try {
    const authUser = await getAuthUser()
    if (!authUser) return unauthorized()

    const allowed = await verificarPermissaoAcademia(authUser.userId, authUser.role, id)
    if (!allowed) return forbidden()

    const body = await req.json()
    const updated = await prisma.evento.update({
      where: { id: eid },
      data: {
        titulo: body.titulo,
        descricao: body.descricao,
        dataInicio: body.dataInicio ? new Date(body.dataInicio) : undefined,
        dataFim: body.dataFim ? new Date(body.dataFim) : undefined,
        local: body.local,
      },
    })
    return NextResponse.json(updated)
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Erro interno' }, { status: 500 })
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; eid: string }> }
) {
  const { id, eid } = await params
  try {
    const authUser = await getAuthUser()
    if (!authUser) return unauthorized()

    const allowed = await verificarPermissaoAcademia(authUser.userId, authUser.role, id)
    if (!allowed) return forbidden()

    await prisma.evento.findFirstOrThrow({ where: { id: eid, academyId: id } })
    await prisma.evento.delete({ where: { id: eid } })
    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Erro interno' }, { status: 500 })
  }
}

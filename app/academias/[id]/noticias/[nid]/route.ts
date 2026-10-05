export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getAuthUser, verificarPermissaoAcademia, forbidden, unauthorized } from '@/lib/permissions'

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; nid: string }> }
) {
  const { id, nid } = await params
  try {
    const authUser = await getAuthUser()
    if (!authUser) return unauthorized()

    const allowed = await verificarPermissaoAcademia(authUser.userId, authUser.role, id)
    if (!allowed) return forbidden()

    const body = await req.json()
    const updated = await prisma.noticia.update({
      where: { id: nid },
      data: {
        titulo: body.titulo,
        corpo: body.corpo,
        publicado: body.publicado,
      },
    })
    return NextResponse.json(updated)
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Erro interno' }, { status: 500 })
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; nid: string }> }
) {
  const { id, nid } = await params
  try {
    const authUser = await getAuthUser()
    if (!authUser) return unauthorized()

    const allowed = await verificarPermissaoAcademia(authUser.userId, authUser.role, id)
    if (!allowed) return forbidden()

    await prisma.noticia.findFirstOrThrow({ where: { id: nid, academyId: id } })
    await prisma.noticia.delete({ where: { id: nid } })
    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Erro interno' }, { status: 500 })
  }
}

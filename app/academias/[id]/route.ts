export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getAuthUser, verificarPermissaoAcademia, forbidden, unauthorized } from '@/lib/permissions'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const academy = await prisma.academy.findUnique({ where: { id } })
    if (!academy) return NextResponse.json({ error: 'Academia não encontrada' }, { status: 404 })
    return NextResponse.json(academy)
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Erro interno' }, { status: 500 })
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const authUser = await getAuthUser()
    if (!authUser) return unauthorized()

    const allowed = await verificarPermissaoAcademia(authUser.userId, authUser.role, id)
    if (!allowed) return forbidden()

    const body = await req.json()
    const updated = await prisma.academy.update({
      where: { id },
      data: {
        nome: body.nome,
        localidade: body.localidade,
        descricao: body.descricao,
        morada: body.morada,
        telefone: body.telefone,
        emailContacto: body.emailContacto,
        horarioTexto: body.horarioTexto,
      },
    })
    return NextResponse.json(updated)
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Erro interno' }, { status: 500 })
  }
}

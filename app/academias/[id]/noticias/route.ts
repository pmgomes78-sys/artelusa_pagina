export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getAuthUser, verificarPermissaoAcademia, forbidden, unauthorized, badRequest } from '@/lib/permissions'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const noticias = await prisma.noticia.findMany({
      where: { academyId: id, publicado: true },
      orderBy: { dataPublicacao: 'desc' },
    })
    return NextResponse.json(noticias)
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Erro interno' }, { status: 500 })
  }
}

export async function POST(
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
    if (!body?.titulo || !body?.corpo) return badRequest('Título e corpo são obrigatórios')

    const noticia = await prisma.noticia.create({
      data: {
        academyId: id,
        titulo: body.titulo,
        corpo: body.corpo,
        publicado: body.publicado ?? true,
        criadoPor: authUser.userId,
      },
    })
    return NextResponse.json(noticia, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Erro interno' }, { status: 500 })
  }
}

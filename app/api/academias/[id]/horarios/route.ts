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
    const horarios = await prisma.horario.findMany({
      where: { academyId: id },
      orderBy: [{ diaSemana: 'asc' }, { horaInicio: 'asc' }],
    })
    return NextResponse.json(horarios)
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
    if (!body?.modalidade || !body?.diaSemana || !body?.horaInicio || !body?.horaFim) {
      return badRequest('Modalidade, dia da semana e horários são obrigatórios')
    }

    const horario = await prisma.horario.create({
      data: {
        academyId: id,
        modalidade: body.modalidade,
        diaSemana: body.diaSemana,
        horaInicio: body.horaInicio,
        horaFim: body.horaFim,
      },
    })
    return NextResponse.json(horario, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Erro interno' }, { status: 500 })
  }
}

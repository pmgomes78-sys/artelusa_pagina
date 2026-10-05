export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getAuthUser, unauthorized, forbidden } from '@/lib/permissions'

export async function POST(req: NextRequest) {
  try {
    const authUser = await getAuthUser()
    if (!authUser) return unauthorized()
    if (authUser.role !== 'admin') return forbidden('Apenas administradores')

    const body = await req.json()
    if (!body?.nome || !body?.localidade) {
      return NextResponse.json({ error: 'Nome e localidade obrigatórios' }, { status: 400 })
    }

    const academy = await prisma.academy.create({
      data: {
        nome: body.nome,
        localidade: body.localidade,
        descricao: body.descricao ?? null,
        morada: body.morada ?? null,
        telefone: body.telefone ?? null,
        emailContacto: body.emailContacto ?? null,
      },
    })
    return NextResponse.json(academy, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Erro interno' }, { status: 500 })
  }
}

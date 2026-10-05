export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getAuthUser, unauthorized, forbidden } from '@/lib/permissions'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ uid: string }> }
) {
  const { uid } = await params
  try {
    const authUser = await getAuthUser()
    if (!authUser) return unauthorized()
    if (authUser.role !== 'admin') return forbidden('Apenas administradores')

    const assignments = await prisma.academyAssignment.findMany({
      where: { userId: uid },
      include: { academy: { select: { id: true, nome: true, localidade: true } } },
    })
    return NextResponse.json(assignments)
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Erro interno' }, { status: 500 })
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ uid: string }> }
) {
  const { uid } = await params
  try {
    const authUser = await getAuthUser()
    if (!authUser) return unauthorized()
    if (authUser.role !== 'admin') return forbidden('Apenas administradores')

    const body = await req.json()
    if (!body?.academyId) {
      return NextResponse.json({ error: 'academyId obrigatório' }, { status: 400 })
    }

    const existing = await prisma.academyAssignment.findFirst({
      where: { userId: uid, academyId: body.academyId },
    })
    if (existing) {
      return NextResponse.json({ error: 'Atribuição já existe' }, { status: 409 })
    }

    const assignment = await prisma.academyAssignment.create({
      data: { userId: uid, academyId: body.academyId },
      include: { academy: { select: { id: true, nome: true, localidade: true } } },
    })
    return NextResponse.json(assignment, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Erro interno' }, { status: 500 })
  }
}

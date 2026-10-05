export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getAuthUser, unauthorized, forbidden } from '@/lib/permissions'

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ uid: string }> }
) {
  const { uid } = await params
  try {
    const authUser = await getAuthUser()
    if (!authUser) return unauthorized()
    if (authUser.role !== 'admin') return forbidden('Apenas administradores')

    await prisma.user.delete({ where: { id: uid } })
    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Erro interno' }, { status: 500 })
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ uid: string }> }
) {
  const { uid } = await params
  try {
    const authUser = await getAuthUser()
    if (!authUser) return unauthorized()
    if (authUser.role !== 'admin') return forbidden('Apenas administradores')

    const body = await req.json()
    const updated = await prisma.user.update({
      where: { id: uid },
      data: {
        name: body.name,
        role: body.role,
      },
      select: { id: true, email: true, name: true, role: true },
    })
    return NextResponse.json(updated)
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Erro interno' }, { status: 500 })
  }
}

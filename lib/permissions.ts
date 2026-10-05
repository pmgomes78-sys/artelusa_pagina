import { prisma } from '@/lib/db'
import { auth } from '@/auth'
import { NextResponse } from 'next/server'

export interface AuthResult {
  userId: string
  role: string
}

export async function getAuthUser(): Promise<AuthResult | null> {
  const session = await auth()
  if (!session?.user?.id) return null
  return { userId: session.user.id, role: session.user.role ?? 'visitante' }
}

export async function requireAuth(): Promise<AuthResult> {
  const user = await getAuthUser()
  if (!user) throw new Error('UNAUTHORIZED')
  return user
}

export async function verificarPermissaoAcademia(
  userId: string,
  role: string,
  academyId: string
): Promise<boolean> {
  if (role === 'admin') return true

  const assignment = await prisma.academyAssignment.findFirst({
    where: { userId, academyId },
  })

  return !!assignment
}

export function forbidden(msg = 'Sem permissão para esta academia') {
  return NextResponse.json({ error: msg }, { status: 403 })
}

export function unauthorized(msg = 'Não autenticado') {
  return NextResponse.json({ error: msg }, { status: 401 })
}

export function badRequest(msg = 'Dados inválidos') {
  return NextResponse.json({ error: msg }, { status: 400 })
}

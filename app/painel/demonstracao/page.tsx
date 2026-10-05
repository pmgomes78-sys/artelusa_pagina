import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { Header } from '@/components/header'
import { SecurityDemo } from './_components/security-demo'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export default async function DemonstracaoPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const academias = await prisma.academy.findMany({ select: { id: true, nome: true }, orderBy: { nome: 'asc' } })
  const userRole = session.user.role ?? 'visitante'
  const userId = session.user.id

  // Get user's assigned academies
  let assignedIds: string[] = []
  if (userRole === 'responsavel') {
    const assignments = await prisma.academyAssignment.findMany({
      where: { userId },
      select: { academyId: true },
    })
    assignedIds = assignments.map((a: any) => a.academyId)
  }

  return (
    <>
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-8">
        <SecurityDemo
          academias={JSON.parse(JSON.stringify(academias))}
          userRole={userRole}
          assignedAcademyIds={assignedIds}
        />
      </main>
    </>
  )
}

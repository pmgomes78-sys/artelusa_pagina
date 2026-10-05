import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { verificarPermissaoAcademia } from '@/lib/permissions'
import { Header } from '@/components/header'
import { AcademiaManager } from './_components/academia-manager'

export const dynamic = 'force-dynamic'

export default async function GerirAcademiaPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const session = await auth()
  if (!session?.user) redirect('/login')

  const role = session.user.role ?? 'visitante'
  const userId = session.user.id

  const allowed = await verificarPermissaoAcademia(userId, role, id)
  if (!allowed) redirect('/painel')

  const academia = await prisma.academy.findUnique({ where: { id } })
  if (!academia) redirect('/painel')

  const noticias = await prisma.noticia.findMany({
    where: { academyId: id },
    orderBy: { dataPublicacao: 'desc' },
  })

  const eventos = await prisma.evento.findMany({
    where: { academyId: id },
    orderBy: { dataInicio: 'desc' },
  })

  const horarios = await prisma.horario.findMany({
    where: { academyId: id },
    orderBy: [{ diaSemana: 'asc' }, { horaInicio: 'asc' }],
  })

  return (
    <>
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-8">
        <AcademiaManager
          academia={JSON.parse(JSON.stringify(academia))}
          initialNoticias={JSON.parse(JSON.stringify(noticias))}
          initialEventos={JSON.parse(JSON.stringify(eventos))}
          initialHorarios={JSON.parse(JSON.stringify(horarios))}
        />
      </main>
    </>
  )
}

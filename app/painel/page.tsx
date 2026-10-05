import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { Header } from '@/components/header'
import Link from 'next/link'
import { Shield, Building2, Users, TestTube } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const dynamic = 'force-dynamic'

export default async function PainelPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const role = session.user.role ?? 'visitante'
  const userId = session.user.id

  let academias: any[] = []
  if (role === 'admin') {
    academias = await prisma.academy.findMany({ orderBy: { nome: 'asc' } })
  } else if (role === 'responsavel') {
    const assignments = await prisma.academyAssignment.findMany({
      where: { userId },
      include: { academy: true },
    })
    academias = assignments.map((a: any) => a.academy)
  }

  return (
    <>
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="mb-8">
          <h1 className="font-display text-2xl font-bold tracking-tight">Painel de Gestão</h1>
          <p className="text-sm text-muted-foreground">
            Olá, {session.user.name ?? session.user.email} —
            <span className="ml-1 rounded bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
              {role}
            </span>
          </p>
        </div>

        {role === 'admin' && (
          <div className="mb-8 flex flex-wrap gap-3">
            <Link href="/painel/admin/utilizadores">
              <Button variant="outline">
                <Users className="mr-2 h-4 w-4" />
                Gerir Utilizadores
              </Button>
            </Link>
            <Link href="/painel/demonstracao">
              <Button variant="outline">
                <TestTube className="mr-2 h-4 w-4" />
                Demonstração de Segurança
              </Button>
            </Link>
          </div>
        )}

        {role === 'responsavel' && (
          <div className="mb-8">
            <Link href="/painel/demonstracao">
              <Button variant="outline">
                <TestTube className="mr-2 h-4 w-4" />
                Demonstração de Segurança
              </Button>
            </Link>
          </div>
        )}

        <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-semibold">
          <Building2 className="h-5 w-5 text-primary" />
          {role === 'admin' ? 'Todas as Academias' : 'As Minhas Academias'}
        </h2>

        {(academias?.length ?? 0) === 0 ? (
          <p className="text-muted-foreground">Nenhuma academia atribuída.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {(academias ?? []).map((a: any) => (
              <Link
                key={a.id}
                href={`/painel/academia/${a.id}`}
                className="group rounded-xl border bg-card p-5 transition-shadow hover:shadow-md"
              >
                <h3 className="font-semibold group-hover:text-primary transition-colors">{a.nome}</h3>
                <p className="text-sm text-muted-foreground">{a.localidade}</p>
              </Link>
            ))}
          </div>
        )}
      </main>
    </>
  )
}


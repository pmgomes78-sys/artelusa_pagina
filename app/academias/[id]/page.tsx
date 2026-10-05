import { prisma } from '@/lib/db'
import { Header } from '@/components/header'
import { notFound } from 'next/navigation'
import { MapPin, Phone, Mail, Calendar, Newspaper, Clock } from 'lucide-react'
import { SafeDate } from '@/components/safe-format'

export const dynamic = 'force-dynamic'

export default async function AcademiaPublicPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const academia = await prisma.academy.findUnique({ where: { id } })
  if (!academia) notFound()

  const noticias = await prisma.noticia.findMany({
    where: { academyId: id, publicado: true },
    orderBy: { dataPublicacao: 'desc' },
    take: 10,
  })

  const eventos = await prisma.evento.findMany({
    where: { academyId: id },
    orderBy: { dataInicio: 'asc' },
    take: 10,
  })

  const horarios = await prisma.horario.findMany({
    where: { academyId: id },
    orderBy: [{ diaSemana: 'asc' }, { horaInicio: 'asc' }],
  })

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100">
      <Header />
      <main className="mx-auto max-w-5xl px-6 py-12">
        <div className="flex items-center gap-3 text-xs font-bold text-red-500 uppercase tracking-widest mb-3">
          <span className="h-0.5 w-6 bg-red-600 inline-block"></span>
          Academia
        </div>
        <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-white">
          {academia.nome}
        </h1>
        <div className="mt-4 flex flex-wrap gap-6 text-xs text-stone-400 uppercase tracking-wider">
          <span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-red-500" />{academia.localidade}</span>
          {academia.morada && <span>{academia.morada}</span>}
          {academia.telefone && <span className="flex items-center gap-2"><Phone className="h-4 w-4 text-red-500" /><span suppressHydrationWarning>{academia.telefone}</span></span>}
          {academia.emailContacto && <span className="flex items-center gap-2"><Mail className="h-4 w-4 text-red-500" /><span suppressHydrationWarning>{academia.emailContacto}</span></span>}
        </div>
        {academia.descricao && (
          <p className="mt-6 text-stone-300 text-sm leading-relaxed max-w-2xl">{academia.descricao}</p>
        )}

        {/* Notícias */}
        <section className="mt-16 pt-10 border-t border-stone-800">
          <h2 className="mb-6 flex items-center gap-2 text-xl font-bold uppercase tracking-tight text-white">
            <Newspaper className="h-5 w-5 text-red-500" /> Notícias
          </h2>
          {(noticias?.length ?? 0) === 0 ? (
            <p className="text-sm text-stone-500">Sem notícias publicadas.</p>
          ) : (
            <div className="space-y-4">
              {(noticias ?? []).map((n: any) => (
                <div key={n.id} className="border border-stone-800 bg-stone-900/50 p-5">
                  <h3 className="font-bold text-white uppercase text-sm tracking-wide">{n.titulo}</h3>
                  <p className="mt-1 text-xs text-stone-500">
                    <SafeDate date={n.dataPublicacao} options={{ dateStyle: 'long' }} locale="pt-PT" />
                  </p>
                  <p className="mt-3 text-sm text-stone-300 whitespace-pre-wrap">{n.corpo}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Eventos */}
        <section className="mt-16 pt-10 border-t border-stone-800">
          <h2 className="mb-6 flex items-center gap-2 text-xl font-bold uppercase tracking-tight text-white">
            <Calendar className="h-5 w-5 text-red-500" /> Eventos
          </h2>
          {(eventos?.length ?? 0) === 0 ? (
            <p className="text-sm text-stone-500">Sem eventos agendados.</p>
          ) : (
            <div className="space-y-4">
              {(eventos ?? []).map((e: any) => (
                <div key={e.id} className="border border-stone-800 bg-stone-900/50 p-5">
                  <h3 className="font-bold text-white uppercase text-sm tracking-wide">{e.titulo}</h3>
                  <p className="mt-1 text-xs text-stone-500">
                    <SafeDate date={e.dataInicio} options={{ dateStyle: 'long' }} locale="pt-PT" />
                    {e.local && <> — {e.local}</>}
                  </p>
                  {e.descricao && <p className="mt-3 text-sm text-stone-300">{e.descricao}</p>}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Horários */}
        <section className="mt-16 pt-10 border-t border-stone-800 pb-10">
          <h2 className="mb-6 flex items-center gap-2 text-xl font-bold uppercase tracking-tight text-white">
            <Clock className="h-5 w-5 text-red-500" /> Horários
          </h2>
          {(horarios?.length ?? 0) === 0 ? (
            <p className="text-sm text-stone-500">Sem horários definidos.</p>
          ) : (
            <div className="overflow-x-auto border border-stone-800">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-stone-800 text-left bg-stone-900/60 text-xs uppercase tracking-wider text-stone-400">
                    <th className="py-3 px-4 font-semibold">Modalidade</th>
                    <th className="py-3 px-4 font-semibold">Dia</th>
                    <th className="py-3 px-4 font-semibold">Hora Início</th>
                    <th className="py-3 px-4 font-semibold">Hora Fim</th>
                  </tr>
                </thead>
                <tbody>
                  {(horarios ?? []).map((h: any) => (
                    <tr key={h.id} className="border-b border-stone-900 last:border-0 text-stone-300">
                      <td className="py-3 px-4">{h.modalidade}</td>
                      <td className="py-3 px-4">{h.diaSemana}</td>
                      <td className="py-3 px-4">{h.horaInicio}</td>
                      <td className="py-3 px-4">{h.horaFim}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

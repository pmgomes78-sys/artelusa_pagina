import { prisma } from '@/lib/db'
import { Header } from '@/components/header'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

const disciplines = [
  { number: "01", name: "Tai Jutsu", type: "Defesa Pessoal", description: "Técnicas de manietação e controlo que combinam consciência corporal, precisão técnica e resposta imediata." },
  { number: "02", name: "Kickboxing", type: "Desporto de Combate", description: "Movimento coordenado, técnica apurada e intensidade num treino completo que desafia corpo e mente." },
  { number: "03", name: "Muay Thai", type: "Desporto de Combate", description: "A secular arte das oito armas: foco constante, resistência física e determinação em cada ronda." },
  { number: "04", name: "Ju Jitsu", type: "Artes Marciais", description: "Aprende a dominar o equilíbrio, alavancas e estratégia no tatami perante qualquer adversário." },
]

export default async function HomePage() {
  const academias = await prisma.academy.findMany({
    where: { ativo: true },
    orderBy: { nome: 'asc' },
  })

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100">
      <Header />
      <main>
        {/* Hero */}
        <section className="relative min-h-[580px] flex items-center border-b border-stone-800 overflow-hidden">
          <img
            src="/images/hero-tatami.png"
            alt="Praticantes de artes marciais a treinar pontapés no tatami"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-stone-950/60" aria-hidden="true"></div>

          <div className="max-w-6xl mx-auto px-6 py-20 relative z-10 w-full">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 text-xs font-bold text-red-500 uppercase tracking-widest mb-4">
                <span className="h-0.5 w-6 bg-red-600 inline-block"></span>
                Artes Marciais · Defesa Pessoal
              </div>

              <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black uppercase tracking-tight text-white leading-none mb-6">
                Arte<br /><span className="text-red-600">Lusa.</span>
              </h1>

              <p className="text-lg text-stone-300 font-normal leading-relaxed mb-8 max-w-lg">
                Mais do que um treino desportivo. Uma forma contínua de te superares, fortalecendo a mente, disciplina e respeito mútuo.
              </p>

              <div className="flex flex-wrap gap-4 items-center">
                <a
                  href="#modalidades"
                  className="bg-red-700 hover:bg-red-600 text-white font-bold text-xs uppercase tracking-widest px-6 py-3.5 inline-flex items-center gap-2"
                >
                  Atreve-te a experimentar
                </a>
                <a
                  href="#academias"
                  className="border border-stone-700 hover:border-stone-500 text-stone-200 font-bold text-xs uppercase tracking-widest px-6 py-3.5"
                >
                  Onde Treinar
                </a>
              </div>
            </div>

            <div className="mt-16 pt-8 border-t border-stone-800/80 flex flex-wrap justify-between items-center text-xs text-stone-400 uppercase tracking-widest gap-4">
              <span>Respeito · Disciplina · Evolução</span>
              <span className="text-stone-500 font-mono">{String(academias.length).padStart(2, '0')} Academias</span>
            </div>
          </div>
        </section>

        {/* Values Strip */}
        <div className="bg-red-800 text-white border-y border-red-700 py-4 px-6">
          <div className="max-w-6xl mx-auto flex flex-wrap justify-between items-center text-xs font-black uppercase tracking-widest gap-4">
            <span>Disciplina</span>
            <span className="text-red-300 opacity-60">/</span>
            <span>Concentração</span>
            <span className="text-red-300 opacity-60">/</span>
            <span>Autocontrolo</span>
            <span className="text-red-300 opacity-60">/</span>
            <span>Autoconfiança</span>
          </div>
        </div>

        {/* Disciplines */}
        <section id="modalidades" className="py-24 border-b border-stone-800 bg-stone-900/50">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
              <div>
                <div className="flex items-center gap-3 text-xs font-bold text-red-500 uppercase tracking-widest mb-3">
                  <span className="h-0.5 w-6 bg-red-600 inline-block"></span>
                  Encontra o teu caminho
                </div>
                <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-white">
                  Há uma força <span className="text-red-600 italic font-serif">em cada um de nós.</span>
                </h2>
              </div>
              <p className="text-stone-400 text-sm max-w-sm">
                Quatro modalidades estruturadas. Caminhos complementares para desenvolver força, coordenação e serenidade.
              </p>
            </div>

            <figure className="mb-12">
              <img
                src="/images/treino-kickboxing.png"
                alt="Instrutora a treinar golpes de boxe com uma criança num ginásio"
                className="w-full h-80 md:h-96 object-cover object-center"
              />
            </figure>

            <div className="grid md:grid-cols-2 gap-6">
              {disciplines.map((d) => (
                <div
                  key={d.number}
                  className="border border-stone-800 bg-stone-950 p-6 flex flex-col justify-between hover:border-red-900/60 transition-colors"
                >
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xs font-mono font-bold text-red-500">{d.number}</span>
                      <span className="text-[10px] font-semibold uppercase tracking-widest text-stone-400 border border-stone-800 px-2 py-0.5">
                        {d.type}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold uppercase tracking-tight text-white mb-2">{d.name}</h3>
                    <p className="text-stone-400 text-xs leading-relaxed">{d.description}</p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-stone-800 flex justify-between items-center text-xs font-semibold text-stone-400">
                    <span>Aulas para todos os níveis</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* About */}
        <section id="sobre" className="py-24 border-b border-stone-800 bg-stone-950">
          <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 text-xs font-bold text-red-500 uppercase tracking-widest mb-3">
                <span className="h-0.5 w-6 bg-red-600 inline-block"></span>
                A Nossa Essência
              </div>
              <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-white mb-6">
                Treinamos o corpo.<br /><span className="text-red-600">Fortalecemos a mente.</span>
              </h2>
              <p className="text-stone-300 text-sm leading-relaxed mb-6">
                Na Associação Arte Lusa, cada treino é uma oportunidade de crescimento pessoal. Acreditamos no respeito rigoroso, na disciplina contínua e na confiança que se constrói passo a passo, juntos em comunidade.
              </p>

              <div className="grid grid-cols-3 gap-4 border-t border-stone-800 pt-6">
                <div>
                  <span className="text-xs font-mono text-red-500 block mb-1">01</span>
                  <span className="text-xs font-bold uppercase text-stone-200">Respeito</span>
                </div>
                <div>
                  <span className="text-xs font-mono text-red-500 block mb-1">02</span>
                  <span className="text-xs font-bold uppercase text-stone-200">Disciplina</span>
                </div>
                <div>
                  <span className="text-xs font-mono text-red-500 block mb-1">03</span>
                  <span className="text-xs font-bold uppercase text-stone-200">Confiança</span>
                </div>
              </div>
            </div>

            <figure className="relative m-0">
              <img
                src="/images/grupo-dojo.png"
                alt="Grupo de adultos e crianças em equipamento de artes marciais reunido num dojo"
                className="w-full h-96 object-cover object-center"
              />
              <figcaption className="bg-red-800 text-white px-6 py-4 text-xs font-bold uppercase tracking-widest">
                A força está em nós.
              </figcaption>
            </figure>
          </div>
        </section>

        {/* Academias (dados reais da base de dados) */}
        <section id="academias" className="py-24 bg-stone-900/40">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
              <div>
                <div className="flex items-center gap-3 text-xs font-bold text-red-500 uppercase tracking-widest mb-3">
                  <span className="h-0.5 w-6 bg-red-600 inline-block"></span>
                  Onde Treinar
                </div>
                <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-white">
                  O teu lugar <span className="text-red-600">é no tatami.</span>
                </h2>
              </div>
              <p className="text-stone-400 text-sm max-w-sm">
                Seleciona a academia mais próxima e vem assistir ou realizar uma aula experimental gratuita.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {(academias ?? []).map((a: any, idx: number) => (
                <Link
                  key={a.id}
                  href={`/academias/${a.id}`}
                  className="border-t-2 border-red-600 bg-stone-950 p-8 border-x border-b border-stone-800 flex flex-col justify-between hover:border-red-500 transition-colors"
                >
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-xs font-mono font-bold tracking-widest text-stone-400">
                        {String(idx + 1).padStart(2, '0')} / ACADEMIA
                      </span>
                      <span className="text-[10px] bg-red-950 text-red-400 border border-red-800/60 px-2 py-0.5 font-semibold uppercase tracking-wider">
                        Ativa
                      </span>
                    </div>

                    <h3 className="text-3xl font-black uppercase tracking-tight text-white mb-2">{a.nome}</h3>
                    <p className="text-xs text-stone-400 mb-6">{a.localidade}</p>

                    {a.descricao && (
                      <p className="text-xs text-stone-400 leading-relaxed border-t border-stone-800 pt-4">
                        {a.descricao}
                      </p>
                    )}
                  </div>

                  <div className="mt-8 pt-4 border-t border-stone-800 text-xs font-bold uppercase tracking-widest text-red-500">
                    Ver detalhes →
                  </div>
                </Link>
              ))}
            </div>

            {(academias?.length ?? 0) === 0 && (
              <p className="text-center text-stone-500 py-8">Nenhuma academia registada.</p>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-stone-950 border-t border-stone-800 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-8 pb-8 border-b border-stone-800">
            <div className="flex items-center gap-3">
              <img src="/images/logo-artelusa.png" alt="Logótipo Arte Lusa" className="h-8 w-8 object-contain" />
              <span className="font-bold text-sm tracking-widest text-white uppercase">Arte Lusa</span>
            </div>

            <div className="flex flex-wrap gap-6 text-xs font-semibold uppercase tracking-wider text-stone-400">
              <a href="#modalidades" className="hover:text-white">Modalidades</a>
              <a href="#sobre" className="hover:text-white">A Associação</a>
              <a href="#academias" className="hover:text-white">Academias</a>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center text-[11px] text-stone-500 gap-4">
            <span>© 2026 Arte Lusa Associação de Artes Marciais e Defesa Pessoal.</span>
            <span className="tracking-widest uppercase">Respeito · Disciplina · Confiança</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

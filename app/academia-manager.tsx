'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Newspaper, Calendar, Clock, Plus, Trash2, Pencil, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Props {
  academia: any
  initialNoticias: any[]
  initialEventos: any[]
  initialHorarios: any[]
}

export function AcademiaManager({ academia, initialNoticias, initialEventos, initialHorarios }: Props) {
  const router = useRouter()
  const [noticias, setNoticias] = useState(initialNoticias ?? [])
  const [eventos, setEventos] = useState(initialEventos ?? [])
  const [horarios, setHorarios] = useState(initialHorarios ?? [])

  // --- Notícias ---
  const [noticiaForm, setNoticiaForm] = useState({ titulo: '', corpo: '' })
  const [editingNoticia, setEditingNoticia] = useState<string | null>(null)

  const criarNoticia = async () => {
    if (!noticiaForm.titulo || !noticiaForm.corpo) { toast.error('Preencha todos os campos'); return }
    const res = await fetch(`/api/academias/${academia.id}/noticias`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(noticiaForm),
    })
    if (res.ok) {
      const n = await res.json()
      setNoticias([n, ...noticias])
      setNoticiaForm({ titulo: '', corpo: '' })
      toast.success('Notícia criada')
    } else {
      const err = await res.json().catch(() => ({}))
      toast.error(err?.error ?? 'Erro ao criar notícia')
    }
  }

  const editarNoticia = async (nid: string) => {
    const n = noticias.find((x: any) => x.id === nid)
    if (!n) return
    const res = await fetch(`/api/academias/${academia.id}/noticias/${nid}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ titulo: n.titulo, corpo: n.corpo }),
    })
    if (res.ok) {
      toast.success('Notícia atualizada')
      setEditingNoticia(null)
    } else {
      const err = await res.json().catch(() => ({}))
      toast.error(err?.error ?? 'Erro')
    }
  }

  const apagarNoticia = async (nid: string) => {
    const res = await fetch(`/api/academias/${academia.id}/noticias/${nid}`, { method: 'DELETE' })
    if (res.ok) {
      setNoticias(noticias.filter((x: any) => x.id !== nid))
      toast.success('Notícia apagada')
    } else {
      const err = await res.json().catch(() => ({}))
      toast.error(err?.error ?? 'Erro')
    }
  }

  // --- Eventos ---
  const [eventoForm, setEventoForm] = useState({ titulo: '', descricao: '', dataInicio: '', local: '' })

  const criarEvento = async () => {
    if (!eventoForm.titulo || !eventoForm.dataInicio) { toast.error('Título e data obrigatórios'); return }
    const res = await fetch(`/api/academias/${academia.id}/eventos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventoForm),
    })
    if (res.ok) {
      const ev = await res.json()
      setEventos([ev, ...eventos])
      setEventoForm({ titulo: '', descricao: '', dataInicio: '', local: '' })
      toast.success('Evento criado')
    } else {
      const err = await res.json().catch(() => ({}))
      toast.error(err?.error ?? 'Erro')
    }
  }

  const apagarEvento = async (eid: string) => {
    const res = await fetch(`/api/academias/${academia.id}/eventos/${eid}`, { method: 'DELETE' })
    if (res.ok) {
      setEventos(eventos.filter((x: any) => x.id !== eid))
      toast.success('Evento apagado')
    } else {
      const err = await res.json().catch(() => ({}))
      toast.error(err?.error ?? 'Erro')
    }
  }

  // --- Horários ---
  const [horarioForm, setHorarioForm] = useState({ modalidade: '', diaSemana: '', horaInicio: '', horaFim: '' })

  const criarHorario = async () => {
    if (!horarioForm.modalidade || !horarioForm.diaSemana || !horarioForm.horaInicio || !horarioForm.horaFim) {
      toast.error('Preencha todos os campos'); return
    }
    const res = await fetch(`/api/academias/${academia.id}/horarios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(horarioForm),
    })
    if (res.ok) {
      const h = await res.json()
      setHorarios([...horarios, h])
      setHorarioForm({ modalidade: '', diaSemana: '', horaInicio: '', horaFim: '' })
      toast.success('Horário criado')
    } else {
      const err = await res.json().catch(() => ({}))
      toast.error(err?.error ?? 'Erro')
    }
  }

  const apagarHorario = async (hid: string) => {
    const res = await fetch(`/api/academias/${academia.id}/horarios/${hid}`, { method: 'DELETE' })
    if (res.ok) {
      setHorarios(horarios.filter((x: any) => x.id !== hid))
      toast.success('Horário apagado')
    } else {
      const err = await res.json().catch(() => ({}))
      toast.error(err?.error ?? 'Erro')
    }
  }

  return (
    <div>
      <Link href="/painel" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="h-4 w-4" /> Voltar ao Painel
      </Link>
      <h1 className="font-display text-2xl font-bold tracking-tight mb-1">{academia?.nome}</h1>
      <p className="text-sm text-muted-foreground mb-6">{academia?.localidade}</p>

      <Tabs defaultValue="noticias">
        <TabsList className="mb-4">
          <TabsTrigger value="noticias"><Newspaper className="mr-1 h-4 w-4" />Notícias</TabsTrigger>
          <TabsTrigger value="eventos"><Calendar className="mr-1 h-4 w-4" />Eventos</TabsTrigger>
          <TabsTrigger value="horarios"><Clock className="mr-1 h-4 w-4" />Horários</TabsTrigger>
        </TabsList>

        {/* NOTÍCIAS */}
        <TabsContent value="noticias" className="space-y-4">
          <div className="rounded-lg border bg-card p-4 space-y-3">
            <h3 className="text-sm font-semibold">Criar Notícia</h3>
            <Input placeholder="Título" value={noticiaForm.titulo} onChange={(e: any) => setNoticiaForm({ ...noticiaForm, titulo: e.target.value })} />
            <Textarea placeholder="Corpo da notícia" value={noticiaForm.corpo} onChange={(e: any) => setNoticiaForm({ ...noticiaForm, corpo: e.target.value })} />
            <Button size="sm" onClick={criarNoticia}><Plus className="mr-1 h-4 w-4" />Criar</Button>
          </div>
          {(noticias ?? []).map((n: any) => (
            <div key={n.id} className="rounded-lg border bg-card p-4">
              {editingNoticia === n.id ? (
                <div className="space-y-2">
                  <Input value={n.titulo} onChange={(e: any) => setNoticias(noticias.map((x: any) => x.id === n.id ? { ...x, titulo: e.target.value } : x))} />
                  <Textarea value={n.corpo} onChange={(e: any) => setNoticias(noticias.map((x: any) => x.id === n.id ? { ...x, corpo: e.target.value } : x))} />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => editarNoticia(n.id)}>Guardar</Button>
                    <Button size="sm" variant="ghost" onClick={() => setEditingNoticia(null)}>Cancelar</Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold">{n.titulo}</h4>
                      <p className="text-xs text-muted-foreground">{new Date(n.dataPublicacao).toLocaleDateString('pt-PT')}</p>
                    </div>
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" onClick={() => setEditingNoticia(n.id)}><Pencil className="h-4 w-4" /></Button>
                      <Button size="icon" variant="ghost" onClick={() => apagarNoticia(n.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                  </div>
                  <p className="mt-2 text-sm whitespace-pre-wrap">{n.corpo}</p>
                </>
              )}
            </div>
          ))}
        </TabsContent>

        {/* EVENTOS */}
        <TabsContent value="eventos" className="space-y-4">
          <div className="rounded-lg border bg-card p-4 space-y-3">
            <h3 className="text-sm font-semibold">Criar Evento</h3>
            <Input placeholder="Título" value={eventoForm.titulo} onChange={(e: any) => setEventoForm({ ...eventoForm, titulo: e.target.value })} />
            <Textarea placeholder="Descrição" value={eventoForm.descricao} onChange={(e: any) => setEventoForm({ ...eventoForm, descricao: e.target.value })} />
            <div className="flex gap-2">
              <div className="flex-1">
                <Label className="text-xs">Data Início</Label>
                <Input type="datetime-local" value={eventoForm.dataInicio} onChange={(e: any) => setEventoForm({ ...eventoForm, dataInicio: e.target.value })} />
              </div>
              <div className="flex-1">
                <Label className="text-xs">Local</Label>
                <Input placeholder="Local" value={eventoForm.local} onChange={(e: any) => setEventoForm({ ...eventoForm, local: e.target.value })} />
              </div>
            </div>
            <Button size="sm" onClick={criarEvento}><Plus className="mr-1 h-4 w-4" />Criar</Button>
          </div>
          {(eventos ?? []).map((ev: any) => (
            <div key={ev.id} className="rounded-lg border bg-card p-4 flex items-start justify-between">
              <div>
                <h4 className="font-semibold">{ev.titulo}</h4>
                <p className="text-xs text-muted-foreground">{new Date(ev.dataInicio).toLocaleDateString('pt-PT')}{ev.local ? ` — ${ev.local}` : ''}</p>
                {ev.descricao && <p className="mt-1 text-sm">{ev.descricao}</p>}
              </div>
              <Button size="icon" variant="ghost" onClick={() => apagarEvento(ev.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
          ))}
        </TabsContent>

        {/* HORÁRIOS */}
        <TabsContent value="horarios" className="space-y-4">
          <div className="rounded-lg border bg-card p-4 space-y-3">
            <h3 className="text-sm font-semibold">Adicionar Horário</h3>
            <div className="grid grid-cols-2 gap-2">
              <Input placeholder="Modalidade" value={horarioForm.modalidade} onChange={(e: any) => setHorarioForm({ ...horarioForm, modalidade: e.target.value })} />
              <select
                className="rounded-md border bg-card px-3 py-2 text-sm"
                value={horarioForm.diaSemana}
                onChange={(e: any) => setHorarioForm({ ...horarioForm, diaSemana: e.target.value })}
              >
                <option value="">Dia da semana</option>
                <option>Segunda-feira</option>
                <option>Terça-feira</option>
                <option>Quarta-feira</option>
                <option>Quinta-feira</option>
                <option>Sexta-feira</option>
                <option>Sábado</option>
              </select>
              <Input type="time" value={horarioForm.horaInicio} onChange={(e: any) => setHorarioForm({ ...horarioForm, horaInicio: e.target.value })} />
              <Input type="time" value={horarioForm.horaFim} onChange={(e: any) => setHorarioForm({ ...horarioForm, horaFim: e.target.value })} />
            </div>
            <Button size="sm" onClick={criarHorario}><Plus className="mr-1 h-4 w-4" />Adicionar</Button>
          </div>
          {(horarios?.length ?? 0) > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b text-left"><th className="py-2 pr-4">Modalidade</th><th className="py-2 pr-4">Dia</th><th className="py-2 pr-4">Início</th><th className="py-2 pr-4">Fim</th><th className="py-2"></th></tr></thead>
                <tbody>
                  {(horarios ?? []).map((h: any) => (
                    <tr key={h.id} className="border-b last:border-0">
                      <td className="py-2 pr-4">{h.modalidade}</td>
                      <td className="py-2 pr-4">{h.diaSemana}</td>
                      <td className="py-2 pr-4">{h.horaInicio}</td>
                      <td className="py-2 pr-4">{h.horaFim}</td>
                      <td className="py-2"><Button size="icon" variant="ghost" onClick={() => apagarHorario(h.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

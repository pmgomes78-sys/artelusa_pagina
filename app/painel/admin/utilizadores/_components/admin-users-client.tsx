'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Plus, Trash2, UserPlus, Building2 } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

export function AdminUsersClient() {
  const [users, setUsers] = useState<any[]>([])
  const [academias, setAcademias] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [newUser, setNewUser] = useState({ email: '', password: '', name: '', role: 'responsavel' })
  const [assignments, setAssignments] = useState<Record<string, any[]>>({})
  const [assignAcademy, setAssignAcademy] = useState<Record<string, string>>({})

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [usersRes, acadRes] = await Promise.all([
        fetch('/api/admin/utilizadores'),
        fetch('/api/academias'),
      ])
      const usersData = await usersRes.json()
      const acadData = await acadRes.json()
      setUsers(Array.isArray(usersData) ? usersData : [])
      setAcademias(Array.isArray(acadData) ? acadData : [])

      // Load assignments for each user
      const assignMap: Record<string, any[]> = {}
      for (const u of (Array.isArray(usersData) ? usersData : [])) {
        const r = await fetch(`/api/admin/utilizadores/${u.id}/academias`)
        const data = await r.json()
        assignMap[u.id] = Array.isArray(data) ? data : []
      }
      setAssignments(assignMap)
    } catch {
      toast.error('Erro ao carregar dados')
    } finally {
      setLoading(false)
    }
  }

  const criarUtilizador = async () => {
    if (!newUser.email || !newUser.password) { toast.error('Email e password obrigatórios'); return }
    const res = await fetch('/api/admin/utilizadores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser),
    })
    if (res.ok) {
      toast.success('Utilizador criado')
      setNewUser({ email: '', password: '', name: '', role: 'responsavel' })
      loadData()
    } else {
      const err = await res.json().catch(() => ({}))
      toast.error(err?.error ?? 'Erro')
    }
  }

  const apagarUtilizador = async (uid: string) => {
    if (!confirm('Tem a certeza que quer apagar este utilizador?')) return
    const res = await fetch(`/api/admin/utilizadores/${uid}`, { method: 'DELETE' })
    if (res.ok) {
      toast.success('Utilizador apagado')
      loadData()
    } else {
      const err = await res.json().catch(() => ({}))
      toast.error(err?.error ?? 'Erro')
    }
  }

  const atribuirAcademia = async (uid: string) => {
    const academyId = assignAcademy[uid]
    if (!academyId) { toast.error('Selecione uma academia'); return }
    const res = await fetch(`/api/admin/utilizadores/${uid}/academias`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ academyId }),
    })
    if (res.ok) {
      toast.success('Academia atribuída')
      loadData()
    } else {
      const err = await res.json().catch(() => ({}))
      toast.error(err?.error ?? 'Erro')
    }
  }

  const removerAtribuicao = async (uid: string, aid: string) => {
    const res = await fetch(`/api/admin/utilizadores/${uid}/academias/${aid}`, { method: 'DELETE' })
    if (res.ok) {
      toast.success('Atribuição removida')
      loadData()
    } else {
      const err = await res.json().catch(() => ({}))
      toast.error(err?.error ?? 'Erro')
    }
  }

  if (loading) return <p className="text-muted-foreground">A carregar...</p>

  return (
    <div>
      <Link href="/painel" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="h-4 w-4" /> Voltar ao Painel
      </Link>
      <h1 className="font-display text-2xl font-bold tracking-tight mb-6">Gerir Utilizadores</h1>

      {/* Criar utilizador */}
      <div className="rounded-lg border bg-card p-4 mb-8 space-y-3">
        <h3 className="flex items-center gap-2 text-sm font-semibold">
          <UserPlus className="h-4 w-4" /> Criar Utilizador
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <Input placeholder="Email" type="email" value={newUser.email} onChange={(e: any) => setNewUser({ ...newUser, email: e.target.value })} />
          <Input placeholder="Password" type="password" value={newUser.password} onChange={(e: any) => setNewUser({ ...newUser, password: e.target.value })} />
          <Input placeholder="Nome" value={newUser.name} onChange={(e: any) => setNewUser({ ...newUser, name: e.target.value })} />
          <select className="rounded-md border bg-card px-3 py-2 text-sm" value={newUser.role} onChange={(e: any) => setNewUser({ ...newUser, role: e.target.value })}>
            <option value="responsavel">Responsável</option>
            <option value="admin">Administrador</option>
            <option value="visitante">Visitante</option>
          </select>
        </div>
        <Button size="sm" onClick={criarUtilizador}><Plus className="mr-1 h-4 w-4" /> Criar</Button>
      </div>

      {/* Lista de utilizadores */}
      <div className="space-y-4">
        {(users ?? []).map((u: any) => (
          <div key={u.id} className="rounded-lg border bg-card p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold">{u.name ?? 'Sem nome'}</p>
                <p className="text-sm text-muted-foreground">{u.email}</p>
                <span className="inline-block mt-1 rounded bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">{u.role}</span>
              </div>
              <Button size="icon" variant="ghost" onClick={() => apagarUtilizador(u.id)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>

            {/* Atribuições */}
            {u.role === 'responsavel' && (
              <div className="mt-3 border-t pt-3">
                <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
                  <Building2 className="h-3 w-3" /> Academias atribuídas:
                </p>
                <div className="flex flex-wrap gap-2 mb-2">
                  {(assignments[u.id] ?? []).map((a: any) => (
                    <span key={a.id} className="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs">
                      {a.academy?.nome ?? 'N/A'}
                      <button onClick={() => removerAtribuicao(u.id, a.academy?.id)} className="text-destructive hover:text-destructive/80">
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                  {(assignments[u.id]?.length ?? 0) === 0 && <span className="text-xs text-muted-foreground">Nenhuma</span>}
                </div>
                <div className="flex gap-2">
                  <select
                    className="rounded-md border bg-card px-3 py-1 text-xs flex-1"
                    value={assignAcademy[u.id] ?? ''}
                    onChange={(e: any) => setAssignAcademy({ ...assignAcademy, [u.id]: e.target.value })}
                  >
                    <option value="">Selecionar academia...</option>
                    {(academias ?? []).map((ac: any) => (
                      <option key={ac.id} value={ac.id}>{ac.nome}</option>
                    ))}
                  </select>
                  <Button size="sm" variant="outline" onClick={() => atribuirAcademia(u.id)} className="text-xs">
                    Atribuir
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

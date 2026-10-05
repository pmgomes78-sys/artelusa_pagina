'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ShieldAlert, ShieldCheck, Send, AlertTriangle } from 'lucide-react'
import Link from 'next/link'

interface TestResult {
  method: string
  url: string
  body?: any
  status: number
  response: any
  blocked: boolean
}

interface Props {
  academias: { id: string; nome: string }[]
  userRole: string
  assignedAcademyIds: string[]
}

export function SecurityDemo({ academias, userRole, assignedAcademyIds }: Props) {
  const [results, setResults] = useState<TestResult[]>([])
  const [running, setRunning] = useState(false)

  const runTest = async (method: string, url: string, body?: any): Promise<TestResult> => {
    const opts: RequestInit = {
      method,
      headers: { 'Content-Type': 'application/json' },
    }
    if (body) opts.body = JSON.stringify(body)

    const res = await fetch(url, opts)
    const data = await res.json().catch(() => ({}))
    return {
      method,
      url,
      body,
      status: res.status,
      response: data,
      blocked: res.status === 403,
    }
  }

  const executarTestes = async () => {
    setRunning(true)
    setResults([])
    const newResults: TestResult[] = []

    // For "responsavel" users, try to write to academies they DON'T have access to
    if (userRole === 'responsavel') {
      const otherAcademias = (academias ?? []).filter((a: any) => !(assignedAcademyIds ?? []).includes(a.id))
      const myAcademias = (academias ?? []).filter((a: any) => (assignedAcademyIds ?? []).includes(a.id))

      // Test: Write to own academy (should succeed)
      for (const ac of myAcademias) {
        const r = await runTest('POST', `/api/academias/${ac.id}/noticias`, {
          titulo: '[Teste] Notícia de teste (própria academia)',
          corpo: 'Este pedido deve ser aceite porque o utilizador tem permissão.',
        })
        newResults.push(r)
        // Clean up: delete test news
        if (r.status === 201 && r.response?.id) {
          await fetch(`/api/academias/${ac.id}/noticias/${r.response.id}`, { method: 'DELETE' })
        }
      }

      // Test: Write to OTHER academy (should be blocked with 403)
      for (const ac of otherAcademias) {
        newResults.push(await runTest('POST', `/api/academias/${ac.id}/noticias`, {
          titulo: '[Teste] Tentativa de acesso cruzado',
          corpo: 'Este pedido deve ser BLOQUEADO pelo servidor.',
        }))

        newResults.push(await runTest('POST', `/api/academias/${ac.id}/eventos`, {
          titulo: '[Teste] Evento não autorizado',
          dataInicio: new Date().toISOString(),
        }))

        newResults.push(await runTest('POST', `/api/academias/${ac.id}/horarios`, {
          modalidade: 'Teste',
          diaSemana: 'Segunda-feira',
          horaInicio: '10:00',
          horaFim: '11:00',
        }))

        newResults.push(await runTest('PUT', `/api/academias/${ac.id}`, {
          nome: '[Hackeado] Nome alterado',
        }))
      }
    }

    // For admin, demonstrate that they CAN access everything
    if (userRole === 'admin') {
      for (const ac of (academias ?? [])) {
        const r = await runTest('POST', `/api/academias/${ac.id}/noticias`, {
          titulo: '[Teste Admin] Acesso total',
          corpo: 'O administrador tem acesso a todas as academias.',
        })
        newResults.push(r)
        if (r.status === 201 && r.response?.id) {
          await fetch(`/api/academias/${ac.id}/noticias/${r.response.id}`, { method: 'DELETE' })
        }
      }
    }

    setResults(newResults)
    setRunning(false)
  }

  const blocked = results.filter((r: any) => r.blocked)
  const allowed = results.filter((r: any) => !r.blocked)

  return (
    <div>
      <Link href="/painel" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="h-4 w-4" /> Voltar ao Painel
      </Link>

      <h1 className="font-display text-2xl font-bold tracking-tight mb-2">
        Demonstração de Segurança
      </h1>
      <p className="text-sm text-muted-foreground mb-4">
        Esta página demonstra que as permissões são verificadas ao nível da API (servidor), não apenas na interface.
      </p>

      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 mb-6">
        <p className="flex items-center gap-2 text-sm font-medium text-amber-800">
          <AlertTriangle className="h-4 w-4" />
          Mesmo enviando um pedido HTTP direto à API com o ID da academia errada, o servidor responde 403 Forbidden.
        </p>
      </div>

      <div className="mb-4 rounded-lg border bg-muted/50 p-3 text-sm">
        <p><strong>Perfil atual:</strong> {userRole}</p>
        {userRole === 'responsavel' && (
          <p><strong>Academias atribuídas:</strong> {(academias ?? []).filter((a: any) => (assignedAcademyIds ?? []).includes(a.id)).map((a: any) => a.nome).join(', ') || 'Nenhuma'}</p>
        )}
        {userRole === 'admin' && (
          <p><strong>Acesso:</strong> Todas as academias (administrador)</p>
        )}
      </div>

      <Button onClick={executarTestes} disabled={running} className="mb-6">
        <Send className="mr-2 h-4 w-4" />
        {running ? 'A executar testes...' : 'Executar Testes de Segurança'}
      </Button>

      {results.length > 0 && (
        <div className="space-y-6">
          {blocked.length > 0 && (
            <div>
              <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-destructive mb-3">
                <ShieldAlert className="h-5 w-5" /> Pedidos Bloqueados ({blocked.length})
              </h2>
              <div className="space-y-3">
                {blocked.map((r: any, i: number) => (
                  <div key={i} className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="rounded bg-destructive px-2 py-0.5 text-xs font-mono text-destructive-foreground">{r.status}</span>
                      <span className="font-mono text-sm font-medium">{r.method} {r.url}</span>
                    </div>
                    {r.body && (
                      <details className="mb-2">
                        <summary className="text-xs text-muted-foreground cursor-pointer">Corpo do pedido</summary>
                        <pre className="mt-1 rounded bg-muted p-2 text-xs font-mono overflow-x-auto">{JSON.stringify(r.body, null, 2)}</pre>
                      </details>
                    )}
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Resposta do servidor:</p>
                      <pre className="rounded bg-muted p-2 text-xs font-mono overflow-x-auto">{JSON.stringify(r.response, null, 2)}</pre>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {allowed.length > 0 && (
            <div>
              <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-green-700 mb-3">
                <ShieldCheck className="h-5 w-5" /> Pedidos Aceites ({allowed.length})
              </h2>
              <div className="space-y-3">
                {allowed.map((r: any, i: number) => (
                  <div key={i} className="rounded-lg border border-green-200 bg-green-50 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="rounded bg-green-600 px-2 py-0.5 text-xs font-mono text-white">{r.status}</span>
                      <span className="font-mono text-sm font-medium">{r.method} {r.url}</span>
                    </div>
                    {r.body && (
                      <details className="mb-2">
                        <summary className="text-xs text-muted-foreground cursor-pointer">Corpo do pedido</summary>
                        <pre className="mt-1 rounded bg-muted p-2 text-xs font-mono overflow-x-auto">{JSON.stringify(r.body, null, 2)}</pre>
                      </details>
                    )}
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Resposta do servidor:</p>
                      <pre className="rounded bg-muted p-2 text-xs font-mono overflow-x-auto">{JSON.stringify(r.response, null, 2)}</pre>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

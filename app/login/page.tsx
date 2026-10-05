'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Shield, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })
      if (res?.error) {
        toast.error('Credenciais inválidas')
      } else {
        toast.success('Sessão iniciada com sucesso')
        router.replace('/painel')
      }
    } catch {
      toast.error('Erro ao iniciar sessão')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Header />
      <main className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center px-4">
        <div className="w-full max-w-sm space-y-6">
          <div className="text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h1 className="font-display text-2xl font-bold tracking-tight">Iniciar Sessão</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Acesso restrito a responsáveis e administradores
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e: any) => setEmail(e.target.value)}
                placeholder="email@artelusa.pt"
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e: any) => setPassword(e.target.value)}
                required
                className="mt-1"
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Entrar
            </Button>
          </form>
          <div className="rounded-lg border bg-muted/50 p-3 text-xs text-muted-foreground">
            <p className="font-medium mb-1">Contas de teste:</p>
            <p>Admin: admin@artelusa.pt / Admin2024!</p>
            <p>Resp. Famalicão: responsavel.famalicao@artelusa.pt / Resp2024A!</p>
            <p>Resp. Vizela: responsavel.vizela@artelusa.pt / Resp2024B!</p>
          </div>
        </div>
      </main>
    </>
  )
}

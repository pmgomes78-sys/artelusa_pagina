'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { LogOut, User, LayoutDashboard } from 'lucide-react'

export function Header() {
  const { data: session } = useSession()
  const user = session?.user

  return (
    <header className="sticky top-0 z-50 border-b border-stone-800 bg-stone-950/95 backdrop-blur-sm">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-3">
          <img src="/images/logo-artelusa.png" alt="Logótipo Arte Lusa" className="h-10 w-10 object-contain" />
          <div className="leading-tight">
            <span className="block font-extrabold text-base tracking-widest text-white uppercase">Arte Lusa</span>
            <span className="block text-[10px] text-stone-400 tracking-wider uppercase">Artes Marciais</span>
          </div>
        </Link>
        <nav className="flex items-center gap-3">
          {!user && (
            <Link href="/login">
              <Button variant="outline" size="sm" className="border-stone-700 text-stone-200 hover:bg-stone-800 uppercase text-xs tracking-wider">
                <User className="mr-1 h-4 w-4" />
                Entrar
              </Button>
            </Link>
          )}
          {user && (
            <>
              <Link href="/painel">
                <Button variant="ghost" size="sm" className="text-stone-200 hover:text-white hover:bg-stone-800 uppercase text-xs tracking-wider">
                  <LayoutDashboard className="mr-1 h-4 w-4" />
                  Painel
                </Button>
              </Link>
              <span className="text-xs text-stone-400 hidden sm:inline">
                {user?.email}
              </span>
              <Button
                variant="outline"
                size="sm"
                className="border-stone-700 text-stone-200 hover:bg-stone-800 uppercase text-xs tracking-wider"
                onClick={() => signOut({ redirectTo: '/' })}
              >
                <LogOut className="mr-1 h-4 w-4" />
                Sair
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}

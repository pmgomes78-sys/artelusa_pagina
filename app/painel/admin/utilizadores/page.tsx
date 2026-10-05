import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { Header } from '@/components/header'
import { AdminUsersClient } from './_components/admin-users-client'

export const dynamic = 'force-dynamic'

export default async function AdminUsersPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')
  if (session.user.role !== 'admin') redirect('/painel')

  return (
    <>
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-8">
        <AdminUsersClient />
      </main>
    </>
  )
}

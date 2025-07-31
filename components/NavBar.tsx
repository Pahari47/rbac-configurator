'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function NavBar() {
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <nav className="flex justify-between items-center px-6 py-4 shadow border-b">
      <h1 className="text-xl font-bold">RBAC Configurator</h1>
      <div className="flex gap-4">
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/dashboard/permissions">Permissions</Link>
        <Button onClick={handleLogout} variant="outline">Logout</Button>
      </div>
    </nav>
  )
}

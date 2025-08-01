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

  const navItems = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Permissions', href: '/dashboard/permissions' },
    { name: 'Roles', href: '/dashboard/roles' },
    { name: 'Assign Permissions', href: '/dashboard/role-permissions' },
    { name: 'Assign Roles', href: '/dashboard/user-roles' },
    { name: 'AI Configurator', href: '/dashboard/ai-configurator' }
  ]

  return (
    <nav className="flex justify-between items-center px-6 py-4 shadow-sm border-b bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <h1 className="text-2xl font-bold tracking-tight">🔐 RBAC Configurator</h1>

      <div className="flex flex-wrap gap-3 items-center">
        {navItems.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            {item.name}
          </Link>
        ))}
        <Button
          onClick={handleLogout}
          variant="outline"
          className="border-gray-300 dark:border-gray-700 text-sm"
        >
          Logout
        </Button>
      </div>
    </nav>
  )
}

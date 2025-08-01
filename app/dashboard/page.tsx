'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'

export default function DashboardHome() {
  const router = useRouter()
  const [userEmail, setUserEmail] = useState('')

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.replace('/login')
      } else {
        setUserEmail(session.user.email || '')
      }
    }

    checkSession()
  }, [router])

  return (
    <div className="min-h-screen px-6 py-10 bg-gradient-to-b from-white to-gray-100 dark:from-black dark:to-gray-900 text-gray-900 dark:text-white">
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="space-y-2">
          <h2 className="text-4xl font-bold">Welcome to your Dashboard</h2>
          <p className="text-muted-foreground">
            Hello <span className="font-medium">{userEmail}</span>! 🎉 Manage your roles and permissions below.
          </p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm bg-white dark:bg-gray-800">
            <h3 className="text-xl font-semibold mb-2">🚀 AI Assistant</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Use natural language to assign roles and permissions.
            </p>
            <Button onClick={() => router.push('/dashboard/ai-configurator')}>Try AI Config</Button>
          </div>

          <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm bg-white dark:bg-gray-800">
            <h3 className="text-xl font-semibold mb-2">🛠 Role & Permission</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Manage role-permission mappings, user roles, and more.
            </p>
            <Button onClick={() => router.push('/dashboard/role-permissions')}>Manage Access</Button>
          </div>
        </section>
      </div>
    </div>
  )
}

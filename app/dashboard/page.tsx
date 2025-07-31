'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function DashboardHome() {
  const router = useRouter()

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.replace('/login')
      }
    }

    checkSession()
  }, [router])

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Dashboard</h2>
      <p>Welcome to the RBAC Configurator! 🎉</p>
    </div>
  )
}

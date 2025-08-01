'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function HomePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.push('/dashboard')
      } else {
        setLoading(false)
      }
    })
  }, [router])

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground text-lg">Checking session...</p>
      </div>
    )

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md p-2 shadow-lg border">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            🛡️ RBAC Configurator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          <p className="text-muted-foreground text-base">
            Manage roles, permissions, and user access easily with our Role-Based Access Control system.
          </p>
          <Button className="w-full" onClick={() => router.push('/login')}>
            Get Started
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
  
    if (error) {
      setError(error.message)
    } else {
      router.push('/dashboard')
    }
  }


  

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-4 p-4 border rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center">Login</h2>
        <Input
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          type="email"
        />
        <Input
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          type="password"
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Button onClick={handleLogin} className="w-full">Login</Button>
      </div>
    </div>
  )
}

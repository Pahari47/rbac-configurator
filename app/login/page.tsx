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
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    setLoading(true)
    setError('')
    setMessage('')

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        // Try to sign up if not found
        const { data: signupData, error: signupError } = await supabase.auth.signUp({
          email,
          password
        })

        if (signupError) {
          setError(signupError.message)
        } else {
          // Check if email confirmation is required
          if (signupData.session === null) {
            setMessage('Check your email to confirm your account before logging in.')
          } else {
            router.push('/dashboard')
          }
        }
      } else {
        setError(error.message)
      }
    } else {
      router.push('/dashboard')
    }

    setLoading(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md space-y-4 p-6 border rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-center">Login / Sign Up</h2>

        <div className="space-y-2">
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
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}
        {message && <p className="text-green-600 text-sm">{message}</p>}

        <Button
          onClick={handleLogin}
          className="w-full"
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Continue'}
        </Button>

        <p className="text-sm text-center text-muted-foreground">
          We'll automatically sign you up if your account doesn’t exist.
        </p>
      </div>
    </div>
  )
}

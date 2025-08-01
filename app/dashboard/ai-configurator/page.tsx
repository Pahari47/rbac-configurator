'use client'

import { useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

export default function AiConfigurator() {
  const [input, setInput] = useState('')
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)

  const handleAiCommand = async () => {
    setLoading(true)
    setResponse('')

    try {
      const aiResp = await fetch('/api/ai-command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input }),
      })

      const result = await aiResp.json()
      if (!aiResp.ok) throw new Error(result.error)

      setResponse(result.message)
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Something went wrong.'
      setResponse(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto py-6">
      <h2 className="text-2xl font-semibold mb-4">AI RBAC Configurator</h2>

      <Textarea
        placeholder="Type a command like: 'Assign publish:blog to Editor'"
        rows={3}
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <Button className="mt-3" onClick={handleAiCommand} disabled={loading}>
        {loading ? 'Processing...' : 'Submit'}
      </Button>

      {response && (
        <p className="mt-4 text-sm text-muted-foreground">
          {response}
        </p>
      )}
    </div>
  )
}

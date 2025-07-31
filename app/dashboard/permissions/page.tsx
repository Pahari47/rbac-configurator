'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Pencil, Trash2 } from 'lucide-react'

type Permission = {
  id: string
  name: string
  description: string | null
}

export default function PermissionsPage() {
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)

  const fetchPermissions = async () => {
    const { data } = await supabase.from('permissions').select('*').order('created_at')
    setPermissions(data || [])
  }

  useEffect(() => {
    fetchPermissions()
  }, [])

  const handleSubmit = async () => {
    if (!name.trim()) return

    if (editingId) {
      await supabase.from('permissions').update({ name, description }).eq('id', editingId)
    } else {
      await supabase.from('permissions').insert([{ name, description }])
    }

    setName('')
    setDescription('')
    setEditingId(null)
    fetchPermissions()
  }

  const handleEdit = (p: Permission) => {
    setName(p.name)
    setDescription(p.description || '')
    setEditingId(p.id)
  }

  const handleDelete = async (id: string) => {
    await supabase.from('permissions').delete().eq('id', id)
    fetchPermissions()
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Permission Management</h2>

      <div className="grid gap-2 max-w-lg">
        <Input
          placeholder="Permission Name (e.g., can_edit_articles)"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <Textarea
          placeholder="Description (optional)"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
        <Button onClick={handleSubmit}>
          {editingId ? 'Update Permission' : 'Add Permission'}
        </Button>
      </div>

      <hr />

      <div className="space-y-2">
        {permissions.map(p => (
          <div key={p.id} className="flex items-center justify-between border p-3 rounded-md">
            <div>
              <h4 className="font-semibold">{p.name}</h4>
              {p.description && <p className="text-sm text-muted-foreground">{p.description}</p>}
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => handleEdit(p)}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="destructive" onClick={() => handleDelete(p.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

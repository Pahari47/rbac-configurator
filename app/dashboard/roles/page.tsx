'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Pencil, Trash2 } from 'lucide-react'

type Role = {
  id: string
  name: string
}

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([])
  const [name, setName] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)

  const fetchRoles = async () => {
    const { data } = await supabase.from('roles').select('*').order('created_at')
    setRoles(data || [])
  }

  useEffect(() => {
    fetchRoles()
  }, [])

  const handleSubmit = async () => {
    if (!name.trim()) return

    if (editingId) {
      await supabase.from('roles').update({ name }).eq('id', editingId)
    } else {
      await supabase.from('roles').insert([{ name }])
    }

    setName('')
    setEditingId(null)
    fetchRoles()
  }

  const handleEdit = (r: Role) => {
    setName(r.name)
    setEditingId(r.id)
  }

  const handleDelete = async (id: string) => {
    await supabase.from('roles').delete().eq('id', id)
    fetchRoles()
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Role Management</h2>

      <div className="grid gap-2 max-w-lg">
        <Input
          placeholder="Role Name (e.g., admin, editor)"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <Button onClick={handleSubmit}>
          {editingId ? 'Update Role' : 'Add Role'}
        </Button>
      </div>

      <hr />

      <div className="space-y-2">
        {roles.map(r => (
          <div key={r.id} className="flex items-center justify-between border p-3 rounded-md">
            <div className="font-semibold">{r.name}</div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => handleEdit(r)}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="destructive" onClick={() => handleDelete(r.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

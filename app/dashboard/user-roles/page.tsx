'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'

type Role = { id: string; name: string }
type User = { id: string; email?: string }

export default function UserRolesPage() {
  const [users, setUsers] = useState<User[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [selectedUser, setSelectedUser] = useState<string>('')
  const [assignedRoles, setAssignedRoles] = useState<Set<string>>(new Set())

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/admin/users')
      const usersData = await res.json()

      const { data: rolesData } = await supabase.from('roles').select('*')
      setUsers(usersData || [])
      setRoles(rolesData || [])
    }

    fetchData()
  }, [])

  const fetchAssignedRoles = async () => {
    const { data } = await supabase
      .from('user_roles')
      .select('role_id')
      .eq('user_id', selectedUser)

    setAssignedRoles(new Set(data?.map(r => r.role_id)))
  }

  useEffect(() => {
    if (selectedUser) {
      fetchAssignedRoles()
    } else {
      setAssignedRoles(new Set())
    }
  }, [selectedUser])

  const handleToggle = async (roleId: string) => {
    const updated = new Set(assignedRoles)

    if (assignedRoles.has(roleId)) {
      await supabase
        .from('user_roles')
        .delete()
        .match({ user_id: selectedUser, role_id: roleId })
      updated.delete(roleId)
    } else {
      await supabase
        .from('user_roles')
        .insert([{ user_id: selectedUser, role_id: roleId }])
      updated.add(roleId)
    }

    setAssignedRoles(updated)
  }

  return (
    <div className="space-y-6 max-w-xl">
      <h2 className="text-2xl font-bold">Assign Roles to Users</h2>

      <Select onValueChange={setSelectedUser}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a user..." />
        </SelectTrigger>
        <SelectContent>
          {users.map(u => (
            <SelectItem key={u.id} value={u.id}>
              {u.email ?? 'Unknown'}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {selectedUser && (
        <div className="space-y-2 border p-4 rounded-md">
          <h3 className="text-lg font-semibold mb-2">Roles</h3>
          {roles.map(r => (
            <div key={r.id} className="flex items-center gap-3">
              <Checkbox
                checked={assignedRoles.has(r.id)}
                onCheckedChange={() => handleToggle(r.id)}
              />
              <Label>{r.name}</Label>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue
} from '@/components/ui/select'

type Role = { id: string; name: string }
type Permission = { id: string; name: string }

export default function RolePermissionsPage() {
  const [roles, setRoles] = useState<Role[]>([])
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [selectedRole, setSelectedRole] = useState<string>('')
  const [assigned, setAssigned] = useState<Set<string>>(new Set())

  const fetchAssignedPermissions = useCallback(async () => {
    const { data } = await supabase
      .from('role_permissions')
      .select('permission_id')
      .eq('role_id', selectedRole)

    setAssigned(new Set(data?.map(p => p.permission_id)))
  }, [selectedRole])

  useEffect(() => {
    const fetchInitialData = async () => {
      const { data: rolesData } = await supabase.from('roles').select('*')
      const { data: permData } = await supabase.from('permissions').select('*')
      setRoles(rolesData || [])
      setPermissions(permData || [])
    }

    fetchInitialData()
  }, [])

  useEffect(() => {
    if (selectedRole) {
      fetchAssignedPermissions()
    } else {
      setAssigned(new Set())
    }
  }, [selectedRole, fetchAssignedPermissions])

  const handleToggle = async (permissionId: string) => {
    const newSet = new Set(assigned)

    if (assigned.has(permissionId)) {
      await supabase
        .from('role_permissions')
        .delete()
        .match({ role_id: selectedRole, permission_id: permissionId })
      newSet.delete(permissionId)
    } else {
      await supabase
        .from('role_permissions')
        .insert([{ role_id: selectedRole, permission_id: permissionId }])
      newSet.add(permissionId)
    }

    setAssigned(newSet)
  }

  return (
    <div className="space-y-6 max-w-xl mx-auto mt-8">
      <h2 className="text-2xl font-bold">Role-Permission Assignment</h2>

      <Select onValueChange={setSelectedRole}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a role..." />
        </SelectTrigger>
        <SelectContent>
          {roles.map(r => (
            <SelectItem key={r.id} value={r.id}>
              {r.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {selectedRole && (
        <div className="space-y-3 border p-4 rounded-md bg-muted/20">
          <h3 className="text-lg font-semibold mb-1">Permissions</h3>
          {permissions.map(p => (
            <div key={p.id} className="flex items-center gap-3">
              <Checkbox
                checked={assigned.has(p.id)}
                onCheckedChange={() => handleToggle(p.id)}
              />
              <Label>{p.name}</Label>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

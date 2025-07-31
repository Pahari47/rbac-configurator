'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select'

type Role = { id: string; name: string }
type Permission = { id: string; name: string }
type RolePermission = { role_id: string; permission_id: string }

export default function RolePermissionsPage() {
  const [roles, setRoles] = useState<Role[]>([])
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [selectedRole, setSelectedRole] = useState<string>('')
  const [assigned, setAssigned] = useState<Set<string>>(new Set())

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
  }, [selectedRole])

  const fetchAssignedPermissions = async () => {
    const { data } = await supabase
      .from('role_permissions')
      .select('permission_id')
      .eq('role_id', selectedRole)

    setAssigned(new Set(data?.map(p => p.permission_id)))
  }

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
    <div className="space-y-6 max-w-xl">
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
        <div className="space-y-2 border p-4 rounded-md">
          <h3 className="text-lg font-semibold mb-2">Permissions</h3>
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

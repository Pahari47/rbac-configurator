import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { supabase } from '@/lib/supabase'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json()

    const chat = model.startChat({})
    const geminiResp = await chat.sendMessage(
      `Interpret the following RBAC command and return a JSON with 'action', 'role', and 'permission' fields. Only return JSON.\n\nCommand: ${prompt}`
    )

    const geminiJson = geminiResp.response.text().match(/```json([\s\S]*?)```/)?.[1]
    if (!geminiJson) throw new Error('AI response could not be parsed.')

    const { action, role, permission } = JSON.parse(geminiJson.trim())

    if (action !== 'assign_permission') {
      return NextResponse.json({ error: 'Only assign_permission supported for now' }, { status: 400 })
    }

    // 🔍 Find role (case-insensitive)
    const { data: roles, error: roleError } = await supabase
      .from('roles')
      .select('*')
      .ilike('name', role) // case-insensitive match
      .limit(1)

    if (roleError || !roles || roles.length === 0) {
      console.error('❌ Role Fetch Error:', roleError)
      return NextResponse.json({ error: 'Role not found' }, { status: 400 })
    }

    const roleId = roles[0].id

    // 🔍 Find permission
    const { data: perms, error: permError } = await supabase
      .from('permissions')
      .select('*')
      .ilike('name', permission)
      .limit(1)

    if (permError || !perms || perms.length === 0) {
      console.error('❌ Permission Fetch Error:', permError)
      return NextResponse.json({ error: 'Permission not found' }, { status: 400 })
    }

    const permissionId = perms[0].id

    // ✅ Insert into role_permissions table
    const { error: insertError } = await supabase
      .from('role_permissions')
      .insert({ role_id: roleId, permission_id: permissionId })

    if (insertError) {
      console.error('❌ Insert Error:', insertError)
      return NextResponse.json({ error: 'Failed to assign permission' }, { status: 500 })
    }

    return NextResponse.json({ message: `✅ Assigned ${permission} to ${role}` })
  } catch (err: any) {
    console.error('AI Command Handler Error:', err)
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 })
  }
}

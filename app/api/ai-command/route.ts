import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(req: NextRequest) {
  const { prompt } = await req.json()

  if (!prompt) {
    return NextResponse.json({ error: 'Prompt required' }, { status: 400 })
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const result = await model.generateContent(
      `You are an RBAC command parser. Convert the following instruction to strict JSON format only (no explanation).\n\nInstruction: "${prompt}"\n\nReturn only this format:\n{\n  "action": "assign_permission",\n  "permission": "<permission>",\n  "role": "<role>"\n}`
    )

    let jsonRaw = await result.response.text()
    console.log('Gemini Raw Output:', jsonRaw)

    // Clean up markdown/code formatting
    jsonRaw = jsonRaw
      .trim()
      .replace(/^```json/, '')
      .replace(/^```/, '')
      .replace(/```$/, '')
      .trim()

    let parsed: { action: string; permission: string; role: string }

    try {
      parsed = JSON.parse(jsonRaw)
    } catch (err) {
      console.error('JSON Parse Error:', err)
      return NextResponse.json({ error: 'Failed to parse AI output' }, { status: 400 })
    }

    const { action, role: rawRole, permission: rawPermission } = parsed

    // Normalize permission and role
    const permission = rawPermission?.toLowerCase().replace(/\s+/g, ':')
    const role = rawRole?.toLowerCase()

    console.log('Normalized Input:', { action, role, permission })

    if (action !== 'assign_permission') {
      return NextResponse.json({ error: 'Only assign_permission supported for now' }, { status: 400 })
    }

    // Fetch Role
    const { data: roles, error: roleError } = await supabase
      .from('roles')
      .select('*')
      .ilike('name', `%${role}%`)
      .limit(1)

    if (roleError || !roles || roles.length === 0) {
      console.error('Role Fetch Error:', roleError)
      return NextResponse.json({ error: 'Role not found' }, { status: 400 })
    }

    // Fetch Permission
    const { data: perms, error: permError } = await supabase
      .from('permissions')
      .select('*')
      .ilike('name', `%${permission}%`)
      .limit(1)

    if (permError || !perms || perms.length === 0) {
      console.error('Permission Fetch Error:', permError)
      return NextResponse.json({ error: 'Permission not found' }, { status: 400 })
    }

    // Assign Permission to Role
    const { error: insertError } = await supabase.from('role_permissions').insert([
      {
        role_id: roles[0].id,
        permission_id: perms[0].id,
      },
    ])

    if (insertError) {
      console.error('Insert Error:', insertError)
      return NextResponse.json({ error: 'Failed to assign permission' }, { status: 500 })
    }

    return NextResponse.json({ message: `Assigned ${permission} to ${role}` })
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err)
    console.error('AI Command Handler Error:', errorMessage)
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 })
  }
}

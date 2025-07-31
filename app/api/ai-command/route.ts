import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { supabase } from '@/lib/supabase'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

export async function POST(req: NextRequest) {
    const { prompt } = await req.json()

    try {
        const promptText = `
      You are an RBAC assistant. From the given sentence, extract the intent and return a JSON object like:
      {
        "action": "assign_permission", // or "create_permission", "remove_permission"
        "permission": "edit:article",
        "role": "Editor"
      }

      Sentence: "${prompt}"
    `

        const result = await model.generateContent(promptText)
        const text = result.response.text()

        console.log('🔍 Gemini Raw Output:', text)

        const parsed = JSON.parse(text)

        const { action, permission, role } = parsed

        if (action === 'create_permission') {
            await supabase.from('permissions').insert({ name: permission })
            return NextResponse.json({ message: `Permission '${permission}' created.` })
        }

        if (action === 'assign_permission') {
            const { data: roleData } = await supabase.from('roles').select().eq('name', role).single()
            const { data: permData } = await supabase.from('permissions').select().eq('name', permission).single()

            if (!roleData || !permData) {
                return NextResponse.json({ error: 'Role or permission not found' }, { status: 400 })
            }

            await supabase.from('role_permissions').insert({
                role_id: roleData.id,
                permission_id: permData.id,
            })
            return NextResponse.json({ message: `Assigned '${permission}' to '${role}'.` })
        }

        if (action === 'remove_permission') {
            const { data: roleData } = await supabase.from('roles').select().eq('name', role).single()
            const { data: permData } = await supabase.from('permissions').select().eq('name', permission).single()

            if (!roleData || !permData) {
                return NextResponse.json({ error: 'Role or permission not found' }, { status: 400 })
            }

            await supabase
                .from('role_permissions')
                .delete()
                .match({ role_id: roleData.id, permission_id: permData.id })

            return NextResponse.json({ message: `Removed '${permission}' from '${role}'.` })
        }

        return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
    } catch (err) {
        return NextResponse.json({ error: 'Failed to process input' }, { status: 500 })
    }
}

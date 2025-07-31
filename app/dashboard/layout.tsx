import { ReactNode } from 'react'
import NavBar from '@/components/NavBar'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <NavBar />
      <main className="p-4">{children}</main>
    </div>
  )
}

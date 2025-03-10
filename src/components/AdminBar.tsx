'use client'

import React, { useEffect } from 'react'

import { useAuth} from '@/app/_providers/Auth'
import Link from "next/link"


export const AdminBar = ()=> {
  const [show, setShow] = React.useState(false)
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      setShow(true)
    }
  }, [user])

  const isAdmin = user?.role === 'admin';

  if (!isAdmin) return null

  return (
    <div className="flex justify-between">
        <span>
          <h6>Dashboard</h6>
          <small>Admin: {user.name}</small>
          <span>
            <Link href="/admin" appearance="outline" newTab={true} />
            <Link  appearance="destructive" />
          </span>
        </span>
    </div>
  )
}


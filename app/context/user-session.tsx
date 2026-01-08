'use client'

import axios from "axios"
import { useSession } from "next-auth/react"
import { createContext, ReactNode, useEffect, useState } from "react"

type LayoutProps = {
  children: ReactNode
}

type UserContextType = {
  user: any | null
  listUser: any[]
  fetchingListChat: () => Promise<void>
}

export const UserContext = createContext<UserContextType | null>(null)

export default function UserSession({ children }: LayoutProps) {
  const { data: session } = useSession()
  const userFromContext = session?.user

  return (
    <UserContext.Provider value={userFromContext}>
      {children}
    </UserContext.Provider>
  )
}

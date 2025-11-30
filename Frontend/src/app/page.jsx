/* eslint-disable react-hooks/rules-of-hooks */
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import Homepage from "@/components/pages/Homepage"
import ProfilePage from "@/components/pages/ProfilePage"

export default function Home() {
  const router = useRouter();
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) router.push("/login")
    else setLoaded(true)
  }, [router]);

  if (!loaded) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-neutral-950">
      <Homepage />
    </div>
  )
}

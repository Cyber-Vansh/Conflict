/* eslint-disable react-hooks/set-state-in-effect */
"use client"
import { useState, useEffect } from "react"
import Homepage from "@/components/pages/Homepage"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()

  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) router.push("/login");
    else setLoaded(true);
  }, []);

  if (!loaded) return <>loading...</>

  return(
    <Homepage />
  )
}
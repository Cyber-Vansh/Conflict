/* eslint-disable react-hooks/set-state-in-effect */
"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"

import Homepage from "@/components/pages/Homepage"
import ProfilePage from "@/components/pages/ProfilePage"

export default function Home() {
  const router = useRouter();
  const [loaded, setLoaded] = useState(false)



  const homepageRef = useRef(null)
  const profileRef = useRef(null)

  const animatingRef = useRef(false)

  const SCROLL_DURATION = 700

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) router.push("/login")
    else setLoaded(true)
  }, [router]);

  useEffect(() => {
    if (!loaded) return



    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduceMotion) return

    const onWheel = (e) => {

      if (animatingRef.current) return;


      if (e.deltaY > 0) {

        e.preventDefault?.()
        animatingRef.current = true

        profileRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })

        setTimeout(() => {
          animatingRef.current = false;
        }, SCROLL_DURATION)
      }
    };


    let touchStartY = null;
    const onTouchStart = (e) => {
      if (animatingRef.current) return;
      touchStartY = e.touches?.[0]?.clientY ?? null
    };
    const onTouchMove = (e) => {
      if (animatingRef.current || touchStartY == null) return;
      const currentY = e.touches?.[0]?.clientY ?? 0
      const delta = touchStartY - currentY

      if (delta > 8) {
        animatingRef.current = true;
        profileRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
        touchStartY = null;
        setTimeout(() => {
          animatingRef.current = false
        }, SCROLL_DURATION + 60)
      }
    };
    const onTouchEnd = () => {
      touchStartY = null
    };


    const onKeyDown = (e) => {
      if (animatingRef.current) return
      if (["ArrowDown", "PageDown", " "].includes(e.key)) {
        e.preventDefault?.()
        animatingRef.current = true
        profileRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
        setTimeout(() => {
          animatingRef.current = false
        }, SCROLL_DURATION + 60)
      }
    }


    window.addEventListener("wheel", onWheel, { passive: false })
    window.addEventListener("touchstart", onTouchStart, { passive: true })
    window.addEventListener("touchmove", onTouchMove, { passive: false })
    window.addEventListener("touchend", onTouchEnd, { passive: true })
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("wheel", onWheel, { passive: false })
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove, { passive: false })
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [loaded]);

  if (!loaded) return <>loading...</>

  return (
    <div>

      <section ref={homepageRef} style={{ minHeight: "100vh", scrollSnapAlign: "start" }}>
        <Homepage />
      </section>


      <div style={{ height: 24 }} />

      <section ref={profileRef} style={{ minHeight: "100vh", scrollSnapAlign: "start" }}>
        <ProfilePage />
      </section>
    </div>
  )
}

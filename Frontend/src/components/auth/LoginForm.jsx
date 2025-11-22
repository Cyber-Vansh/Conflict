"use client";

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import api from "@/app/api"

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [form, setForm] = useState({
    emailOrUsername: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await api.post("/auth/login", form)

      const token = res?.data?.token;
      if (!token) {
        const msg = res?.data?.message || "No token returned from server"
        throw new Error(msg)
      }

      localStorage.setItem("token", token)

      router.push("/");
    } catch (err) {
      const message =
        err?.response?.data?.message || err?.message || "Something went wrong"
      alert(message)
      console.error("[LoginForm] login error:", err)
    } finally {
      setLoading(false)
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium text-white">Username or Email</label>
        <Input
          type="text"
          name="emailOrUsername"
          value={form.emailOrUsername}
          onChange={handleChange}
          required
          placeholder="your username or email"
          className="bg-zinc-900 border-zinc-800 mt-1 text-white"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-white">Password</label>
        <div className="relative mt-1">
          <Input
            type={showPassword ? "text" : "password"}
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            placeholder="••••••••"
            className="bg-zinc-900 border-zinc-800 text-white"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-2.5 text-zinc-400 hover:text-zinc-200"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-green-600 hover:bg-green-700 hover:cursor-pointer text-white"
      >
        {loading ? "Logging in..." : "Login"}
      </Button>

      <p className="text-sm text-center text-zinc-500 mt-2">
        Don’t have an account?{" "}
        <Link href="/signup" className="text-blue-500 hover:underline">
          Sign up
        </Link>
      </p>
    </form>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export default function SignupForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [form, setForm] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3000/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      localStorage.setItem("token", data.token);

      router.push("/");
      setTimeout(() => {
        setLoading(false);
      }, 800);
      
      console.log("User:", data.user);
    } catch (err) {
      alert(`${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium text-white">Full Name</label>
        <Input
          type="text"
          name="fullName"
          value={form.fullName}
          onChange={handleChange}
          required
          placeholder="your full name"
          className="bg-zinc-900 border-zinc-800 mt-1 text-white"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-white">Username</label>
        <Input
          type="text"
          name="username"
          value={form.username}
          onChange={handleChange}
          required
          placeholder="choose a cool username"
          className="bg-zinc-900 border-zinc-800 mt-1 text-white"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-white">Email</label>
        <Input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
          placeholder="you@example.com"
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
        className="w-full bg-green-600 hover:bg-green-700 text-white"
      >
        {loading ? "Creating account..." : "Sign Up"}
      </Button>

      <p className="text-sm text-center text-zinc-500 mt-2">
        Already have an account?{" "}
        <Link href="/login" className="text-blue-500 hover:underline">
          Login
        </Link>
      </p>
    </form>
  );
}

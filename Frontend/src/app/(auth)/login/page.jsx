"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Swords } from "lucide-react";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-white px-4">
      {/* Background gradient */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-neutral-950 to-neutral-950 pointer-events-none" />

      <Card className="relative z-10 w-full max-w-md bg-neutral-900/50 border-neutral-800 shadow-xl rounded-2xl backdrop-blur-sm">
        <CardHeader className="text-center space-y-3">
          <div className="flex justify-center items-center gap-2">
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full" />
              <Swords className="relative h-8 w-8 text-emerald-500" strokeWidth={2.5} />
            </div>
            <CardTitle className="text-3xl font-bold text-white">CONFLICT</CardTitle>
          </div>
          <p className="text-sm text-neutral-400">Welcome back, warrior</p>
        </CardHeader>

        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Code2 } from "lucide-react";
import SignupForm from "@/components/auth/SignupForm";

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center text-white px-4">
      <Card className="w-full max-w-md bg-zinc-800 border border-zinc-700 shadow-xl rounded-2xl">
        <CardHeader className="text-center space-y-3">
          <div className="flex justify-center items-center gap-2">
            <Code2 className="h-8 w-8 text-green-500" />
            <CardTitle className="text-2xl font-bold text-white">Conflict</CardTitle>
          </div>
          <p className="text-sm text-zinc-400">Join the ultimate coding showdown</p>
        </CardHeader>

        <CardContent>
          <SignupForm />
        </CardContent>
      </Card>
    </div>
  );
}

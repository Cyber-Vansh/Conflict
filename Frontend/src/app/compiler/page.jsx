"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import {
  Play,
  Code2,
  Terminal,
  Clock,
  Cpu,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowLeft,
  Loader2
} from "lucide-react";

export default function Compiler() {
  const router = useRouter();
  const [code, setCode] = useState("print('Hello, World!')");
  const [language, setLanguage] = useState(71);
  const [stdin, setStdin] = useState("");
  const [expectedOutput, setExpectedOutput] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const languages = [
    { id: 54, name: "C (GCC)" },
    { id: 55, name: "C++ (GCC)" },
    { id: 71, name: "Python 3" },
    { id: 62, name: "Java" },
    { id: 63, name: "JavaScript (Node.js)" },
    { id: 68, name: "PHP" },
    { id: 72, name: "Ruby" },
    { id: 60, name: "Go" },
    { id: 51, name: "C# (.NET Core)" },
    { id: 83, name: "Swift" },
    { id: 78, name: "Kotlin" },
    { id: 73, name: "Rust" },
  ];

  const defaultCodeSnippets = {
    54: '#include <stdio.h>\\n\\nint main() {\\n    printf("Hello, World!\\\\n");\\n    return 0;\\n}',
    55: '#include <iostream>\\nusing namespace std;\\n\\nint main() {\\n    cout << "Hello, World!" << endl;\\n    return 0;\\n}',
    71: "print('Hello, World!')",
    62: 'public class Main {\\n    public static void main(String[] args) {\\n        System.out.println("Hello, World!");\\n    }\\n}',
    63: 'console.log("Hello, World!");',
    68: '<?php\\necho "Hello, World!\\\\n";\\n?>',
    72: 'puts "Hello, World!"',
    60: 'package main\\n\\nimport "fmt"\\n\\nfunc main() {\\n    fmt.Println("Hello, World!")\\n}',
    51: 'using System;\\n\\nclass Program {\\n    static void Main() {\\n        Console.WriteLine("Hello, World!");\\n    }\\n}',
    83: 'import Foundation\\n\\nprint("Hello, World!")',
    78: 'fun main() {\\n    println("Hello, World!")\\n}',
    73: 'fn main() {\\n    println!("Hello, World!");\\n}',
  };

  const handleLanguageChange = (newLangId) => {
    const langId = parseInt(newLangId);
    setLanguage(langId);
    setCode(defaultCodeSnippets[langId] || "");
  };

  const handleRunCode = async () => {
    if (!code.trim()) {
      setError("Please enter some code");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("No authentication token found. Please login first.");
      }

      const response = await fetch("http://localhost:3000/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          language_id: language,
          source_code: code,
          stdin: stdin,
          expected_output: expectedOutput,
          cpu_time_limit: "2",
          memory_limit: "128000",
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Authentication failed. Please login again.");
        } else if (response.status === 403) {
          throw new Error("Access denied. Invalid token.");
        } else {
          throw new Error(`Failed to execute code: ${response.statusText}`);
        }
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const normalize = (s = "") => {
    return s
      .replace(/\\r/g, "")
      .split("\\n")
      .map((l) => l.replace(/[ \\t]+$/g, ""))
      .join("\\n")
      .trim();
  };

  const getStatusColor = (statusId) => {
    switch (statusId) {
      case 3:
        return "text-emerald-500";
      case 4:
        return "text-red-500";
      case 5:
        return "text-yellow-500";
      case 6:
        return "text-yellow-500";
      default:
        return "text-neutral-400";
    }
  };

  const getStatusIcon = (statusId) => {
    switch (statusId) {
      case 3:
        return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case 4:
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getDisplayStatus = () => {
    if (!result) return null;

    const rawStdout = result.stdout ?? "";
    const rawExpected = expectedOutput ?? "";
    const normalizedStdout = normalize(rawStdout);
    const normalizedExpected = normalize(rawExpected);

    const serverStatusId = result.status?.id;
    let status = result.status || { id: 0, description: "Unknown" };

    if (serverStatusId && [5, 6].includes(serverStatusId)) {
      status = result.status;
    } else if (rawExpected.trim() !== "") {
      if (normalizedStdout !== normalizedExpected) {
        status = { id: 4, description: "Wrong Answer" };
      } else {
        status = { id: 3, description: "Accepted" };
      }
    }

    return status;
  };

  const displayStatus = getDisplayStatus();

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-neutral-950 to-neutral-950 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push("/")}
            className="text-neutral-400 hover:text-white mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
              <Code2 className="w-6 h-6 text-emerald-500" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Code Compiler</h1>
              <p className="text-neutral-400">Write, test, and execute your code</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Card className="bg-neutral-900/50 border-neutral-800 p-4">
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Programming Language
              </label>
              <Select value={language.toString()} onValueChange={handleLanguageChange}>
                <SelectTrigger className="w-full bg-neutral-800 border-neutral-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-neutral-800 border-neutral-700 text-white">
                  {languages.map((lang) => (
                    <SelectItem key={lang.id} value={lang.id.toString()}>
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Card>

            <Card className="bg-neutral-900/50 border-neutral-800 p-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-neutral-300">Source Code</label>
                <Code2 className="w-4 h-4 text-neutral-500" />
              </div>
              <Textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-[400px] bg-neutral-800 border-neutral-700 font-mono text-sm text-white resize-none focus:border-emerald-500"
                placeholder="Write your code here..."
              />
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-neutral-900/50 border-neutral-800 p-4">
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Standard Input
                </label>
                <Textarea
                  value={stdin}
                  onChange={(e) => setStdin(e.target.value)}
                  className="w-full h-[120px] bg-neutral-800 border-neutral-700 font-mono text-sm text-white resize-none focus:border-emerald-500"
                  placeholder="Input for your program..."
                />
              </Card>

              <Card className="bg-neutral-900/50 border-neutral-800 p-4">
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Expected Output <span className="text-neutral-500">(Optional)</span>
                </label>
                <Textarea
                  value={expectedOutput}
                  onChange={(e) => setExpectedOutput(e.target.value)}
                  className="w-full h-[120px] bg-neutral-800 border-neutral-700 font-mono text-sm text-white resize-none focus:border-emerald-500"
                  placeholder="Expected output..."
                />
              </Card>
            </div>

            <Button
              onClick={handleRunCode}
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Executing...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Run Code
                </>
              )}
            </Button>

            {error && (
              <Card className="bg-red-500/10 border-red-500/30 p-4">
                <div className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-400 mt-0.5" />
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              </Card>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Terminal className="w-5 h-5 text-emerald-500" />
              <h2 className="text-xl font-bold text-white">Execution Results</h2>
            </div>

            {result ? (
              <div className="space-y-4">
                <Card className="bg-neutral-900/50 border-neutral-800 p-4">
                  <h3 className="text-sm font-medium text-neutral-400 mb-3">Verdict</h3>
                  <div className="flex items-center gap-3">
                    {getStatusIcon(displayStatus?.id)}
                    <p className={`text-lg font-semibold ${getStatusColor(displayStatus?.id)}`}>
                      {displayStatus?.description}
                    </p>
                  </div>
                </Card>

                <div className="grid grid-cols-3 gap-3">
                  <Card className="bg-neutral-900/50 border-neutral-800 p-4 text-center">
                    <Clock className="w-5 h-5 text-emerald-500 mx-auto mb-2" />
                    <p className="text-xs text-neutral-400 mb-1">Time</p>
                    <p className="font-semibold text-white">{result.time || "0.00"}s</p>
                  </Card>
                  <Card className="bg-neutral-900/50 border-neutral-800 p-4 text-center">
                    <Cpu className="w-5 h-5 text-emerald-500 mx-auto mb-2" />
                    <p className="text-xs text-neutral-400 mb-1">Memory</p>
                    <p className="font-semibold text-white">{result.memory || "0"} KB</p>
                  </Card>
                  <Card className="bg-neutral-900/50 border-neutral-800 p-4 text-center">
                    <Terminal className="w-5 h-5 text-emerald-500 mx-auto mb-2" />
                    <p className="text-xs text-neutral-400 mb-1">Status</p>
                    <p className="font-semibold text-white text-xs">{result.status?.description || "N/A"}</p>
                  </Card>
                </div>

                <Card className="bg-neutral-900/50 border-neutral-800 p-4">
                  <h3 className="text-sm font-medium text-neutral-400 mb-3">Program Output</h3>
                  <pre className="whitespace-pre-wrap font-mono text-sm bg-neutral-800 p-4 rounded-lg text-emerald-400 max-h-[200px] overflow-y-auto border border-neutral-700">
                    {result.stdout || "(No output)"}
                  </pre>
                </Card>

                {expectedOutput.trim() !== "" && (
                  <Card className="bg-neutral-900/50 border-neutral-800 p-4">
                    <h3 className="text-sm font-medium text-neutral-400 mb-3">Expected Output</h3>
                    <pre className="whitespace-pre-wrap font-mono text-sm bg-neutral-800 p-4 rounded-lg text-neutral-300 max-h-[200px] overflow-y-auto border border-neutral-700">
                      {expectedOutput}
                    </pre>
                  </Card>
                )}

                {result.stderr && (
                  <Card className="bg-red-500/10 border-red-500/30 p-4">
                    <h3 className="text-sm font-medium text-red-400 mb-3">Runtime Error</h3>
                    <pre className="whitespace-pre-wrap font-mono text-sm bg-red-900/20 p-4 rounded-lg text-red-300 max-h-[200px] overflow-y-auto border border-red-500/30">
                      {result.stderr}
                    </pre>
                  </Card>
                )}

                {result.compile_output && (
                  <Card className="bg-yellow-500/10 border-yellow-500/30 p-4">
                    <h3 className="text-sm font-medium text-yellow-400 mb-3">Compilation Output</h3>
                    <pre className="whitespace-pre-wrap font-mono text-sm bg-yellow-900/20 p-4 rounded-lg text-yellow-300 max-h-[200px] overflow-y-auto border border-yellow-500/30">
                      {result.compile_output}
                    </pre>
                  </Card>
                )}
              </div>
            ) : (
              <Card className="bg-neutral-900/50 border-neutral-800 p-12 text-center">
                <Terminal className="w-16 h-16 text-neutral-700 mx-auto mb-4" />
                <p className="text-neutral-500">
                  {loading ? "Executing your program..." : "Run your code to see results here"}
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
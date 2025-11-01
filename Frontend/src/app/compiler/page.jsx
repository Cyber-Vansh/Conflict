"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function Compiler() {
  const [code, setCode] = useState("print(\"Hello, World!\")");
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
    54: `#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\\\n");\n    return 0;\n}`,
    55: `#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!" << endl;\n    return 0;\n}`,
    71: `print('Hello, World!')`,
    62: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}`,
    63: `console.log("Hello, World!");`,
    68: `<?php\necho "Hello, World!\\\\n";\n?>`,
    72: `puts "Hello, World!"`,
    60: `package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, World!")\n}`,
    51: `using System;\n\nclass Program {\n    static void Main() {\n        Console.WriteLine("Hello, World!");\n    }\n}`,
    83: `import Foundation\n\nprint("Hello, World!")`,
    78: `fun main() {\n    println("Hello, World!")\n}`,
    73: `fn main() {\n    println!("Hello, World!");\n}`,
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
      .replace(/\r/g, "")
      .split("\n")
      .map((l) => l.replace(/[ \t]+$/g, ""))
      .join("\n")
      .trim();
  };

  const getStatusColor = (statusId) => {
    switch (statusId) {
      case 3:
        return "text-green-500";
      case 4:
        return "text-red-500";
      case 5:
        return "text-yellow-400";
      case 6:
        return "text-yellow-400";
      default:
        return "text-yellow-400";
    }
  };

  const getDisplayStatus = () => {
    if (!result) return null;

    const rawStdout = result.stdout ?? "";
    const rawExpected = expectedOutput ?? "";
    const normalizedStdout = normalize(rawStdout);
    const normalizedExpected = normalize(rawExpected);

    const serverStatusId = result.status?.id;
    let displayStatus = result.status || { id: 0, description: "Unknown" };

    if (serverStatusId && [5, 6].includes(serverStatusId)) {
      displayStatus = result.status;
    } else if (rawExpected.trim() !== "") {
      if (normalizedStdout !== normalizedExpected) {
        displayStatus = { id: 4, description: "Wrong Answer" };
      } else {
        displayStatus = { id: 3, description: "Accepted" };
      }
    }

    return displayStatus;
  };

  const displayStatus = getDisplayStatus();

  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div>
              <Label className="mb-2 text-xl font-semibold">Language</Label>
              <Select value={language.toString()} onValueChange={handleLanguageChange}>
                <SelectTrigger className="w-full bg-zinc-900 border-zinc-800 focus:ring-2 focus:ring-green-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                  {languages.map((lang) => (
                    <SelectItem key={lang.id} value={lang.id.toString()}>
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="mb-2 text-xl font-semibold">Source Code</Label>
              <Textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-[370px] bg-zinc-900 border-zinc-800 font-mono text-sm focus:ring-2 focus:ring-green-500 resize-none"
                placeholder="Write your code here..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="mb-2 text-xl font-semibold">Standard Input</Label>
                <Textarea
                  value={stdin}
                  onChange={(e) => setStdin(e.target.value)}
                  className="w-full h-[150px] bg-zinc-900 border-zinc-800 font-mono text-sm focus:ring-2 focus:ring-green-500 resize-none"
                  placeholder="Input for your program..."
                />
              </div>
              <div>
                <Label className="mb-2 text-xl font-semibold">Expected Output (Optional)</Label>
                <Textarea
                  value={expectedOutput}
                  onChange={(e) => setExpectedOutput(e.target.value)}
                  className="w-full h-[150px] bg-zinc-900 border-zinc-800 font-mono text-sm focus:ring-2 focus:ring-green-500 resize-none"
                  placeholder="Expected output for validation..."
                />
              </div>
            </div>

            <Button
              onClick={handleRunCode}
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 font-semibold py-3 px-6"
            >
              {loading ? "Running..." : "Run Code"}
            </Button>

            {error && (
              <div className="p-3 bg-red-900 border border-red-700 rounded-md">
                <p className="text-red-200">{error}</p>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Execution</h2>

            {result ? (
              <div className="space-y-4">
                <div className="p-4 bg-zinc-900 rounded-md border border-zinc-800">
                  <h3 className="font-medium mb-2">Verdict</h3>
                  <p className={`font-semibold ${getStatusColor(displayStatus?.id)}`}>
                    {displayStatus?.description}
                  </p>
                </div>

                <div className="p-4 bg-zinc-900 rounded-md border border-zinc-800">
                  <h3 className="font-medium mb-2">Program output</h3>
                  <pre className="whitespace-pre-wrap font-mono text-sm bg-black p-3 rounded-md text-white max-h-[200px] overflow-y-auto">
                    {result.stdout || "(No output)"}
                  </pre>
                </div>

                {expectedOutput.trim() !== "" && (
                  <div className="p-4 bg-zinc-900 rounded-md border border-zinc-800">
                    <h3 className="font-medium mb-2">Expected output</h3>
                    <pre className="whitespace-pre-wrap font-mono text-sm bg-black p-3 rounded-md text-white max-h-[200px] overflow-y-auto">
                      {expectedOutput}
                    </pre>
                  </div>
                )}

                {result.stderr && (
                  <div className="p-4 bg-red-900 rounded-md">
                    <h3 className="font-medium mb-2 text-red-300">Runtime error</h3>
                    <pre className="whitespace-pre-wrap font-mono text-sm bg-red-900 p-3 rounded-md text-red-200 max-h-[200px] overflow-y-auto">
                      {result.stderr}
                    </pre>
                  </div>
                )}

                {result.compile_output && (
                  <div className="p-4 bg-yellow-900 rounded-md">
                    <h3 className="font-medium mb-2 text-yellow-300">Compilation output</h3>
                    <pre className="whitespace-pre-wrap font-mono text-sm bg-yellow-900 p-3 rounded-md text-yellow-200 max-h-[200px] overflow-y-auto">
                      {result.compile_output}
                    </pre>
                  </div>
                )}

                <div className="grid grid-cols-3 gap-4">
                  <div className="p-3 bg-zinc-900 rounded-md text-center border border-zinc-800">
                    <p className="text-sm text-zinc-400">Time</p>
                    <p className="font-semibold">{result.time || "0.00"}s</p>
                  </div>
                  <div className="p-3 bg-zinc-900 rounded-md text-center border border-zinc-800">
                    <p className="text-sm text-zinc-400">Memory</p>
                    <p className="font-semibold">{result.memory || "0"} KB</p>
                  </div>
                  <div className="p-3 bg-zinc-900 rounded-md text-center border border-zinc-800">
                    <p className="text-sm text-zinc-400">Server status</p>
                    <p className="font-semibold">{result.status?.description || "N/A"}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 bg-zinc-900 rounded-md text-center text-zinc-400">
                {loading ? "Executing your program..." : "Run your code to see results here"}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
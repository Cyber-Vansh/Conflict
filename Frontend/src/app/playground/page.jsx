"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Editor from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    Play,
    ArrowLeft,
    Loader2,
    Code2,
    Terminal,
} from "lucide-react";
import api from "@/app/api";
import { toast } from "sonner";

export default function PlaygroundPage() {
    const router = useRouter();

    const languages = [
        { id: 54, name: "C", monacoLanguage: "c" },
        { id: 55, name: "C++", monacoLanguage: "cpp" },
        { id: 71, name: "Python", monacoLanguage: "python" },
        { id: 62, name: "Java", monacoLanguage: "java" },
        { id: 63, name: "JavaScript", monacoLanguage: "javascript" },
        { id: 60, name: "Go", monacoLanguage: "go" },
        { id: 73, name: "Rust", monacoLanguage: "rust" },
    ];

    const codeTemplates = {
        54: '#include <stdio.h>\n\nint main() {\n    // Your code here\n    printf("Hello World!");\n    return 0;\n}',
        55: '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Your code here\n    cout << "Hello World!";\n    return 0;\n}',
        71: '# Write your code here\n\nprint("Hello World!")',
        62: 'public class Main {\n    public static void main(String[] args) {\n        // Your code here\n        System.out.println("Hello World!");\n    }\n}',
        63: '// Write your code here\n\nconsole.log("Hello World!");',
        60: 'package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello World!")\n}',
        73: 'fn main() {\n    println!("Hello World!");\n}',
    };

    const [language, setLanguage] = useState(71);
    const [code, setCode] = useState(codeTemplates[71]);
    const [output, setOutput] = useState(null);
    const [loading, setLoading] = useState(false);
    const [customInput, setCustomInput] = useState("");

    const handleLanguageChange = (newLangId) => {
        const langId = parseInt(newLangId);
        setLanguage(langId);
        const currentTemplate = codeTemplates[language];
        if (!code.trim() || code === currentTemplate) {
            setCode(codeTemplates[langId] || "");
        }
    };

    const handleRunCode = async () => {
        if (!code.trim()) {
            toast.warning("Please write some code first");
            return;
        }

        setLoading(true);
        setOutput(null);

        try {
            const token = localStorage.getItem("token");
            const response = await api.post("/run", {
                language_id: language,
                source_code: code,
                stdin: customInput,
                expected_output: "",
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setOutput(response.data.stdout || response.data.stderr || "No output");
        } catch (error) {
            console.error("Error running code:", error);
            setOutput(error.response?.data?.message || error.message || "Failed to run code");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen bg-neutral-950 text-white flex flex-col overflow-hidden">
            <header className="relative z-10 border-b border-neutral-800 bg-neutral-900/50 backdrop-blur-sm">
                <div className="px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" size="sm" onClick={() => router.push("/")} className="text-neutral-400 hover:text-white">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back
                            </Button>
                            <div className="h-8 w-px bg-neutral-800" />
                            <h1 className="text-lg font-bold text-white flex items-center gap-2">
                                <Code2 className="w-5 h-5 text-emerald-500" />
                                Playground
                            </h1>
                        </div>

                        <div className="flex items-center gap-4">
                            <Select value={language.toString()} onValueChange={handleLanguageChange}>
                                <SelectTrigger className="w-48 bg-neutral-900 border-neutral-700">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-neutral-900 border-neutral-700">
                                    {languages.map((lang) => (
                                        <SelectItem key={lang.id} value={lang.id.toString()}>
                                            {lang.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Button onClick={handleRunCode} disabled={loading} className="bg-emerald-600 hover:bg-emerald-500">
                                {loading ? (
                                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Running...</>
                                ) : (
                                    <><Play className="w-4 h-4 mr-2" /> Run</>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-0 overflow-hidden">
                <div className="lg:col-span-2 border-r border-neutral-800 flex flex-col">
                    <div className="flex-1 overflow-hidden">
                        <Editor
                            height="100%"
                            language={languages.find(l => l.id === language)?.monacoLanguage || "python"}
                            value={code}
                            onChange={(value) => setCode(value || "")}
                            theme="vs-dark"
                            options={{
                                minimap: { enabled: false },
                                fontSize: 14,
                                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                                lineNumbers: "on",
                                scrollBeyondLastLine: false,
                                automaticLayout: true,
                                tabSize: 4,
                                wordWrap: "on",
                                padding: { top: 16, bottom: 16 },
                            }}
                        />
                    </div>
                </div>

                <div className="lg:col-span-1 bg-neutral-900/30 flex flex-col overflow-hidden">
                    <div className="h-1/2 border-b border-neutral-800 flex flex-col">
                        <div className="p-4 border-b border-neutral-800 bg-neutral-900/50">
                            <h3 className="text-sm font-medium text-neutral-400 flex items-center gap-2">
                                <Terminal className="w-4 h-4" /> Input
                            </h3>
                        </div>
                        <div className="flex-1 p-4">
                            <textarea
                                value={customInput}
                                onChange={(e) => setCustomInput(e.target.value)}
                                placeholder="Enter input for your program here..."
                                className="w-full h-full bg-transparent border-0 resize-none focus:outline-none font-mono text-sm text-neutral-300 placeholder:text-neutral-600"
                            />
                        </div>
                    </div>

                    <div className="h-1/2 flex flex-col">
                        <div className="p-4 border-b border-neutral-800 bg-neutral-900/50">
                            <h3 className="text-sm font-medium text-neutral-400 flex items-center gap-2">
                                <Terminal className="w-4 h-4" /> Output
                            </h3>
                        </div>
                        <div className="flex-1 p-4 overflow-auto bg-neutral-950">
                            {output !== null ? (
                                <pre className="font-mono text-sm text-white whitespace-pre-wrap">{output}</pre>
                            ) : (
                                <div className="text-neutral-600 text-sm italic">Run code to see output...</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

"use client";

import { getSocket, disconnectSocket } from "../../lib/socket";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Editor from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Play,
  Send,
  ArrowLeft,
  Clock,
  Users,
  Trophy,
  CheckCircle2,
  XCircle,
  Loader2,
  Code2,
  Terminal,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import api from "@/app/api";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

export default function BattlePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const battleId = searchParams.get("battleId");

  const [battle, setBattle] = useState(null);
  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState(71);
  const [output, setOutput] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [showTestCases, setShowTestCases] = useState(true);
  const [testResults, setTestResults] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [pollingSubmissions, setPollingSubmissions] = useState(false);
  const [activeTab, setActiveTab] = useState("tests");
  const [customInput, setCustomInput] = useState("");
  const [customOutput, setCustomOutput] = useState(null);
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);

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
    54: '#include <stdio.h>\n\nint main() {\n    // Your code here\n    return 0;\n}',
    55: '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Your code here\n    return 0;\n}',
    71: '# Write your code here\n\ndef solution():\n    pass\n\nif __name__ == "__main__":\n    solution()',
    62: 'public class Main {\n    public static void main(String[] args) {\n        // Your code here\n    }\n}',
    63: '// Write your code here\n\nfunction solution() {\n    \n}\n\nsolution();',
    60: 'package main\n\nimport "fmt"\n\nfunc main() {\n    // Your code here\n}',
    73: 'fn main() {\n    // Your code here\n}',
  };

  useEffect(() => {
    if (!battleId) {
      router.push("/");
      return;
    }
    fetchBattle();
  }, [battleId]);

  useEffect(() => {
    if (battle && battle.endTime) {
      const interval = setInterval(() => {
        const now = new Date();
        const end = new Date(battle.endTime);
        const diff = Math.max(0, Math.floor((end - now) / 1000));
        setTimeRemaining(diff);

        if (diff === 0) {
          clearInterval(interval);
          setTimeout(() => router.push(`/battle/${battleId}/result`), 2000);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [battle]);

  const fetchBattle = async () => {
    try {
      const response = await api.get(`/battles/${battleId}`);
      const battleData = response.data.data;
      setBattle(battleData);

      if (battleData.problem && !problem) {
        setProblem(battleData.problem);

        const savedCode = localStorage.getItem(`code_${battleId}_${battleData.problem.id}`);
        if (savedCode) {
          setCode(savedCode);
        } else {
          setCode(codeTemplates[language] || "");
        }
      }
    } catch (error) {
      console.error("Error fetching battle:", error);
      if (error.response && (error.response.status === 404 || error.response.status === 403)) {
        toast.error("Failed to load battle");
        router.push("/");
      }
    }
  };

  useEffect(() => {
    fetchBattle();

    const socket = getSocket();

    if (battleId) {
      socket.emit("join_battle", battleId);

      socket.on("battle:update", (data) => {
        console.log("Battle update received:", data);
        if (data.type === "participant_completed" && data.userId === currentUser?.id) {
          router.push(`/battle/${battleId}/result`);
        } else if (data.type === "ended") {
          router.push(`/battle/${battleId}/result`);
        } else {
          fetchBattle();
        }
      });

      socket.on("submission:processed", (data) => {
        console.log("Submission processed:", data);
        fetchBattle();
      });
    }

    return () => {
      if (battleId) {
        socket.emit("leave_battle", battleId);
        socket.off("battle:update");
        socket.off("submission:processed");
      }
    };
  }, [battleId]);

  const handleLanguageChange = (newLangId) => {
    const langId = parseInt(newLangId);
    setLanguage(langId);
    if (code === codeTemplates[language] || !code.trim()) {
      setCode(codeTemplates[langId] || "");
    }
  };

  useEffect(() => {
    if (code && problem && battleId) {
      localStorage.setItem(`code_${battleId}_${problem.id}`, code);
    }
  }, [code, problem, battleId]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "EASY": return "text-emerald-400";
      case "MEDIUM": return "text-yellow-400";
      case "HARD": return "text-red-400";
      default: return "text-neutral-400";
    }
  };

  const handleRunCode = async () => {
    if (!code.trim()) {
      toast.warning("Please write some code first");
      return;
    }

    setLoading(true);
    setOutput(null);
    setTestResults([]);

    try {
      const token = localStorage.getItem("token");

      console.log("Problem data:", problem);
      console.log("All test cases:", problem.testCases);

      if (customInput.trim()) {
        console.log("Using custom input");
        const response = await api.post("/run", {
          language_id: language,
          source_code: code,
          stdin: customInput,
          expected_output: "",
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });

        console.log("Custom input response:", response.data);

        setCustomOutput(response.data.stdout || response.data.stderr || "");
        setTestResults([]);
      } else {
        setCustomOutput(null);
        let testCases = problem.testCases?.filter(tc => tc.isSample) || [];

        if (testCases.length === 0) {
          testCases = problem.testCases?.slice(0, 3) || [];
        }

        console.log("Running code with test cases:", testCases.length);
        console.log("Test cases:", testCases);

        if (testCases.length === 0) {
          toast.info("No test cases available for this problem. Please use custom input.");
          setLoading(false);
          return;
        }

        const results = [];

        for (const testCase of testCases) {
          console.log("Testing case:", testCase);
          const response = await api.post("/run", {
            language_id: language,
            source_code: code,
            stdin: testCase.input,
            expected_output: testCase.output,
          }, {
            headers: { Authorization: `Bearer ${token}` }
          });

          console.log("Run response:", response.data);

          results.push({
            input: testCase.input,
            expectedOutput: testCase.output,
            actualOutput: response.data.stdout || response.data.stderr || "",
            passed: response.data.status?.id === 3,
            time: response.data.time,
            memory: response.data.memory,
          });
        }

        setTestResults(results);
      }
    } catch (error) {
      console.error("Error running code:", error);
      console.error("Error details:", error.response);
      setOutput({ error: error.response?.data?.message || error.message || "Failed to run code" });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!code.trim()) {
      alert("Please write some code first");
      return;
    }

    setSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));

      console.log("=== SUBMITTING CODE ===");
      console.log("User:", user);
      console.log("Problem ID:", problem.id);
      console.log("Battle ID:", battle.id);
      console.log("Language ID:", language);

      const response = await api.post("/submissions", {
        problemId: problem.id,
        battleId: battle.id,
        code: code,
        languageId: language,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log("Submission response:", response.data);
      console.log("Submission full response:", response);

      toast.success("Submission successful! Your code is being evaluated.");
      setActiveTab("submissions");
      setPollingSubmissions(true);

      setTimeout(() => {
        console.log("Fetching submissions after submit...");
        fetchSubmissions();
      }, 1000);
    } catch (error) {
      console.error("Error submitting code:", error);
      console.error("Error response:", error.response);
      toast.error(error.response?.data?.message || "Failed to submit code");
    } finally {
      setSubmitting(false);
    }
  };

  const fetchSubmissions = async () => {
    try {
      let userId = JSON.parse(localStorage.getItem("user"))?.id;

      if (!userId) {
        const token = localStorage.getItem("token");
        if (token) {
          try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            userId = payload.id || payload.userId || payload.sub;
            console.log("Extracted user ID from token:", userId);
          } catch (err) {
            console.error("Failed to decode token:", err);
          }
        }
      }

      if (!userId || !problem?.id || !battle?.id) {
        console.log("Missing data for fetching submissions:", { userId, problemId: problem?.id, battleId: battle?.id });
        return;
      }

      const token = localStorage.getItem("token");
      console.log("=== FETCHING SUBMISSIONS ===");
      console.log("User ID:", userId);
      console.log("Problem ID:", problem.id);
      console.log("Battle ID:", battle.id);
      console.log("URL:", `/submissions/user/${userId}?problemId=${problem.id}`);

      const response = await api.get(`/submissions/user/${userId}?problemId=${problem.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log("Fetched submissions response:", response.data);
      console.log("Full response:", response);

      let allSubmissions = [];
      if (response.data.data?.submissions) {
        allSubmissions = response.data.data.submissions;
      } else if (Array.isArray(response.data.data)) {
        allSubmissions = response.data.data;
      } else if (Array.isArray(response.data.submissions)) {
        allSubmissions = response.data.submissions;
      } else if (Array.isArray(response.data)) {
        allSubmissions = response.data;
      }

      console.log("All submissions:", allSubmissions);
      console.log("All submissions length:", allSubmissions.length);

      const battleSubmissions = allSubmissions.filter(sub => {
        console.log("Checking submission:", sub, "battleId:", sub.battleId, "match:", sub.battleId === battle.id);
        return sub.battleId === battle.id || sub.battleId === parseInt(battle.id);
      });
      console.log("Battle submissions after filter:", battleSubmissions);
      console.log("Battle submissions count:", battleSubmissions.length);

      setSubmissions(battleSubmissions);

      const hasPending = battleSubmissions.some(sub =>
        sub.status === "PENDING" || sub.status === "PROCESSING" || !sub.status
      );

      console.log("Has pending submissions:", hasPending);
      setPollingSubmissions(hasPending);
    } catch (error) {
      console.error("Error fetching submissions:", error);
      console.error("Error response:", error.response);
    }
  };

  useEffect(() => {
    if (problem && battle) {
      fetchSubmissions();
    }
  }, [problem, battle]);

  useEffect(() => {
    if (pollingSubmissions) {
      const interval = setInterval(() => {
        fetchSubmissions();

        const allEvaluated = submissions.every(sub =>
          sub.status && sub.status !== "PENDING" && sub.status !== "PROCESSING"
        );

        if (allEvaluated) {
          setPollingSubmissions(false);
        }
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [pollingSubmissions, submissions]);

  if (!battle || !problem) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
      </div>
    );
  }

  const participants = battle.participants || [];
  const sortedParticipants = [...participants].sort((a, b) => b.score - a.score);

  return (
    <div className="h-screen bg-neutral-950 text-white flex flex-col overflow-hidden">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/10 via-neutral-950 to-neutral-950 pointer-events-none" />

      <header className="relative z-10 border-b border-neutral-800 bg-neutral-900/50 backdrop-blur-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowLeaveDialog(true)}
                className="text-neutral-400 hover:text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Leave
              </Button>

              <div className="h-8 w-px bg-neutral-800" />

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                  <Trophy className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm font-medium text-emerald-400">{battle.type}</span>
                  <span className="text-neutral-500">•</span>
                  <span className="text-sm text-neutral-400">{battle.mode}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-4">
                {sortedParticipants.slice(0, 3).map((p, idx) => (
                  <div key={p.id} className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${idx === 0 ? 'bg-emerald-500' : 'bg-neutral-600'}`} />
                    <span className="text-sm text-neutral-400">{p.user?.username}</span>
                    <span className="text-sm font-medium text-white">{p.score}</span>
                  </div>
                ))}
              </div>

              <div className="h-8 w-px bg-neutral-800" />

              <div className="flex items-center gap-3 px-4 py-2 bg-neutral-800/50 rounded-lg border border-neutral-700">
                <Clock className={`w-5 h-5 ${timeRemaining < 60 ? 'text-red-400' : 'text-emerald-400'} ${timeRemaining < 60 ? 'animate-pulse' : ''}`} />
                <span className={`text-lg font-mono font-bold ${timeRemaining < 60 ? 'text-red-400' : 'text-white'}`}>
                  {formatTime(timeRemaining)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10 flex-1 flex overflow-hidden">
        <div className="flex-1 grid grid-cols-12 gap-0 overflow-hidden">
          <div className="col-span-3 border-r border-neutral-800 overflow-y-auto">
            <div className="p-6">
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <h1 className="text-2xl font-bold text-white">{problem.title}</h1>
                  <span className={`px-2 py-1 text-xs font-medium rounded ${getDifficultyColor(problem.difficulty)} bg-current/10`}>
                    {problem.difficulty}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-neutral-400">
                  <Code2 className="w-4 h-4" />
                  <span>Problem #{problem.id}</span>
                </div>
              </div>

              <Card className="bg-neutral-900/50 border-neutral-800 p-6 mb-6">
                <h3 className="text-lg font-semibold mb-3 text-white">Description</h3>
                <p className="text-neutral-300 text-sm leading-relaxed whitespace-pre-wrap">
                  {problem.description}
                </p>
              </Card>

              <Card className="bg-neutral-900/50 border-neutral-800 p-6">
                <button
                  onClick={() => setShowTestCases(!showTestCases)}
                  className="flex items-center justify-between w-full mb-4"
                >
                  <h3 className="text-lg font-semibold text-white">Example Test Cases</h3>
                  {showTestCases ? (
                    <ChevronUp className="w-5 h-5 text-neutral-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-neutral-400" />
                  )}
                </button>

                {showTestCases && problem.testCases?.filter(tc => tc.isSample).map((tc, idx) => (
                  <div key={tc.id} className="mb-4 last:mb-0">
                    <div className="text-sm font-medium text-emerald-400 mb-2">
                      Example {idx + 1}
                    </div>
                    <div className="space-y-2">
                      <div>
                        <div className="text-xs text-neutral-500 mb-1">Input:</div>
                        <code className="block bg-neutral-950 p-2 rounded text-xs font-mono text-neutral-300">
                          {tc.input}
                        </code>
                      </div>
                      <div>
                        <div className="text-xs text-neutral-500 mb-1">Output:</div>
                        <code className="block bg-neutral-950 p-2 rounded text-xs font-mono text-neutral-300">
                          {tc.output}
                        </code>
                      </div>
                    </div>
                  </div>
                ))}
              </Card>
            </div>
          </div>

          <div className="col-span-6 border-r border-neutral-800 flex flex-col">
            <div className="border-b border-neutral-800 p-4 bg-neutral-900/30">
              <div className="flex items-center justify-between">
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

                <div className="flex items-center gap-2">
                  <Button
                    onClick={handleRunCode}
                    disabled={loading || submitting}
                    className="bg-blue-600 hover:bg-blue-500"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Running...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Run
                      </>
                    )}
                  </Button>

                  <Button
                    onClick={handleSubmit}
                    disabled={loading || submitting}
                    className="bg-emerald-600 hover:bg-emerald-500"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Submit
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>

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


          <div className="col-span-3 bg-neutral-900/30 flex flex-col">
            <div className="border-b border-neutral-800 p-4">
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab("tests")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === "tests"
                    ? "bg-emerald-600 text-white"
                    : "bg-neutral-800 text-neutral-400 hover:text-white"
                    }`}
                >
                  <Terminal className="w-4 h-4 inline mr-2" />
                  Test Results
                </button>
                <button
                  onClick={() => setActiveTab("submissions")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === "submissions"
                    ? "bg-emerald-600 text-white"
                    : "bg-neutral-800 text-neutral-400 hover:text-white"
                    }`}
                >
                  <Clock className="w-4 h-4 inline mr-2" />
                  Submissions ({submissions.length})
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {activeTab === "tests" ? (
                <>
                  {customOutput !== null ? (
                    <Card className="p-4 border border-neutral-800 bg-neutral-900/50">
                      <div className="mb-4">
                        <div className="text-sm font-medium text-neutral-400 mb-2">Custom Input</div>
                        <code className="block bg-neutral-950 p-3 rounded text-xs font-mono text-neutral-300 whitespace-pre-wrap">
                          {customInput}
                        </code>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-neutral-400 mb-2">Output</div>
                        <code className="block bg-neutral-950 p-3 rounded text-xs font-mono text-white whitespace-pre-wrap">
                          {customOutput}
                        </code>
                      </div>
                    </Card>
                  ) : testResults.length > 0 ? (
                    <div className="space-y-3">
                      {testResults.map((result, idx) => (
                        <Card
                          key={idx}
                          className={`p-4 border-2 ${result.passed
                            ? "bg-emerald-500/10 border-emerald-500/30"
                            : "bg-red-500/10 border-red-500/30"
                            }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">Test Case {idx + 1}</span>
                            {result.passed ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                            ) : (
                              <XCircle className="w-5 h-5 text-red-400" />
                            )}
                          </div>

                          {result.time && (
                            <div className="text-xs text-neutral-400 mb-2">
                              Time: {result.time}s | Memory: {result.memory}KB
                            </div>
                          )}

                          {!result.passed && (
                            <div className="space-y-2 text-xs">
                              <div>
                                <div className="text-neutral-500">Expected:</div>
                                <code className="block bg-neutral-950 p-2 rounded mt-1 text-neutral-300">
                                  {result.expectedOutput}
                                </code>
                              </div>
                              <div>
                                <div className="text-neutral-500">Got:</div>
                                <code className="block bg-neutral-950 p-2 rounded mt-1 text-red-400">
                                  {result.actualOutput}
                                </code>
                              </div>
                            </div>
                          )}
                        </Card>
                      ))}
                    </div>
                  ) : output?.error ? (
                    <Card className="bg-red-500/10 border-red-500/30 p-4">
                      <div className="flex items-start gap-2">
                        <XCircle className="w-5 h-5 text-red-400 mt-0.5" />
                        <div>
                          <div className="font-medium text-red-400 mb-1">Error</div>
                          <pre className="text-xs text-neutral-300 whitespace-pre-wrap">
                            {output.error}
                          </pre>
                        </div>
                      </div>
                    </Card>
                  ) : (
                    <div className="text-center py-12 text-neutral-500">
                      <Terminal className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>Run your code to see results</p>
                    </div>
                  )}
                </>
              ) : (
                <>
                  {submissions.length > 0 ? (
                    <div className="space-y-3">
                      {submissions.map((submission, idx) => (
                        <Card
                          key={submission.id}
                          className={`p-4 border ${submission.status === "ACCEPTED"
                            ? "bg-emerald-500/10 border-emerald-500/30"
                            : submission.status === "PENDING" || submission.status === "PROCESSING"
                              ? "bg-blue-500/10 border-blue-500/30"
                              : "bg-red-500/10 border-red-500/30"
                            }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">
                              Submission #{submissions.length - idx}
                            </span>
                            {submission.status === "ACCEPTED" ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                            ) : submission.status === "PENDING" || submission.status === "PROCESSING" ? (
                              <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
                            ) : (
                              <XCircle className="w-5 h-5 text-red-400" />
                            )}
                          </div>

                          <div className="text-xs text-neutral-400 space-y-1">
                            <div>
                              Status:{" "}
                              <span className={
                                submission.status === "ACCEPTED"
                                  ? "text-emerald-400"
                                  : submission.status === "PENDING" || submission.status === "PROCESSING"
                                    ? "text-blue-400"
                                    : "text-red-400"
                              }>
                                {submission.status || "PENDING"}
                              </span>
                            </div>
                            <div>
                              Score: {submission.score || 0} |
                              Passed: {submission.passedTestCases || 0}/{submission.totalTestCases || "?"}
                            </div>
                            {submission.executionTime && (
                              <div>Time: {submission.executionTime}s</div>
                            )}
                            <div className="text-neutral-500">
                              {new Date(submission.submittedAt).toLocaleTimeString()}
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-neutral-500">
                      <Send className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No submissions yet</p>
                    </div>
                  )}
                </>
              )}

              <div className="mt-4 pt-4 border-t border-neutral-800">
                <div className="mb-2 text-xs font-medium text-neutral-400">Custom Input (Optional)</div>
                <textarea
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded p-3 text-xs font-mono text-neutral-300 resize-none focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  rows="4"
                  placeholder="Enter custom input here for testing..."
                />
                <div className="text-xs text-neutral-500 mt-1">
                  This input will be used when you click Run (overrides test case inputs)
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AlertDialog open={showLeaveDialog} onOpenChange={setShowLeaveDialog}>
        <AlertDialogContent className="bg-neutral-900 border-neutral-800 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Leave Battle?</AlertDialogTitle>
            <AlertDialogDescription className="text-neutral-400">
              Are you sure you want to leave this battle? Your progress will be lost and you may lose crowns.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-neutral-700 text-white hover:bg-neutral-800 hover:text-white">
              Stay in Battle
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => router.push("/")}
              className="bg-red-600 hover:bg-red-700 text-white border-0"
            >
              Leave Battle
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
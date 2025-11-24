"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default function DuelsMatchupPage() {
  const durations = [5, 10, 15, 20, 30, 45, 60, 90, 120, 180, 240, 300]
  const difficulties = ["easy", "medium", "hard"]

  const topicGroups = {
    "Arrays & Strings": ["arrays", "strings", "prefix-sum", "sliding-window", "two-pointers", "hashing", "intervals", "matrix", "simulation"],
    "Searching & Sorting": ["binary-search", "binary-search-on-answer", "quick-sort", "merge-sort", "counting-sort", "radix-sort", "top-k", "custom-sorting", "search-in-rotated-array"],
    "Linked Lists": ["singly-linked-list", "doubly-linked-list", "fast-slow-pointers", "linked-list-reversal", "cycle-detection", "merge-k-lists", "linked-list-math"],
    "Stacks & Queues": ["monotonic-stack", "monotonic-queue", "min-stack", "queue-using-stacks", "stack-using-queues", "expression-evaluation", "parentheses"],
    "Trees": ["binary-tree", "binary-search-tree", "tree-traversal", "tree-recursion", "serialization", "lowest-common-ancestor", "segment-tree", "fenwick-tree", "trie"],
    "Graphs": ["bfs", "dfs", "dijkstra", "topological-sort", "union-find", "minimum-spanning-tree", "bellman-ford", "floyd-warshall", "graph-coloring", "connected-components"],
    "Dynamic Programming": ["dp-1d", "dp-2d", "subsequence-dp", "knapsack-dp", "dp-on-trees", "dp-on-graphs", "digit-dp", "bitmask-dp", "interval-dp", "matrix-chain", "state-dp"],
    "Mathematics": ["number-theory", "primes-sieve", "gcd-lcm", "combinatorics", "modular-arithmetic", "factorization", "probability", "geometry"],
    "Bit Manipulation": ["bitwise-ops", "xor-tricks", "subsets-by-bits", "bitmasking-dp", "counting-bits"],
    "Greedy": ["greedy-activity-selection", "scheduling-greedy", "two-pointer-greedy", "interval-greedy", "huffman-concept", "min-jumps", "coin-greedy"],
    "Heaps / Priority Queue": ["min-heap", "max-heap", "k-largest", "top-k-frequent", "heap-sort", "priority-scheduling"],
    "Backtracking": ["subsets-backtracking", "permutations", "combinations", "n-queens", "sudoku-solver", "graph-backtracking", "word-search-backtracking"],
    "Recursion": ["divide-and-conquer", "recursion-trees", "memoization"],
    "Tries": ["word-dictionary", "auto-complete", "prefix-queries", "trie-word-search", "xor-trie"],
    "Advanced Data Structures": ["lru-cache", "lfu-cache", "ordered-set", "ordered-map", "deque", "skip-list", "bloom-filter", "rope"],
    "Concurrency": ["semaphores", "mutex", "synchronization"],
    "SQL / Database": ["joins", "aggregation", "window-functions", "subqueries", "grouping", "ranking"]
  }

  const [selectedDuration, setSelectedDuration] = useState(10)
  const [selectedTags, setSelectedTags] = useState(new Set([]))
  const [friendInput, setFriendInput] = useState("")
  const [invitedFriends, setInvitedFriends] = useState([])

  const [selectedDifficulties, setSelectedDifficulties] = useState(["easy"])
  const [numQuestions, setNumQuestions] = useState(1)

  const [openGroups, setOpenGroups] = useState(
    Object.fromEntries(Object.keys(topicGroups).map(k => [k, false]))
  )

  function toggleTag(tag) {
    setSelectedTags(prev => {
      const copy = new Set(prev)
      if (copy.has(tag)) copy.delete(tag)
      else copy.add(tag)
      return copy
    })
  }

  function toggleDifficulty(d) {
    setSelectedDifficulties(prev => {
      const exists = prev.includes(d)
      if (exists) return prev.filter(x => x !== d)
      if (prev.length < numQuestions) return [...prev, d]
      return [...prev.slice(1), d]
    })
  }

  function handleNumQuestionsChange(v) {
    const n = Math.max(1, Math.min(20, Number(v) || 1))
    setNumQuestions(n)
    setSelectedDifficulties(prev => {
      if (prev.length <= n) return prev
      return prev.slice(0, n)
    })
  }

  function addFriend() {
    const t = friendInput.trim()
    if (!t) return
    if (invitedFriends.includes(t)) {
      setFriendInput("")
      return
    }
    setInvitedFriends(prev => [...prev, t])
    setFriendInput("")
  }

  function removeFriend(name) {
    setInvitedFriends(prev => prev.filter(f => f !== name))
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-b bg-zinc-900">
      <div className="w-full max-w-4xl">
        <Card className="p-6 bg-zinc-800 border border-zinc-600 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-green-600">Duels — Create Match</CardTitle>
            <p className="text-sm text-zinc-400 mt-1">Pick a time, tag the problem domains and invite a friend.</p>
          </CardHeader>

          <CardContent className="mt-6 space-y-6">
            <section>
              <h3 className="text-sm font-medium text-zinc-200 mb-3">Match duration</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {durations.map(d => (
                  <button
                    key={d}
                    onClick={() => setSelectedDuration(d)}
                    className={`text-left rounded-lg transition-colors focus:outline-none border border-zinc-700 p-8 shadow-sm bg-zinc-800 ${
                      selectedDuration === d
                        ? "ring-2 ring-green-500"
                        : "hover:ring-1 hover:ring-zinc-500"
                    }`}
                  >
                    <div className="text-lg font-semibold text-zinc-100">{d} min</div>
                    <div className="text-xs text-zinc-400 mt-1">
                      {d >= 45 ? "Marathon" : "Quick match"}
                    </div>
                  </button>
                ))}
              </div>
            </section>

            <section>
              <h3 className="text-sm font-medium text-zinc-200 mb-3">Select tags (multiple)</h3>

              <div className="h-64 sm:h-80 overflow-y-scroll hide-scrollbar p-2 space-y-3 bg-zinc-900 rounded-md border border-zinc-700">
                {Object.entries(topicGroups).map(([group, items]) => {
                  const open = openGroups[group]
                  return (
                    <div key={group} className="bg-zinc-800 border border-zinc-700 rounded-md p-3">
                      <button
                        onClick={() =>
                          setOpenGroups(prev => ({ ...prev, [group]: !prev[group] }))
                        }
                        className="w-full flex items-center justify-between text-left"
                      >
                        <div className="text-sm font-medium text-zinc-200">{group}</div>
                        <div className="text-xs text-zinc-400">{open ? "Hide" : "Show"}</div>
                      </button>

                      {open && (
                        <div className="mt-3 flex flex-wrap gap-3">
                          {items.map(tag => {
                            const active = selectedTags.has(tag)
                            return (
                              <button
                                key={tag}
                                onClick={() => toggleTag(tag)}
                                className={`px-3 py-1 rounded-md text-sm font-medium shadow-sm transition-colors border border-zinc-700 ${
                                  active
                                    ? "bg-green-600 text-white hover:bg-green-700"
                                    : "bg-zinc-800 text-zinc-200 hover:bg-zinc-700/40"
                                }`}
                              >
                                {tag}
                              </button>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              <div className="mt-3 text-xs text-zinc-400">
                Selected: {Array.from(selectedTags).join(", ") || "none"}
              </div>
            </section>

            <section>
              <h3 className="text-sm font-medium text-zinc-200 mb-3">Difficulty & number of questions</h3>

              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6">
                <div className="flex items-center gap-3 flex-wrap">
                  {difficulties.map(d => {
                    const active = selectedDifficulties.includes(d)
                    return (
                      <button
                        key={d}
                        onClick={() => toggleDifficulty(d)}
                        className={`px-4 py-2 rounded-md text-sm font-medium border border-zinc-700 ${
                          active
                            ? "bg-green-600 text-white hover:bg-green-700"
                            : "bg-zinc-800 text-zinc-200 hover:bg-zinc-700/40"
                        }`}
                      >
                        {d}
                      </button>
                    )
                  })}
                </div>

                <div className="mt-3 sm:mt-0 flex items-center gap-3">
                  <div className="text-xs text-zinc-400">Questions</div>
                  <Input
                    type="number"
                    min={1}
                    max={20}
                    value={numQuestions}
                    onChange={e => handleNumQuestionsChange(e.target.value)}
                    className="w-24 bg-zinc-800 border border-zinc-700 text-zinc-100 text-center"
                  />
                </div>
              </div>

              <div className="mt-3 text-xs text-zinc-400">
                Selected difficulties:{" "}
                {selectedDifficulties
                  .map(s => s.charAt(0).toUpperCase() + s.slice(1))
                  .join(", ") || "none"}{" "}
                • Questions: {numQuestions}
              </div>

            </section>

            <section>
              <h3 className="text-sm font-medium text-zinc-200 mb-3">Invite a friend</h3>
              <div className="flex gap-3">
                <Input
                  value={friendInput}
                  onChange={e => setFriendInput(e.target.value)}
                  placeholder="friend's username or email"
                  className="flex-1 bg-zinc-800 border border-zinc-700"
                />
                <Button className="bg-green-600 hover:bg-green-700" onClick={addFriend}>
                  Invite
                </Button>
              </div>

              {invitedFriends.length > 0 && (
                <ul className="mt-3 space-y-2">
                  {invitedFriends.map(f => (
                    <li
                      key={f}
                      className="flex items-center justify-between bg-zinc-800 p-3 rounded-md border border-zinc-700"
                    >
                      <div className="text-sm text-zinc-100">{f}</div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => alert(`Sent invite to ${f}`)}
                        >
                          Resend
                        </Button>
                        <Button size="sm" variant="secondary" onClick={() => removeFriend(f)}>
                          Remove
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="flex items-center justify-between">
              <div>
                <div className="text-sm text-zinc-400">Ready to start</div>
                <div className="text-lg font-semibold text-zinc-100">
                  {selectedDuration} min • {Array.from(selectedTags).join(", ") || "Random"}
                </div>
                <div className="text-sm text-zinc-400">
                  Difficulties:{" "}
                  {selectedDifficulties
                    .map(s => s.charAt(0).toUpperCase() + s.slice(1))
                    .join(", ")}{" "}
                  • Questions: {numQuestions}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  className="bg-zinc-800 border border-zinc-700 p-3 shadow-sm"
                  onClick={() => alert("Match lobby created (preview)")}
                >
                  Create lobby
                </Button>
                <Button
                  className="bg-green-600 hover:bg-green-700 p-3 shadow-sm"
                  onClick={() => alert("Match started (preview)")}
                >
                  Start match
                </Button>
              </div>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

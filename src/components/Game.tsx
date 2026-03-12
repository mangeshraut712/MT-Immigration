"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { AlertCircle, Bot, Copy, ExternalLink, Puzzle, RotateCcw } from "lucide-react"
import { useTranslations } from "next-intl"
import { SectionIntro } from "@/components/SectionIntro"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
}

export function Game() {
  const t = useTranslations("game")
  const [isGameLoaded, setIsGameLoaded] = useState(false)
  const [iframeKey, setIframeKey] = useState(0)
  const [gameState, setGameState] = useState<"idle" | "loading" | "ready" | "slow">("idle")
  const [puzzleDraft, setPuzzleDraft] = useState("")
  const [copyState, setCopyState] = useState<"idle" | "done">("idle")

  const samplePrompts = [
    "Give me a hint for this Marathi crossword clue:",
    "Suggest possible answers for this puzzle text:",
    "Explain how to solve this clue step by step:",
  ]

  useEffect(() => {
    if (gameState !== "loading") {
      return
    }

    const timer = window.setTimeout(() => {
      setGameState((current) => (current === "loading" ? "slow" : current))
    }, 8000)

    return () => window.clearTimeout(timer)
  }, [gameState])

  const loadGame = () => {
    setIsGameLoaded(true)
    setGameState("loading")
    setIframeKey((current) => current + 1)
  }

  const openPuzzleHelper = (sendImmediately = false) => {
    const message = puzzleDraft.trim()
      ? `Help me solve this Marathi crossword clue or puzzle text:\n\n${puzzleDraft.trim()}`
      : "Help me solve a Marathi crossword clue. Start with a hint."

    window.dispatchEvent(
      new CustomEvent("portfolio-chat:open", {
        detail: {
          agent: "puzzle",
          draft: sendImmediately ? undefined : message,
          message: sendImmediately ? message : undefined,
        },
      })
    )
  }

  const copyDraft = async () => {
    if (!puzzleDraft.trim()) {
      return
    }

    await navigator.clipboard.writeText(puzzleDraft.trim())
    setCopyState("done")
    window.setTimeout(() => setCopyState("idle"), 1600)
  }

  return (
    <section id="game" className="relative scroll-mt-24 border-t border-border/40 bg-background py-16 sm:py-24">
      <div className="container mx-auto max-w-7xl px-6 md:px-8">
        <motion.div {...fadeInUp}>
          <SectionIntro
            eyebrow={t("badge")}
            title="Marathi crossword break"
            description={t("description")}
            align="center"
          />
        </motion.div>

        <motion.div
          {...fadeInUp}
          transition={{ ...fadeInUp.transition, delay: 0.08 }}
          className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr] xl:items-start"
        >
          <Card className="surface-premium overflow-hidden rounded-[2rem]">
            <CardContent className="p-6 sm:p-8">
              <div className="flex flex-wrap items-start justify-between gap-5">
                <div className="max-w-2xl">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                    Inline Interactive
                  </p>
                  <h3 className="font-display mt-3 text-balance text-4xl leading-none text-foreground sm:text-5xl">
                    Play the Marathi crossword right here
                  </h3>
                </div>
                <Button type="button" className="rounded-full" onClick={loadGame}>
                  {isGameLoaded ? "Reload Crossword Inline" : "Load Crossword Inline"}
                </Button>
              </div>

              <p className="mt-6 max-w-2xl text-base leading-8 text-muted-foreground font-light">
                Load the puzzle in-place when you want to play, then use the built-in puzzle
                helper to paste clues, ask for hints, and verify whether your answer fits.
              </p>

              <div className="mt-8 overflow-hidden rounded-[1.5rem] border border-border/70 bg-background">
                {isGameLoaded ? (
                  <div className="relative w-full" style={{ paddingBottom: "62%" }}>
                    {gameState !== "ready" && (
                      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-background/95 px-6 text-center">
                        <Spinner className="h-7 w-7 text-primary" />
                        <div>
                          <h3 className="text-xl font-semibold text-foreground">
                            {gameState === "slow" ? "Still loading the crossword" : "Loading crossword"}
                          </h3>
                          <p className="mt-3 max-w-xl text-sm leading-7 text-muted-foreground">
                            {gameState === "slow"
                              ? "The external game is responding slowly. You can wait, retry the inline load, or open the helper with your clue right away."
                              : "The crossword is loading inline on this page. Once it is ready, you can play without leaving the portfolio."}
                          </p>
                        </div>
                        {gameState === "slow" && (
                          <div className="flex flex-wrap justify-center gap-3">
                            <Button type="button" variant="outline" className="rounded-full" onClick={loadGame}>
                              <RotateCcw className="mr-2 h-4 w-4" />
                              Retry inline load
                            </Button>
                            <Button asChild variant="outline" className="rounded-full">
                              <a
                                href="https://marathigames.in/Crossword/crossword.html"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <ExternalLink className="mr-2 h-4 w-4" />
                                Open source site
                              </a>
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                    <iframe
                      key={iframeKey}
                      className="absolute inset-0 h-full w-full"
                      src="https://marathigames.in/Crossword/crossword.html"
                      title="Marathi Crossword Game"
                      style={{ border: "none", background: "#fff" }}
                      loading="lazy"
                      allow="fullscreen"
                      onLoad={() => setGameState("ready")}
                    />
                  </div>
                ) : (
                  <div className="flex min-h-[340px] flex-col items-center justify-center gap-4 px-6 py-10 text-center">
                    <Puzzle className="h-10 w-10 text-primary" />
                    <div>
                      <h3 className="text-xl font-semibold text-foreground">
                        Load the crossword when you are ready
                      </h3>
                      <p className="mt-3 max-w-xl text-sm leading-7 text-muted-foreground">
                        The game stays on this page below contact and opens inline without taking
                        users into a separate experience.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="surface-soft rounded-[2rem]">
            <CardContent className="p-6 sm:p-7">
              <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                Puzzle Helper
              </p>
              <h3 className="mt-3 text-lg font-semibold text-foreground">
                Paste a clue, puzzle text, or your guessed answer
              </h3>
              <p className="mt-3 text-sm leading-7 text-foreground/80">
                The helper can give a hint first, explain the clue, or check whether your answer
                likely fits before revealing a direct solution.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {samplePrompts.map((samplePrompt) => (
                  <button
                    key={samplePrompt}
                    type="button"
                    onClick={() => setPuzzleDraft(samplePrompt)}
                    className="rounded-full border border-primary/15 bg-primary/5 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/10"
                  >
                    {samplePrompt}
                  </button>
                ))}
              </div>
              <Textarea
                value={puzzleDraft}
                onChange={(event) => setPuzzleDraft(event.target.value)}
                rows={6}
                placeholder="Paste the crossword clue, puzzle text, or your guessed answer here..."
                className="mt-4 min-h-[168px] resize-none rounded-2xl border-border bg-background px-4 py-3 text-sm leading-6"
              />
              <div className="mt-4 flex flex-wrap gap-3">
                <Button
                  type="button"
                  className="rounded-full"
                  onClick={() => openPuzzleHelper(true)}
                >
                  <Bot className="mr-2 h-4 w-4" />
                  Ask Puzzle Helper
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-full"
                  onClick={copyDraft}
                  disabled={!puzzleDraft.trim()}
                >
                  <Copy className="mr-2 h-4 w-4" />
                  {copyState === "done" ? "Copied" : "Copy text"}
                </Button>
              </div>
              <div className="mt-5 inline-flex items-start gap-2 rounded-2xl border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-left text-xs leading-6 text-foreground/80">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                <span>
                  The crossword iframe comes from a third-party site. If it loads slowly, you can
                  still paste the clue into the helper and continue without waiting.
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}

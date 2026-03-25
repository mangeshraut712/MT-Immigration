"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RotateCcw,
  Undo2,
  Sparkles,
  Scale,
  Trophy,
  Clock3,
  Copy,
  MoveRight,
  CalendarDays,
  Keyboard,
  CheckCircle2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  useCopyToClipboard,
  useKeyboardShortcut,
  useLocalStorage,
} from "@/lib/hooks";
import { cn } from "@/lib/utils";
import {
  docketZipPuzzles,
  type DocketZipPuzzle,
} from "@/content/docketZipPuzzles";

type CellMap = {
  key: string;
  row: number;
  col: number;
  clue?: number;
  openIndex: number;
};

type PuzzleModel = {
  puzzle: DocketZipPuzzle;
  openCells: CellMap[];
  openByKey: Map<string, CellMap>;
  indexByKey: Map<string, number>;
  adjacency: number[][];
  clueByIndex: Map<number, number>;
  fullMask: number;
  startIndex: number;
  endIndex: number;
  maxClue: number;
};

type GameStats = {
  streak: number;
  lastSolvedDate: string | null;
  solvedDates: string[];
  bestTimes: Record<string, number>;
};

type GameMode = "challenge" | "single";

type ChallengeStageResult = {
  puzzleId: string;
  seconds: number;
  moves: number;
  hintsUsed: number;
};

const CHAMBER_RUN_HINTS = 4;

const initialStats: GameStats = {
  streak: 0,
  lastSolvedDate: null,
  solvedDates: [],
  bestTimes: {},
};

const puzzleModels = docketZipPuzzles.map((puzzle) => {
  const blockedKeys = new Set(
    puzzle.blocked.map((cell) => `${cell.row}:${cell.col}`),
  );
  const clueIndices = new Map(
    puzzle.clueStepIndices.map((stepIndex, clueIndex) => [
      stepIndex,
      clueIndex + 1,
    ]),
  );

  const openCells: CellMap[] = [];
  for (let row = 0; row < puzzle.size; row += 1) {
    for (let col = 0; col < puzzle.size; col += 1) {
      const key = `${row}:${col}`;
      if (blockedKeys.has(key)) {
        continue;
      }

      openCells.push({
        key,
        row,
        col,
        clue: undefined,
        openIndex: openCells.length,
      });
    }
  }

  const openByKey = new Map(openCells.map((cell) => [cell.key, cell]));
  const indexByKey = new Map(
    openCells.map((cell) => [cell.key, cell.openIndex]),
  );
  const clueByIndex = new Map<number, number>();

  puzzle.solution.forEach((cell, index) => {
    const key = `${cell.row}:${cell.col}`;
    const openIndex = indexByKey.get(key);
    if (openIndex === undefined) {
      throw new Error(
        `Solution cell ${key} is not open in puzzle ${puzzle.id}`,
      );
    }

    const clue = clueIndices.get(index);
    if (clue !== undefined) {
      clueByIndex.set(openIndex, clue);
      openCells[openIndex].clue = clue;
    }
  });

  const adjacency = openCells.map((cell) => {
    const neighbors: number[] = [];
    for (const [rowDelta, colDelta] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ]) {
      const neighborKey = `${cell.row + rowDelta}:${cell.col + colDelta}`;
      const neighborIndex = indexByKey.get(neighborKey);
      if (neighborIndex !== undefined) {
        neighbors.push(neighborIndex);
      }
    }
    return neighbors;
  });

  const startKey = `${puzzle.solution[0].row}:${puzzle.solution[0].col}`;
  const endKey = `${puzzle.solution[puzzle.solution.length - 1].row}:${puzzle.solution[puzzle.solution.length - 1].col}`;

  return {
    puzzle,
    openCells,
    openByKey,
    indexByKey,
    adjacency,
    clueByIndex,
    fullMask: (1 << openCells.length) - 1,
    startIndex: indexByKey.get(startKey)!,
    endIndex: indexByKey.get(endKey)!,
    maxClue: puzzle.clueStepIndices.length,
  } satisfies PuzzleModel;
});

function getTodayPuzzleIndex() {
  const now = new Date();
  const day = Math.floor(
    (Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) -
      Date.UTC(now.getFullYear(), 0, 0)) /
      86_400_000,
  );
  return day % puzzleModels.length;
}

function getLocalDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getPreviousLocalDateKey(dateKey: string) {
  const [year, month, day] = dateKey.split("-").map(Number);
  if (!year || !month || !day) {
    return null;
  }

  const previousDate = new Date(year, month - 1, day);
  previousDate.setDate(previousDate.getDate() - 1);
  return getLocalDateKey(previousDate);
}

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function toMoveText(pathLength: number, totalOpen: number) {
  return `${Math.max(pathLength - 1, 0)} / ${Math.max(totalOpen - 1, 0)} moves`;
}

function getNextClue(currentNextClue: number, clueValue?: number) {
  return clueValue === currentNextClue ? currentNextClue + 1 : currentNextClue;
}

function findCompletion(
  model: PuzzleModel,
  currentIndex: number,
  visitedMask: number,
  nextClue: number,
  memo: Map<string, number[] | null>,
): number[] | null {
  const memoKey = `${currentIndex}|${visitedMask}|${nextClue}`;
  if (memo.has(memoKey)) {
    return memo.get(memoKey)!;
  }

  if (visitedMask === model.fullMask) {
    if (currentIndex === model.endIndex && nextClue === model.maxClue + 1) {
      const result = [currentIndex];
      memo.set(memoKey, result);
      return result;
    }

    memo.set(memoKey, null);
    return null;
  }

  const neighborCandidates = model.adjacency[currentIndex]
    .filter((neighborIndex) => (visitedMask & (1 << neighborIndex)) === 0)
    .sort(
      (left, right) =>
        model.adjacency[left].length - model.adjacency[right].length,
    );

  for (const neighborIndex of neighborCandidates) {
    const clueValue = model.clueByIndex.get(neighborIndex);
    if (clueValue !== undefined && clueValue !== nextClue) {
      continue;
    }

    const nextMask = visitedMask | (1 << neighborIndex);
    const resolvedPath = findCompletion(
      model,
      neighborIndex,
      nextMask,
      getNextClue(nextClue, clueValue),
      memo,
    );

    if (resolvedPath) {
      const result = [currentIndex, ...resolvedPath];
      memo.set(memoKey, result);
      return result;
    }
  }

  memo.set(memoKey, null);
  return null;
}

function buildShareText(
  puzzle: DocketZipPuzzle,
  elapsedSeconds: number,
  streak: number,
) {
  return [
    `${puzzle.title} (${puzzle.docket})`,
    `Solved in ${formatTime(elapsedSeconds)}`,
    `Current streak: ${streak}`,
    `Take a brief break at M&T Immigration`,
  ].join("\n");
}

function buildChallengeShareText(
  completedStages: number,
  totalStages: number,
  elapsedSeconds: number,
  hintsRemaining: number,
) {
  return [
    `Chamber Run`,
    `Cleared ${completedStages}/${totalStages} dockets`,
    `Total time: ${formatTime(elapsedSeconds)}`,
    `Hints left: ${hintsRemaining}`,
    `Take a brief break at M&T Immigration`,
  ].join("\n");
}

function isAdjacent(model: PuzzleModel, fromIndex: number, toIndex: number) {
  return model.adjacency[fromIndex].includes(toIndex);
}

export function DocketZipGame() {
  const todayPuzzleIndex = useMemo(() => getTodayPuzzleIndex(), []);
  const challengeOrder = useMemo(
    () => [
      todayPuzzleIndex,
      ...puzzleModels.map((_, index) => index).filter((index) => index !== todayPuzzleIndex),
    ],
    [todayPuzzleIndex],
  );
  const [gameMode, setGameMode] = useState<GameMode>("challenge");
  const [selectedPuzzleIndex, setSelectedPuzzleIndex] = useState(todayPuzzleIndex);
  const [challengeStageIndex, setChallengeStageIndex] = useState(0);
  const [challengeResults, setChallengeResults] = useState<ChallengeStageResult[]>([]);
  const [challengeHintsRemaining, setChallengeHintsRemaining] =
    useState(CHAMBER_RUN_HINTS);
  const [stageHintsUsed, setStageHintsUsed] = useState(0);
  const activePuzzleIndex =
    gameMode === "challenge"
      ? challengeOrder[challengeStageIndex]
      : selectedPuzzleIndex;
  const model = useMemo(
    () => puzzleModels[activePuzzleIndex],
    [activePuzzleIndex],
  );
  const [stats, setStats] = useLocalStorage<GameStats>(
    "mt-docket-zip-stats",
    initialStats,
  );
  const [path, setPath] = useState<number[]>([model.startIndex]);
  const [nextClue, setNextClue] = useState(2);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [hintCell, setHintCell] = useState<number | null>(null);
  const [isSolved, setIsSolved] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [isTracing, setIsTracing] = useState(false);
  const [solvedStreak, setSolvedStreak] = useState<number | null>(null);
  const { copied, copy } = useCopyToClipboard();
  const suppressNextClickRef = useRef<number | null>(null);

  const visitedOrder = useMemo(
    () => new Map(path.map((openIndex, order) => [openIndex, order])),
    [path],
  );

  const progressPercent = Math.round(
    (path.length / model.openCells.length) * 100,
  );
  const isDailyPuzzle = activePuzzleIndex === todayPuzzleIndex;
  const todaySolved = stats.solvedDates.includes(getLocalDateKey());
  const currentStageNumber = gameMode === "challenge" ? challengeStageIndex + 1 : 1;
  const totalStages = gameMode === "challenge" ? challengeOrder.length : 1;
  const hasNextStage =
    gameMode === "challenge" && challengeStageIndex < challengeOrder.length - 1;
  const runElapsedSeconds =
    challengeResults.reduce((total, result) => total + result.seconds, 0) +
    (!isSolved ? elapsedSeconds : 0);
  const totalHintsUsed =
    challengeResults.reduce((total, result) => total + result.hintsUsed, 0) +
    (isSolved ? 0 : stageHintsUsed);
  const isPerfectRun =
    gameMode === "challenge" &&
    challengeResults.length === totalStages &&
    totalHintsUsed === 0 &&
    challengeResults.every(
      (result) =>
        result.seconds <=
        (puzzleModels.find((entry) => entry.puzzle.id === result.puzzleId)?.puzzle
          .parSeconds ?? Number.MAX_SAFE_INTEGER),
    );

  const initializePuzzleState = useCallback((nextModel: PuzzleModel) => {
    setPath([nextModel.startIndex]);
    setNextClue(2);
    setFeedback(null);
    setHintCell(null);
    setIsSolved(false);
    setElapsedSeconds(0);
    setStartedAt(null);
    setIsTracing(false);
    setSolvedStreak(null);
    setStageHintsUsed(0);
    suppressNextClickRef.current = null;
  }, []);

  const resetPuzzle = useCallback(() => {
    if (gameMode === "challenge") {
      setChallengeResults((currentResults) =>
        currentResults.filter((result) => result.puzzleId !== model.puzzle.id),
      );
    }
    initializePuzzleState(model);
  }, [gameMode, initializePuzzleState, model]);

  const startChallengeRun = useCallback(() => {
    const firstModel = puzzleModels[challengeOrder[0]];
    setGameMode("challenge");
    setChallengeStageIndex(0);
    setChallengeResults([]);
    setChallengeHintsRemaining(CHAMBER_RUN_HINTS);
    initializePuzzleState(firstModel);
  }, [challengeOrder, initializePuzzleState]);

  const advanceChallengeStage = useCallback(() => {
    if (!hasNextStage) {
      return;
    }

    const nextStage = challengeStageIndex + 1;
    const nextModel = puzzleModels[challengeOrder[nextStage]];
    setChallengeStageIndex(nextStage);
    initializePuzzleState(nextModel);
  }, [challengeOrder, challengeStageIndex, hasNextStage, initializePuzzleState]);

  const selectPracticePuzzle = useCallback(
    (index: number) => {
      setGameMode("single");
      setSelectedPuzzleIndex(index);
      setChallengeHintsRemaining(CHAMBER_RUN_HINTS);
      initializePuzzleState(puzzleModels[index]);
    },
    [initializePuzzleState],
  );

  useEffect(() => {
    if (startedAt === null || isSolved) {
      return;
    }

    const interval = window.setInterval(() => {
      setElapsedSeconds(Math.floor((performance.now() - startedAt) / 1000));
    }, 1000);

    return () => window.clearInterval(interval);
  }, [startedAt, isSolved]);

  useEffect(() => {
    if (!feedback) {
      return;
    }

    const timeout = window.setTimeout(() => setFeedback(null), 1800);
    return () => window.clearTimeout(timeout);
  }, [feedback]);

  const undoMove = useCallback(() => {
    if (path.length <= 1 || isSolved) {
      return;
    }

    const removedCell = path[path.length - 1];
    const removedClue = model.clueByIndex.get(removedCell);
    setPath((currentPath) => currentPath.slice(0, -1));
    setNextClue((currentNextClue) =>
      removedClue !== undefined && removedClue + 1 === currentNextClue
        ? removedClue
        : currentNextClue,
    );
    setFeedback(null);
    setHintCell(null);
    setIsTracing(false);
    if (path.length <= 2) {
      setElapsedSeconds(0);
      setStartedAt(null);
    }
  }, [isSolved, model.clueByIndex, path]);

  function markSolved(finalElapsedSeconds: number, finalMoves: number) {
    const today = getLocalDateKey();
    setIsSolved(true);

    if (gameMode === "challenge") {
      setChallengeResults((currentResults) => {
        if (currentResults.some((result) => result.puzzleId === model.puzzle.id)) {
          return currentResults;
        }

        return [
          ...currentResults,
          {
            puzzleId: model.puzzle.id,
            seconds: finalElapsedSeconds,
            moves: finalMoves,
            hintsUsed: stageHintsUsed,
          },
        ];
      });
    }

    setStats((currentStats) => {
      const alreadySolvedToday = currentStats.solvedDates.includes(today);
      const yesterday = getPreviousLocalDateKey(today);
      const isConsecutive =
        currentStats.lastSolvedDate !== null &&
        yesterday !== null &&
        currentStats.lastSolvedDate === yesterday;

      const nextStreak = alreadySolvedToday
        ? currentStats.streak
        : isConsecutive
          ? currentStats.streak + 1
          : 1;
      setSolvedStreak(nextStreak);

      const previousBest = currentStats.bestTimes[model.puzzle.id];
      return {
        streak: nextStreak,
        lastSolvedDate: today,
        solvedDates: alreadySolvedToday
          ? currentStats.solvedDates
          : [...currentStats.solvedDates, today],
        bestTimes: {
          ...currentStats.bestTimes,
          [model.puzzle.id]:
            previousBest === undefined
              ? finalElapsedSeconds
              : Math.min(previousBest, finalElapsedSeconds),
        },
      };
    });
  }

  function handleCellClick(targetIndex: number, moveTimestamp: number) {
    if (isSolved) {
      return;
    }

    const currentIndex = path[path.length - 1];
    const previousIndex = path[path.length - 2];

    if (targetIndex === currentIndex) {
      setFeedback(
        "You are already on the active fact. Keep tracing the brief.",
      );
      return;
    }

    if (targetIndex === previousIndex) {
      undoMove();
      return;
    }

    if (
      visitedOrder.has(targetIndex) ||
      !isAdjacent(model, currentIndex, targetIndex)
    ) {
      setFeedback("Objection: that route does not connect cleanly.");
      return;
    }

    const clueValue = model.clueByIndex.get(targetIndex);
    if (clueValue !== undefined && clueValue !== nextClue) {
      setFeedback(`Objection: fact ${nextClue} has to come before that point.`);
      return;
    }

    const nextMask =
      path.reduce((mask, openIndex) => mask | (1 << openIndex), 0) |
      (1 << targetIndex);
    const solutionPreview = findCompletion(
      model,
      targetIndex,
      nextMask,
      getNextClue(nextClue, clueValue),
      new Map(),
    );

    if (!solutionPreview) {
      setFeedback(
        "Objection: that route traps part of the record. Try another turn.",
      );
      return;
    }

    if (startedAt === null) {
      setStartedAt(moveTimestamp);
    }

    const updatedPath = [...path, targetIndex];
    const resolvedNextClue = getNextClue(nextClue, clueValue);

    setPath(updatedPath);
    setNextClue(resolvedNextClue);
    setFeedback(null);
    setHintCell(null);

    if (
      updatedPath.length === model.openCells.length &&
      targetIndex === model.endIndex
    ) {
      const finalElapsedSeconds =
        startedAt === null ? 0 : Math.floor((moveTimestamp - startedAt) / 1000);
      setElapsedSeconds(finalElapsedSeconds);
      markSolved(finalElapsedSeconds, updatedPath.length - 1);
    }
  }

  const showHint = useCallback(() => {
    if (isSolved) {
      return;
    }

    if (gameMode === "challenge" && challengeHintsRemaining <= 0) {
      setFeedback("No clerk notes remain in this chamber run. Solve it from the record.");
      return;
    }

    const currentIndex = path[path.length - 1];
    const visitedMask = path.reduce(
      (mask, openIndex) => mask | (1 << openIndex),
      0,
    );
    const resolvedPath = findCompletion(
      model,
      currentIndex,
      visitedMask,
      nextClue,
      new Map(),
    );

    if (resolvedPath && resolvedPath.length > 1) {
      setHintCell(resolvedPath[1]);
      if (gameMode === "challenge") {
        setChallengeHintsRemaining((currentValue) => currentValue - 1);
        setStageHintsUsed((currentValue) => currentValue + 1);
      }
      setFeedback("Clerk’s note: the next clean move is highlighted.");
      return;
    }

    setFeedback(
      "No hint available from the current record. Undo a step and try again.",
    );
  }, [challengeHintsRemaining, gameMode, isSolved, model, nextClue, path]);

  useKeyboardShortcut("r", () => {
    resetPuzzle();
  });

  useKeyboardShortcut("u", () => {
    if (path.length > 1 && !isSolved) {
      undoMove();
    }
  });

  useKeyboardShortcut("h", () => {
    if (!isSolved) {
      showHint();
    }
  });

  async function copyScore() {
    await copy(
      gameMode === "challenge"
        ? buildChallengeShareText(
            challengeResults.length,
            totalStages,
            runElapsedSeconds,
            challengeHintsRemaining,
          )
        : buildShareText(
            model.puzzle,
            elapsedSeconds,
            solvedStreak ?? stats.streak,
          ),
    );
  }

  function beginTrace(targetIndex: number, moveTimestamp: number) {
    if (isSolved) {
      return;
    }

    const currentIndex = path[path.length - 1];

    if (targetIndex === currentIndex) {
      setIsTracing(true);
      setFeedback("Trace forward from the highlighted fact.");
      suppressNextClickRef.current = targetIndex;
      return;
    }

    if (
      isAdjacent(model, currentIndex, targetIndex) ||
      targetIndex === path[path.length - 2]
    ) {
      setIsTracing(true);
      suppressNextClickRef.current = targetIndex;
      handleCellClick(targetIndex, moveTimestamp);
    }
  }

  function extendTrace(targetIndex: number, moveTimestamp: number) {
    if (!isTracing || isSolved) {
      return;
    }

    const currentIndex = path[path.length - 1];
    if (targetIndex === currentIndex) {
      return;
    }

    if (
      isAdjacent(model, currentIndex, targetIndex) ||
      targetIndex === path[path.length - 2]
    ) {
      handleCellClick(targetIndex, moveTimestamp);
    }
  }

  function endTrace() {
    setIsTracing(false);
  }

  return (
    <div className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_23rem]">
      <div className="rounded-[2.5rem] border border-border bg-card p-5 shadow-soft md:p-8">
        <div className="mb-6 flex flex-col gap-5 border-b border-border/70 pb-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-border/70 bg-muted px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                  {gameMode === "challenge"
                    ? `Chamber Run · Stage ${currentStageNumber}/${totalStages}`
                    : isDailyPuzzle
                      ? "Today’s Docket"
                      : "Practice Docket"}
                </span>
                {todaySolved && isDailyPuzzle ? (
                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Solved Today
                  </span>
                ) : null}
              </div>
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                {model.puzzle.docket}
              </p>
              <h2 className="mt-2 font-serif text-3xl tracking-tight text-foreground md:text-4xl">
                {model.puzzle.title}
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
                {model.puzzle.matter}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full border border-border/70 bg-muted px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  {model.puzzle.difficulty}
                </span>
                <span className="rounded-full border border-border/70 bg-muted px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Par {formatTime(model.puzzle.parSeconds)}
                </span>
                {gameMode === "challenge" ? (
                  <span className="rounded-full border border-border/70 bg-muted px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    {challengeHintsRemaining} clerk notes left
                  </span>
                ) : null}
              </div>
              {gameMode === "challenge" ? (
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  Clear all {totalStages} dockets in sequence. Each stage tightens the route and carries your run forward.
                </p>
              ) : null}
            </div>

            <div className="flex items-center gap-3 rounded-full border border-border bg-muted px-4 py-2 text-sm font-medium text-secondary-foreground shadow-sm">
              <Clock3 className="h-4 w-4 text-foreground" />
              {formatTime(gameMode === "challenge" ? runElapsedSeconds : elapsedSeconds)}
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-border bg-muted px-4 py-4">
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                <span>Progress</span>
                <span>{progressPercent}%</span>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-border/80">
                <div
                  className="h-full rounded-full bg-foreground transition-[width] duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                {path.length} of {model.openCells.length} open cells are
                connected.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-muted px-4 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                Moves
              </p>
              <p className="mt-3 text-2xl font-semibold text-foreground">
                {toMoveText(path.length, model.openCells.length)}
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-muted px-4 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                Streak
              </p>
              <p className="mt-3 text-2xl font-semibold text-foreground">
                {stats.streak}
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-muted px-4 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                {gameMode === "challenge" ? "Hints" : "Mode"}
              </p>
              <p className="mt-3 text-2xl font-semibold text-foreground">
                {gameMode === "challenge"
                  ? challengeHintsRemaining
                  : "Single"}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                {gameMode === "challenge"
                  ? "Shared clerk notes for the full run."
                  : "Practice one docket at a time."}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-border/70 bg-[#f6efe7] p-4 dark:bg-zinc-950/70 md:p-6">
          <div
            className="relative mx-auto grid w-full max-w-[34rem] gap-2 touch-none select-none"
            style={{
              gridTemplateColumns: `repeat(${model.puzzle.size}, minmax(0, 1fr))`,
            }}
            onPointerUp={endTrace}
            onPointerLeave={endTrace}
            onPointerCancel={endTrace}
          >
            {Array.from({ length: model.puzzle.size * model.puzzle.size }).map(
              (_, cellIndex) => {
                const row = Math.floor(cellIndex / model.puzzle.size);
                const col = cellIndex % model.puzzle.size;
                const key = `${row}:${col}`;
                const openCell = model.openByKey.get(key);

                if (!openCell) {
                  return (
                    <div
                      key={key}
                      className="relative aspect-square rounded-2xl bg-zinc-900/90 shadow-inner dark:bg-zinc-800"
                    >
                      <div className="absolute inset-x-[18%] top-1/2 h-2 -translate-y-1/2 rounded-full bg-white/15" />
                    </div>
                  );
                }

                const order = visitedOrder.get(openCell.openIndex);
                const prevIndex =
                  order !== undefined && order > 0 ? path[order - 1] : null;
                const nextIndex =
                  order !== undefined && order < path.length - 1
                    ? path[order + 1]
                    : null;
                const prevCell =
                  prevIndex !== null ? model.openCells[prevIndex] : null;
                const nextCell =
                  nextIndex !== null ? model.openCells[nextIndex] : null;
                const active = path[path.length - 1] === openCell.openIndex;
                const clue = openCell.clue;
                const cellLabel = [
                  clue ? `Fact ${clue}` : `Grid cell ${row + 1}, ${col + 1}`,
                  active
                    ? "active"
                    : order !== undefined
                      ? `visited step ${order + 1}`
                      : "not visited",
                  hintCell === openCell.openIndex ? "hinted next move" : null,
                ]
                  .filter(Boolean)
                  .join(", ");

                const connections = {
                  up: prevCell?.row === row - 1 || nextCell?.row === row - 1,
                  down: prevCell?.row === row + 1 || nextCell?.row === row + 1,
                  left: prevCell?.col === col - 1 || nextCell?.col === col - 1,
                  right: prevCell?.col === col + 1 || nextCell?.col === col + 1,
                };

                const pathGradient = {
                  background:
                    "linear-gradient(135deg, rgba(20,20,20,0.96) 0%, rgba(80,80,80,0.96) 58%, rgba(120,120,120,0.96) 100%)",
                };

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={(event) => {
                      if (suppressNextClickRef.current === openCell.openIndex) {
                        suppressNextClickRef.current = null;
                        return;
                      }

                      handleCellClick(openCell.openIndex, event.timeStamp);
                    }}
                    onPointerDown={(event) =>
                      beginTrace(openCell.openIndex, event.timeStamp)
                    }
                    onPointerEnter={(event) =>
                      extendTrace(openCell.openIndex, event.timeStamp)
                    }
                    className={cn(
                      "relative aspect-square rounded-2xl border border-border bg-card text-left transition-all",
                      active
                        ? "shadow-lg shadow-zinc-500/10 ring-2 ring-foreground/35"
                        : "shadow-sm hover:border-foreground/40",
                    )}
                    aria-label={cellLabel}
                    aria-pressed={active}
                  >
                    {order !== undefined ? (
                      <>
                        <div
                          className="absolute left-1/2 top-1/2 h-[34%] w-[34%] -translate-x-1/2 -translate-y-1/2 rounded-full"
                          style={pathGradient}
                        />
                        {connections.up ? (
                          <div
                            className="absolute left-1/2 top-[6%] h-[46%] w-[24%] -translate-x-1/2 rounded-full"
                            style={pathGradient}
                          />
                        ) : null}
                        {connections.down ? (
                          <div
                            className="absolute bottom-[6%] left-1/2 h-[46%] w-[24%] -translate-x-1/2 rounded-full"
                            style={pathGradient}
                          />
                        ) : null}
                        {connections.left ? (
                          <div
                            className="absolute left-[6%] top-1/2 h-[24%] w-[46%] -translate-y-1/2 rounded-full"
                            style={pathGradient}
                          />
                        ) : null}
                        {connections.right ? (
                          <div
                            className="absolute right-[6%] top-1/2 h-[24%] w-[46%] -translate-y-1/2 rounded-full"
                            style={pathGradient}
                          />
                        ) : null}
                      </>
                    ) : null}

                    {hintCell === openCell.openIndex ? (
                      <motion.div
                        layoutId="hint-cell"
                        className="absolute inset-2 rounded-2xl border-2 border-amber-400/90"
                        transition={{ duration: 0.25 }}
                      />
                    ) : null}

                    {path.length === 1 && active ? (
                      <motion.div
                        className="absolute inset-1 rounded-2xl border border-foreground/45"
                        initial={{ opacity: 0.45, scale: 0.96 }}
                        animate={{
                          opacity: [0.35, 0.7, 0.35],
                          scale: [0.96, 1, 0.96],
                        }}
                        transition={{
                          duration: 1.6,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />
                    ) : null}

                    {clue ? (
                      <div
                        className={cn(
                          "absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-sm font-bold shadow-md",
                          order !== undefined
                            ? "bg-foreground text-background ring-4 ring-background/25"
                            : active
                              ? "bg-foreground text-background ring-4 ring-border"
                              : "bg-foreground text-background",
                        )}
                      >
                        {clue}
                      </div>
                    ) : null}
                  </button>
                );
              },
            )}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button
            type="button"
            variant={gameMode === "challenge" ? "default" : "outline"}
            onClick={startChallengeRun}
            className={cn(
              "rounded-full",
              gameMode === "challenge"
                ? "bg-foreground text-background hover:opacity-92"
                : "border-border bg-card",
            )}
          >
            <Trophy className="mr-2 h-4 w-4" />
            Chamber Run
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={undoMove}
            disabled={path.length <= 1 || isSolved}
            className="rounded-full border-border bg-card"
          >
            <Undo2 className="mr-2 h-4 w-4" />
            Undo
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={showHint}
            disabled={isSolved}
            className="rounded-full border-border bg-card"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Clerk’s Hint
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={resetPuzzle}
            className="rounded-full border-border bg-card"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={feedback ?? (isSolved ? "solved" : "ready")}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            aria-live="polite"
            className={cn(
              "mt-4 rounded-2xl border px-4 py-3 text-sm leading-relaxed",
              isSolved
                ? "border-emerald-300/40 bg-emerald-500/10 text-emerald-200"
                : feedback
                  ? "border-amber-300/40 bg-amber-500/10 text-amber-200"
                  : "border-border bg-card text-muted-foreground",
            )}
          >
            {isSolved
              ? hasNextStage
                ? `Stage ${currentStageNumber} cleared. The next docket is ready.`
                : gameMode === "challenge"
                  ? "Chamber cleared. You completed the full multi-stage run."
                  : "Court adjourned. You completed the entire record in order."
              : (feedback ??
                "Connect the numbered facts in order, cover every open cell, and avoid the redacted blocks.")}
          </motion.div>
        </AnimatePresence>

        <div className="mt-6 rounded-[2rem] border border-border bg-muted p-5">
          <div className="flex items-center gap-3">
            <MoveRight className="h-5 w-5 text-foreground" />
            <h3 className="font-serif text-xl tracking-tight text-foreground">
              Play it like a court-ready Zip
            </h3>
          </div>
          <div className="mt-4 grid gap-3 text-sm text-muted-foreground sm:grid-cols-3">
            <div className="rounded-2xl bg-card p-4">
              Fact 1 is already selected for you. Start tracing from that
              highlighted cell.
            </div>
            <div className="rounded-2xl bg-card p-4">
              Click or press and drag across adjacent cells to build the route
              in one motion.
            </div>
            <div className="rounded-2xl bg-card p-4">
              {gameMode === "challenge"
                ? "If you trap the path, undo quickly. Clerk notes are limited across the full run."
                : "If you trap the path, undo the last turn or ask the clerk for a hint."}
            </div>
          </div>
        </div>

        {isSolved ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 rounded-[2rem] bg-zinc-950 p-6 text-white"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/55">
                  Docket Closed
                </p>
                <h3 className="mt-3 font-serif text-3xl tracking-tight">
                  {hasNextStage
                    ? `Stage ${currentStageNumber} closed.`
                    : gameMode === "challenge"
                      ? "You cleared the full chamber run."
                      : "You cleared the brief."}
                </h3>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/70">
                  {hasNextStage
                    ? `Good. Advance to stage ${currentStageNumber + 1} and keep the record moving.`
                    : gameMode === "challenge"
                      ? "Three dockets, one clean run. Come back tomorrow for another chamber sequence."
                      : "Small reset, same standard. Come back tomorrow for the next chamber puzzle."}
                </p>
              </div>

              <Scale className="h-8 w-8 text-white/55" />
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-white/50">
                  Time
                </p>
                <p className="mt-2 text-2xl font-semibold">
                  {formatTime(gameMode === "challenge" ? runElapsedSeconds : elapsedSeconds)}
                </p>
              </div>
              <div className="rounded-2xl bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-white/50">
                  {gameMode === "challenge" ? "Stages" : "Streak"}
                </p>
                <p className="mt-2 text-2xl font-semibold">
                  {gameMode === "challenge"
                    ? `${challengeResults.length}/${totalStages}`
                    : (solvedStreak ?? stats.streak)}
                </p>
              </div>
              <div className="rounded-2xl bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-white/50">
                  Best
                </p>
                <p className="mt-2 text-2xl font-semibold">
                  {stats.bestTimes[model.puzzle.id] !== undefined
                    ? formatTime(stats.bestTimes[model.puzzle.id])
                    : "—"}
                </p>
              </div>
            </div>

            {gameMode === "challenge" && !hasNextStage ? (
              <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/75">
                {isPerfectRun
                  ? "Perfect run recorded. Every stage cleared at par without using a clerk note."
                  : `Run complete with ${totalHintsUsed} clerk note${totalHintsUsed === 1 ? "" : "s"} used.`}
              </div>
            ) : null}

            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                type="button"
                onClick={copyScore}
                className="rounded-full bg-foreground text-background hover:opacity-90"
              >
                <Copy className="mr-2 h-4 w-4" />
                {copied ? "Copied" : gameMode === "challenge" ? "Copy Run Result" : "Copy Result"}
              </Button>
              {hasNextStage ? (
                <Button
                  type="button"
                  onClick={advanceChallengeStage}
                  className="rounded-full bg-white text-zinc-950 hover:bg-white/90"
                >
                  Continue to Stage {currentStageNumber + 1}
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  onClick={gameMode === "challenge" ? startChallengeRun : resetPuzzle}
                  className="rounded-full border-white/20 bg-transparent text-white hover:bg-white/10"
                >
                  {gameMode === "challenge" ? "Run It Again" : "Play Again"}
                </Button>
              )}
            </div>
          </motion.div>
        ) : null}
      </div>

      <div className="space-y-4">
        <div className="rounded-[2rem] border border-border bg-card p-6 shadow-soft">
          <div className="flex items-center gap-3">
            <CalendarDays className="h-5 w-5 text-foreground" />
            <h3 className="font-serif text-xl tracking-tight text-foreground">
              Docket Desk
            </h3>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              onClick={startChallengeRun}
              className={cn(
                "rounded-full",
                gameMode === "challenge"
                  ? "bg-foreground text-background hover:opacity-92"
                  : "bg-muted text-foreground hover:bg-muted/80",
              )}
            >
              Chamber Run
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => selectPracticePuzzle(activePuzzleIndex)}
              className={cn(
                "rounded-full border-border/70",
                gameMode === "single"
                  ? "bg-card text-foreground"
                  : "bg-background text-muted-foreground hover:bg-muted",
              )}
            >
              Practice Mode
            </Button>
          </div>
          <div className="mt-5 space-y-3">
            {(gameMode === "challenge" ? challengeOrder.map((index) => index) : puzzleModels.map((_, index) => index)).map((index) => {
              const puzzleModel = puzzleModels[index];
              const selected = index === activePuzzleIndex;
              const isToday = index === todayPuzzleIndex;
              const stageNumber = challengeOrder.indexOf(index) + 1;
              const completed = challengeResults.some(
                (result) => result.puzzleId === puzzleModel.puzzle.id,
              );
              return (
                <button
                  key={puzzleModel.puzzle.id}
                  type="button"
                  onClick={() => {
                    if (gameMode === "challenge") {
                      if (!completed && index !== activePuzzleIndex) {
                        return;
                      }

                      setChallengeStageIndex(stageNumber - 1);
                      initializePuzzleState(puzzleModels[index]);
                      return;
                    }

                    selectPracticePuzzle(index);
                  }}
                  className={cn(
                    "w-full rounded-2xl border px-4 py-4 text-left transition-all",
                    selected
                      ? "border-foreground bg-foreground text-background shadow-lg"
                      : "border-border bg-muted text-foreground hover:border-foreground/30 hover:bg-card",
                    gameMode === "challenge" && !completed && index !== activePuzzleIndex
                      ? "opacity-80"
                      : "",
                  )}
                  disabled={gameMode === "challenge" && !completed && index !== activePuzzleIndex}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p
                        className={cn(
                          "text-[11px] font-semibold uppercase tracking-[0.24em]",
                          selected ? "text-background/65" : "text-muted-foreground",
                        )}
                      >
                        {gameMode === "challenge"
                          ? `Stage ${stageNumber} · ${puzzleModel.puzzle.docket}`
                          : puzzleModel.puzzle.docket}
                      </p>
                      <h4 className="mt-2 text-base font-semibold">
                        {puzzleModel.puzzle.title}
                      </h4>
                    </div>
                    {isToday ? (
                      <span
                        className={cn(
                          "rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]",
                          selected
                            ? "bg-white/10 text-white"
                            : "border border-border bg-card text-muted-foreground",
                        )}
                      >
                        Daily
                      </span>
                    ) : completed ? (
                      <span
                        className={cn(
                          "rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]",
                          selected
                            ? "bg-white/10 text-white"
                            : "border border-emerald-300/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300",
                        )}
                      >
                        Cleared
                      </span>
                    ) : null}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-[2rem] border border-border bg-card p-6 shadow-soft">
          <div className="flex items-center gap-3">
            <Scale className="h-5 w-5 text-foreground" />
            <h3 className="font-serif text-xl tracking-tight text-foreground">
              Chamber Notes
            </h3>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            {model.puzzle.briefing}
          </p>

          <div className="mt-5 space-y-3">
            <div className="rounded-2xl bg-muted p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Best time
              </p>
              <p className="mt-2 text-lg font-semibold text-foreground">
                {stats.bestTimes[model.puzzle.id] !== undefined
                  ? formatTime(stats.bestTimes[model.puzzle.id])
                  : "—"}
              </p>
            </div>
            <div className="rounded-2xl bg-muted p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Difficulty
              </p>
              <p className="mt-2 text-lg font-semibold text-foreground">
                {model.puzzle.difficulty}
              </p>
            </div>
            <div className="rounded-2xl bg-muted p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Current mode
              </p>
              <p className="mt-2 text-lg font-semibold text-foreground">
                {gameMode === "challenge"
                  ? `Chamber run · ${currentStageNumber}/${totalStages}`
                  : isDailyPuzzle
                    ? "Daily chamber puzzle"
                    : "Practice docket"}
              </p>
            </div>
            <div className="rounded-2xl bg-muted p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Stage target
              </p>
              <p className="mt-2 text-lg font-semibold text-foreground">
                {formatTime(model.puzzle.parSeconds)}
              </p>
            </div>
            <div className="rounded-2xl bg-muted p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Keyboard
              </p>
              <p className="mt-2 text-sm font-medium text-foreground">
                <span className="inline-flex items-center gap-2">
                  <Keyboard className="h-4 w-4" />
                  `H` hint, `U` undo, `R` reset
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-border bg-card p-6 shadow-soft">
          <div className="flex items-center gap-3">
            <Trophy className="h-5 w-5 text-foreground" />
            <h3 className="font-serif text-xl tracking-tight text-foreground">
              How to play
            </h3>
          </div>
          <ul className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
            <li>
              Start at fact 1 and trace one continuous route through every open
              cell.
            </li>
            <li>
              Hit the numbered facts in order. Redacted cells are off-limits.
            </li>
            <li>
              Use Undo if you box in the record. Use Clerk’s Hint if you want a
              gentle nudge.
            </li>
            {gameMode === "challenge" ? (
              <li>
                Clear each docket in sequence to finish the full chamber run.
                Every solved stage unlocks the next one.
              </li>
            ) : null}
          </ul>
        </div>
      </div>
    </div>
  );
}

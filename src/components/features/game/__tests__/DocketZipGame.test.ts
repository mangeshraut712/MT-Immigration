import {
  findCompletion,
  getLocalDateKey,
  getPreviousLocalDateKey,
  puzzleModels,
} from "@/components/features/game/DocketZipGame";

type SolverModel = Parameters<typeof findCompletion>[0];

function solveFromStart(model: SolverModel) {
  const startClue = model.clueByIndex.get(model.startIndex);
  const initialClue = startClue === 1 ? 2 : 1;

  return findCompletion(
    model,
    model.startIndex,
    1 << model.startIndex,
    initialClue,
    new Map(),
  );
}

describe("getLocalDateKey", () => {
  it("zero-pads month and day", () => {
    expect(getLocalDateKey(new Date(2024, 0, 5))).toBe("2024-01-05");
    expect(getLocalDateKey(new Date(2023, 10, 9))).toBe("2023-11-09");
  });
});

describe("getPreviousLocalDateKey", () => {
  it("steps back across month, year, and leap-day boundaries", () => {
    expect(getPreviousLocalDateKey("2024-05-15")).toBe("2024-05-14");
    expect(getPreviousLocalDateKey("2024-03-01")).toBe("2024-02-29");
    expect(getPreviousLocalDateKey("2023-03-01")).toBe("2023-02-28");
    expect(getPreviousLocalDateKey("2024-01-01")).toBe("2023-12-31");
  });

  it("returns null for malformed keys instead of throwing", () => {
    expect(getPreviousLocalDateKey("not-a-date")).toBeNull();
    expect(getPreviousLocalDateKey("2024-0x-01")).toBeNull();
  });
});

describe("findCompletion", () => {
  it("keeps every shipped docket puzzle solvable with clues visited in order", () => {
    expect(puzzleModels.length).toBeGreaterThan(0);

    for (const model of puzzleModels) {
      const path = solveFromStart(model);
      if (!path) {
        throw new Error(`Puzzle "${model.puzzle.id}" has no completable path.`);
      }

      expect(path[0]).toBe(model.startIndex);
      expect(path[path.length - 1]).toBe(model.endIndex);
      expect(path).toHaveLength(model.openCells.length);

      for (let step = 1; step < path.length; step += 1) {
        expect(model.adjacency[path[step - 1]]).toContain(path[step]);
      }

      const cluesInOrder = path
        .map((cellIndex) => model.clueByIndex.get(cellIndex))
        .filter((clue): clue is number => clue !== undefined);

      expect(cluesInOrder).toEqual(
        Array.from({ length: model.maxClue }, (_, clueIndex) => clueIndex + 1),
      );
    }
  });

  it("rejects paths that would reach numbered clues out of order", () => {
    const lineModel = {
      adjacency: [[1], [0, 2], [1, 3], [2]],
      fullMask: 0b1111,
      startIndex: 0,
      endIndex: 3,
      openCells: [],
      openByKey: new Map(),
      indexByKey: new Map(),
      puzzle: { id: "line" },
      maxClue: 2,
      clueByIndex: new Map<number, number>(),
    } as unknown as SolverModel;

    const orderedClues = {
      ...lineModel,
      clueByIndex: new Map([
        [1, 1],
        [2, 2],
      ]),
    };
    expect(findCompletion(orderedClues, 0, 1, 1, new Map())).toEqual([0, 1, 2, 3]);

    const reversedClues = {
      ...lineModel,
      clueByIndex: new Map([
        [1, 2],
        [2, 1],
      ]),
    };
    expect(findCompletion(reversedClues, 0, 1, 1, new Map())).toBeNull();
  });
});

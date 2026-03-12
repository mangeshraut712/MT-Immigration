export type GridCell = {
  row: number;
  col: number;
};

export type DocketZipPuzzle = {
  id: string;
  docket: string;
  title: string;
  matter: string;
  size: number;
  blocked: GridCell[];
  solution: GridCell[];
  clueStepIndices: number[];
};

export const docketZipPuzzles: DocketZipPuzzle[] = [
  {
    id: 'evidence-chain',
    docket: 'DZ-101',
    title: 'Evidence Chain',
    matter: 'Keep the record intact from opening fact to final exhibit.',
    size: 5,
    blocked: [
      { row: 1, col: 2 },
      { row: 1, col: 3 },
      { row: 2, col: 4 },
      { row: 4, col: 2 },
      { row: 4, col: 3 },
    ],
    solution: [
      { row: 4, col: 4 },
      { row: 3, col: 4 },
      { row: 3, col: 3 },
      { row: 2, col: 3 },
      { row: 2, col: 2 },
      { row: 3, col: 2 },
      { row: 3, col: 1 },
      { row: 4, col: 1 },
      { row: 4, col: 0 },
      { row: 3, col: 0 },
      { row: 2, col: 0 },
      { row: 2, col: 1 },
      { row: 1, col: 1 },
      { row: 1, col: 0 },
      { row: 0, col: 0 },
      { row: 0, col: 1 },
      { row: 0, col: 2 },
      { row: 0, col: 3 },
      { row: 0, col: 4 },
      { row: 1, col: 4 },
    ],
    clueStepIndices: [0, 3, 6, 9, 12, 15, 17, 19],
  },
  {
    id: 'motion-calendar',
    docket: 'DZ-204',
    title: 'Motion Calendar',
    matter: 'Thread the filings in order before the hearing clock runs out.',
    size: 5,
    blocked: [
      { row: 0, col: 0 },
      { row: 2, col: 2 },
      { row: 2, col: 3 },
      { row: 3, col: 4 },
      { row: 4, col: 4 },
    ],
    solution: [
      { row: 2, col: 4 },
      { row: 1, col: 4 },
      { row: 0, col: 4 },
      { row: 0, col: 3 },
      { row: 1, col: 3 },
      { row: 1, col: 2 },
      { row: 0, col: 2 },
      { row: 0, col: 1 },
      { row: 1, col: 1 },
      { row: 1, col: 0 },
      { row: 2, col: 0 },
      { row: 2, col: 1 },
      { row: 3, col: 1 },
      { row: 3, col: 0 },
      { row: 4, col: 0 },
      { row: 4, col: 1 },
      { row: 4, col: 2 },
      { row: 3, col: 2 },
      { row: 3, col: 3 },
      { row: 4, col: 3 },
    ],
    clueStepIndices: [0, 2, 5, 8, 11, 14, 16, 19],
  },
  {
    id: 'brief-stack',
    docket: 'DZ-312',
    title: 'Brief Stack',
    matter: 'Connect the arguments cleanly and leave no open cell behind.',
    size: 5,
    blocked: [
      { row: 1, col: 1 },
      { row: 1, col: 2 },
      { row: 2, col: 2 },
      { row: 3, col: 2 },
      { row: 4, col: 4 },
    ],
    solution: [
      { row: 0, col: 1 },
      { row: 0, col: 2 },
      { row: 0, col: 3 },
      { row: 0, col: 4 },
      { row: 1, col: 4 },
      { row: 1, col: 3 },
      { row: 2, col: 3 },
      { row: 2, col: 4 },
      { row: 3, col: 4 },
      { row: 3, col: 3 },
      { row: 4, col: 3 },
      { row: 4, col: 2 },
      { row: 4, col: 1 },
      { row: 4, col: 0 },
      { row: 3, col: 0 },
      { row: 3, col: 1 },
      { row: 2, col: 1 },
      { row: 2, col: 0 },
      { row: 1, col: 0 },
      { row: 0, col: 0 },
    ],
    clueStepIndices: [0, 3, 6, 8, 10, 13, 16, 19],
  },
];

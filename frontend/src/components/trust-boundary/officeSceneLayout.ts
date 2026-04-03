export type OfficePoint = {
  x: number;
  y: number;
};

export type OfficeRect = OfficePoint & {
  width: number;
  height: number;
  rotation?: number;
};

export type OfficeDeskCluster = {
  label: string;
  desk: OfficeRect;
  chair: OfficeRect;
  rug: OfficeRect;
  laptop: OfficeRect;
  keyboard: OfficeRect;
  accentColor: number;
  interactionPoint?: OfficePoint;
  screenGlow: OfficePoint & {
    radius: number;
    alpha: number;
  };
  mug?: OfficePoint;
  lamp?: OfficePoint;
};

export const OFFICE_PALETTE = {
  background: 0x06080d,
  roomShadow: 0x05070b,
  floorBase: 0x12161e,
  floorSecondary: 0x171c26,
  floorLine: 0x252c39,
  wall: 0x0c1017,
  wallTrim: 0x202636,
  wallPanel: 0x151a25,
  deskTop: 0x252f3f,
  deskFront: 0x1b2330,
  deskLeg: 0x0e1219,
  chair: 0x151a23,
  chairAccent: 0x5f62b8,
  monitor: 0xd9deff,
  monitorFrame: 0x0b1016,
  printer: 0xced4e0,
  filing: 0x212734,
  coffee: 0x7e5a3b,
  shelf: 0x1d2431,
  plantLeaf: 0x2b4a37,
  plantPot: 0x6b4d35,
  stickyMuted: 0x67718a,
  stickyAccent: 0x8c7fe0,
  stickyWarm: 0xb38e62,
  cable: 0x2d3342,
  label: 0x7d8698,
  deskGlow: 0x8c7fe0,
  coworkerGlow: 0x7fd6a2,
} as const;

export const OFFICE_LAYOUT = {
  bounds: {
    width: 980,
    height: 640,
  },
  room: {
    interior: {
      x: 92,
      y: 74,
      width: 808,
      height: 492,
    },
    topWallHeight: 68,
    rightWallWidth: 70,
    leftWallSegments: [
      { x: 92, y: 74, width: 44, height: 244 },
      { x: 92, y: 402, width: 44, height: 164 },
    ],
    entranceThreshold: {
      x: 176,
      y: 544,
      width: 164,
      height: 16,
    },
  },
  camera: {
    baseZoom: 1.18,
    deskZoom: 1.31,
  },
  spawn: {
    x: 188,
    y: 518,
  },
  deskInteractRadius: 126,
  playerDesk: {
    label: "PLAYER DESK",
    desk: {
      x: 680,
      y: 318,
      width: 214,
      height: 92,
    },
    chair: {
      x: 644,
      y: 404,
      width: 66,
      height: 44,
      rotation: -0.24,
    },
    rug: {
      x: 694,
      y: 402,
      width: 254,
      height: 116,
      rotation: -0.06,
    },
    laptop: {
      x: 734,
      y: 302,
      width: 70,
      height: 34,
    },
    keyboard: {
      x: 734,
      y: 324,
      width: 76,
      height: 9,
    },
    accentColor: OFFICE_PALETTE.deskGlow,
    interactionPoint: {
      x: 690,
      y: 392,
    },
    screenGlow: {
      x: 748,
      y: 308,
      radius: 92,
      alpha: 0.2,
    },
    mug: {
      x: 653,
      y: 300,
    },
    lamp: {
      x: 812,
      y: 296,
    },
  } satisfies OfficeDeskCluster,
  coworkerDesk: {
    label: "COWORKER",
    desk: {
      x: 794,
      y: 206,
      width: 170,
      height: 82,
    },
    chair: {
      x: 778,
      y: 286,
      width: 56,
      height: 38,
      rotation: -0.18,
    },
    rug: {
      x: 804,
      y: 286,
      width: 184,
      height: 92,
      rotation: -0.05,
    },
    laptop: {
      x: 812,
      y: 194,
      width: 56,
      height: 28,
    },
    keyboard: {
      x: 812,
      y: 212,
      width: 62,
      height: 8,
    },
    accentColor: OFFICE_PALETTE.coworkerGlow,
    screenGlow: {
      x: 820,
      y: 198,
      radius: 72,
      alpha: 0.1,
    },
    mug: {
      x: 870,
      y: 194,
    },
    lamp: {
      x: 888,
      y: 190,
    },
  } satisfies OfficeDeskCluster,
  coworkerBody: {
    x: 786,
    y: 292,
    width: 34,
    height: 46,
  },
  whiteboard: {
    x: 320,
    y: 136,
    width: 250,
    height: 92,
    stickyNotes: [
      { x: 246, y: -10, color: OFFICE_PALETTE.stickyMuted },
      { x: 278, y: 10, color: OFFICE_PALETTE.stickyWarm },
      { x: 302, y: -4, color: OFFICE_PALETTE.stickyAccent },
    ],
  },
  printerArea: {
    counter: {
      x: 198,
      y: 250,
      width: 118,
      height: 74,
    },
    printer: {
      x: 198,
      y: 218,
      width: 96,
      height: 30,
    },
    filingCabinet: {
      x: 182,
      y: 356,
      width: 82,
      height: 100,
    },
    paperStacks: [
      { x: 170, y: 214, width: 18, height: 6 },
      { x: 222, y: 212, width: 22, height: 7 },
    ],
  },
  coffeeStation: {
    counter: {
      x: 244,
      y: 466,
      width: 156,
      height: 52,
    },
    machine: {
      x: 188,
      y: 438,
      width: 58,
      height: 54,
    },
    cups: [
      { x: 248, y: 446 },
      { x: 270, y: 448 },
      { x: 292, y: 446 },
    ],
  },
  shelfArea: {
    storageShelf: {
      x: 842,
      y: 470,
      width: 94,
      height: 116,
    },
    boxes: [
      { x: 720, y: 500, width: 54, height: 38 },
      { x: 772, y: 514, width: 36, height: 26 },
    ],
    plant: {
      x: 812,
      y: 520,
      radius: 24,
    },
  },
  cableRuns: [
    {
      x: 700,
      y: 356,
      width: 76,
      height: 4,
      rotation: -0.14,
    },
    {
      x: 248,
      y: 500,
      width: 62,
      height: 4,
      rotation: 0.08,
    },
  ],
  collisionRects: [
    {
      x: 680,
      y: 318,
      width: 214,
      height: 92,
    },
    {
      x: 646,
      y: 404,
      width: 48,
      height: 30,
      rotation: -0.24,
    },
    {
      x: 794,
      y: 206,
      width: 170,
      height: 82,
    },
    {
      x: 780,
      y: 286,
      width: 44,
      height: 28,
      rotation: -0.18,
    },
    {
      x: 198,
      y: 250,
      width: 118,
      height: 74,
    },
    {
      x: 182,
      y: 356,
      width: 82,
      height: 100,
    },
    {
      x: 244,
      y: 466,
      width: 156,
      height: 52,
    },
    {
      x: 188,
      y: 438,
      width: 58,
      height: 54,
    },
    {
      x: 842,
      y: 470,
      width: 94,
      height: 116,
    },
    {
      x: 720,
      y: 500,
      width: 54,
      height: 38,
    },
    {
      x: 812,
      y: 520,
      width: 34,
      height: 34,
    },
    {
      x: 786,
      y: 292,
      width: 34,
      height: 40,
    },
  ] as OfficeRect[],
  labels: [
    {
      text: "ENTRY",
      x: 160,
      y: 564,
    },
    {
      text: "OPS BOARD",
      x: 330,
      y: 214,
    },
    {
      text: "PRINT / FILE",
      x: 188,
      y: 394,
    },
    {
      text: "COFFEE",
      x: 228,
      y: 520,
    },
    {
      text: "PLAYER DESK",
      x: 684,
      y: 430,
    },
    {
      text: "COWORKER",
      x: 810,
      y: 320,
    },
  ],
} as const;

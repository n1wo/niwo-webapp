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
  interactionPoint: OfficePoint;
  screenGlow: OfficePoint & {
    radius: number;
    alpha: number;
  };
  mug?: OfficePoint;
  lamp?: OfficePoint;
};

export type OfficeZone = OfficeRect & {
  fillColor: number;
  edgeColor: number;
};

export const OFFICE_PALETTE = {
  background: 0x0d1015,
  roomShadow: 0x090b10,
  floorBase: 0x505761,
  floorAlt: 0x565d68,
  floorLine: 0x424851,
  wall: 0xd6dce4,
  wallTrim: 0xadb7c4,
  wallCap: 0xf1f4f8,
  wallWood: 0x806247,
  wallWoodDark: 0x5d4531,
  wallInner: 0xc7b59a,
  wallPlaster: 0xe4dac9,
  zonePrimary: 0x4b5667,
  zoneSecondary: 0x525b66,
  zoneUtility: 0x586055,
  zoneBreak: 0x62584d,
  zonePath: 0x4d545e,
  deskTop: 0x917356,
  deskFront: 0x785e47,
  deskDrawer: 0x69523e,
  deskLeg: 0x48525d,
  chair: 0x355f87,
  chairAccent: 0x8db7e6,
  monitor: 0x96cbff,
  monitorFrame: 0x22303d,
  printer: 0xe7ebf0,
  filing: 0x7e8d75,
  storage: 0x74826c,
  divider: 0xc3ccd8,
  deviceLight: 0x72d48f,
  coffee: 0x8a6238,
  coffeeDark: 0x5d4024,
  plantLeaf: 0x5c7a56,
  plantPot: 0x725541,
  stickyMuted: 0x8290a2,
  stickyAccent: 0xf0d56d,
  stickyWarm: 0xe5a86a,
  cable: 0x3d4652,
  focus: 0x8eafe0,
  focusGlow: 0x7aa9ea,
  actorBody: 0x5f6f83,
  actorHead: 0xe2d4c7,
  actorCoworker: 0x869274,
} as const;

export const OFFICE_LAYOUT = {
  tileSize: 32,
  bounds: {
    width: 960,
    height: 640,
  },
  room: {
    interior: {
      x: 128,
      y: 96,
      width: 704,
      height: 448,
    },
    topWallHeight: 64,
    rightWallWidth: 64,
    leftWallSegments: [
      { x: 128, y: 96, width: 48, height: 448 },
    ],
    bottomWallSegments: [
      { x: 128, y: 544, width: 96, height: 48 },
      { x: 352, y: 544, width: 480, height: 48 },
    ],
    entranceThreshold: {
      x: 224,
      y: 528,
      width: 128,
      height: 16,
    },
  },
  camera: {
    baseZoom: 1.24,
    deskZoom: 1.36,
  },
  spawn: {
    x: 256,
    y: 500,
  },
  deskInteractRadius: 112,
  zones: {
    primaryWork: {
      x: 632,
      y: 224,
      width: 184,
      height: 176,
      fillColor: OFFICE_PALETTE.zonePrimary,
      edgeColor: OFFICE_PALETTE.focus,
    },
    secondaryWork: {
      x: 632,
      y: 112,
      width: 184,
      height: 128,
      fillColor: OFFICE_PALETTE.zoneSecondary,
      edgeColor: OFFICE_PALETTE.wallTrim,
    },
    utility: {
      x: 192,
      y: 192,
      width: 192,
      height: 224,
      fillColor: OFFICE_PALETTE.zoneUtility,
      edgeColor: OFFICE_PALETTE.storage,
    },
    breakArea: {
      x: 192,
      y: 432,
      width: 224,
      height: 96,
      fillColor: OFFICE_PALETTE.zoneBreak,
      edgeColor: OFFICE_PALETTE.coffee,
    },
    circulation: {
      x: 224,
      y: 352,
      width: 320,
      height: 128,
      fillColor: OFFICE_PALETTE.zonePath,
      edgeColor: OFFICE_PALETTE.wallTrim,
    },
  } satisfies Record<string, OfficeZone>,
  playerDesk: {
    label: "PLAYER DESK",
    desk: {
      x: 725,
      y: 280,
      width: 130,
      height: 55,
    },
    chair: {
      x: 725,
      y: 352,
      width: 48,
      height: 30,
    },
    rug: {
      x: 725,
      y: 336,
      width: 180,
      height: 136,
    },
    laptop: {
      x: 694,
      y: 260,
      width: 52,
      height: 24,
    },
    keyboard: {
      x: 694,
      y: 280,
      width: 56,
      height: 10,
    },
    accentColor: OFFICE_PALETTE.focusGlow,
    interactionPoint: {
      x: 725,
      y: 352,
    },
    screenGlow: {
      x: 694,
      y: 262,
      radius: 48,
      alpha: 0.12,
    },
    mug: {
      x: 764,
      y: 258,
    },
    lamp: {
      x: 676,
      y: 254,
    },
  } satisfies OfficeDeskCluster,
  coworkerDesk: {
    label: "COWORKER",
    desk: {
      x: 725,
      y: 160,
      width: 130,
      height: 55,
    },
    chair: {
      x: 725,
      y: 232,
      width: 48,
      height: 30,
    },
    rug: {
      x: 725,
      y: 216,
      width: 180,
      height: 112,
    },
    laptop: {
      x: 694,
      y: 140,
      width: 52,
      height: 24,
    },
    keyboard: {
      x: 694,
      y: 160,
      width: 56,
      height: 10,
    },
    accentColor: OFFICE_PALETTE.chairAccent,
    interactionPoint: {
      x: 725,
      y: 232,
    },
    screenGlow: {
      x: 694,
      y: 142,
      radius: 44,
      alpha: 0.08,
    },
    mug: {
      x: 764,
      y: 138,
    },
  } satisfies OfficeDeskCluster,
  coworkerBody: {
    x: 650,
    y: 236,
    width: 34,
    height: 44,
  },
  whiteboard: {
    x: 392,
    y: 140,
    width: 180,
    height: 76,
    stickyNotes: [
      { x: 300, y: -12, color: OFFICE_PALETTE.stickyMuted },
      { x: 332, y: 8, color: OFFICE_PALETTE.stickyWarm },
      { x: 364, y: -4, color: OFFICE_PALETTE.stickyAccent },
    ],
  },
  printerArea: {
    counter: {
      x: 288,
      y: 272,
      width: 96,
      height: 64,
    },
    printer: {
      x: 288,
      y: 240,
      width: 80,
      height: 28,
    },
    filingCabinet: {
      x: 288,
      y: 368,
      width: 80,
      height: 96,
    },
    paperStacks: [
      { x: 224, y: 240, width: 20, height: 8 },
      { x: 244, y: 248, width: 18, height: 8 },
    ],
  },
  coffeeStation: {
    counter: {
      x: 608,
      y: 480,
      width: 128,
      height: 48,
    },
    machine: {
      x: 528,
      y: 472,
      width: 48,
      height: 48,
    },
    cups: [
      { x: 602, y: 470 },
      { x: 626, y: 470 },
      { x: 650, y: 470 },
    ],
  },
  shelfArea: {
    storageShelf: {
      x: 784,
      y: 480,
      width: 64,
      height: 96,
    },
    boxes: [
      { x: 704, y: 480, width: 48, height: 32 },
      { x: 752, y: 480, width: 32, height: 32 },
    ],
    plant: {
      x: 736,
      y: 512,
      radius: 20,
    },
  },
  cableRuns: [
    {
      x: 720,
      y: 312,
      width: 44,
      height: 4,
    },
    {
      x: 592,
      y: 496,
      width: 40,
      height: 4,
    },
  ],
  collisionRects: [
    {
      x: 725,
      y: 280,
      width: 130,
      height: 55,
    },
    {
      x: 725,
      y: 352,
      width: 40,
      height: 22,
    },
    {
      x: 725,
      y: 160,
      width: 130,
      height: 55,
    },
    {
      x: 725,
      y: 232,
      width: 40,
      height: 22,
    },
    {
      x: 288,
      y: 272,
      width: 96,
      height: 64,
    },
    {
      x: 288,
      y: 368,
      width: 80,
      height: 96,
    },
    {
      x: 392,
      y: 186,
      width: 184,
      height: 18,
    },
    {
      x: 608,
      y: 480,
      width: 128,
      height: 48,
    },
    {
      x: 528,
      y: 472,
      width: 48,
      height: 48,
    },
    {
      x: 784,
      y: 480,
      width: 64,
      height: 96,
    },
    {
      x: 704,
      y: 480,
      width: 48,
      height: 32,
    },
    {
      x: 736,
      y: 512,
      width: 28,
      height: 28,
    },
    {
      x: 650,
      y: 236,
      width: 34,
      height: 40,
    },
  ] as OfficeRect[],
} as const;

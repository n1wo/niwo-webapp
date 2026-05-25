"use client";

import { useEffect, useRef } from "react";
import {
  OFFICE_LAYOUT,
  OFFICE_PALETTE,
  type OfficeDeskCluster,
  type OfficeZone,
} from "@/components/trust-boundary/officeSceneLayout";

type TrustBoundaryCanvasProps = {
  deskMode: boolean;
  onDeskRangeChange: (isNearDesk: boolean) => void;
  onDeskInteract: () => void;
};

const VIEWPORT_WIDTH = 960;
const VIEWPORT_HEIGHT = 540;
const ZONE_DRAW_ORDER = [
  "circulation",
  "utility",
  "breakArea",
  "secondaryWork",
  "primaryWork",
] as const;

export default function TrustBoundaryCanvas({
  deskMode,
  onDeskRangeChange,
  onDeskInteract,
}: TrustBoundaryCanvasProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const gameRef = useRef<import("phaser").Game | null>(null);
  const sceneEventsRef = useRef<import("phaser").Events.EventEmitter | null>(null);
  const deskRangeCallbackRef = useRef(onDeskRangeChange);
  const deskInteractCallbackRef = useRef(onDeskInteract);

  useEffect(() => {
    deskRangeCallbackRef.current = onDeskRangeChange;
  }, [onDeskRangeChange]);

  useEffect(() => {
    deskInteractCallbackRef.current = onDeskInteract;
  }, [onDeskInteract]);

  useEffect(() => {
    if (!containerRef.current || gameRef.current) return;

    let cancelled = false;

    async function bootGame() {
      const Phaser = (await import("phaser")).default as typeof import("phaser");
      if (cancelled || !containerRef.current) return;

      const roomWidth = OFFICE_LAYOUT.bounds.width;
      const roomHeight = OFFICE_LAYOUT.bounds.height;

      class TrustBoundaryRoomScene extends Phaser.Scene {
        private playerBody!: Phaser.GameObjects.Rectangle;
        private playerVisual!: Phaser.GameObjects.Container;
        private deskFocusPlate!: Phaser.GameObjects.Rectangle;
        private deskFocusOutline!: Phaser.GameObjects.Rectangle;
        private deskFocusPulse!: Phaser.GameObjects.Ellipse;
        private primaryMonitorGlow!: Phaser.GameObjects.Ellipse;
        private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
        private keys!: Record<string, Phaser.Input.Keyboard.Key>;
        private inputLocked = false;
        private isNearDesk = false;
        private deskModeActive = false;
        private staticObstacles: Phaser.GameObjects.Rectangle[] = [];

        constructor() {
          super("trust-boundary-room");
        }

        create() {
          this.cameras.main.setBackgroundColor("#0a0d12");
          this.physics.world.setBounds(0, 0, roomWidth, roomHeight);
          this.cameras.main.setBounds(0, 0, roomWidth, roomHeight);
          this.cameras.main.roundPixels = true;

          this.buildOfficeShell();
          this.createStaticColliders();
          this.addWhiteboard();
          this.addPrinterArea();
          this.addCoffeeStation();
          this.addShelfArea();
          this.addDeskCluster(Phaser, OFFICE_LAYOUT.coworkerDesk, false);
          this.addDeskCluster(Phaser, OFFICE_LAYOUT.playerDesk, true);
          this.createDeskFocus();
          this.createActors();
          this.setupCamera();

          this.cursors = this.input.keyboard!.createCursorKeys();
          this.keys = this.input.keyboard!.addKeys("W,A,S,D,E") as Record<string, Phaser.Input.Keyboard.Key>;

          this.events.on("desk-mode", (locked: boolean) => {
            this.inputLocked = locked;
            this.deskModeActive = locked;
            const playerPhysics = this.playerBody.body as Phaser.Physics.Arcade.Body;
            if (locked) playerPhysics.setVelocity(0, 0);
            this.tweens.killTweensOf(this.cameras.main);
            this.tweens.add({
              targets: this.cameras.main,
              zoom: locked ? OFFICE_LAYOUT.camera.deskZoom : OFFICE_LAYOUT.camera.baseZoom,
              duration: locked ? 260 : 320,
              ease: "Sine.easeInOut",
            });
            this.refreshDeskFocus();
          });

          this.startAmbientTweens();
          this.refreshDeskFocus();
          deskRangeCallbackRef.current(false);
        }

        update() {
          const playerPhysics = this.playerBody.body as Phaser.Physics.Arcade.Body;
          const speed = 184;
          let velocityX = 0;
          let velocityY = 0;
          if (!this.inputLocked) {
            if (this.cursors.left.isDown || this.keys.A.isDown) velocityX -= speed;
            if (this.cursors.right.isDown || this.keys.D.isDown) velocityX += speed;
            if (this.cursors.up.isDown || this.keys.W.isDown) velocityY -= speed;
            if (this.cursors.down.isDown || this.keys.S.isDown) velocityY += speed;
          }
          playerPhysics.setVelocity(velocityX, velocityY);
          if (velocityX !== 0 && velocityY !== 0) playerPhysics.velocity.normalize().scale(speed);
          this.syncActorVisuals();

          const nearDesk =
            Phaser.Math.Distance.Between(
              this.playerBody.x,
              this.playerBody.y,
              OFFICE_LAYOUT.playerDesk.interactionPoint.x,
              OFFICE_LAYOUT.playerDesk.interactionPoint.y,
            ) < OFFICE_LAYOUT.deskInteractRadius;

          if (nearDesk !== this.isNearDesk) {
            this.isNearDesk = nearDesk;
            this.refreshDeskFocus();
            deskRangeCallbackRef.current(nearDesk);
          }

          if (nearDesk && !this.inputLocked && Phaser.Input.Keyboard.JustDown(this.keys.E)) {
            deskInteractCallbackRef.current();
          }
        }

        private buildOfficeShell() {
          const room = OFFICE_LAYOUT.room;
          const interior = room.interior;
          const backdrop = this.add.graphics();

          // Build the room as a contained office shell first so the props inherit a
          // clean simulation space instead of floating in a moody void.
          backdrop.setDepth(0);
          backdrop.fillStyle(OFFICE_PALETTE.background, 1);
          backdrop.fillRect(0, 0, roomWidth, roomHeight);
          backdrop.fillStyle(0x161b23, 1);
          backdrop.fillRect(interior.x - 80, interior.y - 88, interior.width + 160, interior.height + 176);

          this.add
            .rectangle(
              interior.x + interior.width / 2,
              interior.y + interior.height / 2 + 14,
              interior.width + 36,
              interior.height + 36,
              0x000000,
              0.14,
            )
            .setDepth(1);

          this.drawFloorTiles();
          this.drawZonePanels();
          this.drawRoomBoundaries();
          this.addEntryLane();
          this.addWallAccents();
        }

        private drawFloorTiles() {
          const floor = this.add.graphics();
          const { interior } = OFFICE_LAYOUT.room;
          const tileSize = OFFICE_LAYOUT.tileSize;
          const columns = Math.floor(interior.width / tileSize);
          const rows = Math.floor(interior.height / tileSize);

          floor.setDepth(2);
          floor.fillStyle(OFFICE_PALETTE.floorBase, 1);
          floor.fillRect(interior.x, interior.y, interior.width, interior.height);

          // The floor keeps a subtle tile rhythm so objects snap into place
          // visually without making the room feel like a debug grid.
          for (let row = 0; row < rows; row += 1) {
            for (let column = 0; column < columns; column += 1) {
              const tileX = interior.x + column * tileSize;
              const tileY = interior.y + row * tileSize;
              const isAlternate = (row + column) % 2 === 0;
              floor.fillStyle(isAlternate ? OFFICE_PALETTE.floorBase : OFFICE_PALETTE.floorAlt, 1);
              floor.fillRect(tileX, tileY, tileSize - 1, tileSize - 1);
            }
          }

          floor.lineStyle(1, OFFICE_PALETTE.floorLine, 0.18);
          for (let row = 0; row <= rows; row += 1) {
            const y = interior.y + row * tileSize;
            floor.lineBetween(interior.x, y, interior.x + interior.width, y);
          }
          for (let column = 0; column <= columns; column += 1) {
            const x = interior.x + column * tileSize;
            floor.lineBetween(x, interior.y, x, interior.y + interior.height);
          }

          this.add
            .rectangle(
              interior.x + interior.width / 2,
              interior.y + interior.height / 2,
              interior.width,
              interior.height,
              0x000000,
              0,
            )
            .setDepth(3);
        }

        private drawZonePanels() {
          ZONE_DRAW_ORDER.forEach((zoneKey) => {
            const zone = OFFICE_LAYOUT.zones[zoneKey];
            this.addZonePanel(zone, zoneKey === "primaryWork");
          });
        }

        private addZonePanel(zone: OfficeZone, isPrimary: boolean) {
          const zoneRect = this.add.rectangle(
            zone.x + zone.width / 2,
            zone.y + zone.height / 2,
            zone.width - 8,
            zone.height - 8,
            zone.fillColor,
            isPrimary ? 0.3 : 0.2,
          );
          zoneRect.setDepth(4);
        }

        private drawRoomBoundaries() {
          const walls = this.add.graphics();
          const room = OFFICE_LAYOUT.room;
          const interior = room.interior;
          const topWallY = interior.y - room.topWallHeight;
          const threshold = room.entranceThreshold;
          const thresholdCenterX = threshold.x + threshold.width / 2;

          // ── Wall rendering constants ────────────────────────────────
          const OB = 3;               // outer border (darkest edge)
          const INNER_FACE = 8;       // room-facing inner strip
          const TOP_CAP_H = 6;        // top surface visible from above
          const SEAM_H = 2;           // bright seam between cap and body

          const outerColor = OFFICE_PALETTE.wallWoodDark;   // 0x5d4531
          const bodyColor  = OFFICE_PALETTE.wallWood;        // 0x806247
          const innerColor = OFFICE_PALETTE.wallInner;       // 0xc7b59a
          const capColor   = OFFICE_PALETTE.wallPlaster;     // 0xe4dac9
          const seamColor  = 0xd4c8b0;

          walls.setDepth(16);

          // ── Shell geometry ────────────────────────────────────────────
          const leftSeg = room.leftWallSegments[0];
          const leftW = leftSeg.width;
          const rightW = room.rightWallWidth;
          const topH = room.topWallHeight;
          const botH = room.bottomWallSegments[0].height;

          const shellL = leftSeg.x;
          const shellR = interior.x + interior.width + rightW;
          const shellT = topWallY;
          const shellB = interior.y + interior.height + botH;
          const fullW = shellR - shellL;
          const fullH = shellB - shellT;

          const roomL = shellL + leftW;
          const roomR = interior.x + interior.width;
          const roomT = shellT + topH;
          const roomB = interior.y + interior.height;

          const doorL = threshold.x;
          const doorR = threshold.x + threshold.width;

          // ── LAYER 1: Outer border (darkest) ───────────────────────────
          walls.fillStyle(outerColor, 1);
          walls.fillRect(shellL, shellT, fullW, topH);
          walls.fillRect(shellL, shellT, leftW, fullH);
          walls.fillRect(roomR, shellT, rightW, fullH);
          walls.fillRect(shellL, roomB, doorL - shellL, botH);
          walls.fillRect(doorR, roomB, shellR - doorR, botH);

          // ── LAYER 2: Wall body (medium wood) ──────────────────────────
          walls.fillStyle(bodyColor, 1);
          walls.fillRect(shellL + OB, shellT + OB, fullW - OB * 2, topH - OB * 2);
          walls.fillRect(shellL + OB, shellT + OB, leftW - OB * 2, fullH - OB * 2);
          walls.fillRect(roomR + OB, shellT + OB, rightW - OB * 2, fullH - OB * 2);
          walls.fillRect(shellL + OB, roomB + OB, doorL - shellL - OB * 2, botH - OB * 2);
          walls.fillRect(doorR + OB, roomB + OB, shellR - doorR - OB * 2, botH - OB * 2);

          // ── LAYER 3: Top cap (lightest) ───────────────────────────────
          walls.fillStyle(capColor, 1);
          walls.fillRect(shellL + OB, shellT + OB, fullW - OB * 2, TOP_CAP_H);

          // ── LAYER 4: Seam below cap ───────────────────────────────────
          walls.fillStyle(seamColor, 1);
          walls.fillRect(shellL + OB, shellT + OB + TOP_CAP_H, fullW - OB * 2, SEAM_H);

          // ── LAYER 5: Inner faces (room-facing edges) ──────────────────
          walls.fillStyle(innerColor, 1);
          walls.fillRect(roomL, roomT - INNER_FACE, roomR - roomL, INNER_FACE);
          walls.fillRect(roomL - INNER_FACE, roomT, INNER_FACE, roomB - roomT);
          walls.fillRect(roomR, roomT, INNER_FACE, roomB - roomT);
          walls.fillRect(roomL, roomB, doorL - roomL, INNER_FACE);
          walls.fillRect(doorR, roomB, roomR - doorR, INNER_FACE);

          // ── LAYER 6: Corner lines (diagonal from inner to outer corner)
          // These lines show the wall thickness at each corner joint,
          // like a mitre line where two walls meet.
          walls.lineStyle(2, outerColor, 0.7);
          // Top-left corner
          walls.beginPath();
          walls.moveTo(roomL, roomT);
          walls.lineTo(shellL, shellT);
          walls.strokePath();
          // Top-right corner
          walls.beginPath();
          walls.moveTo(roomR, roomT);
          walls.lineTo(shellR, shellT);
          walls.strokePath();
          // Bottom-left corner
          walls.beginPath();
          walls.moveTo(roomL, roomB);
          walls.lineTo(shellL, shellB);
          walls.strokePath();
          // Bottom-right corner
          walls.beginPath();
          walls.moveTo(roomR, roomB);
          walls.lineTo(shellR, shellB);
          walls.strokePath();

          // ── Inner wall shadows (cast onto the floor) ──────────────────
          this.add.rectangle((roomL + roomR) / 2, roomT + 6, roomR - roomL - 8, 10, 0x000000, 0.1).setDepth(15);
          this.add.rectangle(roomR - 6, (roomT + roomB) / 2, 10, roomB - roomT - 8, 0x000000, 0.09).setDepth(15);
          this.add.rectangle(roomL + 6, (roomT + roomB) / 2, 10, roomB - roomT - 8, 0x000000, 0.07).setDepth(15);

          // ── Door opening ────────────────────────────────────────────
          const doorX = threshold.x;
          const doorW = threshold.width;
          const doorCX = thresholdCenterX;
          const wallY = room.bottomWallSegments[0].y;
          const wallH = room.bottomWallSegments[0].height;

          // Dark corridor / hallway void behind the door
          this.add
            .rectangle(doorCX, wallY + wallH / 2 + 20, doorW + 8, wallH + 44, 0x0a0e14, 1)
            .setDepth(1);
          // Slightly lighter back wall of corridor (visible depth)
          this.add
            .rectangle(doorCX, wallY + wallH + 12, doorW - 8, 16, 0x1a1f28, 1)
            .setDepth(2);

          // ── Door frame (left jamb) ────────────────────────────────────
          const JAMB_W = 12;
          const JAMB_FRONT_H = 10;
          const jambLeftX = doorX - JAMB_W / 2;
          const jambRightX = doorX + doorW + JAMB_W / 2;

          // Left jamb — front face (darkest)
          this.add.rectangle(jambLeftX, wallY + wallH / 2 + JAMB_FRONT_H / 2, JAMB_W, wallH + JAMB_FRONT_H, OFFICE_PALETTE.wallWoodDark, 1).setDepth(18);
          // Left jamb — inner face (medium, facing into doorway)
          this.add.rectangle(jambLeftX + 2, wallY + wallH / 2 + JAMB_FRONT_H / 2, JAMB_W - 4, wallH + JAMB_FRONT_H - 4, OFFICE_PALETTE.wallWood, 1).setDepth(19);
          // Left jamb — inner edge highlight
          this.add.rectangle(doorX + 2, wallY + wallH / 2, 3, wallH - 6, OFFICE_PALETTE.wallInner, 0.7).setDepth(20);

          // Right jamb — front face (darkest)
          this.add.rectangle(jambRightX, wallY + wallH / 2 + JAMB_FRONT_H / 2, JAMB_W, wallH + JAMB_FRONT_H, OFFICE_PALETTE.wallWoodDark, 1).setDepth(18);
          // Right jamb — inner face (medium)
          this.add.rectangle(jambRightX - 2, wallY + wallH / 2 + JAMB_FRONT_H / 2, JAMB_W - 4, wallH + JAMB_FRONT_H - 4, OFFICE_PALETTE.wallWood, 1).setDepth(19);
          // Right jamb — inner edge highlight
          this.add.rectangle(doorX + doorW - 2, wallY + wallH / 2, 3, wallH - 6, OFFICE_PALETTE.wallInner, 0.7).setDepth(20);

          // ── Lintel (top header across the door) ───────────────────────
          this.add.rectangle(doorCX, wallY + 2, doorW + JAMB_W * 2, 8, OFFICE_PALETTE.wallWoodDark, 1).setDepth(20);
          this.add.rectangle(doorCX, wallY + 3, doorW + JAMB_W * 2 - 4, 5, OFFICE_PALETTE.wallWood, 1).setDepth(21);

          // ── Door panel (slightly ajar, swung inward to the right) ─────
          const doorPanelW = doorW * 0.45;  // foreshortened — door is angled open
          const doorPanelH = wallH - 4;
          const doorPanelX = doorX + doorW - doorPanelW / 2 - 4;
          const doorPanelY = wallY + wallH / 2 + 2;

          // Door panel — side face (the visible thickness of the open door)
          this.add.rectangle(doorPanelX + doorPanelW / 2 + 2, doorPanelY, 4, doorPanelH, OFFICE_PALETTE.wallWoodDark, 0.9).setDepth(21);
          // Door panel — front face (the main visible surface)
          this.add.rectangle(doorPanelX, doorPanelY, doorPanelW, doorPanelH, OFFICE_PALETTE.wallWood, 1).setDepth(22);
          // Door panel — lighter inner rectangle (panel detail)
          this.add.rectangle(doorPanelX, doorPanelY - 6, doorPanelW - 8, doorPanelH * 0.38, OFFICE_PALETTE.wallInner, 0.5).setDepth(23);
          this.add.rectangle(doorPanelX, doorPanelY + 8, doorPanelW - 8, doorPanelH * 0.32, OFFICE_PALETTE.wallInner, 0.4).setDepth(23);
          // Door handle (small bright rectangle)
          this.add.rectangle(doorPanelX - doorPanelW / 2 + 8, doorPanelY + 2, 6, 3, 0xb8b8b8, 0.9).setDepth(24);

          // ── Threshold strip (metal/wood transition strip on floor) ────
          this.add.rectangle(doorCX, wallY + wallH + 2, doorW + 4, 5, OFFICE_PALETTE.wallWoodDark, 0.85).setDepth(8);
          this.add.rectangle(doorCX, wallY + wallH + 2, doorW - 2, 3, OFFICE_PALETTE.wallInner, 0.6).setDepth(9);

          // ── Welcome mat ───────────────────────────────────────────────
          const mat = this.add.rectangle(
            doorCX,
            wallY + wallH + 16,
            doorW - 16,
            14,
            OFFICE_PALETTE.zonePath,
            0.7,
          );
          mat.setDepth(8);
          mat.setStrokeStyle(1, OFFICE_PALETTE.wallTrim, 0.3);
        }

        private addEntryLane() {
          // intentionally empty — removed ground-level outlines
        }

        private addWallAccents() {
          // Door-side bracket accents on bottom wall (flanking the entrance)
          this.add.rectangle(218, 540, 20, 16, OFFICE_PALETTE.wallInner, 0.6).setDepth(18);
          this.add.rectangle(358, 540, 20, 16, OFFICE_PALETTE.wallInner, 0.6).setDepth(18);
        }
        private createStaticColliders() {
          const room = OFFICE_LAYOUT.room;
          const interior = room.interior;
          const topWallY = interior.y - room.topWallHeight;

          // Room shell colliders match the visible wall masses so the player
          // cannot walk through the rendered partitions.
          const wallRects = [
            {
              x: interior.x - 24 + (interior.width + 88) / 2,
              y: topWallY + room.topWallHeight / 2,
              width: interior.width + 88,
              height: room.topWallHeight,
            },
            {
              x: interior.x + interior.width + room.rightWallWidth / 2,
              y: interior.y - 4 + (interior.height + 52) / 2,
              width: room.rightWallWidth,
              height: interior.height + 52,
            },
            ...room.leftWallSegments.map((segment) => ({
              x: segment.x + segment.width / 2,
              y: segment.y + segment.height / 2,
              width: segment.width,
              height: segment.height,
            })),
            ...room.bottomWallSegments.map((segment) => ({
              x: segment.x + segment.width / 2,
              y: segment.y + segment.height / 2,
              width: segment.width,
              height: segment.height,
            })),
          ];

          wallRects.forEach((rect) => {
            const obstacle = this.add.rectangle(rect.x, rect.y, rect.width, rect.height, 0x000000, 0);
            this.physics.add.existing(obstacle, true);
            this.staticObstacles.push(obstacle);
          });

          OFFICE_LAYOUT.collisionRects.forEach((rect) => {
            const obstacle = this.add.rectangle(rect.x, rect.y, rect.width, rect.height, 0x000000, 0);
            this.physics.add.existing(obstacle, true);
            this.staticObstacles.push(obstacle);
          });
        }

        /**
         * Draw a desk cluster with pseudo-3D depth.
         *
         * The illusion uses three visible planes:
         *   1. Top surface  — lightest wood tone, the flat horizontal plane
         *   2. Front face   — medium-dark, the vertical face closest to the camera
         *   3. Right side   — darkest, the narrow vertical face on the right edge
         *
         * A bright edge seam separates the top from the front face so the two
         * planes read as distinct even at small sizes.
         */
        private addDeskCluster(
          PhaserLib: typeof import("phaser"),
          cluster: OfficeDeskCluster,
          isPrimary: boolean,
        ) {
          const depth = cluster.desk.y + cluster.desk.height / 2;

          // ── Tuning constants ──────────────────────────────────────────
          const FRONT_FACE_H = 16;          // px height of the visible front face
          const SIDE_FACE_W = 10;           // px width of the visible right side face
          const EDGE_SEAM_H = 2;            // bright seam between top & front
          const DRAWER_W = Math.max(28, Math.round(cluster.desk.width * 0.28));
          const LEG_W = 8;
          const LEG_H = 14;

          // Colours derived from the palette with manual darkening for each plane
          const topColor     = OFFICE_PALETTE.deskTop;      // 0x917356  lightest
          const frontColor   = OFFICE_PALETTE.deskFront;    // 0x785e47  mid
          const sideColor    = OFFICE_PALETTE.deskDrawer;   // 0x69523e  darkest
          const seamColor    = 0xc2a07d;                    // bright wood highlight
          const legColor     = OFFICE_PALETTE.deskLeg;

          // ── Area rug ──────────────────────────────────────────────────
          const rug = this.add.rectangle(
            cluster.rug.x,
            cluster.rug.y,
            cluster.rug.width,
            cluster.rug.height,
            isPrimary ? OFFICE_PALETTE.zonePrimary : OFFICE_PALETTE.zoneSecondary,
            0.58,
          );
          rug.setDepth(depth - 18);
          // no stroke — clean ground

          // ── Ground shadow ─────────────────────────────────────────────
          this.addGroundShadow(
            cluster.desk.x + 6,
            cluster.desk.y + cluster.desk.height / 2 + FRONT_FACE_H / 2 + 8,
            cluster.desk.width + SIDE_FACE_W + 28,
            FRONT_FACE_H + cluster.desk.height * 0.5,
            isPrimary ? 0.22 : 0.16,
            depth - 10,
          );

          // ── Back legs (behind the desk, partially hidden) ─────────────
          this.add
            .rectangle(
              cluster.desk.x - cluster.desk.width / 2 + 14,
              cluster.desk.y - cluster.desk.height / 2 + LEG_H / 2 + 2,
              LEG_W, LEG_H, legColor, 0.5,
            )
            .setDepth(depth - 2);
          this.add
            .rectangle(
              cluster.desk.x + cluster.desk.width / 2 - 14 + SIDE_FACE_W,
              cluster.desk.y - cluster.desk.height / 2 + LEG_H / 2 + 2,
              LEG_W, LEG_H, legColor, 0.4,
            )
            .setDepth(depth - 2);

          // ── Top surface (the flat horizontal plane) ───────────────────
          const deskSurface = this.add.rectangle(
            cluster.desk.x,
            cluster.desk.y,
            cluster.desk.width,
            cluster.desk.height,
            topColor,
            1,
          );
          deskSurface.setDepth(depth);
          // Subtle stroke on top surface only (not the whole block)
          deskSurface.setStrokeStyle(1, frontColor, 0.6);

          // Top surface back-edge highlight (light catching the far edge)
          this.add
            .rectangle(
              cluster.desk.x,
              cluster.desk.y - cluster.desk.height / 2 + 2,
              cluster.desk.width - 4,
              3,
              seamColor, 0.3,
            )
            .setDepth(depth + 1);

          // ── Edge seam (bright line between top surface and front face) ─
          this.add
            .rectangle(
              cluster.desk.x + SIDE_FACE_W / 2,
              cluster.desk.y + cluster.desk.height / 2 + EDGE_SEAM_H / 2,
              cluster.desk.width + SIDE_FACE_W - 2,
              EDGE_SEAM_H,
              seamColor, 0.45,
            )
            .setDepth(depth + 2);

          // ── Front face (vertical face facing the camera) ──────────────
          const frontY = cluster.desk.y + cluster.desk.height / 2 + EDGE_SEAM_H + FRONT_FACE_H / 2;
          this.add
            .rectangle(
              cluster.desk.x + SIDE_FACE_W / 2,
              frontY,
              cluster.desk.width + SIDE_FACE_W - 2,
              FRONT_FACE_H,
              frontColor, 1,
            )
            .setDepth(depth + 2);

          // Front face bottom edge (dark line where front meets floor shadow)
          this.add
            .rectangle(
              cluster.desk.x + SIDE_FACE_W / 2,
              frontY + FRONT_FACE_H / 2 - 1,
              cluster.desk.width + SIDE_FACE_W - 6,
              2,
              sideColor, 0.5,
            )
            .setDepth(depth + 3);

          // ── Right side face (narrow vertical strip on the right) ──────
          const sideX = cluster.desk.x + cluster.desk.width / 2 + SIDE_FACE_W / 2;
          const sideH = cluster.desk.height + EDGE_SEAM_H + FRONT_FACE_H;
          this.add
            .rectangle(
              sideX,
              cluster.desk.y + (EDGE_SEAM_H + FRONT_FACE_H) / 2,
              SIDE_FACE_W,
              sideH,
              sideColor, 1,
            )
            .setDepth(depth + 1);

          // Right side highlight (thin bright edge at top-right corner)
          this.add
            .rectangle(
              sideX,
              cluster.desk.y - cluster.desk.height / 2 + 3,
              SIDE_FACE_W - 2,
              3,
              seamColor, 0.18,
            )
            .setDepth(depth + 2);

          // ── Drawer wells (cut into the front face) ────────────────────
          const drawerX = cluster.desk.x + cluster.desk.width / 2 - DRAWER_W / 2;
          // Upper drawer
          this.add
            .rectangle(drawerX, frontY - 3, DRAWER_W - 4, FRONT_FACE_H / 2 - 2, 0x5e4835, 1)
            .setDepth(depth + 3);
          this.add
            .rectangle(drawerX, frontY - 3, DRAWER_W - 12, 2, seamColor, 0.24)
            .setDepth(depth + 4);
          // Lower drawer
          this.add
            .rectangle(drawerX, frontY + 4, DRAWER_W - 4, FRONT_FACE_H / 2 - 3, 0x5e4835, 1)
            .setDepth(depth + 3);
          this.add
            .rectangle(drawerX, frontY + 4, DRAWER_W - 12, 2, seamColor, 0.18)
            .setDepth(depth + 4);
          // Drawer divider line
          this.add
            .rectangle(drawerX, frontY + 0.5, DRAWER_W - 6, 1, seamColor, 0.3)
            .setDepth(depth + 4);

          // ── Front legs (visible below the front face) ─────────────────
          this.add
            .rectangle(
              cluster.desk.x - cluster.desk.width / 2 + 14,
              frontY + FRONT_FACE_H / 2 + LEG_H / 2,
              LEG_W, LEG_H, legColor, 0.92,
            )
            .setDepth(depth + 2);
          this.add
            .rectangle(
              cluster.desk.x + cluster.desk.width / 2 - 14,
              frontY + FRONT_FACE_H / 2 + LEG_H / 2,
              LEG_W, LEG_H, legColor, 0.88,
            )
            .setDepth(depth + 2);

          // ── Screen glow (ambient light from the monitor) ──────────────
          const screenGlow = this.add.ellipse(
            cluster.screenGlow.x,
            cluster.screenGlow.y,
            cluster.screenGlow.radius * 1.2,
            cluster.screenGlow.radius * 0.72,
            cluster.accentColor,
            cluster.screenGlow.alpha,
          );
          screenGlow.setBlendMode(PhaserLib.BlendModes.SCREEN);
          screenGlow.setDepth(depth - 1);

          // ── Monitor (stand + frame + screen) ──────────────────────────
          // Stand neck
          this.add
            .rectangle(cluster.laptop.x, cluster.laptop.y + cluster.laptop.height / 2 + 3, 4, 8, OFFICE_PALETTE.monitorFrame, 0.7)
            .setDepth(depth + 3);
          // Stand base
          this.add
            .rectangle(cluster.laptop.x, cluster.laptop.y + cluster.laptop.height / 2 + 8, 20, 4, OFFICE_PALETTE.monitorFrame, 0.55)
            .setDepth(depth + 3);
          // Frame
          const monitorFrame = this.add.rectangle(
            cluster.laptop.x,
            cluster.laptop.y,
            cluster.laptop.width,
            cluster.laptop.height,
            OFFICE_PALETTE.monitorFrame, 1,
          );
          monitorFrame.setDepth(depth + 4);
          monitorFrame.setStrokeStyle(2, 0xffffff, isPrimary ? 0.14 : 0.08);
          // Screen
          this.add
            .rectangle(
              cluster.laptop.x,
              cluster.laptop.y,
              cluster.laptop.width - 8,
              cluster.laptop.height - 8,
              OFFICE_PALETTE.monitor,
              isPrimary ? 0.96 : 0.76,
            )
            .setDepth(depth + 5);
          // Screen highlight bar
          this.add
            .rectangle(
              cluster.laptop.x,
              cluster.laptop.y - 5,
              cluster.laptop.width - 14,
              3,
              0xffffff,
              isPrimary ? 0.18 : 0.12,
            )
            .setDepth(depth + 6);
          // Power LED
          this.add
            .circle(
              cluster.laptop.x + cluster.laptop.width / 2 - 6,
              cluster.laptop.y + cluster.laptop.height / 2 - 5,
              2,
              OFFICE_PALETTE.deviceLight,
              0.85,
            )
            .setDepth(depth + 6);

          // ── Keyboard + mouse ──────────────────────────────────────────
          this.add
            .rectangle(cluster.keyboard.x, cluster.keyboard.y, cluster.keyboard.width, cluster.keyboard.height, 0x2b3644, 1)
            .setDepth(depth + 3);
          this.add
            .rectangle(cluster.keyboard.x, cluster.keyboard.y - 1, cluster.keyboard.width - 10, 2, 0xffffff, 0.08)
            .setDepth(depth + 4);
          // Mouse
          this.add
            .ellipse(cluster.keyboard.x + cluster.keyboard.width / 2 + 14, cluster.keyboard.y + 1, 8, 12, 0x2b3644, 0.9)
            .setDepth(depth + 3);

          // ── Desk accessories ──────────────────────────────────────────
          if (cluster.mug) {
            // Mug shadow
            this.add.ellipse(cluster.mug.x + 1, cluster.mug.y + 4, 16, 8, 0x000000, 0.1).setDepth(depth + 3);
            // Mug body
            this.add.circle(cluster.mug.x, cluster.mug.y, 7, 0xf1eee7, 0.92).setDepth(depth + 5);
            // Handle
            this.add.rectangle(cluster.mug.x + 6, cluster.mug.y, 3, 6, 0xf1eee7, 0.4).setDepth(depth + 5);
          }

          if (cluster.lamp) {
            this.add.rectangle(cluster.lamp.x, cluster.lamp.y + 10, 5, 20, legColor, 0.9).setDepth(depth + 3);
            this.add.rectangle(cluster.lamp.x, cluster.lamp.y, 16, 10, OFFICE_PALETTE.wallCap, 0.84).setDepth(depth + 4);
            this.add
              .ellipse(cluster.lamp.x + 12, cluster.lamp.y + 4, 42, 22, OFFICE_PALETTE.focusGlow, isPrimary ? 0.08 : 0.04)
              .setBlendMode(PhaserLib.BlendModes.SCREEN)
              .setDepth(depth + 1);
          }

          // ── Player desk extras ────────────────────────────────────────
          if (isPrimary) {
            // Notebook on left side of desk
            this.add
              .rectangle(cluster.desk.x - cluster.desk.width / 2 + 20, cluster.desk.y + 2, 20, 26, 0xf0eee8, 0.78)
              .setRotation(-0.08)
              .setDepth(depth + 3);
            this.add
              .rectangle(cluster.desk.x - cluster.desk.width / 2 + 21, cluster.desk.y + 2, 16, 20, 0xe2ddd4, 0.5)
              .setRotation(-0.08)
              .setDepth(depth + 4);
            // Pen
            this.add
              .rectangle(cluster.desk.x - cluster.desk.width / 2 + 36, cluster.desk.y + 8, 18, 2, 0x3a4a5e, 0.6)
              .setRotation(0.25)
              .setDepth(depth + 5);

            // Monitor label glow (subtle bar above the player monitor)
            this.add.rectangle(cluster.laptop.x, cluster.laptop.y - 24, cluster.laptop.width + 18, 6, OFFICE_PALETTE.focusGlow, 0.18).setDepth(depth + 6);
            this.primaryMonitorGlow = screenGlow;
          }

          this.addChair(cluster, depth + 8, isPrimary);
        }

        /**
         * Chair with three-plane pseudo-3D: seat top, front cushion face, side strip.
         * Backrest sits behind the seat as a separate block.
         */
        private addChair(cluster: OfficeDeskCluster, depth: number, isPrimary: boolean) {
          const FRONT_H = 8;
          const SIDE_W = 6;
          const cw = cluster.chair.width;
          const ch = cluster.chair.height - 4;
          const cx = cluster.chair.x;
          const cy = cluster.chair.y;
          const seatColor = OFFICE_PALETTE.chair;          // 0x355f87
          const frontColor = 0x2a4e70;
          const sideColor  = 0x234060;
          const accentColor = isPrimary ? OFFICE_PALETTE.chairAccent : OFFICE_PALETTE.wallTrim;

          // Ground shadow
          this.addGroundShadow(cx + 2, cy + ch / 2 + FRONT_H + 6, cw + SIDE_W + 16, 14, 0.16, depth - 2);

          // Backrest (behind the seat)
          this.add.rectangle(cx, cy - ch / 2 - 8, cw - 8, 14, accentColor, isPrimary ? 0.82 : 0.58).setDepth(depth - 1);
          // Backrest front face
          this.add.rectangle(cx + SIDE_W / 2, cy - ch / 2 - 1, cw - 8 + SIDE_W, 3, 0xffffff, 0.06).setDepth(depth);

          // Seat top surface
          this.add.rectangle(cx, cy, cw, ch, seatColor, 1).setStrokeStyle(1, frontColor, 0.5).setDepth(depth);
          // Seat top highlight
          this.add.rectangle(cx, cy - ch / 2 + 2, cw - 6, 3, 0xffffff, 0.08).setDepth(depth + 1);

          // Seat front face
          this.add.rectangle(cx + SIDE_W / 2, cy + ch / 2 + FRONT_H / 2 + 1, cw + SIDE_W, FRONT_H, frontColor, 1).setDepth(depth + 1);
          // Seat right side
          this.add.rectangle(cx + cw / 2 + SIDE_W / 2, cy + FRONT_H / 2, SIDE_W, ch + FRONT_H, sideColor, 1).setDepth(depth + 1);

          // Pedestal (central pole + base star)
          this.add.rectangle(cx, cy + ch / 2 + FRONT_H + 4, 5, 10, OFFICE_PALETTE.deskLeg, 0.88).setDepth(depth + 2);
          this.add.rectangle(cx, cy + ch / 2 + FRONT_H + 9, 18, 4, OFFICE_PALETTE.deskLeg, 0.7).setDepth(depth + 2);
          // Casters
          this.add.circle(cx - 8, cy + ch / 2 + FRONT_H + 10, 2, 0x293341, 0.85).setDepth(depth + 3);
          this.add.circle(cx + 8, cy + ch / 2 + FRONT_H + 10, 2, 0x293341, 0.85).setDepth(depth + 3);
        }
        /**
         * Whiteboard mounted on the back wall.
         * Three-plane: board face (top), bottom frame ledge (front), right frame edge (side).
         */
        private addWhiteboard() {
          const wb = OFFICE_LAYOUT.whiteboard;
          const LEDGE_H = 8;   // pen tray / bottom ledge
          const SIDE_W = 6;    // right frame edge
          const noteSize = Math.max(12, Math.round(wb.height * 0.18));
          const leftColumnX = wb.x - wb.width * 0.22;
          const rightColumnX = wb.x + wb.width * 0.24;
          const lineWidth = Math.round(wb.width * 0.5);
          const accentWidth = Math.round(wb.width * 0.18);
          const baseDepth = 220;

          // Wall shadow
          this.add.rectangle(wb.x + 4, wb.y + 6, wb.width + 10, wb.height + LEDGE_H + 10, 0x000000, 0.12).setDepth(baseDepth);

          // Board face (the white surface)
          this.add.rectangle(wb.x, wb.y, wb.width, wb.height, 0xf2f5f8, 1).setStrokeStyle(3, 0x657180, 0.9).setDepth(baseDepth + 1);
          // Top edge highlight
          this.add.rectangle(wb.x, wb.y - wb.height / 2 + 2, wb.width - 8, 3, 0xffffff, 0.25).setDepth(baseDepth + 2);

          // Bottom ledge (front face — the pen tray)
          this.add.rectangle(wb.x + SIDE_W / 2, wb.y + wb.height / 2 + LEDGE_H / 2 + 1, wb.width + SIDE_W, LEDGE_H, 0xa5aeb8, 1).setDepth(baseDepth + 2);
          // Ledge seam
          this.add.rectangle(wb.x + SIDE_W / 2, wb.y + wb.height / 2 + 1, wb.width + SIDE_W - 4, 2, 0xc8d0da, 0.6).setDepth(baseDepth + 3);

          // Right frame edge (side face)
          this.add.rectangle(wb.x + wb.width / 2 + SIDE_W / 2, wb.y + LEDGE_H / 2, SIDE_W, wb.height + LEDGE_H, 0x8a93a1, 1).setDepth(baseDepth + 2);

          // Marker tray items on the ledge
          this.add.rectangle(wb.x - wb.width * 0.24, wb.y + wb.height / 2 + LEDGE_H / 2 + 1, 14, 4, 0x445166, 0.9).setDepth(baseDepth + 4);
          this.add.rectangle(wb.x - wb.width * 0.12, wb.y + wb.height / 2 + LEDGE_H / 2 + 1, 14, 4, OFFICE_PALETTE.stickyWarm, 0.8).setDepth(baseDepth + 4);
          this.add.circle(wb.x + wb.width * 0.3, wb.y + wb.height / 2 + LEDGE_H / 2 + 1, 4, 0xe7edf4, 0.9).setDepth(baseDepth + 4);

          // Sticky notes
          wb.stickyNotes.forEach((note, i) => {
            this.add.rectangle(
              wb.x - wb.width * 0.28 + i * (noteSize + 10),
              wb.y - wb.height * 0.18 + (i % 2 === 0 ? 0 : 8),
              noteSize,
              noteSize,
              note.color,
              0.95,
              ).setDepth(baseDepth + 3);
          });

          // Written lines
          for (let row = 0; row < 4; row += 1) {
            const rowY = wb.y - wb.height * 0.18 + row * Math.round(wb.height * 0.18);
            this.add.rectangle(leftColumnX, rowY, lineWidth, 2, 0x5c6674, 0.42).setDepth(baseDepth + 3);
            this.add.rectangle(
              rightColumnX,
              rowY,
              accentWidth,
              2,
              row % 2 === 0 ? OFFICE_PALETTE.stickyAccent : OFFICE_PALETTE.stickyWarm,
              0.44,
            ).setDepth(baseDepth + 3);
          }
        }

        /**
         * Printer counter + printer on top + filing cabinet below.
         * Each piece uses the three-plane block system.
         */
        private addPrinterArea() {
          const pa = OFFICE_LAYOUT.printerArea;
          const FRONT_H = 12;
          const SIDE_W = 8;

          // ── Counter (top + front + side) ──────────────────────────────
          const cDepth = pa.counter.y + pa.counter.height / 2;
          this.addGroundShadow(pa.counter.x + 4, pa.counter.y + pa.counter.height / 2 + FRONT_H + 4, pa.counter.width + SIDE_W + 20, 16, 0.16, cDepth - 4);

          const cx = pa.counter.x;
          const cy = pa.counter.y;
          const cw = pa.counter.width;
          const ch = pa.counter.height;
          const cTopColor   = OFFICE_PALETTE.storage;  // lightest
          const cFrontColor = 0x65715a;                // medium
          const cSideColor  = 0x586050;                // darkest
          const cSeamColor  = 0xa3b097;

          // Top surface
          this.add.rectangle(cx, cy, cw, ch, cTopColor, 1).setDepth(cDepth);
          // Back-edge highlight
          this.add.rectangle(cx, cy - ch / 2 + 2, cw - 6, 2, cSeamColor, 0.35).setDepth(cDepth + 1);
          // Edge seam
          this.add.rectangle(cx + SIDE_W / 2, cy + ch / 2 + 1, cw + SIDE_W, 2, cSeamColor, 0.5).setDepth(cDepth + 2);
          // Front face
          this.add.rectangle(cx + SIDE_W / 2, cy + ch / 2 + FRONT_H / 2 + 2, cw + SIDE_W, FRONT_H, cFrontColor, 1).setDepth(cDepth + 2);
          // Right side
          this.add.rectangle(cx + cw / 2 + SIDE_W / 2, cy + FRONT_H / 2 + 1, SIDE_W, ch + FRONT_H, cSideColor, 1).setDepth(cDepth + 1);

          // ── Printer (sitting on counter top) ──────────────────────────
          const pFront = 14;
          const pSide = 8;
          const pDepth = cDepth + 4;

          const px = pa.printer.x;
          const py = pa.printer.y;
          const pw = pa.printer.width;
          const ph = pa.printer.height;

          const pTopColor   = 0xdce2ea;   // lightest — top surface
          const pFrontColor = 0xc0c8d2;   // medium — front face
          const pSideColor  = 0xa8b2be;   // darkest — right side
          const pSeamColor  = 0xe8ecf0;   // bright seam

          // Top surface
          this.add.rectangle(px, py, pw, ph, pTopColor, 1).setDepth(pDepth);
          // Back-edge highlight
          this.add.rectangle(px, py - ph / 2 + 2, pw - 6, 2, pSeamColor, 0.5).setDepth(pDepth + 1);
          // Edge seam (between top and front)
          this.add.rectangle(px + pSide / 2, py + ph / 2 + 1, pw + pSide, 2, pSeamColor, 0.6).setDepth(pDepth + 1);
          // Front face
          this.add.rectangle(px + pSide / 2, py + ph / 2 + pFront / 2 + 2, pw + pSide, pFront, pFrontColor, 1).setDepth(pDepth + 1);
          // Right side face
          this.add.rectangle(px + pw / 2 + pSide / 2, py + pFront / 2 + 1, pSide, ph + pFront, pSideColor, 1).setDepth(pDepth + 1);
          // Paper output tray (on top, near back)
          this.add.rectangle(px - 8, py - ph / 2 + 6, pw * 0.5, 6, 0xf4f7fb, 0.9).setDepth(pDepth + 2);
          this.add.rectangle(px - 8, py - ph / 2 + 10, pw * 0.5 + 4, 2, pFrontColor, 0.5).setDepth(pDepth + 2);
          // Paper feed slot (dark recess on front face)
          this.add.rectangle(px - 4, py + ph / 2 + 5, 28, 4, 0x8a93a1, 0.8).setDepth(pDepth + 2);
          // Control panel (small dark area on front face)
          this.add.rectangle(px + 12, py + ph / 2 + 10, 16, 6, 0x3a4450, 0.7).setDepth(pDepth + 2);
          // Status LED
          this.add.circle(px + pw / 2 - 6, py - 2, 3, OFFICE_PALETTE.deviceLight, 0.9).setDepth(pDepth + 2);

          // ── Filing cabinet (three-plane + drawers) ────────────────────
          // Tall cabinet: small top surface, large front face with drawers
          const fc = pa.filingCabinet;
          const fcTopH = 10;           // narrow top strip (looking down at top of tall cabinet)
          const fcFrontH = fc.height;  // front face IS the dominant area — full layout height
          const fcSide = 10;
          const fcDepth = fc.y + fcTopH + fcFrontH / 2;

          const fcTopColor   = 0x96a88c;   // lightest
          const fcFrontColor = OFFICE_PALETTE.filing; // 0x7e8d75
          const fcSideColor  = 0x5e6e53;   // darkest
          const fcSeamColor  = 0xacb8a2;

          // Ground shadow (tight)
          this.addGroundShadow(fc.x + fcSide / 2 + 2, fc.y + fcTopH + fcFrontH + 2, fc.width + fcSide + 8, 10, 0.18, fcDepth - 4);

          // Top surface (narrow strip — the top of a tall cabinet seen from above)
          this.add.rectangle(fc.x, fc.y + fcTopH / 2, fc.width, fcTopH, fcTopColor, 1).setDepth(fcDepth);
          // Seam between top and front
          this.add.rectangle(fc.x + fcSide / 2, fc.y + fcTopH + 1, fc.width + fcSide, 2, fcSeamColor, 0.5).setDepth(fcDepth + 1);

          // Front face (tall — this is what you mainly see)
          this.add.rectangle(fc.x + fcSide / 2, fc.y + fcTopH + fcFrontH / 2 + 2, fc.width + fcSide, fcFrontH, fcFrontColor, 1).setDepth(fcDepth + 1);
          // Right side face
          this.add.rectangle(fc.x + fc.width / 2 + fcSide / 2, fc.y + fcTopH / 2 + fcFrontH / 2 + 1, fcSide, fcTopH + fcFrontH, fcSideColor, 1).setDepth(fcDepth + 1);
          // Bottom contact line
          this.add.rectangle(fc.x + fcSide / 2, fc.y + fcTopH + fcFrontH + 1, fc.width + fcSide, 2, 0x4a5547, 0.5).setDepth(fcDepth + 2);

          // Drawers (inset into the front face)
          const numDrawers = 3;
          const drawerPad = 4;
          const drawerGap = 3;
          const drawerAreaH = fcFrontH - drawerPad * 2;
          const drawerH = Math.floor((drawerAreaH - (numDrawers - 1) * drawerGap) / numDrawers);
          const drawerStartY = fc.y + fcTopH + drawerPad + 2;
          for (let d = 0; d < numDrawers; d += 1) {
            const dy = drawerStartY + d * (drawerH + drawerGap) + drawerH / 2;
            // Drawer face
            this.add.rectangle(fc.x, dy, fc.width - 6, drawerH, 0x8a9c80, 1).setDepth(fcDepth + 2);
            // Dark line at top (recess shadow)
            this.add.rectangle(fc.x, dy - drawerH / 2 + 1, fc.width - 8, 1.5, 0x5c6b52, 0.7).setDepth(fcDepth + 3);
            // Handle
            this.add.rectangle(fc.x + 4, dy, 16, 3, 0xd4dece, 0.7).setDepth(fcDepth + 3);
          }

          // Paper stacks on counter
          pa.paperStacks.forEach((stack) => {
            this.add.rectangle(stack.x, stack.y, stack.width, stack.height, 0xf4f7fb, 0.96).setDepth(cDepth + 3);
            this.add.rectangle(stack.x, stack.y - 2, stack.width - 4, 2, 0xffffff, 0.35).setDepth(cDepth + 4);
          });
        }

        /**
         * Coffee station: counter + coffee machine on top + cups.
         * Both the counter and the machine use the three-plane block system.
         */
        private addCoffeeStation() {
          const cs = OFFICE_LAYOUT.coffeeStation;
          const FRONT_H = 12;
          const SIDE_W = 8;

          // ── Counter ───────────────────────────────────────────────────
          const cDepth = cs.counter.y + cs.counter.height / 2;
          this.addGroundShadow(cs.counter.x + 2, cs.counter.y + cs.counter.height / 2 + FRONT_H + 4, cs.counter.width + SIDE_W + 18, 14, 0.14, cDepth - 4);

          // Top surface
          this.add.rectangle(cs.counter.x, cs.counter.y, cs.counter.width, cs.counter.height, OFFICE_PALETTE.coffeeDark, 1)
            .setStrokeStyle(1, 0x4e351f, 0.5).setDepth(cDepth);
          this.add.rectangle(cs.counter.x, cs.counter.y - cs.counter.height / 2 + 2, cs.counter.width - 6, 3, 0xffffff, 0.06).setDepth(cDepth + 1);
          // Edge seam
          this.add.rectangle(cs.counter.x + SIDE_W / 2, cs.counter.y + cs.counter.height / 2 + 1, cs.counter.width + SIDE_W, 2, 0x8a6238, 0.35).setDepth(cDepth + 2);
          // Front face
          this.add.rectangle(cs.counter.x + SIDE_W / 2, cs.counter.y + cs.counter.height / 2 + FRONT_H / 2 + 2, cs.counter.width + SIDE_W, FRONT_H, 0x4e351f, 1).setDepth(cDepth + 2);
          // Right side
          this.add.rectangle(cs.counter.x + cs.counter.width / 2 + SIDE_W / 2, cs.counter.y + FRONT_H / 2 + 1, SIDE_W, cs.counter.height + FRONT_H, 0x3e2a18, 1).setDepth(cDepth + 1);

          // ── Coffee machine (block on counter) ─────────────────────────
          const mx = cs.machine.x;
          const my = cs.machine.y;
          const mw = cs.machine.width;
          const mh = cs.machine.height;
          const mFront = 10;
          const mSide = 6;
          const mDepth = my + mh / 2;

          // Top surface
          this.add.rectangle(mx, my, mw, mh, OFFICE_PALETTE.monitorFrame, 1).setStrokeStyle(1, 0x2e3948, 0.5).setDepth(mDepth);
          this.add.rectangle(mx, my - mh / 2 + 2, mw - 6, 3, 0xffffff, 0.06).setDepth(mDepth + 1);
          // Edge seam
          this.add.rectangle(mx + mSide / 2, my + mh / 2 + 1, mw + mSide, 2, 0x4a5a6e, 0.3).setDepth(mDepth + 2);
          // Front face
          this.add.rectangle(mx + mSide / 2, my + mh / 2 + mFront / 2 + 2, mw + mSide, mFront, 0x1a2430, 1).setDepth(mDepth + 2);
          // Right side
          this.add.rectangle(mx + mw / 2 + mSide / 2, my + mFront / 2 + 1, mSide, mh + mFront, 0x141c26, 1).setDepth(mDepth + 1);
          // Control panel on front face
          this.add.rectangle(mx - 6, my + mh / 2 + mFront / 2 + 2, 18, 6, 0x161c24, 0.7).setDepth(mDepth + 3);
          // Status LED
          this.add.circle(mx + 12, my - mh / 2 + 6, 3, OFFICE_PALETTE.deviceLight, 0.84).setDepth(mDepth + 1);
          // Drip tray on front face
          this.add.rectangle(mx + 4, my + mh / 2 + mFront - 1, 14, 3, 0xb7c3cf, 0.45).setDepth(mDepth + 3);

          // ── Cups on counter ───────────────────────────────────────────
          cs.cups.forEach((cup) => {
            this.add.circle(cup.x, cup.y, 6, 0xf0ece4, 0.85).setDepth(cDepth + 3);
            this.add.rectangle(cup.x + 5, cup.y, 3, 5, 0xf0ece4, 0.3).setDepth(cDepth + 3);
            this.add.circle(cup.x, cup.y - 1, 3, 0x8d6438, 0.38).setDepth(cDepth + 4);
          });
        }

        /**
         * Storage shelf (three-plane block) + boxes (three-plane each) + plant.
         */
        private addShelfArea() {
          const sa = OFFICE_LAYOUT.shelfArea;
          const FRONT_H = 14;
          const SIDE_W = 8;

          // ── Shelf unit (top + front + side + internal shelves) ────────
          const ss = sa.storageShelf;
          const sDepth = ss.y + ss.height / 2;
          this.addGroundShadow(ss.x + 4, ss.y + ss.height / 2 + FRONT_H + 4, ss.width + SIDE_W + 18, 16, 0.16, sDepth - 4);

          // Top surface
          this.add.rectangle(ss.x, ss.y - ss.height / 2 + 4, ss.width, 8, OFFICE_PALETTE.storage, 1).setDepth(sDepth);
          this.add.rectangle(ss.x, ss.y - ss.height / 2 + 2, ss.width - 6, 3, 0xa3b097, 0.45).setDepth(sDepth + 1);
          // Edge seam
          this.add.rectangle(ss.x + SIDE_W / 2, ss.y - ss.height / 2 + 9, ss.width + SIDE_W - 4, 2, 0xa3b097, 0.3).setDepth(sDepth + 2);
          // Front face (holds the shelf dividers)
          this.add.rectangle(ss.x + SIDE_W / 2, ss.y + 4, ss.width + SIDE_W, ss.height, OFFICE_PALETTE.storage, 1).setDepth(sDepth + 1);
          // Right side
          this.add.rectangle(ss.x + ss.width / 2 + SIDE_W / 2, ss.y + 4, SIDE_W, ss.height, 0x5f6b58, 1).setDepth(sDepth + 1);
          // Bottom dark edge
          this.add.rectangle(ss.x + SIDE_W / 2, ss.y + ss.height / 2 + 3, ss.width + SIDE_W - 4, 2, 0x4a5547, 0.4).setDepth(sDepth + 2);

          // Internal shelf dividers (horizontal lines on the front face)
          [-22, 6, 34].forEach((offset) => {
            this.add.rectangle(ss.x, ss.y + offset, ss.width - 8, 4, 0x606b59, 1).setDepth(sDepth + 2);
            // Shelf edge highlight
            this.add.rectangle(ss.x, ss.y + offset - 2, ss.width - 12, 1.5, 0xa3b097, 0.2).setDepth(sDepth + 3);
          });

          // ── Boxes (each is a small three-plane block) ─────────────────
          sa.boxes.forEach((box) => {
            const bx = box.x;
            const by = box.y;
            const bw = box.width;
            const bh = box.height;
            const bFront = 8;
            const bSide = 5;
            const bDepth = by + bh / 2;

            // Top surface
            this.add.rectangle(bx, by, bw, bh, 0x7b654a, 0.96).setStrokeStyle(1, 0x5f4d39, 0.4).setDepth(bDepth);
            this.add.rectangle(bx, by - bh / 2 + 2, bw - 4, 2, 0xc6aa7f, 0.3).setDepth(bDepth + 1);
            // Tape cross
            this.add.rectangle(bx, by, bw - 6, 2, 0xc6aa7f, 0.22).setDepth(bDepth + 1);
            // Front face
            this.add.rectangle(bx + bSide / 2, by + bh / 2 + bFront / 2 + 1, bw + bSide, bFront, 0x634e38, 1).setDepth(bDepth + 1);
            // Right side
            this.add.rectangle(bx + bw / 2 + bSide / 2, by + bFront / 2, bSide, bh + bFront, 0x5a4530, 1).setDepth(bDepth + 1);
          });

          // ── Plant ─────────────────────────────────────────────────────
          const px = sa.plant.x;
          const py = sa.plant.y;
          const pr = sa.plant.radius;
          // Pot (small front face to give depth)
          this.add.circle(px, py + 12, pr - 6, OFFICE_PALETTE.plantPot, 0.96).setDepth(py + 24);
          this.add.rectangle(px, py + pr + 2, pr * 1.2, 4, 0x5a4230, 0.5).setDepth(py + 25);
          // Stem
          this.add.rectangle(px, py + 2, 4, 12, 0x5b6a43, 0.7).setDepth(py + 25);
          // Leaves
          this.add.circle(px, py - 4, pr, OFFICE_PALETTE.plantLeaf, 1).setDepth(py + 25);
          this.add.circle(px - 12, py - 10, pr - 6, 0x4f6e4e, 1).setDepth(py + 26);
          this.add.circle(px + 12, py - 10, pr - 8, 0x486449, 1).setDepth(py + 26);

          // ── Cables ────────────────────────────────────────────────────
          OFFICE_LAYOUT.cableRuns.forEach((cable) => {
            this.add.rectangle(cable.x, cable.y, cable.width, cable.height, OFFICE_PALETTE.cable, 0.95).setDepth(86);
          });
        }

        private createDeskFocus() {
          const rug = OFFICE_LAYOUT.playerDesk.rug;
          const desk = OFFICE_LAYOUT.playerDesk.desk;
          const interaction = OFFICE_LAYOUT.playerDesk.interactionPoint;

          // Keep the interaction focus crisp and geometric so the desk stands out
          // as the task destination without adding noisy effects to the whole room.
          this.deskFocusPlate = this.add.rectangle(rug.x, rug.y, rug.width + 14, rug.height + 14, OFFICE_PALETTE.focus, 0.07);
          this.deskFocusPlate.setDepth(68);
          this.deskFocusPlate.setStrokeStyle(2, OFFICE_PALETTE.focus, 0.16);

          this.deskFocusOutline = this.add.rectangle(desk.x, desk.y + 6, desk.width + 26, desk.height + 34, OFFICE_PALETTE.focus, 0);
          this.deskFocusOutline.setDepth(69);
          this.deskFocusOutline.setStrokeStyle(3, OFFICE_PALETTE.focus, 0.18);

          this.deskFocusPulse = this.add.ellipse(interaction.x, interaction.y + 8, 116, 42, OFFICE_PALETTE.focusGlow, 0.1);
          this.deskFocusPulse.setDepth(70);
        }

        private createActors() {
          this.playerBody = this.add.rectangle(OFFICE_LAYOUT.spawn.x, OFFICE_LAYOUT.spawn.y, 28, 42, 0x000000, 0);
          this.physics.add.existing(this.playerBody);

          const playerPhysics = this.playerBody.body as Phaser.Physics.Arcade.Body;
          playerPhysics.setCollideWorldBounds(true);
          playerPhysics.setSize(28, 42);

          this.staticObstacles.forEach((obstacle) => {
            this.physics.add.collider(this.playerBody, obstacle);
          });

          this.playerVisual = this.createActorVisual(OFFICE_LAYOUT.spawn.x, OFFICE_LAYOUT.spawn.y, OFFICE_PALETTE.actorBody);

          const coworker = OFFICE_LAYOUT.coworkerBody;
          const coworkerVisual = this.createActorVisual(coworker.x, coworker.y, OFFICE_PALETTE.actorCoworker);
          coworkerVisual.setAlpha(0.92);
          coworkerVisual.setDepth(coworker.y + 32);
        }

        private createActorVisual(x: number, y: number, bodyColor: number) {
          const shadow = this.add.ellipse(0, 16, 34, 16, 0x000000, 0.18);
          const legs = this.add.rectangle(0, 9, 12, 14, 0x2b3441, 1);
          const torso = this.add.rectangle(0, -2, 20, 23, bodyColor, 1);
          torso.setStrokeStyle(1, 0xffffff, 0.14);
          const shoulders = this.add.rectangle(0, -10, 26, 7, bodyColor, 0.92);
          const badge = this.add.rectangle(5, -4, 4, 8, 0xe8eef6, 0.28);
          const armLeft = this.add.rectangle(-12, -2, 4, 16, bodyColor, 0.94);
          const armRight = this.add.rectangle(12, -2, 4, 16, bodyColor, 0.94);
          const head = this.add.circle(0, -18, 9, OFFICE_PALETTE.actorHead, 1);
          const hair = this.add.rectangle(0, -23, 16, 5, 0x6d7784, 0.72);

          return this.add.container(x, y, [shadow, legs, torso, shoulders, badge, armLeft, armRight, head, hair]);
        }

        private syncActorVisuals() {
          this.playerVisual.setPosition(this.playerBody.x, this.playerBody.y);
          this.playerVisual.setDepth(this.playerBody.y + 32);
        }

        private setupCamera() {
          this.cameras.main.startFollow(this.playerBody, true, 0.08, 0.08);
          this.cameras.main.setDeadzone(112, 84);
          this.cameras.main.setZoom(OFFICE_LAYOUT.camera.baseZoom);
        }

        private refreshDeskFocus() {
          const outlineAlpha = this.deskModeActive ? 0.28 : this.isNearDesk ? 0.22 : 0.12;
          const plateAlpha = this.deskModeActive ? 0.18 : this.isNearDesk ? 0.14 : 0.08;
          const pulseAlpha = this.deskModeActive ? 0.22 : this.isNearDesk ? 0.18 : 0.1;
          const scale = this.deskModeActive ? 1.04 : this.isNearDesk ? 1.02 : 1;
          const monitorAlpha = this.deskModeActive ? 0.2 : this.isNearDesk ? 0.16 : 0.12;

          this.tweens.killTweensOf([this.deskFocusPlate, this.deskFocusOutline, this.deskFocusPulse, this.primaryMonitorGlow]);
          this.tweens.add({ targets: this.deskFocusPlate, alpha: plateAlpha, scaleX: scale, scaleY: scale, duration: 220, ease: "Sine.easeInOut" });
          this.tweens.add({ targets: this.deskFocusOutline, alpha: outlineAlpha, scaleX: scale, scaleY: scale, duration: 220, ease: "Sine.easeInOut" });
          this.tweens.add({ targets: this.deskFocusPulse, alpha: pulseAlpha, scaleX: scale, scaleY: scale, duration: 220, ease: "Sine.easeInOut" });
          this.tweens.add({ targets: this.primaryMonitorGlow, alpha: monitorAlpha, duration: 220, ease: "Sine.easeInOut" });
        }

        private startAmbientTweens() {
          this.tweens.add({
            targets: this.deskFocusPulse,
            alpha: { from: 0.08, to: 0.16 },
            scaleX: { from: 0.98, to: 1.04 },
            scaleY: { from: 0.98, to: 1.04 },
            duration: 2200,
            yoyo: true,
            repeat: -1,
            ease: "Sine.easeInOut",
          });

          this.tweens.add({
            targets: this.primaryMonitorGlow,
            alpha: { from: 0.1, to: 0.18 },
            duration: 1800,
            yoyo: true,
            repeat: -1,
            ease: "Sine.easeInOut",
          });
        }

        private addGroundShadow(
          x: number,
          y: number,
          width: number,
          height: number,
          alpha: number,
          depth: number,
        ) {
          return this.add.ellipse(x, y, width, height, 0x000000, alpha).setDepth(depth);
        }
      }

      const game = new Phaser.Game({
        type: Phaser.AUTO,
        parent: containerRef.current,
        width: VIEWPORT_WIDTH,
        height: VIEWPORT_HEIGHT,
        transparent: true,
        physics: { default: "arcade", arcade: { debug: false } },
        scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
        scene: TrustBoundaryRoomScene,
      });

      gameRef.current = game;
      game.events.once("ready", () => {
        const scene = game.scene.getScene("trust-boundary-room");
        if (scene) {
          sceneEventsRef.current = scene.events;
          scene.events.emit("desk-mode", deskMode);
        }
      });
    }

    void bootGame();

    return () => {
      cancelled = true;
      sceneEventsRef.current = null;
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, [deskMode]);

  useEffect(() => {
    sceneEventsRef.current?.emit("desk-mode", deskMode);
  }, [deskMode]);

  return (
    <div className="relative h-full w-full bg-[#0d1016]">
      <div ref={containerRef} className="h-full w-full" />
    </div>
  );
}

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
            .setStrokeStyle(2, OFFICE_PALETTE.floorLine, 0.3)
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
          zoneRect.setStrokeStyle(2, zone.edgeColor, isPrimary ? 0.34 : 0.22);

          this.add
            .rectangle(zone.x + zone.width / 2, zone.y + 10, zone.width - 22, 4, 0xffffff, isPrimary ? 0.08 : 0.05)
            .setDepth(5);
          this.add
            .rectangle(zone.x + 12, zone.y + zone.height / 2, 4, zone.height - 16, zone.edgeColor, isPrimary ? 0.16 : 0.08)
            .setDepth(5);
        }

        private drawRoomBoundaries() {
          const walls = this.add.graphics();
          const room = OFFICE_LAYOUT.room;
          const interior = room.interior;
          const topWallY = interior.y - room.topWallHeight;

          walls.setDepth(16);
          walls.fillStyle(OFFICE_PALETTE.wall, 1);
          walls.fillRect(interior.x - 24, topWallY, interior.width + 88, room.topWallHeight);
          walls.fillStyle(OFFICE_PALETTE.wallTrim, 1);
          walls.fillRect(interior.x - 16, interior.y - 6, interior.width + 48, 8);
          walls.fillStyle(OFFICE_PALETTE.wallCap, 1);
          walls.fillRect(interior.x - 12, topWallY + 8, interior.width + 40, 6);

          walls.fillStyle(OFFICE_PALETTE.wall, 1);
          walls.fillRect(interior.x + interior.width, interior.y - 4, room.rightWallWidth, interior.height + 52);
          walls.fillStyle(OFFICE_PALETTE.wallTrim, 1);
          walls.fillRect(interior.x + interior.width + 8, interior.y + 8, 8, interior.height + 28);

          room.leftWallSegments.forEach((segment) => {
            walls.fillStyle(OFFICE_PALETTE.wall, 1);
            walls.fillRect(segment.x, segment.y, segment.width, segment.height);
            walls.fillStyle(OFFICE_PALETTE.wallTrim, 1);
            walls.fillRect(segment.x + segment.width - 8, segment.y + 8, 8, segment.height - 16);
          });

          room.bottomWallSegments.forEach((segment) => {
            walls.fillStyle(OFFICE_PALETTE.wall, 1);
            walls.fillRect(segment.x, segment.y, segment.width, segment.height);
            walls.fillStyle(OFFICE_PALETTE.wallTrim, 1);
            walls.fillRect(segment.x + 8, segment.y + 8, segment.width - 16, 8);
          });

          this.add
            .rectangle(interior.x + interior.width / 2, interior.y + 10, interior.width - 12, 12, 0x000000, 0.08)
            .setDepth(15);
          this.add
            .rectangle(interior.x + interior.width - 8, interior.y + interior.height / 2, 12, interior.height - 12, 0x000000, 0.06)
            .setDepth(15);
          this.add
            .rectangle(interior.x + 8, interior.y + interior.height / 2, 12, interior.height - 12, 0x000000, 0.05)
            .setDepth(15);

          const threshold = room.entranceThreshold;
          const thresholdCenterX = threshold.x + threshold.width / 2;
          this.add
            .rectangle(thresholdCenterX, interior.y + interior.height + 44, threshold.width + 34, 88, 0x07090d, 1)
            .setDepth(1);

          const mat = this.add.rectangle(
            thresholdCenterX,
            threshold.y + threshold.height / 2,
            threshold.width - 10,
            threshold.height,
            OFFICE_PALETTE.zonePath,
            0.82,
          );
          mat.setDepth(8);
          mat.setStrokeStyle(2, OFFICE_PALETTE.wallTrim, 0.42);
          this.add.rectangle(thresholdCenterX, threshold.y + 3, threshold.width - 18, 4, 0xffffff, 0.08).setDepth(9);
        }

        private addEntryLane() {
          const lane = this.add.rectangle(400, 432, 232, 28, OFFICE_PALETTE.focus, 0.06);
          lane.setDepth(6);
          lane.setStrokeStyle(1, OFFICE_PALETTE.focus, 0.18);

          [304, 368, 432, 496].forEach((x) => {
            this.add.rectangle(x, 432, 20, 8, OFFICE_PALETTE.focus, 0.14).setDepth(7);
          });
        }

        private addWallAccents() {
          this.add.rectangle(504, 126, 264, 10, OFFICE_PALETTE.wallTrim, 0.8).setDepth(18);
          this.add.rectangle(504, 120, 220, 4, OFFICE_PALETTE.wallCap, 0.52).setDepth(19);
          this.add.rectangle(844, 220, 12, 188, OFFICE_PALETTE.wallTrim, 0.72).setDepth(18);
          this.add.rectangle(218, 540, 24, 20, OFFICE_PALETTE.wallTrim, 0.9).setDepth(18);
          this.add.rectangle(358, 540, 24, 20, OFFICE_PALETTE.wallTrim, 0.9).setDepth(18);
        }
        private createStaticColliders() {
          OFFICE_LAYOUT.collisionRects.forEach((rect) => {
            const obstacle = this.add.rectangle(rect.x, rect.y, rect.width, rect.height, 0x000000, 0);
            this.physics.add.existing(obstacle, true);
            this.staticObstacles.push(obstacle);
          });
        }

        private addDeskCluster(
          PhaserLib: typeof import("phaser"),
          cluster: OfficeDeskCluster,
          isPrimary: boolean,
        ) {
          const depth = cluster.desk.y + cluster.desk.height / 2;
          const rug = this.add.rectangle(
            cluster.rug.x,
            cluster.rug.y,
            cluster.rug.width,
            cluster.rug.height,
            isPrimary ? OFFICE_PALETTE.zonePrimary : OFFICE_PALETTE.zoneSecondary,
            0.58,
          );
          rug.setDepth(depth - 18);
          rug.setStrokeStyle(2, cluster.accentColor, isPrimary ? 0.28 : 0.14);

          this.addGroundShadow(cluster.desk.x + 4, cluster.desk.y + 10, cluster.desk.width + 24, cluster.desk.height + 22, 0.18, depth - 10);

          const deskSurface = this.add.rectangle(
            cluster.desk.x,
            cluster.desk.y,
            cluster.desk.width,
            cluster.desk.height,
            OFFICE_PALETTE.deskTop,
            1,
          );
          deskSurface.setDepth(depth);
          deskSurface.setStrokeStyle(2, OFFICE_PALETTE.deskFront, 0.88);

          this.add
            .rectangle(cluster.desk.x, cluster.desk.y - cluster.desk.height / 2 + 6, cluster.desk.width - 12, 6, 0xffffff, 0.08)
            .setDepth(depth + 1);
          this.add
            .rectangle(cluster.desk.x + cluster.desk.width / 2 - 26, cluster.desk.y + 6, 40, cluster.desk.height - 12, OFFICE_PALETTE.deskDrawer, 1)
            .setDepth(depth + 1);
          this.add.rectangle(cluster.desk.x + cluster.desk.width / 2 - 26, cluster.desk.y - 12, 18, 4, OFFICE_PALETTE.wallCap, 0.36).setDepth(depth + 2);
          this.add.rectangle(cluster.desk.x + cluster.desk.width / 2 - 26, cluster.desk.y + 14, 18, 4, OFFICE_PALETTE.wallCap, 0.36).setDepth(depth + 2);
          this.add.rectangle(cluster.desk.x - cluster.desk.width / 2 + 16, cluster.desk.y + cluster.desk.height / 2 - 10, 12, 20, OFFICE_PALETTE.deskLeg, 0.92).setDepth(depth + 1);
          this.add.rectangle(cluster.desk.x + cluster.desk.width / 2 - 64, cluster.desk.y + cluster.desk.height / 2 - 10, 12, 20, OFFICE_PALETTE.deskLeg, 0.92).setDepth(depth + 1);

          const screenGlow = this.add.ellipse(
            cluster.screenGlow.x,
            cluster.screenGlow.y,
            cluster.screenGlow.radius * 1.35,
            cluster.screenGlow.radius,
            cluster.accentColor,
            cluster.screenGlow.alpha,
          );
          screenGlow.setBlendMode(PhaserLib.BlendModes.SCREEN);
          screenGlow.setDepth(depth + 2);

          const monitorFrame = this.add.rectangle(
            cluster.laptop.x,
            cluster.laptop.y,
            cluster.laptop.width,
            cluster.laptop.height,
            OFFICE_PALETTE.monitorFrame,
            1,
          );
          monitorFrame.setDepth(depth + 3);
          monitorFrame.setStrokeStyle(2, 0xffffff, isPrimary ? 0.14 : 0.08);

          this.add.rectangle(cluster.laptop.x, cluster.laptop.y, cluster.laptop.width - 8, cluster.laptop.height - 8, OFFICE_PALETTE.monitor, isPrimary ? 0.96 : 0.76).setDepth(depth + 4);
          this.add.rectangle(cluster.laptop.x, cluster.laptop.y - 6, cluster.laptop.width - 14, 3, 0xffffff, isPrimary ? 0.2 : 0.12).setDepth(depth + 5);
          this.add.circle(cluster.laptop.x + cluster.laptop.width / 2 - 7, cluster.laptop.y + cluster.laptop.height / 2 - 6, 2, OFFICE_PALETTE.deviceLight, 0.85).setDepth(depth + 5);

          this.add.rectangle(cluster.keyboard.x, cluster.keyboard.y, cluster.keyboard.width, cluster.keyboard.height, 0x2b3644, 1).setDepth(depth + 2);
          this.add.rectangle(cluster.keyboard.x, cluster.keyboard.y - 1, cluster.keyboard.width - 10, 2, 0xffffff, 0.08).setDepth(depth + 3);

          if (cluster.mug) {
            this.add.circle(cluster.mug.x, cluster.mug.y, 7, 0xf1eee7, 0.92).setDepth(depth + 4);
            this.add.rectangle(cluster.mug.x + 6, cluster.mug.y, 3, 6, 0xf1eee7, 0.4).setDepth(depth + 4);
          }

          if (cluster.lamp) {
            this.add.rectangle(cluster.lamp.x, cluster.lamp.y + 10, 5, 20, OFFICE_PALETTE.deskLeg, 0.9).setDepth(depth + 2);
            this.add.rectangle(cluster.lamp.x, cluster.lamp.y, 16, 10, OFFICE_PALETTE.wallCap, 0.84).setDepth(depth + 3);
            this.add
              .ellipse(cluster.lamp.x + 12, cluster.lamp.y + 4, 42, 22, OFFICE_PALETTE.focusGlow, isPrimary ? 0.08 : 0.04)
              .setBlendMode(PhaserLib.BlendModes.SCREEN)
              .setDepth(depth + 1);
          }

          if (isPrimary) {
            this.add.rectangle(cluster.laptop.x, cluster.laptop.y - 24, cluster.laptop.width + 18, 6, OFFICE_PALETTE.focusGlow, 0.18).setDepth(depth + 5);
            this.primaryMonitorGlow = screenGlow;
          }

          this.addChair(cluster, depth + 2, isPrimary);
        }

        private addChair(cluster: OfficeDeskCluster, depth: number, isPrimary: boolean) {
          this.addGroundShadow(cluster.chair.x, cluster.chair.y + 10, cluster.chair.width + 12, cluster.chair.height, 0.14, depth - 2);

          const seat = this.add.rectangle(
            cluster.chair.x,
            cluster.chair.y,
            cluster.chair.width,
            cluster.chair.height,
            OFFICE_PALETTE.chair,
            1,
          );
          seat.setDepth(depth);
          seat.setStrokeStyle(2, 0xffffff, 0.08);

          this.add
            .rectangle(cluster.chair.x, cluster.chair.y - cluster.chair.height / 2 - 8, cluster.chair.width - 8, 12, isPrimary ? OFFICE_PALETTE.chairAccent : OFFICE_PALETTE.wallTrim, isPrimary ? 0.7 : 0.5)
            .setDepth(depth + 1);
          this.add
            .rectangle(cluster.chair.x, cluster.chair.y + cluster.chair.height / 2 + 6, 8, 12, OFFICE_PALETTE.deskLeg, 0.9)
            .setDepth(depth + 1);
        }
        private addWhiteboard() {
          const whiteboard = OFFICE_LAYOUT.whiteboard;
          this.add.rectangle(whiteboard.x + 6, whiteboard.y + 8, whiteboard.width + 10, whiteboard.height + 10, 0x000000, 0.12).setDepth(109);

          const board = this.add.rectangle(whiteboard.x, whiteboard.y, whiteboard.width, whiteboard.height, 0xf2f5f8, 1);
          board.setStrokeStyle(4, 0x657180, 0.95);
          board.setDepth(110);

          this.add.rectangle(whiteboard.x, whiteboard.y - 28, whiteboard.width - 36, 8, 0x6c7784, 0.6).setDepth(111);
          this.add.rectangle(whiteboard.x, whiteboard.y + 36, whiteboard.width - 26, 6, 0xc8d0da, 0.82).setDepth(111);

          whiteboard.stickyNotes.forEach((note, index) => {
            this.add.rectangle(whiteboard.x - 68 + index * 34, whiteboard.y - 20 + (index % 2 === 0 ? 0 : 10), 18, 18, note.color, 0.95).setDepth(112);
          });

          for (let row = 0; row < 4; row += 1) {
            this.add.rectangle(whiteboard.x - 26, whiteboard.y - 14 + row * 16, 112, 2, 0x5c6674, 0.42).setDepth(112);
            this.add.rectangle(whiteboard.x + 56, whiteboard.y - 14 + row * 16, 36, 2, row % 2 === 0 ? OFFICE_PALETTE.stickyAccent : OFFICE_PALETTE.stickyWarm, 0.44).setDepth(112);
          }
        }

        private addPrinterArea() {
          const printerArea = OFFICE_LAYOUT.printerArea;
          const counterDepth = printerArea.counter.y + printerArea.counter.height / 2;

          this.addGroundShadow(printerArea.counter.x + 4, printerArea.counter.y + 8, printerArea.counter.width + 18, printerArea.counter.height + 18, 0.16, counterDepth - 4);

          const counter = this.add.rectangle(
            printerArea.counter.x,
            printerArea.counter.y,
            printerArea.counter.width,
            printerArea.counter.height,
            OFFICE_PALETTE.storage,
            1,
          );
          counter.setDepth(counterDepth);
          counter.setStrokeStyle(2, 0xffffff, 0.06);
          this.add.rectangle(printerArea.counter.x, printerArea.counter.y - printerArea.counter.height / 2 + 6, printerArea.counter.width - 12, 6, 0xffffff, 0.08).setDepth(counterDepth + 1);

          const printer = this.add.rectangle(printerArea.printer.x, printerArea.printer.y, printerArea.printer.width, printerArea.printer.height, OFFICE_PALETTE.printer, 1);
          printer.setDepth(counterDepth + 2);
          printer.setStrokeStyle(2, 0x8a93a1, 0.8);
          this.add.rectangle(printerArea.printer.x + 16, printerArea.printer.y - 4, 30, 6, 0x9aa4b3, 0.72).setDepth(counterDepth + 3);
          this.add.circle(printerArea.printer.x + 26, printerArea.printer.y + 3, 3, OFFICE_PALETTE.deviceLight, 0.8).setDepth(counterDepth + 3);

          const filing = this.add.rectangle(
            printerArea.filingCabinet.x,
            printerArea.filingCabinet.y,
            printerArea.filingCabinet.width,
            printerArea.filingCabinet.height,
            OFFICE_PALETTE.filing,
            1,
          );
          filing.setDepth(printerArea.filingCabinet.y + printerArea.filingCabinet.height / 2);
          filing.setStrokeStyle(2, 0xffffff, 0.05);

          for (let drawer = 0; drawer < 3; drawer += 1) {
            this.add.rectangle(printerArea.filingCabinet.x, printerArea.filingCabinet.y - 26 + drawer * 28, printerArea.filingCabinet.width - 14, 18, 0x67735d, 0.96).setDepth(printerArea.filingCabinet.y + printerArea.filingCabinet.height / 2 + 1);
            this.add.rectangle(printerArea.filingCabinet.x, printerArea.filingCabinet.y - 26 + drawer * 28, 16, 4, 0xf0f4f7, 0.26).setDepth(printerArea.filingCabinet.y + printerArea.filingCabinet.height / 2 + 2);
          }

          printerArea.paperStacks.forEach((stack) => {
            this.add.rectangle(stack.x, stack.y, stack.width, stack.height, 0xf4f7fb, 0.96).setDepth(counterDepth + 3);
          });
        }

        private addCoffeeStation() {
          const coffeeStation = OFFICE_LAYOUT.coffeeStation;
          const counterDepth = coffeeStation.counter.y + coffeeStation.counter.height / 2;

          this.addGroundShadow(coffeeStation.counter.x, coffeeStation.counter.y + 8, coffeeStation.counter.width + 18, coffeeStation.counter.height + 14, 0.14, counterDepth - 4);

          const counter = this.add.rectangle(coffeeStation.counter.x, coffeeStation.counter.y, coffeeStation.counter.width, coffeeStation.counter.height, OFFICE_PALETTE.coffeeDark, 1);
          counter.setDepth(counterDepth);
          counter.setStrokeStyle(2, 0xffffff, 0.05);
          this.add.rectangle(coffeeStation.counter.x, coffeeStation.counter.y - coffeeStation.counter.height / 2 + 6, coffeeStation.counter.width - 10, 6, 0xffffff, 0.08).setDepth(counterDepth + 1);

          const machine = this.add.rectangle(coffeeStation.machine.x, coffeeStation.machine.y, coffeeStation.machine.width, coffeeStation.machine.height, OFFICE_PALETTE.monitorFrame, 1);
          machine.setDepth(coffeeStation.machine.y + coffeeStation.machine.height / 2);
          machine.setStrokeStyle(2, 0xffffff, 0.05);
          this.add.rectangle(coffeeStation.machine.x, coffeeStation.machine.y - 10, coffeeStation.machine.width - 12, 10, 0x2e3948, 1).setDepth(coffeeStation.machine.y + coffeeStation.machine.height / 2 + 1);
          this.add.circle(coffeeStation.machine.x + 12, coffeeStation.machine.y - 8, 3, OFFICE_PALETTE.deviceLight, 0.84).setDepth(coffeeStation.machine.y + coffeeStation.machine.height / 2 + 2);

          coffeeStation.cups.forEach((cup) => {
            this.add.circle(cup.x, cup.y, 6, 0xf0ece4, 0.88).setDepth(counterDepth + 2);
            this.add.rectangle(cup.x + 4, cup.y, 3, 6, 0xf0ece4, 0.34).setDepth(counterDepth + 2);
          });
        }

        private addShelfArea() {
          const shelfArea = OFFICE_LAYOUT.shelfArea;
          const shelfDepth = shelfArea.storageShelf.y + shelfArea.storageShelf.height / 2;

          this.addGroundShadow(shelfArea.storageShelf.x + 4, shelfArea.storageShelf.y + 10, shelfArea.storageShelf.width + 18, shelfArea.storageShelf.height + 18, 0.16, shelfDepth - 4);

          const shelf = this.add.rectangle(shelfArea.storageShelf.x, shelfArea.storageShelf.y, shelfArea.storageShelf.width, shelfArea.storageShelf.height, OFFICE_PALETTE.storage, 1);
          shelf.setDepth(shelfDepth);
          shelf.setStrokeStyle(2, 0xffffff, 0.05);
          [-26, 2, 30].forEach((offset) => {
            this.add.rectangle(shelfArea.storageShelf.x, shelfArea.storageShelf.y + offset, shelfArea.storageShelf.width - 10, 6, 0x606b59, 1).setDepth(shelfDepth + 1);
          });

          shelfArea.boxes.forEach((box) => {
            const boxDepth = box.y + box.height / 2;
            const parcel = this.add.rectangle(box.x, box.y, box.width, box.height, 0x7b654a, 0.96);
            parcel.setDepth(boxDepth);
            parcel.setStrokeStyle(2, 0xffffff, 0.04);
            this.add.rectangle(box.x, box.y - 4, box.width - 8, 4, 0xc6aa7f, 0.36).setDepth(boxDepth + 1);
          });

          this.add.circle(shelfArea.plant.x, shelfArea.plant.y + 12, shelfArea.plant.radius - 6, OFFICE_PALETTE.plantPot, 0.96).setDepth(shelfArea.plant.y + 24);
          this.add.circle(shelfArea.plant.x, shelfArea.plant.y - 4, shelfArea.plant.radius, OFFICE_PALETTE.plantLeaf, 1).setDepth(shelfArea.plant.y + 25);
          this.add.circle(shelfArea.plant.x - 14, shelfArea.plant.y - 10, shelfArea.plant.radius - 6, 0x4f6e4e, 1).setDepth(shelfArea.plant.y + 26);
          this.add.circle(shelfArea.plant.x + 14, shelfArea.plant.y - 10, shelfArea.plant.radius - 8, 0x486449, 1).setDepth(shelfArea.plant.y + 26);

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
          const legs = this.add.rectangle(0, 8, 14, 16, 0x26313f, 1);
          const torso = this.add.rectangle(0, -2, 22, 24, bodyColor, 1);
          torso.setStrokeStyle(1, 0xffffff, 0.16);
          const badge = this.add.rectangle(5, -4, 5, 9, 0xe8eef6, 0.32);
          const head = this.add.circle(0, -18, 9, OFFICE_PALETTE.actorHead, 1);
          const hair = this.add.rectangle(0, -23, 16, 5, 0x6d7784, 0.72);

          return this.add.container(x, y, [shadow, legs, torso, badge, head, hair]);
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
      const scene = game.scene.getScene("trust-boundary-room");
      sceneEventsRef.current = scene.events;
      scene.events.emit("desk-mode", deskMode);
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

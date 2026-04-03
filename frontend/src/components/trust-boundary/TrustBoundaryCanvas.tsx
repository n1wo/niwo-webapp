"use client";

import { useEffect, useRef } from "react";
import {
  OFFICE_LAYOUT,
  OFFICE_PALETTE,
  type OfficeDeskCluster,
} from "@/components/trust-boundary/officeSceneLayout";

type TrustBoundaryCanvasProps = {
  deskMode: boolean;
  onDeskRangeChange: (isNearDesk: boolean) => void;
  onDeskInteract: () => void;
};

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

        private deskFocusGlow!: Phaser.GameObjects.Ellipse;

        private deskFocusRing!: Phaser.GameObjects.Ellipse;

        private deskAura!: Phaser.GameObjects.Arc;

        private deskSweep!: Phaser.GameObjects.Rectangle;

        private coworkerLampGlow!: Phaser.GameObjects.Arc;

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
          this.cameras.main.setBackgroundColor("#05070d");
          this.physics.world.setBounds(0, 0, roomWidth, roomHeight);
          this.cameras.main.setBounds(0, 0, roomWidth, roomHeight);
          this.cameras.main.roundPixels = true;

          this.buildOfficeShell(Phaser);
          this.createStaticColliders();
          this.createDeskFocus();
          this.addDeskCluster(Phaser, OFFICE_LAYOUT.coworkerDesk, false);
          this.addDeskCluster(Phaser, OFFICE_LAYOUT.playerDesk, true);
          this.addWhiteboard();
          this.addPrinterArea();
          this.addCoffeeStation();
          this.addShelfArea();
          this.addEnvironmentLabels();
          this.createActors();
          this.setupCamera();

          this.cursors = this.input.keyboard!.createCursorKeys();
          this.keys = this.input.keyboard!.addKeys("W,A,S,D,E") as Record<
            string,
            Phaser.Input.Keyboard.Key
          >;

          this.events.on("desk-mode", (locked: boolean) => {
            this.inputLocked = locked;
            this.deskModeActive = locked;

            const playerBody = this.playerBody.body as Phaser.Physics.Arcade.Body;
            if (locked) {
              playerBody.setVelocity(0, 0);
            }

            this.tweens.killTweensOf(this.cameras.main);
            this.tweens.add({
              targets: this.cameras.main,
              zoom: locked ? OFFICE_LAYOUT.camera.deskZoom : OFFICE_LAYOUT.camera.baseZoom,
              duration: locked ? 280 : 360,
              ease: "Sine.easeInOut",
            });

            this.refreshDeskFocus();
          });

          this.startAmbientTweens();
          this.refreshDeskFocus();
          deskRangeCallbackRef.current(false);
        }

        update() {
          const playerBody = this.playerBody.body as Phaser.Physics.Arcade.Body;
          const speed = 188;
          let velocityX = 0;
          let velocityY = 0;

          if (!this.inputLocked) {
            if (this.cursors.left.isDown || this.keys.A.isDown) velocityX -= speed;
            if (this.cursors.right.isDown || this.keys.D.isDown) velocityX += speed;
            if (this.cursors.up.isDown || this.keys.W.isDown) velocityY -= speed;
            if (this.cursors.down.isDown || this.keys.S.isDown) velocityY += speed;
          }

          playerBody.setVelocity(velocityX, velocityY);
          if (velocityX !== 0 && velocityY !== 0) {
            playerBody.velocity.normalize().scale(speed);
          }

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

          if (
            nearDesk &&
            !this.inputLocked &&
            Phaser.Input.Keyboard.JustDown(this.keys.E)
          ) {
            deskInteractCallbackRef.current();
          }
        }

        private buildOfficeShell(PhaserLib: typeof import("phaser")) {
          const graphics = this.add.graphics();
          const room = OFFICE_LAYOUT.room;
          const interior = room.interior;

          graphics.setDepth(0);
          graphics.fillStyle(OFFICE_PALETTE.roomShadow, 1);
          graphics.fillRect(0, 0, roomWidth, roomHeight);

          graphics.fillStyle(0x0b0e14, 1);
          graphics.fillRoundedRect(
            interior.x - 24,
            interior.y - 20,
            interior.width + 42,
            interior.height + 34,
            34,
          );

          graphics.fillStyle(OFFICE_PALETTE.floorBase, 1);
          graphics.fillRoundedRect(
            interior.x,
            interior.y,
            interior.width,
            interior.height,
            28,
          );

          graphics.fillStyle(OFFICE_PALETTE.floorSecondary, 0.36);
          graphics.fillRoundedRect(
            interior.x + 22,
            interior.y + 28,
            interior.width - 44,
            interior.height - 60,
            22,
          );

          graphics.fillStyle(OFFICE_PALETTE.wall, 1);
          graphics.fillRect(
            interior.x - 24,
            interior.y - 28,
            interior.width + 24,
            room.topWallHeight,
          );
          graphics.fillStyle(OFFICE_PALETTE.wallTrim, 0.96);
          graphics.fillRect(
            interior.x - 12,
            interior.y + 16,
            interior.width - 28,
            12,
          );

          graphics.fillStyle(OFFICE_PALETTE.wall, 1);
          graphics.fillRect(
            interior.x + interior.width - 10,
            interior.y - 6,
            room.rightWallWidth,
            interior.height + 8,
          );
          graphics.fillStyle(OFFICE_PALETTE.wallTrim, 0.86);
          graphics.fillRect(
            interior.x + interior.width - 22,
            interior.y + 22,
            12,
            interior.height - 54,
          );

          room.leftWallSegments.forEach((segment) => {
            graphics.fillStyle(OFFICE_PALETTE.wall, 1);
            graphics.fillRect(segment.x, segment.y, segment.width, segment.height);
            graphics.fillStyle(OFFICE_PALETTE.wallTrim, 0.86);
            graphics.fillRect(
              segment.x + segment.width - 10,
              segment.y + 12,
              10,
              segment.height - 24,
            );
          });

          graphics.fillStyle(OFFICE_PALETTE.wallPanel, 0.85);
          graphics.fillRoundedRect(220, 102, 132, 20, 8);
          graphics.fillRoundedRect(378, 102, 112, 20, 8);
          graphics.fillRoundedRect(818, 124, 56, 184, 12);

          graphics.lineStyle(1, OFFICE_PALETTE.floorLine, 0.52);
          for (let index = 0; index < 16; index += 1) {
            const y = interior.y + 44 + index * 30;
            graphics.lineBetween(
              interior.x + 22,
              y,
              interior.x + interior.width - 28,
              y - 18,
            );
          }

          for (let index = 0; index < 17; index += 1) {
            const x = interior.x + 26 + index * 46;
            graphics.lineBetween(
              x,
              interior.y + 22,
              x + 38,
              interior.y + interior.height - 24,
            );
          }

          const pathStripe = this.add.rectangle(462, 448, 402, 104, 0xf4f4f5, 0.028);
          pathStripe.setRotation(-0.14);
          pathStripe.setDepth(8);

          const deskLane = this.add.rectangle(614, 388, 262, 98, OFFICE_PALETTE.deskGlow, 0.04);
          deskLane.setRotation(-0.08);
          deskLane.setDepth(9);

          const entryShadow = this.add.rectangle(128, 548, 220, 104, 0x04060a, 0.82);
          entryShadow.setRotation(-0.1);
          entryShadow.setDepth(2);

          graphics.fillStyle(OFFICE_PALETTE.floorSecondary, 0.78);
          graphics.fillRoundedRect(
            room.entranceThreshold.x,
            room.entranceThreshold.y,
            room.entranceThreshold.width,
            room.entranceThreshold.height,
            6,
          );
          graphics.fillStyle(0xf4f4f5, 0.08);
          graphics.fillRect(
            room.entranceThreshold.x + 10,
            room.entranceThreshold.y + 3,
            room.entranceThreshold.width - 22,
            3,
          );

          this.add.rectangle(82, 322, 132, 620, 0x030409, 0.48).setDepth(1);
          this.add.rectangle(512, 62, 940, 134, 0x04060a, 0.36).setDepth(1);
          this.add.rectangle(928, 322, 120, 620, 0x020408, 0.52).setDepth(1);

          const vignette = this.add.circle(842, 124, 172, OFFICE_PALETTE.roomShadow, 0.18);
          vignette.setBlendMode(PhaserLib.BlendModes.MULTIPLY);
          vignette.setDepth(4);

          const backGlow = this.add.circle(416, 146, 180, 0xf4f4f5, 0.035);
          backGlow.setBlendMode(PhaserLib.BlendModes.SCREEN);
          backGlow.setDepth(3);

          const shadowPool = this.add.ellipse(766, 498, 344, 132, 0x020305, 0.22);
          shadowPool.setRotation(-0.12);
          shadowPool.setDepth(5);
        }

        private createStaticColliders() {
          OFFICE_LAYOUT.collisionRects.forEach((rect) => {
            const obstacle = this.add.rectangle(rect.x, rect.y, rect.width, rect.height, 0x000000, 0);
            if (rect.rotation) {
              obstacle.setRotation(rect.rotation);
            }
            this.physics.add.existing(obstacle, true);
            this.staticObstacles.push(obstacle);
          });
        }

        private createDeskFocus() {
          this.deskFocusGlow = this.add.ellipse(
            712,
            406,
            244,
            112,
            OFFICE_PALETTE.deskGlow,
            0.08,
          );
          this.deskFocusGlow.setRotation(-0.09);
          this.deskFocusGlow.setBlendMode(Phaser.BlendModes.SCREEN);
          this.deskFocusGlow.setDepth(72);

          this.deskFocusRing = this.add.ellipse(
            712,
            406,
            194,
            76,
            OFFICE_PALETTE.deskGlow,
            0.08,
          );
          this.deskFocusRing.setRotation(-0.08);
          this.deskFocusRing.setStrokeStyle(2, OFFICE_PALETTE.deskGlow, 0.18);
          this.deskFocusRing.setDepth(73);
        }

        private addDeskCluster(
          PhaserLib: typeof import("phaser"),
          cluster: OfficeDeskCluster,
          isPrimary: boolean,
        ) {
          const depth = cluster.desk.y + cluster.desk.height / 2;
          const rugColor = isPrimary ? 0x1a2030 : 0x171d26;
          const shadowAlpha = isPrimary ? 0.28 : 0.2;

          const rug = this.add.rectangle(
            cluster.rug.x,
            cluster.rug.y,
            cluster.rug.width,
            cluster.rug.height,
            rugColor,
            0.96,
          );
          rug.setRotation(cluster.rug.rotation ?? 0);
          rug.setDepth(depth - 30);

          const rugEdge = this.add.rectangle(
            cluster.rug.x,
            cluster.rug.y - cluster.rug.height / 2 + 6,
            cluster.rug.width - 10,
            6,
            cluster.accentColor,
            isPrimary ? 0.14 : 0.08,
          );
          rugEdge.setRotation(cluster.rug.rotation ?? 0);
          rugEdge.setDepth(depth - 29);

          this.addShadowEllipse(
            cluster.desk.x + 16,
            cluster.desk.y + 32,
            cluster.desk.width + 56,
            54,
            shadowAlpha,
            depth - 20,
            -0.08,
          );

          const deskTop = this.add.rectangle(
            cluster.desk.x,
            cluster.desk.y,
            cluster.desk.width,
            cluster.desk.height,
            OFFICE_PALETTE.deskTop,
            1,
          );
          deskTop.setDepth(depth);
          deskTop.setStrokeStyle(2, 0xffffff, 0.06);

          this.add.rectangle(
            cluster.desk.x,
            cluster.desk.y + cluster.desk.height / 2 - 10,
            cluster.desk.width - 18,
            18,
            OFFICE_PALETTE.deskFront,
            1,
          ).setDepth(depth + 2);

          this.add.rectangle(
            cluster.desk.x,
            cluster.desk.y - cluster.desk.height / 2 + 14,
            cluster.desk.width - 26,
            10,
            cluster.accentColor,
            isPrimary ? 0.18 : 0.11,
          ).setDepth(depth + 1);

          this.add.rectangle(
            cluster.desk.x - cluster.desk.width / 2 + 22,
            cluster.desk.y + 22,
            14,
            48,
            OFFICE_PALETTE.deskLeg,
            1,
          ).setDepth(depth + 1);
          this.add.rectangle(
            cluster.desk.x + cluster.desk.width / 2 - 22,
            cluster.desk.y + 22,
            14,
            48,
            OFFICE_PALETTE.deskLeg,
            1,
          ).setDepth(depth + 1);

          const screenGlow = this.add.circle(
            cluster.screenGlow.x,
            cluster.screenGlow.y,
            cluster.screenGlow.radius,
            cluster.accentColor,
            cluster.screenGlow.alpha,
          );
          screenGlow.setBlendMode(PhaserLib.BlendModes.SCREEN);
          screenGlow.setDepth(depth - 6);

          const monitorFrame = this.add.rectangle(
            cluster.laptop.x,
            cluster.laptop.y,
            cluster.laptop.width,
            cluster.laptop.height,
            OFFICE_PALETTE.monitorFrame,
            1,
          );
          monitorFrame.setDepth(depth + 4);
          monitorFrame.setStrokeStyle(2, 0xffffff, 0.08);

          this.add.rectangle(
            cluster.laptop.x,
            cluster.laptop.y - 1,
            cluster.laptop.width - 10,
            cluster.laptop.height - 10,
            OFFICE_PALETTE.monitor,
            isPrimary ? 0.9 : 0.7,
          ).setDepth(depth + 5);

          this.add.rectangle(
            cluster.keyboard.x,
            cluster.keyboard.y,
            cluster.keyboard.width,
            cluster.keyboard.height,
            0xd7dbeb,
            0.28,
          ).setDepth(depth + 5);

          this.add.rectangle(
            cluster.desk.x + 44,
            cluster.desk.y - 18,
            44,
            12,
            0x0f141d,
            1,
          ).setDepth(depth + 3);
          this.add.rectangle(
            cluster.desk.x + 44,
            cluster.desk.y - 18,
            28,
            2,
            cluster.accentColor,
            0.28,
          ).setDepth(depth + 4);

          if (cluster.mug) {
            this.add.circle(cluster.mug.x, cluster.mug.y, 8, 0xf1e6d9, 0.92).setDepth(depth + 4);
            this.add.rectangle(cluster.mug.x + 8, cluster.mug.y, 4, 8, 0xf1e6d9, 0.56)
              .setDepth(depth + 4);
          }

          if (cluster.lamp) {
            this.add.rectangle(
              cluster.lamp.x,
              cluster.lamp.y + 8,
              4,
              18,
              0xc8ccd6,
              0.55,
            ).setDepth(depth + 4);
            this.add.circle(cluster.lamp.x, cluster.lamp.y, 8, 0xe4e7ef, 0.8).setDepth(depth + 5);
            const lampGlow = this.add.circle(
              cluster.lamp.x + 10,
              cluster.lamp.y + 6,
              isPrimary ? 46 : 34,
              cluster.accentColor,
              isPrimary ? 0.12 : 0.08,
            );
            lampGlow.setBlendMode(PhaserLib.BlendModes.SCREEN);
            lampGlow.setDepth(depth - 8);

            if (!isPrimary) {
              this.coworkerLampGlow = lampGlow;
            }
          }

          this.addChair(cluster, depth + 8, isPrimary);

          if (isPrimary) {
            this.deskAura = this.add.circle(
              cluster.screenGlow.x,
              cluster.screenGlow.y + 30,
              112,
              cluster.accentColor,
              0.08,
            );
            this.deskAura.setBlendMode(PhaserLib.BlendModes.SCREEN);
            this.deskAura.setDepth(depth - 10);

            this.deskSweep = this.add.rectangle(
              cluster.laptop.x + 2,
              cluster.laptop.y - 4,
              90,
              6,
              0xffffff,
              0.16,
            );
            this.deskSweep.setBlendMode(PhaserLib.BlendModes.SCREEN);
            this.deskSweep.setDepth(depth + 6);
          }
        }

        private addChair(cluster: OfficeDeskCluster, depth: number, isPrimary: boolean) {
          this.addShadowEllipse(
            cluster.chair.x + 10,
            cluster.chair.y + 18,
            cluster.chair.width + 18,
            24,
            0.22,
            depth - 2,
            cluster.chair.rotation ?? 0,
          );

          const seat = this.add.rectangle(
            cluster.chair.x,
            cluster.chair.y,
            cluster.chair.width,
            cluster.chair.height,
            OFFICE_PALETTE.chair,
            1,
          );
          seat.setRotation(cluster.chair.rotation ?? 0);
          seat.setDepth(depth);
          seat.setStrokeStyle(2, 0xffffff, 0.05);

          const backrest = this.add.rectangle(
            cluster.chair.x - 10,
            cluster.chair.y - 18,
            cluster.chair.width - 16,
            12,
            isPrimary ? OFFICE_PALETTE.chairAccent : OFFICE_PALETTE.wallTrim,
            isPrimary ? 0.48 : 0.32,
          );
          backrest.setRotation((cluster.chair.rotation ?? 0) - 0.04);
          backrest.setDepth(depth + 1);

          this.add.rectangle(
            cluster.chair.x + 12,
            cluster.chair.y + 16,
            6,
            20,
            OFFICE_PALETTE.deskLeg,
            1,
          )
            .setRotation(cluster.chair.rotation ?? 0)
            .setDepth(depth + 1);
        }

        private addWhiteboard() {
          const whiteboard = OFFICE_LAYOUT.whiteboard;

          this.add.rectangle(
            whiteboard.x + 10,
            whiteboard.y + 14,
            whiteboard.width + 14,
            whiteboard.height + 10,
            0x04060a,
            0.2,
          ).setDepth(118);

          const board = this.add.rectangle(
            whiteboard.x,
            whiteboard.y,
            whiteboard.width,
            whiteboard.height,
            0xe3e8f3,
            0.92,
          );
          board.setStrokeStyle(6, 0x424d62, 0.9);
          board.setDepth(120);

          this.add.rectangle(whiteboard.x, whiteboard.y + 48, whiteboard.width - 22, 8, 0xc7d0dd, 0.56)
            .setDepth(121);

          whiteboard.stickyNotes.forEach((note, index) => {
            this.add.rectangle(
              whiteboard.x - 86 + index * 42,
              whiteboard.y - 20 + (index % 2 === 0 ? 0 : 10),
              22,
              18,
              note.color,
              0.9,
            ).setDepth(122);
          });

          for (let row = 0; row < 4; row += 1) {
            this.add.rectangle(
              whiteboard.x - 40,
              whiteboard.y - 12 + row * 16,
              120,
              2,
              0x596376,
              0.38,
            ).setDepth(122);
            this.add.rectangle(
              whiteboard.x + 54,
              whiteboard.y - 12 + row * 16,
              46,
              2,
              row % 2 === 0 ? OFFICE_PALETTE.stickyAccent : OFFICE_PALETTE.stickyWarm,
              0.42,
            ).setDepth(122);
          }
        }

        private addPrinterArea() {
          const printerArea = OFFICE_LAYOUT.printerArea;
          const baseDepth = printerArea.counter.y + printerArea.counter.height / 2;

          this.addShadowEllipse(
            printerArea.counter.x + 10,
            printerArea.counter.y + 28,
            printerArea.counter.width + 40,
            44,
            0.24,
            baseDepth - 14,
            -0.1,
          );

          const counter = this.add.rectangle(
            printerArea.counter.x,
            printerArea.counter.y,
            printerArea.counter.width,
            printerArea.counter.height,
            OFFICE_PALETTE.shelf,
            1,
          );
          counter.setDepth(baseDepth);
          counter.setStrokeStyle(2, 0xffffff, 0.05);

          this.add.rectangle(
            printerArea.counter.x,
            printerArea.counter.y + 26,
            printerArea.counter.width - 12,
            18,
            OFFICE_PALETTE.deskFront,
            1,
          ).setDepth(baseDepth + 1);

          const printer = this.add.rectangle(
            printerArea.printer.x,
            printerArea.printer.y,
            printerArea.printer.width,
            printerArea.printer.height,
            OFFICE_PALETTE.printer,
            0.94,
          );
          printer.setDepth(baseDepth + 3);
          printer.setStrokeStyle(2, 0x7f8798, 0.56);

          this.add.rectangle(
            printerArea.printer.x + 20,
            printerArea.printer.y - 3,
            36,
            6,
            0x8e96a8,
            0.66,
          ).setDepth(baseDepth + 4);
          this.add.circle(printerArea.printer.x + 36, printerArea.printer.y + 4, 3, 0x7fd6a2, 0.8)
            .setDepth(baseDepth + 4);

          const filing = this.add.rectangle(
            printerArea.filingCabinet.x,
            printerArea.filingCabinet.y,
            printerArea.filingCabinet.width,
            printerArea.filingCabinet.height,
            OFFICE_PALETTE.filing,
            1,
          );
          filing.setDepth(printerArea.filingCabinet.y + 42);
          filing.setStrokeStyle(2, 0xffffff, 0.04);

          for (let drawer = 0; drawer < 3; drawer += 1) {
            this.add.rectangle(
              printerArea.filingCabinet.x,
              printerArea.filingCabinet.y - 22 + drawer * 28,
              printerArea.filingCabinet.width - 16,
              20,
              0x2a3241,
              1,
            ).setDepth(printerArea.filingCabinet.y + 43);
            this.add.rectangle(
              printerArea.filingCabinet.x,
              printerArea.filingCabinet.y - 22 + drawer * 28,
              20,
              4,
              0xb7becf,
              0.34,
            ).setDepth(printerArea.filingCabinet.y + 44);
          }

          printerArea.paperStacks.forEach((stack) => {
            this.add.rectangle(stack.x, stack.y, stack.width, stack.height, 0xf1f4fa, 0.92)
              .setRotation(-0.08)
              .setDepth(baseDepth + 4);
          });
        }

        private addCoffeeStation() {
          const coffeeStation = OFFICE_LAYOUT.coffeeStation;
          const counterDepth = coffeeStation.counter.y + coffeeStation.counter.height / 2;

          this.addShadowEllipse(
            coffeeStation.counter.x + 12,
            coffeeStation.counter.y + 22,
            coffeeStation.counter.width + 32,
            32,
            0.22,
            counterDepth - 14,
            -0.1,
          );

          const machine = this.add.rectangle(
            coffeeStation.machine.x,
            coffeeStation.machine.y,
            coffeeStation.machine.width,
            coffeeStation.machine.height,
            0x1d212a,
            1,
          );
          machine.setDepth(coffeeStation.machine.y + 26);
          machine.setStrokeStyle(2, 0xffffff, 0.05);

          this.add.rectangle(
            coffeeStation.machine.x,
            coffeeStation.machine.y - 8,
            coffeeStation.machine.width - 14,
            10,
            0x2d3647,
            1,
          ).setDepth(coffeeStation.machine.y + 28);
          this.add.circle(coffeeStation.machine.x + 12, coffeeStation.machine.y - 6, 4, 0x7fd6a2, 0.8)
            .setDepth(coffeeStation.machine.y + 29);

          const counter = this.add.rectangle(
            coffeeStation.counter.x,
            coffeeStation.counter.y,
            coffeeStation.counter.width,
            coffeeStation.counter.height,
            0x2a313e,
            1,
          );
          counter.setDepth(counterDepth);
          counter.setStrokeStyle(2, 0xffffff, 0.05);

          this.add.rectangle(
            coffeeStation.counter.x,
            coffeeStation.counter.y + 18,
            coffeeStation.counter.width - 12,
            14,
            OFFICE_PALETTE.coffee,
            0.55,
          ).setDepth(counterDepth + 1);

          coffeeStation.cups.forEach((cup) => {
            this.add.circle(cup.x, cup.y, 7, 0xf2ece2, 0.88).setDepth(counterDepth + 2);
            this.add.rectangle(cup.x + 6, cup.y, 3, 7, 0xf2ece2, 0.52).setDepth(counterDepth + 2);
          });
        }

        private addShelfArea() {
          const shelfArea = OFFICE_LAYOUT.shelfArea;
          const shelfDepth = shelfArea.storageShelf.y + shelfArea.storageShelf.height / 2;

          this.addShadowEllipse(
            shelfArea.storageShelf.x + 10,
            shelfArea.storageShelf.y + 36,
            shelfArea.storageShelf.width + 40,
            48,
            0.22,
            shelfDepth - 16,
            -0.08,
          );

          const shelf = this.add.rectangle(
            shelfArea.storageShelf.x,
            shelfArea.storageShelf.y,
            shelfArea.storageShelf.width,
            shelfArea.storageShelf.height,
            OFFICE_PALETTE.shelf,
            1,
          );
          shelf.setDepth(shelfDepth);
          shelf.setStrokeStyle(2, 0xffffff, 0.05);

          [-24, 6, 36].forEach((offset) => {
            this.add.rectangle(
              shelfArea.storageShelf.x,
              shelfArea.storageShelf.y + offset,
              shelfArea.storageShelf.width - 12,
              8,
              0x2e3748,
              1,
            ).setDepth(shelfDepth + 1);
          });

          shelfArea.boxes.forEach((box) => {
            const boxDepth = box.y + box.height / 2;
            const parcel = this.add.rectangle(box.x, box.y, box.width, box.height, 0x7a6145, 0.94);
            parcel.setDepth(boxDepth);
            parcel.setStrokeStyle(2, 0xffffff, 0.04);

            this.add.rectangle(box.x, box.y, box.width - 8, 6, 0xc3a47d, 0.34).setDepth(boxDepth + 1);
          });

          this.add.circle(
            shelfArea.plant.x,
            shelfArea.plant.y + 10,
            shelfArea.plant.radius - 3,
            OFFICE_PALETTE.plantPot,
            0.92,
          ).setDepth(shelfArea.plant.y + 40);
          this.add.circle(
            shelfArea.plant.x,
            shelfArea.plant.y - 10,
            shelfArea.plant.radius,
            OFFICE_PALETTE.plantLeaf,
            1,
          ).setDepth(shelfArea.plant.y + 39);
          this.add.circle(
            shelfArea.plant.x - 16,
            shelfArea.plant.y - 18,
            shelfArea.plant.radius - 6,
            0x35573f,
            1,
          ).setDepth(shelfArea.plant.y + 40);
          this.add.circle(
            shelfArea.plant.x + 14,
            shelfArea.plant.y - 16,
            shelfArea.plant.radius - 8,
            0x284a37,
            1,
          ).setDepth(shelfArea.plant.y + 40);

          OFFICE_LAYOUT.cableRuns.forEach((cable) => {
            const strip = this.add.rectangle(
              cable.x,
              cable.y,
              cable.width,
              cable.height,
              OFFICE_PALETTE.cable,
              0.92,
            );
            strip.setRotation(cable.rotation ?? 0);
            strip.setDepth(88);
          });
        }

        private addEnvironmentLabels() {
          OFFICE_LAYOUT.labels.forEach((label) => {
            this.add
              .text(label.x, label.y, label.text, {
                fontFamily: "IBM Plex Mono, monospace",
                fontSize: "12px",
                color: "#7d8698",
              })
              .setAlpha(0.86)
              .setDepth(148);
          });
        }

        private createActors() {
          this.playerBody = this.add.rectangle(
            OFFICE_LAYOUT.spawn.x,
            OFFICE_LAYOUT.spawn.y,
            28,
            42,
            0x000000,
            0,
          );
          this.physics.add.existing(this.playerBody);

          const playerPhysics = this.playerBody.body as Phaser.Physics.Arcade.Body;
          playerPhysics.setCollideWorldBounds(true);
          playerPhysics.setSize(28, 42);

          this.staticObstacles.forEach((obstacle) => {
            this.physics.add.collider(this.playerBody, obstacle);
          });

          this.playerVisual = this.createActorVisual(
            OFFICE_LAYOUT.spawn.x,
            OFFICE_LAYOUT.spawn.y,
            OFFICE_PALETTE.deskGlow,
          );

          const coworker = OFFICE_LAYOUT.coworkerBody;
          const coworkerVisual = this.createActorVisual(
            coworker.x,
            coworker.y,
            OFFICE_PALETTE.coworkerGlow,
          );
          coworkerVisual.setAlpha(0.82);
          coworkerVisual.setDepth(coworker.y + 42);
        }

        private createActorVisual(x: number, y: number, accent: number) {
          const shadow = this.add.ellipse(0, 18, 34, 16, 0x010204, 0.26);
          const legs = this.add.rectangle(0, 10, 18, 18, 0x10151d, 1);
          const torso = this.add.rectangle(0, -2, 24, 28, accent, 0.96);
          torso.setStrokeStyle(1, 0xffffff, 0.16);
          const badge = this.add.rectangle(6, -4, 6, 10, 0xf4f4f5, 0.22);
          const head = this.add.circle(0, -18, 10, 0xd7deed, 1);
          const hair = this.add.rectangle(0, -24, 18, 6, 0x8189a0, 0.72);

          return this.add.container(x, y, [shadow, legs, torso, badge, head, hair]);
        }

        private syncActorVisuals() {
          this.playerVisual.setPosition(this.playerBody.x, this.playerBody.y);
          this.playerVisual.setDepth(this.playerBody.y + 42);
        }

        private setupCamera() {
          this.cameras.main.startFollow(this.playerBody, true, 0.08, 0.08);
          this.cameras.main.setDeadzone(120, 80);
          this.cameras.main.setZoom(OFFICE_LAYOUT.camera.baseZoom);
        }

        private refreshDeskFocus() {
          const targetRingAlpha = this.deskModeActive ? 0.22 : this.isNearDesk ? 0.16 : 0.08;
          const targetGlowAlpha = this.deskModeActive ? 0.2 : this.isNearDesk ? 0.14 : 0.07;
          const targetScale = this.deskModeActive ? 1.06 : this.isNearDesk ? 1.02 : 1;

          this.tweens.killTweensOf([this.deskFocusGlow, this.deskFocusRing]);
          this.tweens.add({
            targets: this.deskFocusGlow,
            alpha: targetGlowAlpha,
            scaleX: targetScale,
            scaleY: targetScale,
            duration: 240,
            ease: "Sine.easeInOut",
          });
          this.tweens.add({
            targets: this.deskFocusRing,
            alpha: targetRingAlpha,
            scaleX: targetScale,
            scaleY: targetScale,
            duration: 240,
            ease: "Sine.easeInOut",
          });
        }

        private startAmbientTweens() {
          this.tweens.add({
            targets: this.deskAura,
            alpha: { from: 0.06, to: 0.13 },
            scale: { from: 0.98, to: 1.04 },
            duration: 2100,
            yoyo: true,
            repeat: -1,
            ease: "Sine.easeInOut",
          });

          this.tweens.add({
            targets: this.deskSweep,
            x: { from: 712, to: 782 },
            alpha: { from: 0.04, to: 0.18 },
            duration: 1700,
            yoyo: true,
            repeat: -1,
            ease: "Sine.easeInOut",
          });

          this.tweens.add({
            targets: this.deskFocusGlow,
            alpha: { from: 0.06, to: 0.12 },
            duration: 2800,
            yoyo: true,
            repeat: -1,
            ease: "Sine.easeInOut",
          });

          this.tweens.add({
            targets: this.coworkerLampGlow,
            alpha: { from: 0.05, to: 0.12 },
            scale: { from: 0.97, to: 1.04 },
            duration: 2600,
            yoyo: true,
            repeat: -1,
            ease: "Sine.easeInOut",
            delay: 220,
          });
        }

        private addShadowEllipse(
          x: number,
          y: number,
          width: number,
          height: number,
          alpha: number,
          depth: number,
          rotation = 0,
        ) {
          const shadow = this.add.ellipse(x, y, width, height, 0x010204, alpha);
          shadow.setRotation(rotation);
          shadow.setDepth(depth);
          return shadow;
        }
      }

      const game = new Phaser.Game({
        type: Phaser.AUTO,
        parent: containerRef.current,
        width: 960,
        height: 540,
        transparent: true,
        physics: {
          default: "arcade",
          arcade: {
            debug: false,
          },
        },
        scale: {
          mode: Phaser.Scale.FIT,
          autoCenter: Phaser.Scale.CENTER_BOTH,
        },
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

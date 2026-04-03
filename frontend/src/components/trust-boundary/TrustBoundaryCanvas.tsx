"use client";

import { useEffect, useRef } from "react";

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

      const roomWidth = 1240;
      const roomHeight = 720;

      class TrustBoundaryRoomScene extends Phaser.Scene {
        private player!: Phaser.GameObjects.Rectangle;

        private deskAnchor!: Phaser.GameObjects.Zone;

        private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

        private keys!: Record<string, Phaser.Input.Keyboard.Key>;

        private inputLocked = false;

        private isNearDesk = false;

        constructor() {
          super("trust-boundary-room");
        }

        create() {
          this.cameras.main.setBackgroundColor("#0b0d12");
          this.physics.world.setBounds(0, 0, roomWidth, roomHeight);
          this.cameras.main.setBounds(0, 0, roomWidth, roomHeight);

          this.drawRoom(Phaser);

          const deskAura = this.add.circle(870, 332, 138, 0x5f62b8, 0.07);
          deskAura.setBlendMode(Phaser.BlendModes.SCREEN);

          const deskSweep = this.add.rectangle(870, 320, 128, 6, 0x8c7fe0, 0.18);
          deskSweep.setBlendMode(Phaser.BlendModes.SCREEN);

          const coworkerLamp = this.add.circle(946, 204, 28, 0x7fd6a2, 0.1);
          coworkerLamp.setBlendMode(Phaser.BlendModes.SCREEN);

          const corridorSweep = this.add.rectangle(332, 586, 208, 12, 0xf4f4f5, 0.05);
          corridorSweep.setBlendMode(Phaser.BlendModes.SCREEN);

          const obstacles: Phaser.GameObjects.Rectangle[] = [];
          const addObstacle = (
            x: number,
            y: number,
            width: number,
            height: number,
            fillColor: number,
            alpha = 1,
          ) => {
            const block = this.add.rectangle(x, y, width, height, fillColor, alpha);
            this.physics.add.existing(block, true);
            obstacles.push(block);
            return block;
          };

          addObstacle(870, 332, 216, 92, 0x262d39, 1);
          addObstacle(954, 214, 112, 74, 0x1b2230, 1);
          addObstacle(210, 108, 176, 34, 0x1a1f29, 1);
          addObstacle(1044, 590, 112, 90, 0x191d25, 1);

          const chair = addObstacle(820, 410, 58, 46, 0x181d26, 0.95);
          chair.setRotation(-0.18);

          const coworker = this.add.rectangle(946, 214, 34, 54, 0x6f73d8, 1);
          this.add.rectangle(946, 246, 50, 24, 0x161a22, 0.92);
          this.physics.add.existing(coworker, true);

          this.player = this.add.rectangle(136, 604, 30, 44, 0x8c7fe0, 1);
          this.player.setStrokeStyle(2, 0xf4f4f5, 0.18);
          this.physics.add.existing(this.player);

          const playerBody = this.player.body as Phaser.Physics.Arcade.Body;
          playerBody.setCollideWorldBounds(true);
          playerBody.setSize(28, 42);

          obstacles.forEach((obstacle) => {
            this.physics.add.collider(this.player, obstacle);
          });
          this.physics.add.collider(this.player, coworker);

          this.deskAnchor = this.add.zone(860, 332, 250, 156);

          this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
          this.cameras.main.setZoom(1.02);

          this.cursors = this.input.keyboard!.createCursorKeys();
          this.keys = this.input.keyboard!.addKeys("W,A,S,D,E") as Record<
            string,
            Phaser.Input.Keyboard.Key
          >;

          this.events.on("desk-mode", (locked: boolean) => {
            this.inputLocked = locked;
            if (locked) {
              playerBody.setVelocity(0, 0);
            }

            this.tweens.killTweensOf(this.cameras.main);
            this.tweens.add({
              targets: this.cameras.main,
              zoom: locked ? 1.16 : 1.02,
              duration: locked ? 280 : 360,
              ease: "Sine.easeInOut",
            });
          });

          this.tweens.add({
            targets: deskAura,
            alpha: { from: 0.04, to: 0.12 },
            scale: { from: 0.96, to: 1.04 },
            duration: 2200,
            yoyo: true,
            repeat: -1,
            ease: "Sine.easeInOut",
          });

          this.tweens.add({
            targets: deskSweep,
            y: { from: 300, to: 344 },
            alpha: { from: 0.05, to: 0.24 },
            duration: 1800,
            yoyo: true,
            repeat: -1,
            ease: "Sine.easeInOut",
          });

          this.tweens.add({
            targets: coworkerLamp,
            alpha: { from: 0.06, to: 0.16 },
            scale: { from: 0.97, to: 1.05 },
            duration: 2500,
            yoyo: true,
            repeat: -1,
            ease: "Sine.easeInOut",
            delay: 260,
          });

          this.tweens.add({
            targets: corridorSweep,
            x: { from: 252, to: 404 },
            alpha: { from: 0.02, to: 0.09 },
            duration: 3200,
            yoyo: true,
            repeat: -1,
            ease: "Sine.easeInOut",
            delay: 420,
          });
        }

        update() {
          const body = this.player.body as Phaser.Physics.Arcade.Body;
          const speed = 190;
          let velocityX = 0;
          let velocityY = 0;

          if (!this.inputLocked) {
            if (this.cursors.left.isDown || this.keys.A.isDown) velocityX -= speed;
            if (this.cursors.right.isDown || this.keys.D.isDown) velocityX += speed;
            if (this.cursors.up.isDown || this.keys.W.isDown) velocityY -= speed;
            if (this.cursors.down.isDown || this.keys.S.isDown) velocityY += speed;
          }

          body.setVelocity(velocityX, velocityY);
          if (velocityX !== 0 && velocityY !== 0) {
            body.velocity.normalize().scale(speed);
          }

          const nearDesk =
            Phaser.Math.Distance.Between(
              this.player.x,
              this.player.y,
              this.deskAnchor.x,
              this.deskAnchor.y,
            ) < 132;

          if (nearDesk !== this.isNearDesk) {
            this.isNearDesk = nearDesk;
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

        private drawRoom(PhaserLib: typeof import("phaser")) {
          const graphics = this.add.graphics();

          graphics.fillStyle(0x0e1016, 1);
          graphics.fillRect(0, 0, roomWidth, roomHeight);

          graphics.fillStyle(0x131722, 1);
          graphics.fillRect(38, 38, roomWidth - 76, roomHeight - 76);

          graphics.lineStyle(1, 0x1f2633, 0.52);
          for (let x = 90; x < roomWidth - 60; x += 66) {
            graphics.lineBetween(x, 70, x, roomHeight - 70);
          }
          for (let y = 82; y < roomHeight - 60; y += 66) {
            graphics.lineBetween(70, y, roomWidth - 70, y);
          }

          graphics.fillStyle(0x1a2230, 0.92);
          graphics.fillRoundedRect(112, 74, 190, 72, 14);
          graphics.fillStyle(0x2d3a4f, 0.88);
          graphics.fillRoundedRect(136, 96, 140, 22, 8);

          graphics.fillStyle(0x202938, 0.95);
          graphics.fillRoundedRect(760, 266, 228, 104, 18);
          graphics.fillStyle(0x8c7fe0, 0.18);
          graphics.fillRoundedRect(790, 278, 70, 10, 4);
          graphics.fillRoundedRect(884, 278, 70, 10, 4);
          graphics.fillStyle(0x0f141e, 1);
          graphics.fillRoundedRect(804, 292, 132, 56, 12);

          graphics.fillStyle(0x111722, 0.94);
          graphics.fillRoundedRect(894, 160, 120, 90, 18);
          graphics.fillStyle(0x8c7fe0, 0.2);
          graphics.fillRoundedRect(908, 174, 54, 6, 3);
          graphics.fillStyle(0x0d1218, 0.95);
          graphics.fillRoundedRect(904, 188, 82, 34, 10);

          graphics.fillStyle(0x1d241f, 1);
          graphics.fillCircle(1090, 610, 26);
          graphics.fillStyle(0x283227, 1);
          graphics.fillRect(1082, 622, 16, 40);

          graphics.fillStyle(0x191d25, 0.98);
          graphics.fillRoundedRect(1004, 546, 92, 96, 16);
          graphics.fillStyle(0x5f62b8, 0.14);
          graphics.fillRoundedRect(1018, 560, 64, 12, 4);
          graphics.fillRoundedRect(1018, 584, 64, 12, 4);

          graphics.fillStyle(0x0a0d11, 1);
          graphics.fillRect(64, 634, 140, 10);

          const ambientTextStyle = {
            fontFamily: "IBM Plex Mono, monospace",
            fontSize: "12px",
            color: "#70778a",
          };

          this.add.text(150, 158, "OFFICE BOARD", ambientTextStyle);
          this.add.text(760, 398, "PLAYER DESK", ambientTextStyle);
          this.add.text(904, 274, "COWORKER", ambientTextStyle);
          this.add.text(70, 607, "ENTRY", ambientTextStyle);

          const glow = this.add.circle(870, 332, 148, 0x5f62b8, 0.08);
          glow.setBlendMode(PhaserLib.BlendModes.SCREEN);
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

/**
 * Hero Three.js Interactive 3D Experience — UI/UX Designer Workspace
 * Strictly scoped to the landing/hero section.
 *
 * Recreates the premium dark UI/UX designer workspace inspired by the portfolio reference:
 * - Stylized 3D designer in ergonomic chair viewed from rear-left 3/4 angle facing the monitor:
 *   Dark streetwear hoodie, folded hood, styled tousled dark hair, studio headphones with DK monogram.
 * - Modern dark desk with dual-tone pad, low-profile keyboard, ergonomic mouse, DK coffee mug with rising steam, notebook.
 * - Large desktop monitor running an animated Figma-style UI/UX workspace (Design, Wireframe, Prototype, Return states).
 * - Background wall shelf with books, cascading hanging ivy plant, and red LED backlighting.
 * - Modern articulated desk lamp on right with warm red/amber cone lighting.
 * - Small potted succulents/plants on desk and shelf.
 * - Floating glassmorphic UI/UX cards ("UI/UX" pen tool, color palette, "Aa" typography, component spec).
 * - Cinematic studio lighting with signature brand red (#f43534) rim highlights and ambient embers.
 * - Interactive mouse parallax with smooth damping (3-5° X, 5-7° Y).
 * - Organic idle breathing and scroll synchronization.
 * - Zero overlap with Hero text ("Hi! I'm Dinesh", subtitle, description, CTA).
 * - Fully responsive for Desktop, Tablet, and Mobile.
 */
import * as THREE from 'three';
import { prefersReducedMotion } from '../js/utils.js';

// ==========================================
// 1. DYNAMIC PROCEDURAL CANVAS TEXTURES
// ==========================================

class FigmaScreenRenderer {
  constructor() {
    this.width = 1024;
    this.height = 640;
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.ctx = this.canvas.getContext('2d');

    // 4 Distinct Design Screens
    // Screen 0: UI/UX Hero Experience (Landing Page)
    // Screen 1: Wireframes & UX Flow Architecture
    // Screen 2: High Fidelity Design System & UI Cards
    // Screen 3: Interactive Prototype & Testing
    this.scrollY = 0;
    this.targetScrollY = 0;
    this.maxScroll = 1200;
    this.isUserScrolling = false;
    this.userScrollTimer = 0;
    this.activeScreen = 0;

    this.timer = 0;
    this.flowSignalOffset = 0;

    this.cursor = {
      x: 480,
      y: 280,
      targetX: 480,
      targetY: 280,
      clicking: false,
      pulse: 0
    };

    // Cached Dot Grid Pattern Canvas for high-performance single-pass fill
    this.dotPatternCanvas = document.createElement('canvas');
    this.dotPatternCanvas.width = 22;
    this.dotPatternCanvas.height = 22;
    const pctx = this.dotPatternCanvas.getContext('2d');
    pctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    pctx.fillRect(0, 0, 1.5, 1.5);
    this.dotPattern = this.ctx.createPattern(this.dotPatternCanvas, 'repeat');
  }

  handleWheel(deltaY) {
    this.targetScrollY = Math.max(0, Math.min(this.maxScroll, this.targetScrollY + deltaY * 0.95));
    this.isUserScrolling = true;
    this.userScrollTimer = 2.8; // Yield auto-animation for 2.8s during user interaction
  }

  update(delta) {
    this.timer += delta;
    this.flowSignalOffset = (this.flowSignalOffset + delta * 48) % 100;

    // 1. User Scroll vs Idle Auto-Cruising
    if (this.userScrollTimer > 0) {
      this.userScrollTimer -= delta;
      if (this.userScrollTimer <= 0) {
        this.isUserScrolling = false;
      }
    } else {
      // Gentle automatic cruising through the 4 screens
      this.targetScrollY = (this.targetScrollY + delta * 26) % (this.maxScroll + 120);
    }

    // Smooth scroll interpolation
    this.scrollY += (this.targetScrollY - this.scrollY) * 0.12;

    // Active screen calculation based on scroll offset
    if (this.scrollY < 260) {
      this.activeScreen = 0; // Screen 1: Hero
    } else if (this.scrollY < 630) {
      this.activeScreen = 1; // Screen 2: Wireframes
    } else if (this.scrollY < 990) {
      this.activeScreen = 2; // Screen 3: High Fidelity
    } else {
      this.activeScreen = 3; // Screen 4: Prototype
    }

    // 2. Animate Multiplayer Cursor on active screen
    const screenBaseY = [60, 470, 880, 1290][this.activeScreen] - this.scrollY;

    if (this.activeScreen === 0) {
      // Screen 1: Inspecting CTA & layout
      this.cursor.targetX = 490 + Math.sin(this.timer * 1.5) * 60;
      this.cursor.targetY = screenBaseY + 280 + Math.cos(this.timer * 1.2) * 25;
      this.cursor.clicking = false;
    } else if (this.activeScreen === 1) {
      // Screen 2: Tracing user flow noodle
      this.cursor.targetX = 460 + Math.sin(this.timer * 1.8) * 80;
      this.cursor.targetY = screenBaseY + 190 + Math.cos(this.timer * 1.4) * 35;
      this.cursor.clicking = false;
    } else if (this.activeScreen === 2) {
      // Screen 3: Selecting color tokens & toggle
      this.cursor.targetX = 540 + Math.cos(this.timer * 1.6) * 50;
      this.cursor.targetY = screenBaseY + 220 + Math.sin(this.timer * 1.3) * 20;
      this.cursor.clicking = false;
    } else {
      // Screen 4: Tapping prototype button
      this.cursor.targetX = 430;
      this.cursor.targetY = screenBaseY + 260;
      const cycle = this.timer % 3.0;
      if (cycle > 1.2 && cycle < 2.6) {
        this.cursor.clicking = true;
        this.cursor.pulse = (this.cursor.pulse + delta * 3.5) % 1;
      } else {
        this.cursor.clicking = false;
      }
    }

    this.cursor.x += (this.cursor.targetX - this.cursor.x) * 0.12;
    this.cursor.y += (this.cursor.targetY - this.cursor.y) * 0.12;

    this.render();
  }

  render() {
    const ctx = this.ctx;
    const W = this.width;
    const H = this.height;

    // 1. Overall Dark Canvas Background
    ctx.fillStyle = '#141518';
    ctx.fillRect(0, 0, W, H);

    // Viewport boundaries for design canvas
    const vpX = 180;
    const vpY = 38;
    const vpW = W - 180 - 180;
    const vpH = H - 38;

    // Dot Grid with Scroll Parallax (High-performance single pattern fill)
    if (this.dotPattern) {
      ctx.save();
      ctx.fillStyle = this.dotPattern;
      ctx.translate(0, -Math.round(this.scrollY % 22));
      ctx.fillRect(vpX, vpY, vpW, vpH + 22);
      ctx.restore();
    }

    // Clip to Viewport and translate by scroll
    ctx.save();
    ctx.beginPath();
    ctx.rect(vpX, vpY, vpW, vpH);
    ctx.clip();

    ctx.save();
    ctx.translate(0, -this.scrollY);

    const artX = 220;
    const artW = 580;
    const artH = 360;

    // ==========================================
    // SCREEN 1: UI/UX Design — Hero Landing Page
    // ==========================================
    this.renderScreen1(ctx, artX, 60, artW, artH);

    // ==========================================
    // SCREEN 2: Wireframes & UX Flow Architecture
    // ==========================================
    this.renderScreen2(ctx, artX, 470, artW, artH);

    // ==========================================
    // SCREEN 3: High Fidelity UI & Design System
    // ==========================================
    this.renderScreen3(ctx, artX, 880, artW, artH);

    // ==========================================
    // SCREEN 4: Interactive Prototype & Testing
    // ==========================================
    this.renderScreen4(ctx, artX, 1290, artW, artH);

    ctx.restore();

    // Scrollbar indicator inside Viewport
    this.renderScrollbar(ctx, vpX + vpW - 8, vpY + 8, 5, vpH - 16);

    ctx.restore();

    // Figma Chrome
    this.renderToolbar(ctx, W);
    this.renderLayersPanel(ctx, vpX, H);
    this.renderInspector(ctx, W, H);
    this.renderMultiplayerCursor(ctx);
  }

  renderScreen1(ctx, x, y, w, h) {
    // Frame Label
    ctx.fillStyle = '#0d99ff';
    ctx.font = '500 11px system-ui, -apple-system, sans-serif';
    ctx.fillText('❖ Screen 1: UI/UX Design — Hero Experience (1440px)', x, y - 8);

    // Frame Body
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 12);
    ctx.fillStyle = '#181a20';
    ctx.fill();
    ctx.strokeStyle = this.activeScreen === 0 ? '#0d99ff' : 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.clip();

    // Banner: Sunset Mountain Illustration
    const bannerH = 145;
    const grad = ctx.createLinearGradient(x, y, x + w, y + bannerH);
    grad.addColorStop(0, '#38164b');
    grad.addColorStop(0.5, '#7b204e');
    grad.addColorStop(1, '#e03a3a');
    ctx.fillStyle = grad;
    ctx.fillRect(x, y, w, bannerH);

    // Radiant Sun Disc
    ctx.beginPath();
    ctx.arc(x + w * 0.72, y + 55, 26, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 220, 210, 0.9)';
    ctx.shadowColor = '#f43534';
    ctx.shadowBlur = 18;
    ctx.fill();
    ctx.shadowBlur = 0;

    // Mountain Ridges (Back)
    ctx.fillStyle = '#22112d';
    ctx.beginPath();
    ctx.moveTo(x + 60, y + bannerH);
    ctx.lineTo(x + 170, y + 50);
    ctx.lineTo(x + 270, y + bannerH);
    ctx.fill();

    // Mountain Ridges (Front with snow peak)
    ctx.fillStyle = '#180c21';
    ctx.beginPath();
    ctx.moveTo(x + 180, y + bannerH);
    ctx.lineTo(x + 310, y + 35);
    ctx.lineTo(x + 440, y + bannerH);
    ctx.fill();

    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.beginPath();
    ctx.moveTo(x + 310, y + 35);
    ctx.lineTo(x + 285, y + 65);
    ctx.lineTo(x + 310, y + 58);
    ctx.lineTo(x + 335, y + 65);
    ctx.closePath();
    ctx.fill();

    // UI Content Cards
    const cardW = 124;
    const cardH = 88;
    const cardGap = 14;
    const startY = y + bannerH + 18;
    const startX = x + (w - (cardW * 4 + cardGap * 3)) / 2;

    const cards = [
      { title: 'Design System', col: '#f43534', isAction: true },
      { title: 'Prototyping', col: '#9333ea', isAction: false },
      { title: 'Typography', col: '#06b6d4', isAction: false },
      { title: 'Motion Specs', col: '#eab308', isAction: false }
    ];

    cards.forEach((c, i) => {
      const cx = startX + i * (cardW + cardGap);
      ctx.beginPath();
      ctx.roundRect(cx, startY, cardW, cardH, 8);
      ctx.fillStyle = '#22252e';
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.09)';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.beginPath();
      ctx.roundRect(cx + 10, startY + 10, 18, 18, 5);
      ctx.fillStyle = c.col;
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = '600 10px system-ui, sans-serif';
      ctx.fillText(c.title, cx + 34, startY + 22);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.fillRect(cx + 10, startY + 36, cardW - 20, 4);
      ctx.fillRect(cx + 10, startY + 44, cardW - 40, 4);

      ctx.beginPath();
      ctx.roundRect(cx + 10, startY + 56, cardW - 20, 20, 5);
      if (c.isAction) {
        ctx.fillStyle = '#f43534';
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.font = '600 9px system-ui, sans-serif';
        ctx.fillText('Explore Work', cx + 24, startY + 69);
      } else {
        ctx.fillStyle = '#2c313d';
        ctx.fill();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.font = '500 9px system-ui, sans-serif';
        ctx.fillText('Inspect', cx + 44, startY + 69);
      }
    });

    ctx.restore();

    // Handles if active
    if (this.activeScreen === 0) {
      this.renderSelectionHandles(ctx, x, y, w, h);
    }
  }

  renderScreen2(ctx, x, y, w, h) {
    // Frame Label
    ctx.fillStyle = '#a855f7';
    ctx.font = '500 11px system-ui, -apple-system, sans-serif';
    ctx.fillText('❖ Screen 2: Wireframes & UX Flow Architecture', x, y - 8);

    // Frame Body
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 12);
    ctx.fillStyle = '#15171d';
    ctx.fill();
    ctx.strokeStyle = this.activeScreen === 1 ? '#a855f7' : 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.clip();

    // Blueprint Header Bar
    ctx.fillStyle = 'rgba(168, 85, 247, 0.12)';
    ctx.fillRect(x, y, w, 32);
    ctx.fillStyle = '#c084fc';
    ctx.font = '600 11px system-ui, sans-serif';
    ctx.fillText('UX FLOW — 3 STAGE PIPELINE', x + 16, y + 20);

    // 3 UX Flow Step Nodes
    const stepW = 155;
    const stepH = 220;
    const stepY = y + 54;
    const stepGap = 45;
    const startX = x + 35;

    const steps = [
      { num: '01', title: 'User Discovery', sub: 'Persona & Journey', tag: 'INPUT' },
      { num: '02', title: 'Wireframe Engine', sub: 'Low-Fi Prototypes', tag: 'PROCESS' },
      { num: '03', title: 'Usability Audit', sub: 'A/B Validation', tag: 'OUTPUT' }
    ];

    steps.forEach((s, idx) => {
      const sx = startX + idx * (stepW + stepGap);

      // Blueprint Card
      ctx.beginPath();
      ctx.roundRect(sx, stepY, stepW, stepH, 8);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.4)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 3]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Step Tag
      ctx.fillStyle = '#f43534';
      ctx.beginPath();
      ctx.roundRect(sx + 12, stepY + 12, 28, 16, 4);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 9px monospace';
      ctx.fillText(s.num, sx + 18, stepY + 24);

      ctx.fillStyle = '#ffffff';
      ctx.font = '600 11px system-ui, sans-serif';
      ctx.fillText(s.title, sx + 46, stepY + 24);

      // Wireframe Skeleton
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.strokeRect(sx + 14, stepY + 44, stepW - 28, 55);

      ctx.beginPath();
      ctx.arc(sx + 34, stepY + 70, 12, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.fillRect(sx + 56, stepY + 62, 70, 5);
      ctx.fillRect(sx + 56, stepY + 72, 45, 4);

      // Blueprint Button Skeleton
      ctx.setLineDash([2, 2]);
      ctx.strokeStyle = '#0d99ff';
      ctx.strokeRect(sx + 14, stepY + 114, stepW - 28, 22);
      ctx.setLineDash([]);

      // Subtitle
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.font = '10px system-ui, sans-serif';
      ctx.fillText(s.sub, sx + 14, stepY + 160);

      // Metric Badge
      ctx.fillStyle = 'rgba(13, 153, 255, 0.15)';
      ctx.beginPath();
      ctx.roundRect(sx + 14, stepY + 180, stepW - 28, 24, 4);
      ctx.fill();
      ctx.fillStyle = '#38bdf8';
      ctx.font = '500 10px monospace';
      ctx.fillText(`STATUS: ${s.tag}`, sx + 22, stepY + 196);
    });

    // Connecting Flow Noodles between steps
    for (let i = 0; i < 2; i++) {
      const nStartX = startX + i * (stepW + stepGap) + stepW;
      const nStartY = stepY + 125;
      const nEndX = startX + (i + 1) * (stepW + stepGap);
      const nEndY = stepY + 125;

      ctx.beginPath();
      ctx.moveTo(nStartX, nStartY);
      ctx.bezierCurveTo(nStartX + 20, nStartY - 25, nEndX - 20, nEndY + 25, nEndX, nEndY);
      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Flow signal dot
      const pulseT = ((this.flowSignalOffset * 0.01 + i * 0.5) % 1);
      const dotX = nStartX + (nEndX - nStartX) * pulseT;
      const dotY = nStartY + Math.sin(pulseT * Math.PI) * 15 * (i === 0 ? -1 : 1);

      ctx.beginPath();
      ctx.arc(dotX, dotY, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#38bdf8';
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    ctx.restore();

    if (this.activeScreen === 1) {
      this.renderSelectionHandles(ctx, x, y, w, h);
    }
  }

  renderScreen3(ctx, x, y, w, h) {
    // Frame Label
    ctx.fillStyle = '#10b981';
    ctx.font = '500 11px system-ui, -apple-system, sans-serif';
    ctx.fillText('❖ Screen 3: High Fidelity Design System & UI Cards', x, y - 8);

    ctx.save();
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 12);
    ctx.fillStyle = '#161922';
    ctx.fill();
    ctx.strokeStyle = this.activeScreen === 2 ? '#10b981' : 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.clip();

    // Top Design System Navigation Tab
    ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.fillRect(x, y, w, 34);
    ctx.fillStyle = '#10b981';
    ctx.font = '600 11px system-ui, sans-serif';
    ctx.fillText('TOKENS & UI COMPONENTS', x + 18, y + 22);

    // Left Column: Interactive Component Card
    const colLX = x + 24;
    const colLY = y + 54;
    const colLW = 270;
    const colLH = 280;

    ctx.beginPath();
    ctx.roundRect(colLX, colLY, colLW, colLH, 10);
    ctx.fillStyle = '#202430';
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.stroke();

    // Header gradient line
    const accentGrad = ctx.createLinearGradient(colLX, colLY, colLX + colLW, colLY);
    accentGrad.addColorStop(0, '#f43534');
    accentGrad.addColorStop(1, '#ff7a45');
    ctx.fillStyle = accentGrad;
    ctx.fillRect(colLX, colLY, colLW, 4);

    ctx.fillStyle = '#ffffff';
    ctx.font = '600 13px system-ui, sans-serif';
    ctx.fillText('Interactive Glassmorphic Card', colLX + 16, colLY + 32);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = '10px system-ui, sans-serif';
    ctx.fillText('Multi-state UI module with fluid physics', colLX + 16, colLY + 48);

    // Toggle Switch Component
    ctx.fillStyle = '#ffffff';
    ctx.font = '500 11px system-ui, sans-serif';
    ctx.fillText('Active State Engine', colLX + 16, colLY + 82);

    ctx.beginPath();
    ctx.roundRect(colLX + 195, colLY + 68, 44, 22, 11);
    ctx.fillStyle = '#f43534';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(colLX + 226, colLY + 79, 8.5, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 4;
    ctx.fill();
    ctx.shadowBlur = 0;

    // Button Variants Showcase
    ctx.fillStyle = '#ffffff';
    ctx.font = '600 11px system-ui, sans-serif';
    ctx.fillText('Button Variants', colLX + 16, colLY + 125);

    // Primary Solid Button
    ctx.beginPath();
    ctx.roundRect(colLX + 16, colLY + 140, 115, 32, 6);
    ctx.fillStyle = '#f43534';
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = '600 10px system-ui, sans-serif';
    ctx.fillText('Primary Action', colLX + 34, colLY + 160);

    // Ghost Outline Button
    ctx.beginPath();
    ctx.roundRect(colLX + 142, colLY + 140, 110, 32, 6);
    ctx.strokeStyle = '#0d99ff';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.fillStyle = '#0d99ff';
    ctx.font = '600 10px system-ui, sans-serif';
    ctx.fillText('Secondary', colLX + 170, colLY + 160);

    // Metrics Pill
    ctx.beginPath();
    ctx.roundRect(colLX + 16, colLY + 190, colLW - 32, 65, 8);
    ctx.fillStyle = 'rgba(16, 185, 129, 0.12)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.3)';
    ctx.stroke();

    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 20px monospace';
    ctx.fillText('99.4%', colLX + 30, colLY + 225);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = '500 10px system-ui, sans-serif';
    ctx.fillText('Design Token Sync Rating', colLX + 30, colLY + 242);

    // Right Column: Color Palette & Typography Tokens
    const colRX = x + 315;
    const colRY = y + 54;
    const colRW = 240;

    ctx.fillStyle = '#ffffff';
    ctx.font = '600 12px system-ui, sans-serif';
    ctx.fillText('Color Tokens & Swatches', colRX, colRY + 16);

    const tokens = [
      { name: 'Brand Red (Accent)', hex: '#F43534', col: '#f43534' },
      { name: 'Warm Cream (Light)', hex: '#F5F1EC', col: '#f5f1ec' },
      { name: 'Obsidian (Dark Base)', hex: '#121316', col: '#121316' },
      { name: 'Electric Cyan (UX)', hex: '#0D99FF', col: '#0d99ff' }
    ];

    tokens.forEach((t, i) => {
      const ty = colRY + 36 + i * 55;
      ctx.beginPath();
      ctx.roundRect(colRX, ty, colRW, 46, 6);
      ctx.fillStyle = '#202430';
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.stroke();

      ctx.beginPath();
      ctx.roundRect(colRX + 8, ty + 8, 30, 30, 4);
      ctx.fillStyle = t.col;
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = '600 11px system-ui, sans-serif';
      ctx.fillText(t.name, colRX + 48, ty + 22);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.font = '500 10px monospace';
      ctx.fillText(t.hex, colRX + 48, ty + 36);
    });

    ctx.restore();

    if (this.activeScreen === 2) {
      this.renderSelectionHandles(ctx, x, y, w, h);
    }
  }

  renderScreen4(ctx, x, y, w, h) {
    // Frame Label
    ctx.fillStyle = '#f97316';
    ctx.font = '500 11px system-ui, -apple-system, sans-serif';
    ctx.fillText('❖ Screen 4: Prototype & Interactive Testing Experience', x, y - 8);

    ctx.save();
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 12);
    ctx.fillStyle = '#14161f';
    ctx.fill();
    ctx.strokeStyle = this.activeScreen === 3 ? '#f97316' : 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.clip();

    // Prototype Mode Banner
    ctx.fillStyle = 'rgba(249, 115, 22, 0.15)';
    ctx.fillRect(x, y, w, 34);
    ctx.fillStyle = '#fb923c';
    ctx.font = '600 11px system-ui, sans-serif';
    ctx.fillText('LIVE INTERACTION PREVIEW — SMART ANIMATE', x + 18, y + 22);

    // Left Frame: Mobile Mockup Screen
    const mobX = x + 40;
    const mobY = y + 54;
    const mobW = 165;
    const mobH = 280;

    ctx.beginPath();
    ctx.roundRect(mobX, mobY, mobW, mobH, 16);
    ctx.fillStyle = '#1f232d';
    ctx.fill();
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Notch
    ctx.fillStyle = '#0f1218';
    ctx.beginPath();
    ctx.roundRect(mobX + 42, mobY + 6, 80, 10, 5);
    ctx.fill();

    // App Screen Header
    ctx.fillStyle = '#f43534';
    ctx.font = 'bold 11px system-ui, sans-serif';
    ctx.fillText('Dinesh Portfolio', mobX + 16, mobY + 40);

    // Card inside mobile app
    ctx.beginPath();
    ctx.roundRect(mobX + 14, mobY + 55, mobW - 28, 90, 8);
    ctx.fillStyle = '#2c3240';
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = '600 10px system-ui, sans-serif';
    ctx.fillText('Featured Project', mobX + 24, mobY + 75);

    // Interactive CTA Button inside phone
    const btnX = mobX + 14;
    const btnY = mobY + 165;
    const btnW = mobW - 28;
    const btnH = 34;

    ctx.beginPath();
    ctx.roundRect(btnX, btnY, btnW, btnH, 8);
    ctx.fillStyle = '#f43534';
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = '600 10px system-ui, sans-serif';
    ctx.fillText('View Case Study ➔', btnX + 22, btnY + 21);

    // Pulse ripple on button tap
    if (this.cursor.clicking) {
      ctx.beginPath();
      ctx.arc(btnX + btnW / 2, btnY + btnH / 2, 14 + this.cursor.pulse * 24, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(255, 255, 255, ${1 - this.cursor.pulse})`;
      ctx.lineWidth = 2.5;
      ctx.stroke();
    }

    // Right Frame: Modal Overlay appearing on click
    const modalX = x + 280;
    const modalY = y + 75;
    const modalW = 260;
    const modalH = 220;

    ctx.beginPath();
    ctx.roundRect(modalX, modalY, modalW, modalH, 12);
    ctx.fillStyle = '#222634';
    ctx.fill();
    ctx.strokeStyle = '#0d99ff';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#0d99ff';
    ctx.font = 'bold 12px system-ui, sans-serif';
    ctx.fillText('❖ Modal: Case Study Overlay', modalX + 18, modalY + 30);

    ctx.fillStyle = '#ffffff';
    ctx.font = '600 11px system-ui, sans-serif';
    ctx.fillText('Interactive Details Unlocked', modalX + 18, modalY + 60);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = '10px system-ui, sans-serif';
    ctx.fillText('Trigger: On Tap ➔ Open Overlay', modalX + 18, modalY + 80);
    ctx.fillText('Animation: Smart Animate (400ms)', modalX + 18, modalY + 98);

    // Prototype Connection Noodle
    ctx.beginPath();
    ctx.moveTo(btnX + btnW, btnY + btnH / 2);
    ctx.bezierCurveTo(btnX + btnW + 50, btnY, modalX - 40, modalY + 110, modalX, modalY + 110);
    ctx.strokeStyle = '#0d99ff';
    ctx.lineWidth = 2.5;
    ctx.setLineDash([6, 4]);
    ctx.lineDashOffset = -this.timer * 25;
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.beginPath();
    ctx.arc(modalX, modalY + 110, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#0d99ff';
    ctx.fill();

    // Prototype Badge
    ctx.fillStyle = 'rgba(13, 153, 255, 0.18)';
    ctx.beginPath();
    ctx.roundRect(modalX + 18, modalY + 130, modalW - 36, 65, 8);
    ctx.fill();

    ctx.fillStyle = '#38bdf8';
    ctx.font = '600 10px monospace';
    ctx.fillText('PROTOTYPE LINK ACTIVE', modalX + 30, modalY + 155);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = '10px system-ui, sans-serif';
    ctx.fillText('Hotspot response verified (0ms lag)', modalX + 30, modalY + 175);

    ctx.restore();

    if (this.activeScreen === 3) {
      this.renderSelectionHandles(ctx, x, y, w, h);
    }
  }

  renderSelectionHandles(ctx, x, y, w, h) {
    ctx.strokeStyle = '#0d99ff';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x - 2, y - 2, w + 4, h + 4);

    const size = 6;
    const corners = [
      [x - 2, y - 2],
      [x + w + 2, y - 2],
      [x - 2, y + h + 2],
      [x + w + 2, y + h + 2]
    ];
    ctx.fillStyle = '#ffffff';
    corners.forEach(([cx, cy]) => {
      ctx.fillRect(cx - size / 2, cy - size / 2, size, size);
      ctx.strokeRect(cx - size / 2, cy - size / 2, size, size);
    });
  }

  renderScrollbar(ctx, x, y, w, h) {
    // Scrollbar Track
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, w / 2);
    ctx.fill();

    // Scrollbar Thumb
    const thumbH = 65;
    const maxThumbY = h - thumbH;
    const thumbY = y + (this.scrollY / this.maxScroll) * maxThumbY;

    ctx.fillStyle = this.isUserScrolling ? '#0d99ff' : 'rgba(255, 255, 255, 0.35)';
    ctx.beginPath();
    ctx.roundRect(x, thumbY, w, thumbH, w / 2);
    ctx.fill();
  }

  renderToolbar(ctx, W) {
    ctx.fillStyle = '#22242a';
    ctx.fillRect(0, 0, W, 38);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.fillRect(0, 37, W, 1);

    const dots = ['#ff5f56', '#ffbd2e', '#27c93f'];
    dots.forEach((color, i) => {
      ctx.beginPath();
      ctx.arc(16 + i * 14, 19, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
    });

    // DK Logo Pill
    ctx.fillStyle = '#f43534';
    ctx.beginPath();
    ctx.roundRect(64, 11, 18, 16, 4);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 9px sans-serif';
    ctx.fillText('DK', 67, 23);

    ctx.fillStyle = '#ffffff';
    ctx.font = '500 12px system-ui, sans-serif';
    ctx.fillText('Dinesh_Portfolio_v2.fig', 94, 23);

    const tools = ['⬚', '❖', '✎', 'T', '✋', '💬'];
    ctx.font = '13px sans-serif';
    tools.forEach((tool, i) => {
      const tx = 380 + i * 28;
      ctx.fillStyle = i === 0 ? '#0d99ff' : 'rgba(255, 255, 255, 0.55)';
      ctx.fillText(tool, tx, 23);
    });

    // Share Pill
    ctx.beginPath();
    ctx.roundRect(W - 130, 9, 62, 20, 5);
    ctx.fillStyle = '#0d99ff';
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = '600 10px system-ui, sans-serif';
    ctx.fillText('Share', W - 114, 23);

    // Play/Present Button
    ctx.beginPath();
    ctx.moveTo(W - 48, 14);
    ctx.lineTo(W - 36, 19);
    ctx.lineTo(W - 48, 24);
    ctx.closePath();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.fill();
  }

  renderLayersPanel(ctx, leftW, H) {
    ctx.fillStyle = '#1a1c22';
    ctx.fillRect(0, 38, leftW, H - 38);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.fillRect(leftW - 1, 38, 1, H - 38);

    ctx.fillStyle = '#ffffff';
    ctx.font = '600 11px system-ui, sans-serif';
    ctx.fillText('Layers', 14, 58);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.fillText('Assets', 65, 58);

    const layers = [
      { name: '❖ Screen 1: Web Hero', icon: '❖', screen: 0 },
      { name: '  ▸ Header & CTA', icon: '#', screen: 0 },
      { name: '❖ Screen 2: Wireframes', icon: '❖', screen: 1 },
      { name: '  ▸ UX Flow Nodes', icon: '#', screen: 1 },
      { name: '❖ Screen 3: UI Tokens', icon: '❖', screen: 2 },
      { name: '  ▸ Component System', icon: '#', screen: 2 },
      { name: '❖ Screen 4: Prototype', icon: '❖', screen: 3 },
      { name: '  ▸ Mobile Live Tap', icon: '#', screen: 3 }
    ];

    layers.forEach((layer, idx) => {
      const ly = 82 + idx * 24;
      const isActive = this.activeScreen === layer.screen;
      if (isActive) {
        ctx.fillStyle = 'rgba(13, 153, 255, 0.2)';
        ctx.fillRect(6, ly - 14, leftW - 12, 20);
        ctx.fillStyle = '#0d99ff';
      } else {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
      }
      ctx.font = '10px system-ui, sans-serif';
      ctx.fillText(layer.name, 14, ly);
    });
  }

  renderInspector(ctx, W, H) {
    const rightW = 180;
    const rightX = W - rightW;
    ctx.fillStyle = '#1a1c22';
    ctx.fillRect(rightX, 38, rightW, H - 38);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.fillRect(rightX, 38, 1, H - 38);

    ctx.fillStyle = '#ffffff';
    ctx.font = '600 11px system-ui, sans-serif';
    ctx.fillText('Design', rightX + 16, 58);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.fillText('Prototype', rightX + 68, 58);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = '9px monospace';
    const screenY = [60, 470, 880, 1290][this.activeScreen];
    ctx.fillText(`X: 220    Y: ${screenY}`, rightX + 16, 84);
    ctx.fillText('W: 580    H: 360', rightX + 16, 102);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.fillRect(rightX + 14, 116, rightW - 28, 1);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.font = '600 10px system-ui, sans-serif';
    ctx.fillText('Auto Layout', rightX + 16, 134);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.font = '9px system-ui, sans-serif';
    ctx.fillText('Vertical (Gap: 24px)', rightX + 16, 150);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.fillRect(rightX + 14, 166, rightW - 28, 1);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.font = '600 10px system-ui, sans-serif';
    ctx.fillText('Selection Colors', rightX + 16, 184);

    const colors = [
      { hex: '#F43534', label: 'Primary Red' },
      { hex: '#121316', label: 'Obsidian' },
      { hex: '#0D99FF', label: 'Cyan Wire' }
    ];
    colors.forEach((c, idx) => {
      const cy = 204 + idx * 24;
      ctx.fillStyle = c.hex;
      ctx.fillRect(rightX + 16, cy - 8, 12, 12);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.font = '9px monospace';
      ctx.fillText(c.hex, rightX + 36, cy + 2);
    });
  }

  renderMultiplayerCursor(ctx) {
    ctx.save();
    ctx.translate(this.cursor.x, this.cursor.y);

    // Vector Pen Cursor
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, 15);
    ctx.lineTo(4, 12);
    ctx.lineTo(8, 20);
    ctx.lineTo(11, 18);
    ctx.lineTo(7, 10);
    ctx.lineTo(13, 10);
    ctx.closePath();
    ctx.fillStyle = '#f43534';
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.stroke();

    // User Tag Pill
    ctx.beginPath();
    ctx.roundRect(8, 14, 62, 16, 4);
    ctx.fillStyle = '#f43534';
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 9px system-ui, sans-serif';
    ctx.fillText('Dinesh [DK]', 12, 26);
    ctx.restore();
  }
}

function createHeadphoneTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  const grad = ctx.createRadialGradient(128, 128, 20, 128, 128, 128);
  grad.addColorStop(0, '#262933');
  grad.addColorStop(0.7, '#14151a');
  grad.addColorStop(1, '#090a0d');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(128, 128, 126, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#f43534';
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.arc(128, 128, 114, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(128, 128, 122, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = '#ffffff';
  ctx.font = '900 88px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('DK', 128, 128);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createMugTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#141518';
  ctx.fillRect(0, 0, 512, 256);

  ctx.strokeStyle = '#f43534';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.roundRect(206, 68, 100, 100, 18);
  ctx.stroke();

  ctx.fillStyle = '#ffffff';
  ctx.font = '900 48px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('DK', 256, 118);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.font = '600 12px monospace';
  ctx.fillText('UI / UX DESIGN', 256, 190);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createFloatingCardTexture(type) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = 'rgba(20, 22, 30, 0.9)';
  ctx.beginPath();
  ctx.roundRect(16, 16, 480, 480, 36);
  ctx.fill();

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.16)';
  ctx.lineWidth = 3.5;
  ctx.stroke();

  if (type === 'uiux') {
    ctx.strokeStyle = '#f43534';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.roundRect(18, 18, 476, 476, 34);
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 88px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('UI/UX', 256, 170);

    ctx.strokeStyle = '#f43534';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(110, 380);
    ctx.bezierCurveTo(180, 260, 320, 420, 390, 290);
    ctx.stroke();

    const nodes = [
      [110, 380],
      [250, 340],
      [390, 290]
    ];
    nodes.forEach(([nx, ny]) => {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(nx - 8, ny - 8, 16, 16);
      ctx.strokeStyle = '#f43534';
      ctx.lineWidth = 3;
      ctx.strokeRect(nx - 8, ny - 8, 16, 16);
    });

    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.font = '500 24px system-ui, sans-serif';
    ctx.fillText('Craft & Motion', 256, 440);
  } else if (type === 'palette') {
    ctx.fillStyle = '#ffffff';
    ctx.font = '800 36px system-ui, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('PALETTE', 60, 90);

    const swatches = [
      { color: '#f43534', name: '#F43534 (Primary Red)' },
      { color: '#ff694b', name: '#FF694B (Sunset Coral)' },
      { color: '#8b5cf6', name: '#8B5CF6 (Royal Violet)' },
      { color: '#16171b', name: '#16171B (Obsidian Dark)' }
    ];

    swatches.forEach((swatch, i) => {
      const sy = 130 + i * 82;
      ctx.beginPath();
      ctx.roundRect(60, sy, 80, 56, 14);
      ctx.fillStyle = swatch.color;
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = '600 26px monospace';
      ctx.fillText(swatch.name, 160, sy + 38);
    });
  } else if (type === 'typography') {
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 190px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Aa', 256, 260);

    ctx.fillStyle = '#f43534';
    ctx.font = 'bold 32px system-ui, sans-serif';
    ctx.fillText('Futura & Roboto', 256, 330);

    const weights = ['Light 300', 'Medium 500', 'Bold 700'];
    weights.forEach((w, i) => {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
      ctx.font = '500 22px system-ui, sans-serif';
      ctx.fillText(w, 120 + i * 135, 410);
    });
  } else {
    ctx.fillStyle = '#ffffff';
    ctx.font = '800 36px system-ui, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('COMPONENT', 60, 90);

    ctx.beginPath();
    ctx.roundRect(60, 140, 140, 70, 35);
    ctx.fillStyle = '#f43534';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(165, 175, 28, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = '600 28px system-ui, sans-serif';
    ctx.fillText('Active State', 230, 185);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.fillRect(60, 270, 380, 12);
    ctx.fillStyle = '#f43534';
    ctx.fillRect(60, 270, 260, 12);
    ctx.beginPath();
    ctx.arc(320, 276, 18, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();

    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = '500 24px monospace';
    ctx.fillText('Progress: 72%', 60, 340);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// ==========================================
// 2. MAIN HERO SCENE CLASS
// ==========================================

export class HeroScene {
  constructor(container, heroSection) {
    this.container = container;
    this.heroSection = heroSection || container.closest('.hero-section') || container.parentElement;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.lastTime = 0;
    this.elapsedTime = 0;

    this.rootGroup = null;
    this.workspaceGroup = null;
    this.designerGroup = null;
    this.monitorGroup = null;
    this.deskGroup = null;
    this.floatingCards = [];
    this.steamParticles = null;
    this.embers = null;
    this.lights = [];

    this.figmaRenderer = null;
    this.figmaTexture = null;
    this.lastTextureUpdate = 0;

    this.animId = null;
    this.isVisible = true;
    this.isReducedMotion = false;
    this.isMobile = false;

    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.scroll = { progress: 0, targetProgress: 0 };
    this.layout = { baseX: 0.98, baseY: -0.05, baseZ: 0, scale: 0.84 };

    // Theme state (Default: light as requested)
    this.currentTheme = (typeof document !== 'undefined' && document.documentElement.getAttribute('data-theme')) || 'light';
    this.targetTheme = this.currentTheme;
    this.themeProgress = 1.0;
    this.themeTransitionDuration = 0.75;
    this.raycaster = new THREE.Raycaster();
    this.mouseCoords = new THREE.Vector2();

    this.handlers = {};
    this.resizeObserver = null;
    this.intersectionObserver = null;

    // Performance optimization caches
    this.heroHeight = this.heroSection ? (this.heroSection.offsetHeight || window.innerHeight) : window.innerHeight;
    this.isScrolling = false;
    this.scrollTimeout = null;
    this._colorA = new THREE.Color();
    this._colorB = new THREE.Color();
  }

  init() {
    if (!this.container) return;

    this.isReducedMotion = prefersReducedMotion();
    this.checkMobile();

    this.scene = new THREE.Scene();
    this.lastTime = performance.now();
    this.elapsedTime = 0;

    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 50);
    this.camera.position.set(0, 0.22, 5.2);

    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: !this.isMobile,
      powerPreference: 'high-performance',
      stencil: false,
      depth: true
    });
    this.renderer.setSize(width, height);
    const maxDPR = this.isMobile ? 1.5 : 2;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxDPR));
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;

    const canvas = this.renderer.domElement;
    canvas.style.display = 'block';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    this.container.appendChild(canvas);

    this.setupLighting();
    this.buildWorkspace();
    this.updateLayout(width, height);
    this.setupListeners();

    if (this.isReducedMotion) {
      this.render();
    } else {
      this.start();
    }
  }

  checkMobile() {
    this.isMobile = window.innerWidth < 768 || ('ontouchstart' in window && window.innerWidth < 1024);
  }

  setupLighting() {
    const isDark = this.currentTheme === 'dark';

    // Warm soft studio ambient (Light: 0xfbf7f2, 2.2 | Dark: 0x151720, 1.4)
    this.ambientLight = new THREE.AmbientLight(isDark ? 0x151720 : 0xfbf7f2, isDark ? 1.4 : 2.2);
    this.scene.add(this.ambientLight);
    this.lights.push(this.ambientLight);

    // Studio Key Light (Light: 0xfff8ee, 2.5 | Dark: 0xffffff, 2.2)
    this.keyLight = new THREE.DirectionalLight(isDark ? 0xffffff : 0xfff8ee, isDark ? 2.2 : 2.5);
    this.keyLight.position.set(4, 5, 4);
    this.scene.add(this.keyLight);
    this.lights.push(this.keyLight);

    // Fill Light (Light: 0xd8d4cc, 1.2 | Dark: 0x2d3446, 0.7)
    this.fillLight = new THREE.DirectionalLight(isDark ? 0x2d3446 : 0xd8d4cc, isDark ? 0.7 : 1.2);
    this.fillLight.position.set(-4, -2, 2);
    this.scene.add(this.fillLight);
    this.lights.push(this.fillLight);

    // Signature Red Rim Light
    this.redRimLight = new THREE.DirectionalLight(0xf43534, isDark ? 4.0 : 2.8);
    this.redRimLight.position.set(-4, 2, -1);
    this.scene.add(this.redRimLight);
    this.lights.push(this.redRimLight);

    this.redPoint = new THREE.PointLight(0xf43534, isDark ? 2.4 : 1.8, 7, 1.4);
    this.redPoint.position.set(-1.8, 0.4, 1.6);
    this.scene.add(this.redPoint);
    this.lights.push(this.redPoint);

    this.screenGlow = new THREE.PointLight(0x7da4ff, 1.6, 4.5, 1.2);
    this.screenGlow.position.set(0.3, 0.3, 0.2);
    this.scene.add(this.screenGlow);
    this.lights.push(this.screenGlow);
  }

  buildWorkspace() {
    this.rootGroup = new THREE.Group();
    this.scene.add(this.rootGroup);

    this.workspaceGroup = new THREE.Group();
    this.rootGroup.add(this.workspaceGroup);

    this.createMaterials();

    this.figmaRenderer = new FigmaScreenRenderer();
    this.figmaRenderer.update(0);
    this.figmaTexture = new THREE.CanvasTexture(this.figmaRenderer.canvas);
    this.figmaTexture.colorSpace = THREE.SRGBColorSpace;
    this.figmaTexture.minFilter = THREE.LinearFilter;
    this.figmaTexture.magFilter = THREE.LinearFilter;

    this.buildDesk();
    this.buildMonitor();
    this.buildDesigner();
    this.buildDeskLamp();
    this.buildPlants();
    this.buildShelf();
    this.buildFloatingCards();
    this.buildAtmosphere();
  }

  createMaterials() {
    this.matDesk = new THREE.MeshStandardMaterial({
      color: 0x16171b,
      roughness: 0.35,
      metalness: 0.25
    });

    this.matPad = new THREE.MeshStandardMaterial({
      color: 0x22252c,
      roughness: 0.65,
      metalness: 0.1
    });

    this.matMetal = new THREE.MeshStandardMaterial({
      color: 0x32353e,
      metalness: 0.85,
      roughness: 0.25
    });

    this.matChrome = new THREE.MeshStandardMaterial({
      color: 0xcccccc,
      metalness: 0.95,
      roughness: 0.15
    });

    this.matHoodie = new THREE.MeshStandardMaterial({
      color: 0x131417,
      roughness: 0.88,
      metalness: 0.04
    });

    this.matSkin = new THREE.MeshStandardMaterial({
      color: 0xd49b78,
      roughness: 0.6,
      metalness: 0.05
    });

    this.matHair = new THREE.MeshStandardMaterial({
      color: 0x111215,
      roughness: 0.6,
      metalness: 0.25
    });

    this.matChair = new THREE.MeshStandardMaterial({
      color: 0x131418,
      roughness: 0.45,
      metalness: 0.25
    });

    this.matBrandRed = new THREE.MeshStandardMaterial({
      color: 0xf43534,
      emissive: 0xf43534,
      emissiveIntensity: 0.85,
      roughness: 0.2,
      metalness: 0.6
    });

    this.matPlantGreen = new THREE.MeshStandardMaterial({
      color: 0x347c43,
      roughness: 0.5,
      metalness: 0.1
    });

    this.matPlantPot = new THREE.MeshStandardMaterial({
      color: 0xdedfe5,
      roughness: 0.3,
      metalness: 0.1
    });
  }

  buildDesk() {
    this.deskGroup = new THREE.Group();
    this.workspaceGroup.add(this.deskGroup);

    // Desk Surface
    const deskGeo = new THREE.BoxGeometry(2.4, 0.065, 1.25);
    const deskMesh = new THREE.Mesh(deskGeo, this.matDesk);
    deskMesh.position.set(0.15, -0.65, -0.05);
    this.deskGroup.add(deskMesh);

    // Red accent strip along desk front edge
    const deskEdgeGeo = new THREE.BoxGeometry(2.4, 0.015, 0.02);
    const deskEdgeMesh = new THREE.Mesh(deskEdgeGeo, this.matBrandRed);
    deskEdgeMesh.position.set(0.15, -0.62, 0.575);
    this.deskGroup.add(deskEdgeMesh);

    // Legs
    const legGeo = new THREE.CylinderGeometry(0.03, 0.03, 1.1, 16);
    const legPositions = [
      [-0.95, -1.2, -0.55],
      [-0.95, -1.2, 0.45],
      [1.25, -1.2, -0.55],
      [1.25, -1.2, 0.45]
    ];
    legPositions.forEach(([x, y, z]) => {
      const leg = new THREE.Mesh(legGeo, this.matMetal);
      leg.position.set(x, y, z);
      this.deskGroup.add(leg);
    });

    // Dual-Tone Desk Mat / Mousepad
    const padBaseGeo = new THREE.BoxGeometry(1.65, 0.012, 0.7);
    const padBase = new THREE.Mesh(padBaseGeo, this.matPad);
    padBase.position.set(0.18, -0.61, 0.1);
    this.deskGroup.add(padBase);

    const padInlayGeo = new THREE.BoxGeometry(0.55, 0.013, 0.66);
    const matInlay = new THREE.MeshStandardMaterial({ color: 0x2e323b, roughness: 0.7 });
    const padInlay = new THREE.Mesh(padInlayGeo, matInlay);
    padInlay.position.set(0.68, -0.608, 0.1);
    this.deskGroup.add(padInlay);

    // Keyboard
    const kbGeo = new THREE.BoxGeometry(0.72, 0.02, 0.24);
    const kbMesh = new THREE.Mesh(kbGeo, this.matMetal);
    kbMesh.position.set(0.08, -0.595, 0.14);
    kbMesh.rotation.x = -0.06;
    this.deskGroup.add(kbMesh);

    const keysGeo = new THREE.BoxGeometry(0.68, 0.012, 0.2);
    const matKeys = new THREE.MeshStandardMaterial({ color: 0x18191e, roughness: 0.4 });
    const keysMesh = new THREE.Mesh(keysGeo, matKeys);
    keysMesh.position.set(0.08, -0.58, 0.14);
    this.deskGroup.add(keysMesh);

    // Mouse
    const mouseGeo = new THREE.SphereGeometry(0.055, 16, 16);
    mouseGeo.scale(0.85, 0.5, 1.4);
    const mouseMesh = new THREE.Mesh(mouseGeo, this.matMetal);
    mouseMesh.position.set(0.66, -0.585, 0.14);
    mouseMesh.rotation.y = -0.1;
    this.deskGroup.add(mouseMesh);

    const mouseLedGeo = new THREE.BoxGeometry(0.008, 0.01, 0.05);
    const mouseLed = new THREE.Mesh(mouseLedGeo, this.matBrandRed);
    mouseLed.position.set(0.66, -0.56, 0.12);
    this.deskGroup.add(mouseLed);

    // DK Coffee Mug (Placed clearly in view between designer and monitor stand)
    const mugGeo = new THREE.CylinderGeometry(0.07, 0.065, 0.16, 24);
    const mugMat = new THREE.MeshStandardMaterial({
      map: createMugTexture(),
      roughness: 0.35,
      metalness: 0.1
    });
    const mugMesh = new THREE.Mesh(mugGeo, mugMat);
    mugMesh.position.set(-0.06, -0.52, 0.22);
    mugMesh.rotation.y = Math.PI * 0.45;
    this.deskGroup.add(mugMesh);

    const handleGeo = new THREE.TorusGeometry(0.042, 0.013, 12, 24, Math.PI);
    const handleMesh = new THREE.Mesh(handleGeo, this.matChair);
    handleMesh.position.set(-0.13, -0.52, 0.22);
    handleMesh.rotation.z = Math.PI / 2;
    this.deskGroup.add(handleMesh);

    this.buildMugSteam(-0.06, -0.42, 0.22);

    // Notebook on left
    const bookGeo = new THREE.BoxGeometry(0.28, 0.02, 0.38);
    const bookMat = new THREE.MeshStandardMaterial({ color: 0x1f2127, roughness: 0.7 });
    const bookMesh = new THREE.Mesh(bookGeo, bookMat);
    bookMesh.position.set(-0.68, -0.6, 0.08);
    bookMesh.rotation.y = 0.2;
    this.deskGroup.add(bookMesh);

    const ribbonGeo = new THREE.BoxGeometry(0.03, 0.005, 0.4);
    const ribbonMesh = new THREE.Mesh(ribbonGeo, this.matBrandRed);
    ribbonMesh.position.set(-0.68, -0.585, 0.08);
    ribbonMesh.rotation.y = 0.2;
    this.deskGroup.add(ribbonMesh);
  }

  buildMugSteam(x, y, z) {
    const steamCount = 8;
    const positions = new Float32Array(steamCount * 3);
    this.steamData = [];

    for (let i = 0; i < steamCount; i++) {
      positions[i * 3] = x + (Math.random() - 0.5) * 0.04;
      positions[i * 3 + 1] = y + Math.random() * 0.2;
      positions[i * 3 + 2] = z + (Math.random() - 0.5) * 0.04;

      this.steamData.push({
        baseX: x,
        baseY: y,
        baseZ: z,
        offset: Math.random() * Math.PI * 2,
        speed: 0.14 + Math.random() * 0.14
      });
    }

    const steamGeo = new THREE.BufferGeometry();
    steamGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const steamMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.035,
      transparent: true,
      opacity: 0.22,
      depthWrite: false
    });

    this.steamParticles = new THREE.Points(steamGeo, steamMat);
    this.deskGroup.add(this.steamParticles);
  }

  buildMonitor() {
    this.monitorGroup = new THREE.Group();
    this.workspaceGroup.add(this.monitorGroup);
    this.monitorGroup.position.set(0.25, 0.18, -0.26);

    // Stand Base Plate
    const standBaseGeo = new THREE.BoxGeometry(0.58, 0.02, 0.35);
    const standBase = new THREE.Mesh(standBaseGeo, this.matMetal);
    standBase.position.set(0, -0.79, 0);
    this.monitorGroup.add(standBase);

    // Stand Pillar
    const pillarGeo = new THREE.BoxGeometry(0.085, 0.72, 0.075);
    const pillar = new THREE.Mesh(pillarGeo, this.matMetal);
    pillar.position.set(0, -0.45, -0.05);
    pillar.rotation.x = -0.05;
    this.monitorGroup.add(pillar);

    // Bezel Frame
    const bezelGeo = new THREE.BoxGeometry(1.95, 1.22, 0.045);
    const bezel = new THREE.Mesh(bezelGeo, this.matDesk);
    this.monitorGroup.add(bezel);

    const chamferGeo = new THREE.BoxGeometry(1.96, 1.23, 0.015);
    const chamferMat = new THREE.MeshStandardMaterial({ color: 0x444852, metalness: 0.9, roughness: 0.2 });
    const chamfer = new THREE.Mesh(chamferGeo, chamferMat);
    chamfer.position.set(0, 0, -0.02);
    this.monitorGroup.add(chamfer);

    // Screen Plane (Figma Canvas)
    const screenGeo = new THREE.PlaneGeometry(1.9, 1.16);
    const screenMat = new THREE.MeshBasicMaterial({
      map: this.figmaTexture
    });
    this.screenMesh = new THREE.Mesh(screenGeo, screenMat);
    this.screenMesh.position.set(0, 0, 0.025);
    this.monitorGroup.add(this.screenMesh);

    this.monitorGroup.rotation.y = -0.06;
    this.monitorGroup.rotation.x = -0.02;
  }

  buildDesigner() {
    this.designerGroup = new THREE.Group();
    this.workspaceGroup.add(this.designerGroup);
    // Seated in front of the desk, facing the monitor
    this.designerGroup.position.set(-0.35, -0.65, 0.52);
    this.designerGroup.rotation.y = 2.45;

    // === ERGONOMIC CHAIR ===
    const chairGroup = new THREE.Group();
    this.designerGroup.add(chairGroup);

    // 5-Star Caster Base
    const baseHubGeo = new THREE.CylinderGeometry(0.075, 0.075, 0.05, 16);
    const baseHub = new THREE.Mesh(baseHubGeo, this.matMetal);
    baseHub.position.set(0, -0.52, 0);
    chairGroup.add(baseHub);

    for (let i = 0; i < 5; i++) {
      const angle = (i * Math.PI * 2) / 5;
      const spokeGeo = new THREE.BoxGeometry(0.32, 0.028, 0.038);
      const spoke = new THREE.Mesh(spokeGeo, this.matMetal);
      spoke.position.set(Math.cos(angle) * 0.16, -0.53, Math.sin(angle) * 0.16);
      spoke.rotation.y = -angle;
      chairGroup.add(spoke);

      const wheelGeo = new THREE.SphereGeometry(0.028, 12, 12);
      const wheel = new THREE.Mesh(wheelGeo, this.matChair);
      wheel.position.set(Math.cos(angle) * 0.32, -0.55, Math.sin(angle) * 0.32);
      chairGroup.add(wheel);
    }

    // Chrome Lift Cylinder
    const cylinderGeo = new THREE.CylinderGeometry(0.036, 0.036, 0.44, 16);
    const cylinder = new THREE.Mesh(cylinderGeo, this.matChrome);
    cylinder.position.set(0, -0.32, 0);
    chairGroup.add(cylinder);

    // Seat Cushion (Dark leather)
    const seatGeo = new THREE.BoxGeometry(0.62, 0.1, 0.62);
    const seatMesh = new THREE.Mesh(seatGeo, this.matChair);
    seatMesh.position.set(0, -0.06, 0);
    chairGroup.add(seatMesh);

    // Ergonomic Backrest (Dark charcoal, supports mid-back)
    const backGeo = new THREE.BoxGeometry(0.54, 0.62, 0.07);
    const backMesh = new THREE.Mesh(backGeo, this.matChair);
    backMesh.position.set(0, 0.26, -0.26);
    backMesh.rotation.x = -0.08;
    chairGroup.add(backMesh);

    // Red Rim Accent: Slender strip along the left/rear outer contour of the backrest
    const redTrimLeftGeo = new THREE.BoxGeometry(0.02, 0.62, 0.075);
    const redTrimLeft = new THREE.Mesh(redTrimLeftGeo, this.matBrandRed);
    redTrimLeft.position.set(-0.27, 0.26, -0.26);
    redTrimLeft.rotation.x = -0.08;
    chairGroup.add(redTrimLeft);

    const redTrimTopGeo = new THREE.BoxGeometry(0.54, 0.02, 0.075);
    const redTrimTop = new THREE.Mesh(redTrimTopGeo, this.matBrandRed);
    redTrimTop.position.set(0, 0.57, -0.285);
    redTrimTop.rotation.x = -0.08;
    chairGroup.add(redTrimTop);

    // Armrests
    const armBracketGeo = new THREE.BoxGeometry(0.03, 0.22, 0.03);
    const armPadGeo = new THREE.BoxGeometry(0.085, 0.032, 0.32);

    [-0.32, 0.32].forEach((side) => {
      const bracket = new THREE.Mesh(armBracketGeo, this.matMetal);
      bracket.position.set(side, 0.05, 0.02);
      chairGroup.add(bracket);

      const pad = new THREE.Mesh(armPadGeo, this.matChair);
      pad.position.set(side, 0.16, 0.04);
      chairGroup.add(pad);
    });

    // === DESIGNER BODY & CLOTHING ===
    this.bodyGroup = new THREE.Group();
    this.designerGroup.add(this.bodyGroup);

    // Seated Lower Body (Pants)
    const legsGeo = new THREE.BoxGeometry(0.54, 0.15, 0.54);
    const legsMesh = new THREE.Mesh(legsGeo, this.matHoodie);
    legsMesh.position.set(0, 0.08, 0.02);
    this.bodyGroup.add(legsMesh);

    // Torso (Oversized Streetwear Dark Hoodie)
    const torsoGeo = new THREE.CylinderGeometry(0.26, 0.3, 0.68, 20);
    const torsoMesh = new THREE.Mesh(torsoGeo, this.matHoodie);
    torsoMesh.position.set(0, 0.44, 0.02);
    torsoMesh.rotation.x = 0.12;
    this.bodyGroup.add(torsoMesh);

    // Folded Hood draped around neck and upper back
    const hoodGeo = new THREE.TorusGeometry(0.18, 0.06, 14, 24);
    const hoodMesh = new THREE.Mesh(hoodGeo, this.matHoodie);
    hoodMesh.position.set(0, 0.74, -0.07);
    hoodMesh.rotation.x = 0.45;
    this.bodyGroup.add(hoodMesh);

    // Left Arm (toward keyboard)
    const leftArmGeo = new THREE.CylinderGeometry(0.075, 0.065, 0.46, 14);
    const leftArm = new THREE.Mesh(leftArmGeo, this.matHoodie);
    leftArm.position.set(-0.28, 0.42, 0.15);
    leftArm.rotation.set(0.65, 0.15, -0.2);
    this.bodyGroup.add(leftArm);

    const leftForearmGeo = new THREE.CylinderGeometry(0.062, 0.052, 0.38, 14);
    const leftForearm = new THREE.Mesh(leftForearmGeo, this.matHoodie);
    leftForearm.position.set(-0.18, 0.22, 0.4);
    leftForearm.rotation.set(1.4, -0.3, 0.2);
    this.bodyGroup.add(leftForearm);

    const leftHandGeo = new THREE.BoxGeometry(0.065, 0.032, 0.1);
    const leftHand = new THREE.Mesh(leftHandGeo, this.matSkin);
    leftHand.position.set(-0.1, 0.12, 0.55);
    this.bodyGroup.add(leftHand);

    // Right Arm (toward mouse)
    const rightArmGeo = new THREE.CylinderGeometry(0.075, 0.065, 0.46, 14);
    const rightArm = new THREE.Mesh(rightArmGeo, this.matHoodie);
    rightArm.position.set(0.28, 0.42, 0.15);
    rightArm.rotation.set(0.65, -0.2, 0.2);
    this.bodyGroup.add(rightArm);

    const rightForearmGeo = new THREE.CylinderGeometry(0.062, 0.052, 0.4, 14);
    const rightForearm = new THREE.Mesh(rightForearmGeo, this.matHoodie);
    rightForearm.position.set(0.34, 0.22, 0.4);
    rightForearm.rotation.set(1.4, 0.2, -0.2);
    this.bodyGroup.add(rightForearm);

    const rightHandGeo = new THREE.BoxGeometry(0.07, 0.032, 0.11);
    const rightHand = new THREE.Mesh(rightHandGeo, this.matSkin);
    rightHand.position.set(0.42, 0.12, 0.57);
    this.bodyGroup.add(rightHand);

    // Neck (subtle, covered by hood)
    const neckGeo = new THREE.CylinderGeometry(0.085, 0.095, 0.14, 16);
    const neckMesh = new THREE.Mesh(neckGeo, this.matSkin);
    neckMesh.position.set(0, 0.82, 0.01);
    this.bodyGroup.add(neckMesh);

    // Head Base (Wrapped completely in dark hair geometry, so no skin is visible from behind)
    const headGroup = new THREE.Group();
    this.bodyGroup.add(headGroup);
    headGroup.position.set(0, 0.98, 0.03);

    // Stylized Dark Tousled Hair (Full coverage of the head from behind)
    const hairMainGeo = new THREE.SphereGeometry(0.22, 24, 24);
    hairMainGeo.scale(0.96, 1.05, 1.0);
    const hairMain = new THREE.Mesh(hairMainGeo, this.matHair);
    headGroup.add(hairMain);

    // Tousled hair tufts on crown, back, and sides (matching reference silhouette)
    for (let i = 0; i < 14; i++) {
      const strandGeo = new THREE.ConeGeometry(0.068, 0.18, 8);
      const strand = new THREE.Mesh(strandGeo, this.matHair);
      const theta = (i / 14) * Math.PI * 2;
      const r = 0.14 + (i % 3) * 0.02;
      strand.position.set(Math.sin(theta) * r, 0.1 + (i % 4) * 0.02, Math.cos(theta) * r);
      strand.rotation.set(0.35 * Math.cos(theta), theta, 0.35 * Math.sin(theta));
      headGroup.add(strand);
    }

    // Headphones with DK Monogram on Outer Earcups
    const hpGroup = new THREE.Group();
    headGroup.add(hpGroup);

    const bandGeo = new THREE.TorusGeometry(0.23, 0.025, 12, 28, Math.PI);
    const bandMesh = new THREE.Mesh(bandGeo, this.matChair);
    bandMesh.rotation.z = Math.PI;
    hpGroup.add(bandMesh);

    const hpTex = createHeadphoneTexture();
    const earcupGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.05, 24);
    const earcupMat = new THREE.MeshStandardMaterial({
      map: hpTex,
      metalness: 0.8,
      roughness: 0.25
    });

    // Left earcup (Facing camera)
    const leftCup = new THREE.Mesh(earcupGeo, earcupMat);
    leftCup.position.set(-0.21, 0, 0);
    leftCup.rotation.z = Math.PI / 2;
    hpGroup.add(leftCup);

    // Right earcup
    const rightCup = new THREE.Mesh(earcupGeo, earcupMat);
    rightCup.position.set(0.21, 0, 0);
    rightCup.rotation.z = -Math.PI / 2;
    hpGroup.add(rightCup);
  }

  buildDeskLamp() {
    const lampGroup = new THREE.Group();
    this.workspaceGroup.add(lampGroup);
    lampGroup.position.set(1.15, -0.65, 0.05);

    const baseGeo = new THREE.CylinderGeometry(0.14, 0.14, 0.028, 24);
    const base = new THREE.Mesh(baseGeo, this.matMetal);
    lampGroup.add(base);

    const lowerArmGeo = new THREE.CylinderGeometry(0.014, 0.014, 0.52, 12);
    const lowerArm = new THREE.Mesh(lowerArmGeo, this.matMetal);
    lowerArm.position.set(0, 0.25, 0);
    lowerArm.rotation.z = -0.35;
    lampGroup.add(lowerArm);

    const jointGeo = new THREE.SphereGeometry(0.03, 12, 12);
    const joint = new THREE.Mesh(jointGeo, this.matBrandRed);
    joint.position.set(0.16, 0.47, 0);
    lampGroup.add(joint);

    const upperArmGeo = new THREE.CylinderGeometry(0.014, 0.014, 0.46, 12);
    const upperArm = new THREE.Mesh(upperArmGeo, this.matMetal);
    upperArm.position.set(0.05, 0.65, 0);
    upperArm.rotation.z = 0.55;
    lampGroup.add(upperArm);

    const shadeGeo = new THREE.ConeGeometry(0.14, 0.2, 24, 1, true);
    const shade = new THREE.Mesh(shadeGeo, this.matDesk);
    shade.position.set(-0.14, 0.8, 0);
    shade.rotation.z = 0.85;
    lampGroup.add(shade);

    const bulbGeo = new THREE.SphereGeometry(0.04, 16, 16);
    const bulbMat = new THREE.MeshBasicMaterial({ color: 0xff6644 });
    const bulb = new THREE.Mesh(bulbGeo, bulbMat);
    bulb.position.set(-0.14, 0.8, 0);
    lampGroup.add(bulb);

    const spotIntensity = this.currentTheme === 'dark' ? 4.6 : 3.8;
    this.deskLampSpot = new THREE.SpotLight(0xff5533, spotIntensity, 5.0, Math.PI / 4, 0.5, 1.2);
    this.deskLampSpot.position.set(-0.14, 0.8, 0);
    this.deskLampSpot.target.position.set(-0.35, -0.65, 0.2);
    lampGroup.add(this.deskLampSpot);
    lampGroup.add(this.deskLampSpot.target);
    this.lights.push(this.deskLampSpot);
  }

  buildPlants() {
    // Desk succulent near monitor
    const plantAGroup = new THREE.Group();
    this.workspaceGroup.add(plantAGroup);
    plantAGroup.position.set(-0.45, -0.62, -0.2);

    const potAGeo = new THREE.CylinderGeometry(0.09, 0.07, 0.14, 20);
    const potA = new THREE.Mesh(potAGeo, this.matPlantPot);
    plantAGroup.add(potA);

    for (let i = 0; i < 7; i++) {
      const leafGeo = new THREE.ConeGeometry(0.038, 0.15, 8);
      const leaf = new THREE.Mesh(leafGeo, this.matPlantGreen);
      const angle = (i / 7) * Math.PI * 2;
      leaf.position.set(Math.cos(angle) * 0.04, 0.1, Math.sin(angle) * 0.04);
      leaf.rotation.set(0.45 * Math.sin(angle), angle, 0.45 * Math.cos(angle));
      plantAGroup.add(leaf);
    }

    // Plant on right edge under desk lamp
    const plantBGroup = new THREE.Group();
    this.workspaceGroup.add(plantBGroup);
    plantBGroup.position.set(1.05, -0.62, 0.25);

    const potBGeo = new THREE.CylinderGeometry(0.08, 0.06, 0.12, 20);
    const potB = new THREE.Mesh(potBGeo, this.matPlantPot);
    plantBGroup.add(potB);

    for (let i = 0; i < 6; i++) {
      const leafGeo = new THREE.ConeGeometry(0.032, 0.14, 8);
      const leaf = new THREE.Mesh(leafGeo, this.matPlantGreen);
      const angle = (i / 6) * Math.PI * 2;
      leaf.position.set(Math.cos(angle) * 0.035, 0.08, Math.sin(angle) * 0.035);
      leaf.rotation.set(0.4 * Math.sin(angle), angle, 0.4 * Math.cos(angle));
      plantBGroup.add(leaf);
    }
  }

  buildShelf() {
    const shelfGroup = new THREE.Group();
    this.workspaceGroup.add(shelfGroup);
    shelfGroup.position.set(0.15, 1.3, -0.95);

    const plankGeo = new THREE.BoxGeometry(1.9, 0.042, 0.32);
    const plank = new THREE.Mesh(plankGeo, this.matDesk);
    shelfGroup.add(plank);

    const ledGeo = new THREE.BoxGeometry(1.88, 0.012, 0.015);
    const led = new THREE.Mesh(ledGeo, this.matBrandRed);
    led.position.set(0, -0.022, 0.15);
    shelfGroup.add(led);

    const bookColors = [0x1d2028, 0xf43534, 0x3d4352, 0xe0e2ec, 0x1d2028];
    bookColors.forEach((col, i) => {
      const bGeo = new THREE.BoxGeometry(0.048, 0.26 + (i % 3) * 0.04, 0.2);
      const bMat = new THREE.MeshStandardMaterial({ color: col, roughness: 0.6 });
      const bMesh = new THREE.Mesh(bGeo, bMat);
      bMesh.position.set(0.1 + i * 0.06, 0.15, 0);
      shelfGroup.add(bMesh);
    });

    // Cascading vine plant on left of shelf
    const potShelfGeo = new THREE.CylinderGeometry(0.1, 0.075, 0.14, 20);
    const potShelf = new THREE.Mesh(potShelfGeo, this.matChair);
    potShelf.position.set(-0.55, 0.08, 0);
    shelfGroup.add(potShelf);

    for (let v = 0; v < 7; v++) {
      const vineSegments = 6;
      let currX = -0.58 + (v / 7) * 0.2;
      let currY = 0.08;
      let currZ = 0.1;

      for (let s = 0; s < vineSegments; s++) {
        const segGeo = new THREE.SphereGeometry(0.022, 8, 8);
        segGeo.scale(1.2, 0.8, 1.0);
        const seg = new THREE.Mesh(segGeo, this.matPlantGreen);
        currY -= 0.06;
        currX += Math.sin(s + v) * 0.016;
        seg.position.set(currX, currY, currZ);
        shelfGroup.add(seg);
      }
    }

    const shelfIntensity = this.currentTheme === 'dark' ? 1.6 : 1.2;
    this.shelfLight = new THREE.PointLight(0xf43534, shelfIntensity, 3.0);
    this.shelfLight.position.set(0, 0.16, 0.16);
    shelfGroup.add(this.shelfLight);
    this.lights.push(this.shelfLight);
  }

  buildFloatingCards() {
    this.floatingCards = [];

    // Positioned safely around the monitor, completely clear of the left typography and red brush mark
    const cardsConfig = [
      // Card 1: "UI/UX" Pen Tool (Centered above monitor)
      { type: 'uiux', x: 0.30, y: 1.06, z: 0.15, rotX: 0.04, rotY: 0.06, scale: 0.48, speed: 1.2 },
      // Card 2: Color Palette (Top right above monitor)
      { type: 'palette', x: 0.96, y: 1.10, z: 0.10, rotX: -0.04, rotY: -0.14, scale: 0.44, speed: 0.9 },
      // Card 3: "Aa" Typography (Right of monitor)
      { type: 'typography', x: 1.28, y: 0.46, z: 0.20, rotX: 0.03, rotY: -0.20, scale: 0.42, speed: 1.1 },
      // Card 4: Component Spec (Lower right)
      { type: 'component', x: 1.18, y: -0.16, z: 0.28, rotX: -0.05, rotY: -0.10, scale: 0.38, speed: 1.0 }
    ];

    cardsConfig.forEach((cfg) => {
      const cardGeo = new THREE.PlaneGeometry(1.0, 1.0);
      const cardMat = new THREE.MeshBasicMaterial({
        map: createFloatingCardTexture(cfg.type),
        transparent: true,
        opacity: 0.92,
        side: THREE.DoubleSide
      });
      const cardMesh = new THREE.Mesh(cardGeo, cardMat);
      cardMesh.position.set(cfg.x, cfg.y, cfg.z);
      cardMesh.rotation.set(cfg.rotX, cfg.rotY, 0);
      cardMesh.scale.setScalar(cfg.scale);

      this.workspaceGroup.add(cardMesh);

      this.floatingCards.push({
        mesh: cardMesh,
        baseX: cfg.x,
        baseY: cfg.y,
        baseZ: cfg.z,
        baseRotX: cfg.rotX,
        baseRotY: cfg.rotY,
        speed: cfg.speed,
        phase: Math.random() * Math.PI * 2
      });
    });
  }

  buildAtmosphere() {
    const count = this.isMobile ? 24 : 48;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const red = new THREE.Color(0xf43534);
    const amber = new THREE.Color(0xff8c42);
    const slate = new THREE.Color(0x4a5163);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 6;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 4;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 3;

      const choice = Math.random();
      const col = choice > 0.6 ? red : choice > 0.3 ? amber : slate;
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }

    const emberGeo = new THREE.BufferGeometry();
    emberGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    emberGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const emberMat = new THREE.PointsMaterial({
      size: 0.026,
      vertexColors: true,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.embers = new THREE.Points(emberGeo, emberMat);
    this.workspaceGroup.add(this.embers);
  }

  updateLayout(width, height) {
    if (!this.rootGroup) return;

    this.checkMobile();
    const aspect = width / height;

    if (width >= 1200) {
      // Desktop: Shifted slightly to the left, maintaining generous clearance from text
      this.layout.baseX = Math.min(aspect * 0.62, 0.98);
      this.layout.baseY = -0.05;
      this.layout.scale = 0.84;
    } else if (width >= 992) {
      // Small desktop / landscape tablet
      this.layout.baseX = Math.min(aspect * 0.54, 0.84);
      this.layout.baseY = -0.08;
      this.layout.scale = 0.74;
    } else if (width >= 768) {
      // Tablet portrait: centered gracefully in the right half, clear of left typography
      this.layout.baseX = 0.66;
      this.layout.baseY = -0.26;
      this.layout.scale = 0.38;
    } else {
      // Mobile (< 768px): Anchored cleanly below hero typography in lower half
      let mobileScale = 0.50;
      let mobileY = -0.62;
      let mobileX = -0.08;

      if (width < 380) {
        // Very small mobile screens (e.g. iPhone SE / 360px width Android)
        mobileScale = height < 700 ? 0.44 : 0.46;
        mobileY = height < 700 ? -0.70 : -0.64;
        mobileX = -0.06;
      } else if (width < 480) {
        // Standard mobile screens (e.g. 390px - 430px modern smartphones)
        mobileScale = height < 750 ? 0.48 : 0.50;
        mobileY = height < 750 ? -0.64 : -0.60;
        mobileX = -0.08;
      } else {
        // Large mobile screens / phablet (480px - 767px)
        mobileScale = 0.54;
        mobileY = -0.56;
        mobileX = -0.08;
      }

      this.layout.baseX = mobileX;
      this.layout.baseY = mobileY;
      this.layout.scale = mobileScale;
    }

    this.rootGroup.scale.setScalar(this.layout.scale);
    this.rootGroup.position.set(this.layout.baseX, this.layout.baseY, this.layout.baseZ);

    // Responsive floating cards visibility
    if (this.floatingCards && this.floatingCards.length > 0) {
      this.floatingCards.forEach((card, idx) => {
        if (width < 768) {
          // On mobile, show only top 2 cards to prevent crowding
          card.mesh.visible = idx < 2;
        } else {
          card.mesh.visible = true;
        }
      });
    }
  }

  setupListeners() {
    this.handlers.onMouseMove = (e) => {
      if (this.isReducedMotion || !this.heroSection || !this.isVisible) return;

      const clientX = e.clientX ?? (e.touches && e.touches[0] ? e.touches[0].clientX : null);
      const clientY = e.clientY ?? (e.touches && e.touches[0] ? e.touches[0].clientY : null);

      if (clientX !== null && clientY !== null) {
        this.mouse.targetX = (clientX / window.innerWidth - 0.5) * 2;
        this.mouse.targetY = (clientY / window.innerHeight - 0.5) * 2;
      }
    };

    this.handlers.onMouseLeave = () => {
      this.mouse.targetX = 0;
      this.mouse.targetY = 0;
    };

    window.addEventListener('mousemove', this.handlers.onMouseMove, { passive: true });
    if (this.heroSection) {
      this.heroSection.addEventListener('mouseleave', this.handlers.onMouseLeave, { passive: true });
    }

    // Mouse Wheel interaction driving the Figma monitor screen
    this.handlers.onWheel = (e) => {
      if (!this.heroSection || !this.figmaRenderer || !this.isVisible) return;

      const clientX = e.clientX;
      const clientY = e.clientY;
      const isRightHalf = clientX > window.innerWidth * 0.42;

      let isOverScreen = false;
      if (this.camera && this.screenMesh) {
        this.mouseCoords.x = (clientX / window.innerWidth) * 2 - 1;
        this.mouseCoords.y = -(clientY / window.innerHeight) * 2 + 1;
        this.raycaster.setFromCamera(this.mouseCoords, this.camera);
        const intersects = this.raycaster.intersectObject(this.screenMesh);
        if (intersects.length > 0) {
          isOverScreen = true;
        }
      }

      if (isOverScreen) {
        e.preventDefault();
        this.figmaRenderer.handleWheel(e.deltaY);
      } else if (isRightHalf) {
        this.figmaRenderer.handleWheel(e.deltaY * 0.65);
      }
    };

    if (this.container) {
      this.container.addEventListener('wheel', this.handlers.onWheel, { passive: false });
    }
    window.addEventListener('wheel', (e) => {
      if (this.renderer && e.target === this.renderer.domElement) {
        this.handlers.onWheel(e);
      }
    }, { passive: false });

    this.handlers.onScroll = () => {
      if (!this.heroSection) return;
      const scrollY = (window.lenis && typeof window.lenis.scroll === 'number')
        ? window.lenis.scroll
        : (window.scrollY || window.pageYOffset || 0);

      const heroH = this.heroHeight || window.innerHeight;
      const progress = Math.max(0, Math.min(1, scrollY / heroH));
      this.scroll.targetProgress = progress;

      // Mark active scroll to prioritize scroll rendering over monitor texture re-uploads
      this.isScrolling = true;
      if (this.scrollTimeout) clearTimeout(this.scrollTimeout);
      this.scrollTimeout = setTimeout(() => {
        this.isScrolling = false;
      }, 120);

      if (this.isReducedMotion) {
        this.scroll.progress = progress;
        this.render();
      }
    };
    window.addEventListener('scroll', this.handlers.onScroll, { passive: true });
    this.handlers.onScroll();

    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const { width, height } = entry.contentRect;
          if (width > 0 && height > 0) {
            this.resize(width, height);
          }
        }
      });
      this.resizeObserver.observe(this.container);
    } else {
      this.handlers.onWindowResize = () => {
        if (!this.container) return;
        this.resize(this.container.clientWidth, this.container.clientHeight);
      };
      window.addEventListener('resize', this.handlers.onWindowResize, { passive: true });
    }

    if (typeof IntersectionObserver !== 'undefined' && this.heroSection) {
      this.intersectionObserver = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              this.resume();
            } else {
              this.pause();
            }
          }
        },
        { threshold: 0 }
      );
      this.intersectionObserver.observe(this.heroSection);
    }

    const motionMediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.handlers.onMotionPreferenceChange = (e) => {
      this.isReducedMotion = e.matches;
      if (this.isReducedMotion) {
        this.pause();
        this.resetToStatic();
        this.render();
      } else {
        this.resume();
      }
    };
    if (motionMediaQuery.addEventListener) {
      motionMediaQuery.addEventListener('change', this.handlers.onMotionPreferenceChange);
    }
  }

  resetToStatic() {
    if (!this.rootGroup) return;
    this.mouse.x = 0;
    this.mouse.y = 0;
    this.mouse.targetX = 0;
    this.mouse.targetY = 0;
    this.rootGroup.position.set(this.layout.baseX, this.layout.baseY, this.layout.baseZ);
    this.rootGroup.rotation.set(0, 0, 0);
  }

  resize(width, height) {
    if (!this.camera || !this.renderer) return;

    this.heroHeight = this.heroSection ? (this.heroSection.offsetHeight || window.innerHeight) : window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
    const maxDPR = this.isMobile ? 1.5 : 2;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxDPR));

    this.updateLayout(width, height);

    if (this.isReducedMotion) {
      this.render();
    }
  }

  start() {
    if (this.isReducedMotion) return;
    this.isVisible = true;
    if (this.animId) return;

    const loop = () => {
      if (!this.isVisible) {
        this.animId = null;
        return;
      }
      this.animId = requestAnimationFrame(loop);
      this.update();
      this.render();
    };
    this.animId = requestAnimationFrame(loop);
  }

  pause() {
    this.isVisible = false;
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
  }

  resume() {
    if (this.isReducedMotion) return;
    this.isVisible = true;
    if (!this.animId) {
      this.start();
    }
  }

  setTheme(themeName) {
    if (this.targetTheme === themeName) return;
    this.targetTheme = themeName;
    this.themeProgress = 0.0;
  }

  interpolateTheme(progress) {
    // Smooth cosine interpolation
    const t = 0.5 - 0.5 * Math.cos(progress * Math.PI);
    const isDark = this.targetTheme === 'dark';

    // Ambient light
    if (this.ambientLight) {
      this._colorA.setHex(isDark ? 0xfbf7f2 : 0x151720);
      this._colorB.setHex(isDark ? 0x151720 : 0xfbf7f2);
      this.ambientLight.color.copy(this._colorA).lerp(this._colorB, t);
      const ambStartInt = isDark ? 2.2 : 1.4;
      const ambEndInt = isDark ? 1.4 : 2.2;
      this.ambientLight.intensity = ambStartInt + (ambEndInt - ambStartInt) * t;
    }

    // Key light
    if (this.keyLight) {
      this._colorA.setHex(isDark ? 0xfff8ee : 0xffffff);
      this._colorB.setHex(isDark ? 0xffffff : 0xfff8ee);
      this.keyLight.color.copy(this._colorA).lerp(this._colorB, t);
      const keyStartInt = isDark ? 2.5 : 2.2;
      const keyEndInt = isDark ? 2.2 : 2.5;
      this.keyLight.intensity = keyStartInt + (keyEndInt - keyStartInt) * t;
    }

    // Fill light
    if (this.fillLight) {
      this._colorA.setHex(isDark ? 0xd8d4cc : 0x2d3446);
      this._colorB.setHex(isDark ? 0x2d3446 : 0xd8d4cc);
      this.fillLight.color.copy(this._colorA).lerp(this._colorB, t);
      const fillStartInt = isDark ? 1.2 : 0.7;
      const fillEndInt = isDark ? 0.7 : 1.2;
      this.fillLight.intensity = fillStartInt + (fillEndInt - fillStartInt) * t;
    }

    // Red Rim Light
    const rimStartInt = isDark ? 2.8 : 4.0;
    const rimEndInt = isDark ? 4.0 : 2.8;
    if (this.redRimLight) {
      this.redRimLight.intensity = rimStartInt + (rimEndInt - rimStartInt) * t;
    }

    // Desk Lamp Spot
    const lampStartInt = isDark ? 3.8 : 4.6;
    const lampEndInt = isDark ? 4.6 : 3.8;
    if (this.deskLampSpot) {
      this.deskLampSpot.intensity = lampStartInt + (lampEndInt - lampStartInt) * t;
    }

    // Shelf Point Light
    const shelfStartInt = isDark ? 1.2 : 1.6;
    const shelfEndInt = isDark ? 1.6 : 1.2;
    if (this.shelfLight) {
      this.shelfLight.intensity = shelfStartInt + (shelfEndInt - shelfStartInt) * t;
    }

    // Embers Opacity
    if (this.embers && this.embers.material) {
      const emberStartOp = isDark ? 0.2 : 0.55;
      const emberEndOp = isDark ? 0.55 : 0.2;
      this.embers.material.opacity = emberStartOp + (emberEndOp - emberStartOp) * t;
    }

    if (progress >= 1.0) {
      this.currentTheme = this.targetTheme;
    }
  }

  update() {
    if (!this.rootGroup) return;

    const now = performance.now();
    const delta = Math.min((now - (this.lastTime || now)) / 1000, 0.1);
    this.lastTime = now;
    this.elapsedTime = (this.elapsedTime || 0) + delta;
    const time = this.elapsedTime;

    // Smooth Theme Transition Lerp
    if (this.themeProgress < 1.0) {
      this.themeProgress = Math.min(1.0, this.themeProgress + delta / this.themeTransitionDuration);
      this.interpolateTheme(this.themeProgress);
    }

    // 1. Update Figma Canvas Texture (Paused during active scroll to eliminate GPU texImage2D pipeline stalls)
    if (this.figmaRenderer && this.figmaTexture && !this.isScrolling) {
      if (time - this.lastTextureUpdate > 0.048) {
        this.figmaRenderer.update(delta);
        this.figmaTexture.needsUpdate = true;
        this.lastTextureUpdate = time;
      }
    }

    // 2. Parallax Lerp
    const lerpFactor = this.isMobile ? 0.04 : 0.06;
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * lerpFactor;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * lerpFactor;

    this.scroll.progress += (this.scroll.targetProgress - this.scroll.progress) * 0.08;
    const motionFactor = this.isMobile ? 0.45 : 1.0;

    // 3. Root Group Transform (Clamped to 3-5° X, 5-7° Y)
    const rotY = this.mouse.x * 0.085 * motionFactor;
    const rotX = -this.mouse.y * 0.06 * motionFactor;

    const breathY = Math.sin(time * 0.75) * 0.035 * motionFactor;
    const scrollOffsetY = -this.scroll.progress * 0.65;
    const scrollRotY = this.scroll.progress * 0.18;

    this.rootGroup.position.x = this.layout.baseX + this.mouse.x * 0.12 * motionFactor;
    this.rootGroup.position.y = this.layout.baseY + breathY - this.mouse.y * 0.08 * motionFactor + scrollOffsetY;
    this.rootGroup.position.z = this.layout.baseZ;

    this.rootGroup.rotation.y = rotY + scrollRotY;
    this.rootGroup.rotation.x = rotX;

    // Subtle designer breathing motion
    if (this.bodyGroup) {
      this.bodyGroup.position.y = Math.sin(time * 1.5) * 0.008;
    }

    // 4. Floating UI Cards Independent Bobbing
    this.floatingCards.forEach((card) => {
      const bob = Math.sin(time * card.speed + card.phase) * 0.04 * motionFactor;
      card.mesh.position.y = card.baseY + bob;
      card.mesh.rotation.y = card.baseRotY + this.mouse.x * 0.08 * motionFactor;
      card.mesh.rotation.x = card.baseRotX - this.mouse.y * 0.06 * motionFactor;
    });

    // 5. Rising Mug Steam Animation
    if (this.steamParticles && this.steamData) {
      const posAttr = this.steamParticles.geometry.attributes.position;
      for (let i = 0; i < this.steamData.length; i++) {
        const item = this.steamData[i];
        let currY = posAttr.getY(i) + item.speed * delta;
        if (currY > item.baseY + 0.28) {
          currY = item.baseY;
          posAttr.setX(i, item.baseX + (Math.random() - 0.5) * 0.04);
          posAttr.setZ(i, item.baseZ + (Math.random() - 0.5) * 0.04);
        }
        posAttr.setY(i, currY);
      }
      posAttr.needsUpdate = true;
    }

    // 6. Atmospheric Embers Slow Drift
    if (this.embers) {
      this.embers.rotation.y = time * 0.02 * motionFactor;
    }
  }

  render() {
    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }

  dispose() {
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }

    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
      this.scrollTimeout = null;
    }

    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
      this.intersectionObserver = null;
    }

    if (this.handlers.onMouseMove) {
      window.removeEventListener('mousemove', this.handlers.onMouseMove);
    }
    if (this.handlers.onMouseLeave && this.heroSection) {
      this.heroSection.removeEventListener('mouseleave', this.handlers.onMouseLeave);
    }
    if (this.handlers.onScroll) {
      window.removeEventListener('scroll', this.handlers.onScroll);
    }
    if (this.handlers.onWindowResize) {
      window.removeEventListener('resize', this.handlers.onWindowResize);
    }
    const motionMediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motionMediaQuery.removeEventListener && this.handlers.onMotionPreferenceChange) {
      motionMediaQuery.removeEventListener('change', this.handlers.onMotionPreferenceChange);
    }

    if (this.figmaTexture) {
      this.figmaTexture.dispose();
      this.figmaTexture = null;
    }

    if (this.scene) {
      this.scene.traverse((child) => {
        if (child.isMesh || child.isPoints) {
          if (child.geometry) child.geometry.dispose();
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach((mat) => {
                if (mat.map) mat.map.dispose();
                mat.dispose();
              });
            } else {
              if (child.material.map) child.material.map.dispose();
              child.material.dispose();
            }
          }
        }
      });
      this.scene.clear();
    }

    if (this.renderer) {
      this.renderer.dispose();
      this.renderer.forceContextLoss();
      if (this.renderer.domElement && this.renderer.domElement.parentNode) {
        this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
      }
      this.renderer = null;
    }

    this.scene = null;
    this.camera = null;
    this.rootGroup = null;
    this.workspaceGroup = null;
    this.designerGroup = null;
    this.monitorGroup = null;
    this.deskGroup = null;
    this.floatingCards = [];
    this.lights = [];
  }
}

let currentHeroInstance = null;

export function initHeroExperience(container) {
  const target = container || document.getElementById('hero-3d-container');
  if (!target) return null;

  if (currentHeroInstance) {
    currentHeroInstance.dispose();
    currentHeroInstance = null;
  }

  const heroSection = target.closest('.hero-section') || document.querySelector('.hero-section');
  currentHeroInstance = new HeroScene(target, heroSection);
  currentHeroInstance.init();
  window.heroScene = currentHeroInstance;

  window.__destroyHero3D = () => {
    if (currentHeroInstance) {
      currentHeroInstance.dispose();
      currentHeroInstance = null;
    }
  };

  return currentHeroInstance;
}

export function destroyHeroExperience() {
  if (currentHeroInstance) {
    currentHeroInstance.dispose();
    currentHeroInstance = null;
  }
}

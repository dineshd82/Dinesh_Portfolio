/**
 * Interactive Ceiling Pull-Rope Theme Switch
 * 
 * Features:
 * - Hanging cord anchored physically to page top beside hamburger menu
 * - Turned walnut wood & antique brass weighted teardrop handle
 * - Dynamic mouse hover physics: rope gently curves toward mouse pointer
 * - Elastic downward drag with tactile trigger threshold (Light <-> Dark)
 * - Click & keyboard fallback with automated spring pull animation
 * - Smooth theme transition (500-900ms) across page & Three.js workspace
 */

export class ThemeRope {
  constructor(containerId = 'theme-rope-container') {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.canvas = document.getElementById('theme-rope-canvas');
    this.hitbox = document.getElementById('theme-rope-hitbox');
    if (!this.canvas || !this.hitbox) return;

    this.ctx = this.canvas.getContext('2d');

    // Canvas coordinate space
    this.width = 90;
    this.height = 320;
    this.canvas.width = this.width * 2;
    this.canvas.height = this.height * 2;
    this.ctx.scale(2, 2);

    // Physics parameters
    this.anchorX = this.width / 2;
    this.anchorY = 0;
    this.restLength = 185;
    this.hx = this.anchorX;
    this.hy = this.anchorY + this.restLength;
    this.targetHx = this.anchorX;
    this.targetHy = this.hy;
    this.vx = 0;
    this.vy = 0;
    this.k = 0.16;       // Spring tension
    this.damping = 0.82; // Spring damping

    // Hover sway & curve physics
    this.mouseX = -9999;
    this.mouseY = -9999;
    this.hoverInfluenceX = 0;

    // Interaction state
    this.isDragging = false;
    this.dragStartY = 0;
    this.dragStartX = 0;
    this.hasTriggered = false;
    this.pullThreshold = window.innerWidth < 768 ? 34 : 52;
    this.isAutoPulling = false;
    this.autoPullProgress = 0;

    // Theme state (Default: light as requested)
    const storedTheme = localStorage.getItem('dinesh_portfolio_theme');
    this.theme = storedTheme === 'dark' ? 'dark' : 'light';
    this.applyTheme(this.theme, false);

    this.initEvents();
    this.startLoop();
  }

  applyTheme(theme, animate = true) {
    this.theme = theme;
    try {
      localStorage.setItem('dinesh_portfolio_theme', theme);
    } catch (_) {}

    document.documentElement.setAttribute('data-theme', theme);
    document.body.classList.toggle('theme-dark', theme === 'dark');
    document.body.classList.toggle('theme-light', theme === 'light');

    // Notify Three.js Hero Scene if present
    if (window.heroScene && typeof window.heroScene.setTheme === 'function') {
      window.heroScene.setTheme(theme);
    }

    // Broadcast theme event
    window.dispatchEvent(new CustomEvent('theme-changed', { detail: { theme } }));
  }

  toggleTheme() {
    const nextTheme = this.theme === 'light' ? 'dark' : 'light';
    this.applyTheme(nextTheme, true);
  }

  initEvents() {
    // Mouse hover detection for rope sway
    window.addEventListener('mousemove', (e) => {
      const rect = this.container.getBoundingClientRect();
      this.mouseX = e.clientX - rect.left;
      this.mouseY = e.clientY - rect.top;
    }, { passive: true });

    window.addEventListener('mouseleave', () => {
      this.mouseX = -9999;
      this.mouseY = -9999;
    });

    // Drag interactions via pointer events on hitbox
    const onPointerDown = (e) => {
      this.isDragging = true;
      this.hasTriggered = false;
      this.dragStartX = e.clientX;
      this.dragStartY = e.clientY;
      this.hitbox.classList.add('is-dragging');
      this.hitbox.setPointerCapture?.(e.pointerId);
      e.preventDefault();
    };

    const onPointerMove = (e) => {
      if (!this.isDragging) return;

      const dy = Math.max(0, e.clientY - this.dragStartY);
      const dx = (e.clientX - this.dragStartX) * 0.35;

      // Elastic pull distance with resistance
      const pull = Math.min(100, dy * 0.82);
      this.targetHy = this.anchorY + this.restLength + pull;
      this.targetHx = this.anchorX + dx;

      // Threshold trigger
      if (pull >= this.pullThreshold && !this.hasTriggered) {
        this.hasTriggered = true;
        this.toggleTheme();
        // Little visual kick
        this.vy += 6;
      }
    };

    const onPointerUp = (e) => {
      if (!this.isDragging) return;
      const dy = Math.max(0, e.clientY - this.dragStartY);
      this.isDragging = false;
      this.hitbox.classList.remove('is-dragging');
      try {
        this.hitbox.releasePointerCapture?.(e.pointerId);
      } catch (_) {}

      // If clicked without substantial drag, perform animated pull
      if (dy < 6) {
        this.triggerAutoPull();
      } else {
        // Elastic snap back
        this.targetHy = this.anchorY + this.restLength;
        this.targetHx = this.anchorX;
      }
    };

    this.hitbox.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove, { passive: false });
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);

    // Keyboard accessibility
    this.hitbox.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.triggerAutoPull();
      }
    });

    window.addEventListener('resize', () => {
      this.pullThreshold = window.innerWidth < 768 ? 34 : 52;
    }, { passive: true });
  }

  triggerAutoPull() {
    if (this.isAutoPulling) return;
    this.isAutoPulling = true;
    this.autoPullProgress = 0;
    this.toggleTheme();
    // Kick downward impulse
    this.vy = window.innerWidth < 768 ? 16 : 22;
  }

  startLoop() {
    const loop = () => {
      this.updatePhysics();
      this.draw();
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  updatePhysics() {
    const restY = this.anchorY + this.restLength;

    if (!this.isDragging) {
      this.targetHy = restY;

      // Mouse hover sway: cord gently follows cursor when nearby
      if (this.mouseY >= 0 && this.mouseY <= this.height + 40 &&
          Math.abs(this.mouseX - this.anchorX) < 90) {
        const distFromCenter = this.mouseX - this.anchorX;
        const verticalWeight = Math.min(1, Math.max(0, this.mouseY / restY));
        this.hoverInfluenceX = distFromCenter * 0.3 * verticalWeight;
      } else {
        this.hoverInfluenceX *= 0.88;
      }

      this.targetHx = this.anchorX + this.hoverInfluenceX;
    }

    // Spring physics integration
    const ax = (this.targetHx - this.hx) * this.k;
    const ay = (this.targetHy - this.hy) * this.k;

    this.vx = (this.vx + ax) * this.damping;
    this.vy = (this.vy + ay) * this.damping;

    this.hx += this.vx;
    this.hy += this.vy;

    // Sync HTML hitbox position to handle
    if (this.hitbox) {
      this.hitbox.style.transform = `translate(-50%, -50%) translate(${this.hx - this.anchorX}px, ${this.hy - 185}px)`;
    }
  }

  draw() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    const ax = this.anchorX;
    const ay = this.anchorY;
    const hx = this.hx;
    const hy = this.hy;

    // 1. Ceiling Bracket (Brass mount at top:0)
    ctx.fillStyle = '#b89254';
    ctx.beginPath();
    ctx.roundRect(ax - 7, 0, 14, 5, [0, 0, 3, 3]);
    ctx.fill();

    const bracketGrad = ctx.createLinearGradient(ax - 7, 0, ax + 7, 5);
    bracketGrad.addColorStop(0, '#d9b472');
    bracketGrad.addColorStop(0.5, '#997332');
    bracketGrad.addColorStop(1, '#664c1e');
    ctx.fillStyle = bracketGrad;
    ctx.fill();

    // 2. Hanging Braided Cord with Physics Curve
    // Mid control point for realistic physical sag/sway
    const midX = (ax + hx) * 0.5 + (this.hoverInfluenceX * 0.6);
    const midY = (ay + hy) * 0.5;

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(ax, ay + 4);
    ctx.quadraticCurveTo(midX, midY, hx, hy - 22);

    // Cord shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.18)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 3;

    // Outer cord stroke
    ctx.strokeStyle = this.theme === 'light' ? '#8e714b' : '#c9a873';
    ctx.lineWidth = 2.2;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Subtle golden highlight line
    ctx.shadowColor = 'transparent';
    ctx.strokeStyle = this.theme === 'light' ? '#e0c598' : '#ffe1a8';
    ctx.lineWidth = 0.8;
    ctx.stroke();
    ctx.restore();

    // 3. Turned Walnut Wood & Brass Teardrop Handle
    ctx.save();
    ctx.translate(hx, hy);

    // Subtle tilt based on velocity
    const tilt = Math.max(-0.25, Math.min(0.25, this.vx * 0.04));
    ctx.rotate(tilt);

    // Soft drop shadow beneath handle
    ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
    ctx.shadowBlur = 12;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 6;

    // 3a. Brass Top Collar Ring
    const brassGrad = ctx.createLinearGradient(-6, -24, 6, -18);
    brassGrad.addColorStop(0, '#f2d28f');
    brassGrad.addColorStop(0.4, '#b88c47');
    brassGrad.addColorStop(1, '#6b4f23');
    ctx.fillStyle = brassGrad;
    ctx.beginPath();
    ctx.roundRect(-5.5, -24, 11, 5, 2);
    ctx.fill();

    // 3b. Wooden Teardrop Body (Rich Walnut Grain)
    ctx.beginPath();
    ctx.moveTo(0, -19);
    // Left curve down to bulbous bottom
    ctx.bezierCurveTo(-7, -13, -12, -2, -11, 8);
    ctx.bezierCurveTo(-10, 16, -4, 21, 0, 21);
    // Right curve back to top
    ctx.bezierCurveTo(4, 21, 10, 16, 11, 8);
    ctx.bezierCurveTo(12, -2, 7, -13, 0, -19);
    ctx.closePath();

    const woodGrad = ctx.createRadialGradient(-3, -2, 2, 0, 3, 16);
    woodGrad.addColorStop(0, '#9a572c');   // Warm highlight
    woodGrad.addColorStop(0.35, '#6a3617'); // Rich walnut
    woodGrad.addColorStop(0.8, '#421f0b');  // Deep shadow
    woodGrad.addColorStop(1, '#241005');    // Rim shadow
    ctx.fillStyle = woodGrad;
    ctx.fill();

    // 3c. Tactile Gloss Highlight along left flank
    ctx.shadowColor = 'transparent';
    ctx.beginPath();
    ctx.moveTo(-2, -15);
    ctx.bezierCurveTo(-6, -10, -9, 0, -8, 8);
    ctx.bezierCurveTo(-7, 13, -4, 17, -2, 18);
    ctx.strokeStyle = 'rgba(255, 230, 205, 0.38)';
    ctx.lineWidth = 1.6;
    ctx.lineCap = 'round';
    ctx.stroke();

    // 3d. Brass Bottom Accent Pip
    ctx.fillStyle = brassGrad;
    ctx.beginPath();
    ctx.arc(0, 20, 2.4, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}

let themeRopeInstance = null;

export function initThemeRope() {
  if (!themeRopeInstance) {
    themeRopeInstance = new ThemeRope();
  }
  return themeRopeInstance;
}


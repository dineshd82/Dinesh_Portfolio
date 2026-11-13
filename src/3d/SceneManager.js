/**
 * Modular Three.js Scene Manager
 * Prepares the 3D foundation for dedicated future interactive sections.
 */
import * as THREE from 'three';

export class SceneManager {
  /**
   * @param {HTMLElement} container - Target container element for the canvas
   * @param {Object} [options]
   */
  constructor(container, options = {}) {
    this.container = container;
    this.options = {
      alpha: true,
      antialias: true,
      cameraFov: 45,
      cameraNear: 0.1,
      cameraFar: 1000,
      clearColor: 0x000000,
      clearAlpha: 0,
      ...options
    };

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.animId = null;
    this.resizeObserver = null;
    this.isVisible = true;
    this.customUpdateCallbacks = [];
  }

  /**
   * Initialize scene, camera, renderer, lighting, and event listeners
   */
  init() {
    if (!this.container) return;

    const width = this.container.clientWidth || 300;
    const height = this.container.clientHeight || 300;

    // 1. Scene
    this.scene = new THREE.Scene();

    // 2. Camera
    this.camera = new THREE.PerspectiveCamera(
      this.options.cameraFov,
      width / height,
      this.options.cameraNear,
      this.options.cameraFar
    );
    this.camera.position.set(0, 0, 5);

    // 3. WebGL Renderer
    this.renderer = new THREE.WebGLRenderer({
      alpha: this.options.alpha,
      antialias: this.options.antialias,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(this.options.clearColor, this.options.clearAlpha);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;

    this.container.appendChild(this.renderer.domElement);

    // 4. Default Studio Lighting
    this.setupLighting();

    // 5. Responsive Resize Handling
    this.setupResizeObserver();

    // 6. Start Render Loop
    this.start();
  }

  /**
   * Configure basic studio lighting setup
   */
  setupLighting() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    this.scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
    keyLight.position.set(5, 5, 5);
    this.scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xf43534, 0.6); // Subtle accent rim
    fillLight.position.set(-5, 0, -2);
    this.scene.add(fillLight);
  }

  /**
   * Handle responsive container resizing cleanly
   */
  setupResizeObserver() {
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
      window.addEventListener('resize', this.onWindowResize.bind(this));
    }
  }

  onWindowResize() {
    if (!this.container) return;
    this.resize(this.container.clientWidth, this.container.clientHeight);
  }

  resize(width, height) {
    if (!this.camera || !this.renderer) return;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  /**
   * Register a per-frame update callback
   * @param {Function} cb
   */
  onUpdate(cb) {
    if (typeof cb === 'function') {
      this.customUpdateCallbacks.push(cb);
    }
  }

  /**
   * Start animation loop
   */
  start() {
    const loop = (time) => {
      this.animId = requestAnimationFrame(loop);
      if (this.isVisible) {
        this.update(time);
        this.render();
      }
    };
    this.animId = requestAnimationFrame(loop);
  }

  /**
   * Pause animation loop (e.g. when off-screen)
   */
  pause() {
    this.isVisible = false;
  }

  /**
   * Resume animation loop
   */
  resume() {
    this.isVisible = true;
  }

  update(time) {
    for (const cb of this.customUpdateCallbacks) {
      cb(time);
    }
  }

  render() {
    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }

  /**
   * Dispose all resources and remove DOM elements
   */
  dispose() {
    if (this.animId) {
      cancelAnimationFrame(this.animId);
    }
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    window.removeEventListener('resize', this.onWindowResize.bind(this));

    if (this.renderer) {
      this.renderer.dispose();
      if (this.renderer.domElement && this.renderer.domElement.parentNode) {
        this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
      }
    }

    this.scene = null;
    this.camera = null;
    this.renderer = null;
  }
}


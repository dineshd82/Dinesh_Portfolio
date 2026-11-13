# 3D Architecture Foundation (Three.js)

This directory provides the technical foundation and architecture for future interactive 3D experiences in the portfolio without adding runtime overhead or visual distractions to the current homepage.

## Architecture Overview

- **`SceneManager.js`**: Core class managing the Three.js lifecycle:
  - Three.js `Scene`
  - Perspective camera with dynamic aspect ratio calculation
  - WebGLRenderer with `antialias: true`, `alpha: true`, sRGB encoding, and pixel-ratio clamping (`Math.min(window.devicePixelRatio, 2)`)
  - Studio lighting setup (ambient, key light, fill light, rim light)
  - ResizeObserver-driven responsive canvas handling
  - RequestAnimationFrame loop with automatic pause when canvas is out of view (performance & battery preservation)
  - Full memory disposal (`dispose()` method to avoid WebGL context leaks)

## Directory Structure

```text
src/
├── 3d/
│   ├── SceneManager.js    # Modular Three.js scene controller
│   └── README.md          # 3D guidelines & architecture documentation
└── assets/
    └── models/            # Target directory for future GLTF / GLB assets
```

## Model Guidelines for Future Implementation

1. **Format**: Optimized binary `.glb` is preferred over `.gltf` + external buffers.
2. **Compression**: Use DRACO or Meshopt compression for compact downloads.
3. **Polygon Budget**: Target under 50,000 polygons for smooth 60fps mobile execution.
4. **Textures**: Use 1K/2K resolution textures in WebP/Basis/KTX2 format when possible.
5. **Draw Calls**: Combine meshes and materials where feasible to keep draw calls under 20.

## How to Initialize in Future Steps

```javascript
import { SceneManager } from './3d/SceneManager.js';

const container = document.getElementById('three-container');
const sceneManager = new SceneManager(container);

sceneManager.init();
// Load future model: sceneManager.loadModel('/src/assets/models/portfolio-object.glb');
```


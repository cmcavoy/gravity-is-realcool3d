# Architecture

## System Overview

"Gravity is Real Cool" is a client-side single-page application built entirely in JavaScript using the P5.js creative coding library. The architecture is intentionally simple, consisting of a single HTML page, a physics simulation class, and a P5.js sketch that handles the animation loop.

The system operates as a real-time physics simulation running at browser frame rate (typically 60 FPS), where each frame:
1. Calculates gravitational forces between all objects
2. Updates object positions based on velocities
3. Renders all objects as 3D spheres with textures

There is no backend, no build process, and no external APIs beyond loading the P5.js library and a texture image from CDNs.

## Components

### 1. HTML Entry Point (index.html)

**Responsibility**: Provides the minimal HTML structure and loads required resources.

**Key Elements**:
- Sets up viewport and page metadata
- Links to stylesheet for basic styling
- Loads P5.js library (v0.10.2) from jsdelivr CDN
- Loads main script.js with defer attribute
- Body remains empty - P5.js creates canvas dynamically

**Dependencies**: P5.js CDN, local style.css, local script.js

### 2. CelestialObject Class (script.js)

**Responsibility**: Encapsulates all physics and rendering behavior for individual objects.

**Properties**:
- `location`: P5.Vector (x, y, z) - current position in 3D space
- `velocity`: P5.Vector - current velocity vector
- `gravforce`: P5.Vector - accumulated gravitational force
- `mass`: Number - mass for gravity calculations
- `size`: Number - render radius
- `stationary`: Boolean - if true, object doesn't move but exerts gravity
- `color`: Array [r, g, b] - RGB color values
- `previousLocation`: P5.Vector - used for motion trails (currently not rendered)

**Methods**:

- `gravity(obj)` (lines 16-24): Calculates gravitational force using Newton's law of universal gravitation:
  - F = G × (m1 × m2) / r²
  - Applies gravModifier to scale down forces for visual effect
  - Normalizes and adds to velocity

- `move()` (lines 26-29): Updates position by adding velocity vector

- `addThrust(t, angle)` (lines 31-37): Adds initial velocity at specified angle

- `update(objs)` (lines 39-49): Called each frame to:
  - Calculate gravity from all stationary objects
  - Move if not stationary

- `draw()` (lines 51-58): Renders object as textured 3D sphere

### 3. P5.js Sketch Functions (script.js)

**preload()** (lines 73-75):
- Loads texture image from Glitch CDN before setup runs
- Image used as texture on all spheres

**setup()** (lines 77-121):
- Creates WebGL canvas sized to browser window
- Initializes universe array with configured objects:
  - **Planets** (lines 85-91): Stationary at origin (0,0,0), large mass/size
  - **Ships** (lines 93-106): Offset positions with initial thrust, medium mass/size
  - **Particles** (lines 108-120): Random positions, small mass/size

**draw()** (lines 123-133):
- Animation loop executed every frame
- Sets up 3D camera perspective and lighting
- Iterates all objects calling update() then draw()
- `clear()` creates motion trail effect (previous frames fade)

### 4. Styling (style.css)

**Responsibility**: Minimal visual styling for the page.

**Key Styles**:
- Black background (`background: black`) for space effect
- 20px margin around canvas
- Font definition (unused - no text rendered)

### 5. Universe State (script.js)

**universe array** (line 67):
- Global array holding all CelestialObject instances
- Initialized in setup(), never modified during animation
- Passed to each object's update() for gravity calculations

**Configuration variables** (lines 63-65):
- `planets`: Count of stationary massive objects
- `ships`: Count of moving objects with thrust
- `particles`: Count of small particles
- These control how many of each type are created in setup()

## Data Flow

```
1. Browser loads index.html
   ↓
2. P5.js library loads from CDN
   ↓
3. script.js executes:
   - Defines CelestialObject class
   - Sets configuration variables
   - P5.js calls preload() → loads texture
   ↓
4. P5.js calls setup():
   - Creates WebGL canvas
   - Instantiates all CelestialObject instances
   - Adds to universe array
   ↓
5. P5.js calls draw() repeatedly (60 FPS):
   ├─ For each object in universe:
   │  ├─ Call update(universe)
   │  │  ├─ For each stationary object:
   │  │  │  └─ Calculate gravity force
   │  │  └─ Update position if not stationary
   │  └─ Call draw()
   │     └─ Render as textured 3D sphere
   └─ Loop continues indefinitely
```

## External Dependencies

### Runtime Dependencies

1. **P5.js Library (v0.10.2)**
   - Source: https://cdn.jsdelivr.net/npm/p5@0.10.2/lib/p5.js
   - Purpose: Creative coding framework with WebGL support
   - Provides: Canvas creation, 3D rendering, vector math, image loading
   - Critical: Yes - application won't run without it

2. **Texture Image**
   - Source: https://cdn.glitch.com/75e46e32-1a41-433f-a7ad-e5e6ad6e976f%2FHipstamaticPhoto-603053477.650420.jpg
   - Purpose: Texture mapped onto sphere surfaces
   - Type: JPEG image (3024x3024px, 4.5MB)
   - Critical: No - objects will render without texture but appearance degraded

### Browser Requirements

- **WebGL Support**: Required for 3D rendering
- **ES6 JavaScript**: Class syntax, arrow functions, let/const
- **Modern Browser**: Chrome, Firefox, Safari, Edge (recent versions)

### No Backend Dependencies

- No server-side processing
- No database
- No API endpoints
- No authentication
- No build tools or transpilation
- No package manager (npm/yarn)

## Performance Characteristics

**Computational Complexity**:
- Gravity calculations: O(n²) where n = number of objects
  - Each non-stationary object checks against all stationary objects
- Rendering: O(n) - each object rendered once per frame

**Optimization Techniques**:
- `p5.disableFriendlyErrors = true`: Removes runtime error checking overhead
- Only stationary objects exert gravity: Reduces calculation pairs
- `gravModifier = 0.005`: Reduces force magnitude for numerical stability
- Sphere detail limited to 100x100: Balances quality vs performance

**Scalability Limits**:
- Performance degrades with large object counts due to O(n²) gravity calculations
- Recommended: < 100 total objects for smooth 60 FPS
- Browser WebGL capabilities and CPU speed are limiting factors

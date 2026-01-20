# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

"Gravity is Real Cool" is an interactive web-based visualization project that uses gravity physics to create dynamic patterns and animations. Built with P5.js in WebGL mode, it simulates celestial objects (planets, ships, and particles) interacting through gravitational forces to generate visually interesting patterns.

This is a creative coding project originally developed on Glitch.com that demonstrates physics-based generative art.

## Technology Stack

- **JavaScript (ES6)**: Core programming language
- **P5.js (v0.10.2)**: Creative coding library with WebGL rendering
- **HTML5**: Structure and canvas rendering
- **CSS3**: Minimal styling for dark theme
- **WebGL**: 3D graphics rendering via P5.js
- **CDN Delivery**: P5.js loaded from jsdelivr CDN

## Development Commands

This is a static web project with no build process or dependencies to install.

```bash
# Run locally - serve the directory with any static web server
python -m http.server 8000
# Or use Node.js http-server
npx http-server .

# Open in browser
open http://localhost:8000
```

## Architecture

This is a simple single-page application with client-side physics simulation:

1. **HTML Entry Point** (index.html): Loads P5.js library and project scripts
2. **Physics Simulation** (script.js): Contains the CelestialObject class and P5.js sketch
3. **Styling** (style.css): Minimal black background styling
4. **Assets** (.glitch-assets): References to external images used for textures

### Key Components

**CelestialObject Class** (script.js:1-59)
- Represents any object in the simulation (planet, ship, or particle)
- Properties: location, velocity, mass, size, stationary flag, color
- Methods:
  - `gravity(obj)`: Calculates gravitational force between objects
  - `move()`: Updates position based on velocity
  - `addThrust(t, angle)`: Applies thrust force for initial velocity
  - `update(objs)`: Applies gravitational forces from all stationary objects
  - `draw()`: Renders the object as a textured sphere in 3D space

**P5.js Sketch Functions**
- `preload()`: Loads texture image from Glitch CDN (script.js:73-75)
- `setup()`: Initializes canvas, creates celestial objects, sets initial conditions (script.js:77-121)
- `draw()`: Animation loop that updates and renders all objects (script.js:123-133)

**Universe Array** (script.js:67)
- Contains all CelestialObject instances
- Iterated each frame for physics updates and rendering

## Key Files

- **script.js** (134 lines): Contains entire physics simulation and rendering logic
  - Lines 1-59: CelestialObject class definition
  - Lines 63-65: Configuration variables (planets, ships, particles)
  - Lines 73-75: Image preloading
  - Lines 77-121: Setup function - initializes objects
  - Lines 123-133: Draw loop - animation frame

- **index.html** (17 lines): Minimal HTML structure
  - Line 11: P5.js library from CDN
  - Line 12: Main script.js reference

- **style.css** (11 lines): Basic styling with black background

- **.glitch-assets** (9 lines): Asset manifest from Glitch.com hosting
  - Line 8: Texture image URL used in simulation

## Code Quality Standards

### Observed Patterns

1. **Object-Oriented Design**: Single class (CelestialObject) encapsulates all physics and rendering
2. **P5.js Conventions**: Follows standard P5.js structure (preload, setup, draw)
3. **WebGL Mode**: Uses WEBGL renderer for 3D graphics
4. **Vector Math**: Uses P5.Vector for position and velocity calculations
5. **Physics Accuracy Trade-offs**: Simplified gravity (gravModifier reduces force) for visual effect

### Configuration

The simulation behavior can be modified by changing constants in script.js:63-65:
- `planets`: Number of stationary massive objects (default: 1)
- `ships`: Number of moving objects with initial thrust (default: 2)
- `particles`: Number of small particles (default: 0)

### Physics Parameters

Key tunable values in CelestialObject constructor:
- `gravModifier = 0.005`: Reduces gravitational forces for smoother motion (script.js:7)
- `G = 1`: Gravitational constant (script.js:9)
- Mass, size, and initial thrust in setup() function affect orbital patterns

### Performance Note

- `p5.disableFriendlyErrors = true` (script.js:61) improves performance by disabling error checking
- Sphere detail set to 100x100 for smooth rendering (script.js:57)

## Development Workflow

1. Modify configuration variables to change number of objects
2. Adjust physics parameters (mass, size, initial thrust) in setup()
3. Tweak gravModifier and G constants for different visual effects
4. Refresh browser to see changes (no build step required)
5. Experiment with initial positions, velocities, and thrust angles

## Deployment

This project was originally hosted on Glitch.com. To deploy:
- Upload all files to any static hosting service
- Ensure CDN resources are accessible
- No server-side processing required

# Gravity is Real Cool - Overview

## Purpose

"Gravity is Real Cool" is a creative coding project that demonstrates the beauty of physics-based generative art. It simulates gravitational interactions between celestial objects in 3D space, creating mesmerizing orbital patterns and visual effects. The project uses basic Newtonian gravity equations to move objects around, producing different patterns depending on initial configuration.

The primary purpose is artistic and educational - showing how simple physics rules can create complex, beautiful emergent behaviors.

## Key Features

- **3D Physics Simulation**: Real-time Newtonian gravity calculations between objects
- **WebGL Rendering**: Hardware-accelerated 3D graphics using P5.js WebGL mode
- **Configurable Objects**: Three types of objects with different behaviors:
  - Planets: Stationary massive objects that exert gravitational force
  - Ships: Moving objects with initial thrust affected by gravity
  - Particles: Small objects that can be affected by gravity
- **Customizable Parameters**: Easy modification of object count, mass, size, and initial conditions
- **3D Visualization**: Textured spheres rendered with proper lighting and perspective
- **Performance Optimized**: Disabled error checking and efficient rendering for smooth animation
- **Generative Art**: Each configuration produces unique orbital patterns and trails

## Target Audience

- **Creative Coders**: Artists interested in generative art and procedural visuals
- **Students**: Learning physics simulation, vector math, or P5.js
- **Educators**: Teaching concepts like gravity, orbits, and emergent behavior
- **Hobbyists**: Experimenting with parameters to create unique visual patterns
- **Web Developers**: Studying client-side animation and WebGL rendering

## Quick Start

1. **Clone or download the repository**
   ```bash
   git clone <repository-url>
   cd gravity-is-realcool3d
   ```

2. **Serve the files locally**
   ```bash
   # Using Python
   python -m http.server 8000

   # Or using Node.js
   npx http-server .
   ```

3. **Open in browser**
   ```
   Navigate to http://localhost:8000
   ```

4. **Experiment with parameters**
   - Open `script.js` in a text editor
   - Modify lines 63-65 to change object counts:
     ```javascript
     let planets = 1;  // Stationary gravitational centers
     let ships = 2;    // Moving objects with initial thrust
     let particles = 0; // Small particles
     ```
   - Refresh browser to see changes

5. **Try different configurations**
   - Single planet with multiple ships: Creates orbital patterns
   - Multiple planets: Creates complex multi-body interactions
   - Many particles with planets: Creates swirling debris fields
   - Adjust mass, size, and thrust in the `setup()` function for different effects

## Project Origin

This project was originally developed on Glitch.com, a collaborative coding platform. The `.glitch-assets` file contains references to assets hosted on Glitch's CDN. The project demonstrates how simple physics can create compelling visual experiences directly in the browser.

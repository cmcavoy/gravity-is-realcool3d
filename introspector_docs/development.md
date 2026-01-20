# Development Guide

## Prerequisites

### Required Software

- **Web Browser**: Modern browser with WebGL support
  - Chrome 56+ (recommended)
  - Firefox 51+
  - Safari 11+
  - Edge 79+

- **Local Web Server**: Any static file server
  - Python 3.x (built-in http.server)
  - Node.js (for http-server or similar)
  - PHP (built-in server)
  - Any other static file server

### Optional Tools

- **Text Editor or IDE**: For code editing
  - VS Code (recommended)
  - Sublime Text
  - Atom
  - Any text editor

- **Git**: For version control
  - Git 2.x+

### System Requirements

- Operating System: Windows, macOS, or Linux
- RAM: 2GB minimum, 4GB recommended
- Graphics: GPU with WebGL support

### Knowledge Prerequisites

- Basic JavaScript (ES6 syntax)
- Understanding of vectors and basic physics (helpful but not required)
- Familiarity with P5.js (helpful but not required)

## Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd gravity-is-realcool3d
```

Or download and extract the ZIP file.

### 2. Verify File Structure

Ensure you have these files:

```
gravity-is-realcool3d/
├── index.html
├── script.js
├── style.css
├── .glitch-assets
└── README.md
```

### 3. Start a Local Web Server

**Option A: Python (most common)**
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

**Option B: Node.js**
```bash
# Install http-server globally (one time)
npm install -g http-server

# Run server
http-server -p 8000
```

**Option C: PHP**
```bash
php -S localhost:8000
```

**Option D: VS Code Extension**
- Install "Live Server" extension
- Right-click index.html
- Select "Open with Live Server"

### 4. Open in Browser

Navigate to: `http://localhost:8000`

You should see the gravity simulation running with objects orbiting.

### 5. Verify WebGL Support

If the page is blank or shows errors:
1. Open browser console (F12)
2. Check for WebGL errors
3. Test WebGL support: Visit https://get.webgl.org/

## Development Workflow

### Basic Workflow

1. **Edit Code**: Modify script.js in your text editor
2. **Save File**: Save changes (Ctrl+S / Cmd+S)
3. **Refresh Browser**: Reload page (F5 or Ctrl+R / Cmd+R)
4. **Observe Changes**: Watch the updated simulation
5. **Iterate**: Repeat as needed

### Recommended Workflow for Experimentation

1. **Start Simple**: Begin with default configuration
2. **Change One Thing**: Modify one parameter at a time
3. **Document Interesting Results**: Note configurations that create cool patterns
4. **Save Variations**: Use git branches or file copies for different versions

### Live Reloading (Optional)

For faster development, use a live-reload server:

```bash
# Install browser-sync
npm install -g browser-sync

# Run with live reload
browser-sync start --server --files "*.js, *.html, *.css"
```

Now changes automatically refresh the browser.

## Testing

This project has no automated tests. Testing is visual and interactive.

### Manual Testing Checklist

- [ ] Page loads without errors
- [ ] Canvas appears and fills browser window
- [ ] Objects are visible
- [ ] Objects are moving/orbiting
- [ ] Animation is smooth (no stuttering)
- [ ] Browser console has no errors

### Performance Testing

Check browser console for FPS (frames per second):

```javascript
// Add this to draw() function for FPS display
console.log(frameRate());
```

Smooth performance: 55-60 FPS
Acceptable: 30-55 FPS
Poor: < 30 FPS (reduce object count)

### Visual Testing

Different configurations produce different results:

**Single Planet + Multiple Ships**
```javascript
let planets = 1;
let ships = 5;
let particles = 0;
```
Expected: Ships orbit the central planet

**Multiple Planets**
```javascript
let planets = 3;
let ships = 2;
let particles = 0;
```
Expected: Complex multi-body interactions, chaotic orbits

**Particle Field**
```javascript
let planets = 1;
let ships = 0;
let particles = 50;
```
Expected: Particles slowly drift toward center

## Common Tasks

### Change Number of Objects

Edit lines 63-65 in script.js:

```javascript
let planets = 1;   // Stationary gravity sources
let ships = 2;     // Moving objects with thrust
let particles = 0; // Small particles
```

### Adjust Gravity Strength

Edit line 7 in script.js (CelestialObject constructor):

```javascript
this.gravModifier = 0.005; // Smaller = weaker gravity
```

Try values:
- `0.001` - Very weak, slow orbits
- `0.005` - Default, balanced
- `0.01` - Strong, tight orbits
- `0.02` - Very strong, fast spirals

### Change Object Sizes

Edit setup() function (lines 85-106):

**Planets** (line 89):
```javascript
let p = new CelestialObject(x, y, z, 50, 75, true, [255, 255, 255]);
//                                    mass ^^  ^^ size
```

**Ships** (line 101):
```javascript
let s = new CelestialObject(x, y, z, 10, 20, false, [r, g, b]);
//                                    mass ^^  ^^ size
```

### Modify Initial Velocities

Edit ship thrust in setup() (line 104):

```javascript
s.addThrust(20000 * m, heading);
//          ^^^^^ thrust magnitude
```

Try values:
- `10000` - Slow, may fall into planet
- `20000` - Default, stable orbits
- `30000` - Fast, wide orbits
- `50000` - Very fast, may escape

### Change Colors

Edit color arrays in setup():

**Planets** (line 89):
```javascript
let p = new CelestialObject(x, y, z, 50, 75, true, [255, 255, 255]);
//                                                    R    G    B
```

**Ships** (lines 98-100):
```javascript
let r = 255;  // Red channel (0-255)
let g = 255;  // Green channel (0-255)
let b = 255;  // Blue channel (0-255)
```

Try:
- `[255, 0, 0]` - Red
- `[0, 255, 0]` - Green
- `[0, 0, 255]` - Blue
- `[255, 255, 0]` - Yellow
- `[random(255), random(255), random(255)]` - Random colors

### Change Canvas Size

Edit setup() function (line 78):

```javascript
createCanvas(windowWidth - 40, windowHeight, WEBGL);
//           ^^^^^^^^^^^^^^^^  ^^^^^^^^^^^
//           width             height
```

Or use fixed size:
```javascript
createCanvas(800, 600, WEBGL);
```

### Change Background Behavior

Edit draw() function (line 124):

**Current** (transparent trails):
```javascript
clear();
```

**Solid background** (no trails):
```javascript
background(0);  // Black background
```

### Modify Camera Perspective

Edit draw() function (lines 125-127):

```javascript
let fov = PI/3;  // Field of view (wider = more distortion)
let cameraZ = (height/2.0) / tan(fov/2.0);
perspective(fov, width/height, cameraZ/10.0, cameraZ*10.0);
```

Try different FOV:
- `PI/4` - Narrower, less distortion
- `PI/3` - Default
- `PI/2` - Wide angle, more distortion

### Add More Initial Positions

Edit setup() to place ships in different locations:

```javascript
for (let i=0; i<ships; i++) {
    let m = i + 1;
    let angle = (TWO_PI / ships) * i;  // Distribute evenly in circle
    let radius = 200;
    let x = cos(angle) * radius;
    let y = sin(angle) * radius;
    let z = 0;
    let s = new CelestialObject(x, y, z, 10, 20, false, [255, 255, 255]);
    s.addThrust(20000, angle + HALF_PI);  // Tangential velocity
    universe.push(s);
}
```

### Debug Gravity Calculations

Add console logging to gravity() method (line 16):

```javascript
gravity(obj) {
    let dir = obj.location.copy().sub(this.location);
    let r = dir.mag();
    let f = this.G * ((obj.mass * this.mass) / (r * r));
    console.log(`Distance: ${r}, Force: ${f}`);  // Add this
    // ... rest of method
}
```

## Project Structure

```
gravity-is-realcool3d/
│
├── index.html              # Entry point - loads P5.js and script.js
│   └── Lines 11-12: Resource loading
│
├── script.js               # Main application logic
│   ├── Lines 1-59:    CelestialObject class definition
│   ├── Lines 63-65:   Configuration variables
│   ├── Lines 73-75:   preload() - image loading
│   ├── Lines 77-121:  setup() - initialization
│   └── Lines 123-133: draw() - animation loop
│
├── style.css               # Basic styling (black background)
│
├── .glitch-assets          # Asset manifest (Glitch.com format)
│   └── Line 8: Texture image URL
│
└── README.md               # Project description
```

## Debugging Tips

### Canvas Not Appearing

Check browser console for errors:
- WebGL not supported: Update browser or use different browser
- P5.js failed to load: Check CDN connectivity
- Script error: Check JavaScript syntax

### Objects Not Moving

- Check configuration: Are ships = 0?
- Check stationary flag: Ships should have `stationary: false`
- Check initial velocity: Add thrust in setup()

### Poor Performance

- Reduce object count (especially particles)
- Lower sphere detail: Change line 57 from `sphere(this.size, 100, 100)` to `sphere(this.size, 24, 24)`
- Enable `p5.disableFriendlyErrors` (already enabled at line 61)

### Objects Flying Off Screen

- Reduce initial thrust
- Increase gravity (gravModifier)
- Ensure proper thrust angle (tangent to radius)

### Jittery Animation

- Check FPS (should be 55-60)
- Close other browser tabs
- Reduce object count
- Update graphics drivers

## Version Control

### Create New Branch for Experiments

```bash
git checkout -b experiment-multiple-planets
```

### Save Your Work

```bash
git add script.js
git commit -m "Add configuration with 3 planets"
```

### Return to Original

```bash
git checkout main
```

## Additional Resources

- **P5.js Reference**: https://p5js.org/reference/
- **P5.js WebGL Tutorial**: https://github.com/processing/p5.js/wiki/Getting-started-with-WebGL-in-p5
- **WebGL Support**: https://get.webgl.org/
- **Newton's Law of Gravitation**: https://en.wikipedia.org/wiki/Newton%27s_law_of_universal_gravitation

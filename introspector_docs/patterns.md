# Code Patterns and Best Practices

## Design Patterns

### 1. Object-Oriented Encapsulation

**Pattern**: Single class encapsulates all behavior for entity type

**Implementation**: The `CelestialObject` class (script.js:1-59) encapsulates all properties and behaviors for any object in the simulation, whether planet, ship, or particle.

**Benefits**:
- Reusable: Same class for different object types
- Maintainable: All related code in one place
- Extensible: Easy to add new behaviors

**Example**:
```javascript
class CelestialObject {
  constructor(x, y, z, mass, size, stationary, color) {
    // All properties defined in constructor
    this.location = createVector(x, y, z);
    this.velocity = createVector(0, 0);
    this.mass = mass;
    this.stationary = stationary;
    // ... more properties
  }

  // Methods operate on instance state
  gravity(obj) { /* ... */ }
  move() { /* ... */ }
  update(objs) { /* ... */ }
  draw() { /* ... */ }
}
```

### 2. Configuration Over Code

**Pattern**: Top-level variables control behavior without changing logic

**Implementation**: Configuration variables (script.js:63-65) control how many objects are created.

**Benefits**:
- Quick experimentation
- No deep code changes needed
- Clear intent

**Example**:
```javascript
let planets = 1;
let ships = 2;
let particles = 0;
```

To change behavior, just modify these numbers.

### 3. Entity Component Pattern (Implicit)

**Pattern**: Entities have different capabilities based on flags/properties

**Implementation**: The `stationary` flag (script.js:11) determines if an object moves or just exerts gravity.

**Benefits**:
- Single class supports multiple behaviors
- Composition over inheritance
- Flexible entity types

**Example**:
```javascript
// Planet: stationary gravitational source
let planet = new CelestialObject(0, 0, 0, 50, 75, true, [255, 255, 255]);

// Ship: moves and affected by gravity
let ship = new CelestialObject(100, 100, 0, 10, 20, false, [255, 255, 255]);
```

### 4. Update-Draw Separation

**Pattern**: Separate logic updates from rendering

**Implementation**: Each object has separate `update()` and `draw()` methods called in sequence.

**Benefits**:
- Clear separation of concerns
- Easier to debug
- Standard game development pattern

**Example**:
```javascript
for (const i in universe) {
    universe[i].update(universe);  // Physics/logic
    universe[i].draw();            // Rendering only
}
```

### 5. P5.js Lifecycle Hooks

**Pattern**: Framework calls functions at specific lifecycle stages

**Implementation**: Uses P5.js convention of `preload()`, `setup()`, `draw()` functions.

**Benefits**:
- Guaranteed execution order
- Framework handles timing
- Standard P5.js pattern

**Example**:
```javascript
function preload() {
    // Load assets before setup
    img = loadImage(url);
}

function setup() {
    // Initialize once
    createCanvas(width, height, WEBGL);
}

function draw() {
    // Called every frame
    // Render objects
}
```

## Common Patterns

### 1. Vector Math Operations

**Pattern**: Use P5.Vector methods for all spatial calculations

**Location**: Throughout CelestialObject class

**Example**:
```javascript
// Calculate direction vector from this to obj
let dir = obj.location.copy().sub(this.location);

// Get distance (magnitude)
let r = dir.mag();

// Create force vector
this.gravforce = dir.copy().mult(f);

// Normalize and apply
this.gravforce.normalize();
this.velocity.add(this.gravforce);
```

**Why This Pattern**:
- Avoids manual x/y/z calculations
- More readable
- Less error-prone
- Leverages P5.js optimizations

### 2. Force Accumulation

**Pattern**: Accumulate forces, then apply to velocity

**Location**: script.js:16-24 (gravity method)

**Example**:
```javascript
gravity(obj) {
    // Calculate force
    let dir = obj.location.copy().sub(this.location);
    let r = dir.mag();
    let f = this.G * ((obj.mass * this.mass) / (r * r));

    // Store force
    this.gravforce = dir.copy().mult(f);
    this.gravforce.normalize();
    this.gravforce.mult(this.gravModifier);

    // Apply to velocity (acceleration)
    this.velocity.add(this.gravforce);
}
```

**Why This Pattern**:
- Separates force calculation from application
- Allows debugging/visualization of forces
- Can accumulate multiple forces

### 3. Relative Position Calculation

**Pattern**: Calculate positions relative to origin for rendering

**Location**: script.js:52-53 (draw method)

**Example**:
```javascript
translate(0, 0, 0);  // Reset to origin
translate(this.location.x, this.location.y, this.location.z);  // Move to position
```

**Why This Pattern**:
- WebGL requires transformation matrices
- Each object renders in its own coordinate space
- Standard 3D graphics pattern

### 4. Previous State Tracking

**Pattern**: Store previous frame's state before updating

**Location**: script.js:12, 27

**Example**:
```javascript
// In constructor
this.previousLocation = this.location.copy();

// In move()
this.previousLocation = this.location.copy();
this.location.add(this.velocity);
```

**Why This Pattern**:
- Enables motion trails (currently not rendered)
- Can calculate velocity from position changes
- Useful for collision detection

### 5. Loop with Multiplier Pattern

**Pattern**: Use loop index as multiplier for variation

**Location**: script.js:93-106 (ship creation)

**Example**:
```javascript
for (let i = 0; i < ships; i++) {
    let m = i + 1;  // Multiplier: 1, 2, 3, ...
    let x = 100 * m;
    let y = 100 * m;
    let z = 20 * m;
    s.addThrust(20000 * m, heading);
}
```

**Why This Pattern**:
- Creates varied but predictable initial conditions
- Each object slightly different
- Avoids overlapping objects

### 6. Early Return / Guard Pattern

**Pattern**: Check conditions early and skip unnecessary work

**Location**: script.js:42-43 (update method)

**Example**:
```javascript
if (obj != this && obj.stationary && !this.stationary) {
    this.gravity(objs[i]);  // Only calculate if conditions met
}

if (!this.stationary) {
    this.move();  // Only move if not stationary
}
```

**Why This Pattern**:
- Improves performance
- Clear intent
- Avoids unnecessary calculations

## Best Practices

### 1. Immutability When Appropriate

**Practice**: Copy vectors before modifying them

**Example**:
```javascript
// GOOD: Copy before modifying
let dir = obj.location.copy().sub(this.location);

// BAD: Would modify obj.location
let dir = obj.location.sub(this.location);
```

**Reason**: Prevents unintended side effects and bugs

### 2. Meaningful Variable Names

**Practice**: Use descriptive names that reveal intent

**Examples**:
```javascript
let fov = PI/3;              // Field of view
let cameraZ = ...            // Camera Z position
let gravModifier = 0.005;    // Gravity modifier
let stationary               // Boolean flag
```

**Reason**: Self-documenting code reduces need for comments

### 3. Magic Numbers as Constants

**Practice**: Define magic numbers at class/module level

**Example**:
```javascript
this.gravModifier = 0.005;  // Defined once in constructor
this.G = 1;                 // Gravitational constant

// Used later in calculations
let f = this.G * ((obj.mass * this.mass) / (r * r));
this.gravforce.mult(this.gravModifier);
```

**Reason**: Easy to tune, understand purpose, maintain consistency

### 4. Performance Optimization Flags

**Practice**: Disable unnecessary checks for production

**Example**:
```javascript
p5.disableFriendlyErrors = true;
```

**Reason**: P5.js error checking has overhead; disable when code is stable

### 5. Minimal Canvas Clearing

**Practice**: Use `clear()` instead of `background()` for trails effect

**Example**:
```javascript
function draw() {
    clear();  // Transparent clear - creates trails
    // vs
    // background(0);  // Solid black - no trails
}
```

**Reason**: Creates interesting visual effects, reduces overdraw

### 6. Proper Texture Preloading

**Practice**: Load assets in `preload()` not `setup()`

**Example**:
```javascript
function preload() {
    img = loadImage(url);  // Blocks until loaded
}

function setup() {
    // img guaranteed to be loaded
    texture(img);
}
```

**Reason**: P5.js waits for preload() to complete before calling setup()

### 7. Separate Configuration from Implementation

**Practice**: Configuration at top, implementation below

**Example**:
```javascript
// Configuration section
let planets = 1;
let ships = 2;
let particles = 0;

// Implementation
class CelestialObject { /* ... */ }
function setup() { /* ... */ }
```

**Reason**: Easy to find and modify settings

### 8. Consistent Coordinate System

**Practice**: Use center origin (0,0,0) for WebGL

**Example**:
```javascript
// Planets at origin
let x = 0, y = 0, z = 0;

// Ships offset from origin
let x = 100 * m;
let y = 100 * m;
```

**Reason**: WebGL uses center-origin, matches physics convention

## Anti-Patterns to Avoid

### 1. Avoid Deep Nesting

Current code keeps nesting shallow:
```javascript
// GOOD: Current implementation
if (obj != this && obj.stationary && !this.stationary) {
    this.gravity(objs[i]);
}
```

Avoid:
```javascript
// BAD: Deep nesting
if (obj != this) {
    if (obj.stationary) {
        if (!this.stationary) {
            this.gravity(objs[i]);
        }
    }
}
```

### 2. Avoid Global State Mutation

Current approach uses local scope well:
```javascript
// GOOD: Local array passed around
universe.push(obj);
obj.update(universe);
```

Avoid having methods mutate global state unexpectedly.

### 3. Avoid Premature Abstraction

The code keeps things simple - single class, straightforward logic. This is good for a creative coding project. Don't add unnecessary abstraction layers.

## Physics Simulation Patterns

### 1. Simplified Physics for Aesthetics

**Pattern**: Scale down realistic values for visual effect

**Example**:
```javascript
this.gravModifier = 0.005;  // Reduces force by 200x
```

Real gravity would cause very fast, unstable orbits. Scaling down creates pleasing visuals.

### 2. Verlet-like Integration (Implicit)

**Pattern**: Update velocity from forces, then position from velocity

**Example**:
```javascript
// In update()
this.gravity(obj);        // Adds to velocity
// In move()
this.location.add(this.velocity);  // Adds velocity to position
```

This is basic Euler integration - simple and good enough for creative coding.

### 3. N-body Problem Simplification

**Pattern**: Only stationary objects exert gravity

**Example**:
```javascript
if (obj != this && obj.stationary && !this.stationary) {
    this.gravity(objs[i]);
}
```

Real n-body: all objects attract all others (O(n²))
This implementation: only stationary objects attract (O(n×m) where m is planets)

**Trade-off**: Less accurate but better performance and more predictable

## Code Organization Principles

1. **Single Responsibility**: Each method does one thing
   - `gravity()`: Calculates force
   - `move()`: Updates position
   - `update()`: Orchestrates updates
   - `draw()`: Renders

2. **Separation of Concerns**: Physics separate from rendering

3. **Minimal Dependencies**: Only depends on P5.js, no other libraries

4. **No Build Step**: Keep it simple, edit and refresh

5. **Configuration Over Code**: Change behavior by changing values, not logic

These patterns make the code easy to understand, modify, and experiment with - perfect for creative coding.

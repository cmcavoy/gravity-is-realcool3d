# C4 Architecture Diagrams

## Context Diagram

The system context shows how users interact with the application and its external dependencies.

```mermaid
graph TB
    User[("User<br/>(Web Browser)")]
    System["Gravity is Real Cool<br/>Web Application<br/>[JavaScript/P5.js]<br/>3D gravity simulation and visualization"]
    P5CDN["P5.js CDN<br/>[jsdelivr]<br/>JavaScript library delivery"]
    GlitchCDN["Glitch CDN<br/>[cdn.glitch.com]<br/>Image asset hosting"]

    User -->|"Views orbital patterns<br/>in web browser"| System
    System -->|"Loads P5.js library<br/>(v0.10.2)"| P5CDN
    System -->|"Loads texture images<br/>(JPEG)"| GlitchCDN

    style System fill:#1168bd,stroke:#0b4884,color:#ffffff
    style User fill:#08427b,stroke:#052e56,color:#ffffff
    style P5CDN fill:#999999,stroke:#6b6b6b,color:#ffffff
    style GlitchCDN fill:#999999,stroke:#6b6b6b,color:#ffffff
```

## Container Diagram

The container diagram shows the major executable units within the application.

```mermaid
graph TB
    User[("User<br/>(Web Browser)")]

    subgraph WebApp["Gravity is Real Cool [Static Web App]"]
        HTML["index.html<br/>[HTML5]<br/>Entry point and<br/>resource loader"]
        CSS["style.css<br/>[CSS3]<br/>Visual styling"]
        Script["script.js<br/>[JavaScript ES6]<br/>Physics simulation<br/>and rendering"]
    end

    P5CDN["P5.js Library<br/>[External CDN]<br/>WebGL rendering framework"]
    GlitchCDN["Texture Image<br/>[External CDN]<br/>Sphere texture asset"]

    User -->|"HTTP GET<br/>Opens page"| HTML
    HTML -->|"Loads and renders"| CSS
    HTML -->|"Loads and executes"| Script
    Script -->|"Imports via script tag"| P5CDN
    Script -->|"Loads via preload()"| GlitchCDN
    Script -->|"Creates canvas,<br/>renders frames"| User

    style WebApp fill:#1168bd,stroke:#0b4884,color:#ffffff
    style HTML fill:#438dd5,stroke:#2e6295,color:#ffffff
    style CSS fill:#438dd5,stroke:#2e6295,color:#ffffff
    style Script fill:#438dd5,stroke:#2e6295,color:#ffffff
    style User fill:#08427b,stroke:#052e56,color:#ffffff
    style P5CDN fill:#999999,stroke:#6b6b6b,color:#ffffff
    style GlitchCDN fill:#999999,stroke:#6b6b6b,color:#ffffff
```

## Component Diagram

The component diagram shows the internal structure of script.js, the main application logic.

```mermaid
graph TB
    subgraph P5JS["P5.js Framework [External Library]"]
        P5Core["Core Functions<br/>createCanvas, createVector,<br/>translate, rotateZ"]
        P5WebGL["WebGL Renderer<br/>3D graphics, lighting,<br/>texture, sphere"]
        P5Lifecycle["Lifecycle Hooks<br/>preload(), setup(), draw()"]
    end

    subgraph ScriptJS["script.js [JavaScript Module]"]
        Config["Configuration<br/>[Variables]<br/>planets, ships,<br/>particles counts"]

        CelestialClass["CelestialObject<br/>[ES6 Class]<br/>Properties: location,<br/>velocity, mass, size<br/>Methods: gravity(),<br/>move(), update(), draw()"]

        Universe["Universe State<br/>[Array]<br/>Holds all object instances"]

        Preload["preload()<br/>[Function]<br/>Loads texture image"]

        Setup["setup()<br/>[Function]<br/>Initializes canvas,<br/>creates objects"]

        Draw["draw()<br/>[Function]<br/>Animation loop,<br/>updates and renders"]

        Physics["Physics Engine<br/>[Methods]<br/>Gravity calculations,<br/>velocity updates,<br/>position updates"]
    end

    P5Lifecycle -->|"Calls at startup"| Preload
    P5Lifecycle -->|"Calls after preload"| Setup
    P5Lifecycle -->|"Calls 60x/sec"| Draw

    Setup -->|"Reads config"| Config
    Setup -->|"Instantiates N times"| CelestialClass
    Setup -->|"Populates with objects"| Universe
    Setup -->|"Uses for canvas"| P5Core

    Draw -->|"Iterates objects"| Universe
    Draw -->|"Calls update() on each"| CelestialClass
    Draw -->|"Calls draw() on each"| CelestialClass
    Draw -->|"Uses for perspective"| P5Core
    Draw -->|"Uses for lighting"| P5WebGL

    CelestialClass -->|"Contains methods"| Physics
    CelestialClass -->|"Uses for vectors"| P5Core
    CelestialClass -->|"Uses for rendering"| P5WebGL

    Physics -->|"Reads all objects"| Universe
    Physics -->|"Calculates forces between"| CelestialClass

    style ScriptJS fill:#1168bd,stroke:#0b4884,color:#ffffff
    style P5JS fill:#999999,stroke:#6b6b6b,color:#ffffff
    style Config fill:#85bbf0,stroke:#5d82a8,color:#000000
    style CelestialClass fill:#85bbf0,stroke:#5d82a8,color:#000000
    style Universe fill:#85bbf0,stroke:#5d82a8,color:#000000
    style Preload fill:#85bbf0,stroke:#5d82a8,color:#000000
    style Setup fill:#85bbf0,stroke:#5d82a8,color:#000000
    style Draw fill:#85bbf0,stroke:#5d82a8,color:#000000
    style Physics fill:#85bbf0,stroke:#5d82a8,color:#000000
```

## Data Flow Diagram

Shows how data flows through the system during runtime.

```mermaid
sequenceDiagram
    participant Browser
    participant HTML
    participant P5.js
    participant Script
    participant CelestialObject
    participant Universe

    Browser->>HTML: Load page
    HTML->>P5.js: Load from CDN
    HTML->>Script: Load script.js

    P5.js->>Script: Call preload()
    Script->>Script: Load texture image

    P5.js->>Script: Call setup()
    Script->>P5.js: createCanvas(WebGL)

    loop Create planets
        Script->>CelestialObject: new CelestialObject(stationary=true)
        Script->>Universe: push(planet)
    end

    loop Create ships
        Script->>CelestialObject: new CelestialObject(stationary=false)
        CelestialObject->>CelestialObject: addThrust()
        Script->>Universe: push(ship)
    end

    loop 60 times per second
        P5.js->>Script: Call draw()
        Script->>P5.js: Set perspective & lighting

        loop For each object
            Script->>Universe: Get object
            Script->>CelestialObject: update(universe)

            loop For each stationary object
                CelestialObject->>CelestialObject: gravity(stationary)
                Note over CelestialObject: Calculate F = G×m1×m2/r²
                Note over CelestialObject: Update velocity
            end

            CelestialObject->>CelestialObject: move()
            Note over CelestialObject: location += velocity

            Script->>CelestialObject: draw()
            CelestialObject->>P5.js: translate(), sphere()
            P5.js->>Browser: Render frame
        end
    end
```

## Deployment Diagram

Shows how the application is deployed and accessed.

```mermaid
graph TB
    subgraph Internet["Internet"]
        CDN1["jsdelivr CDN<br/>[Content Delivery Network]<br/>P5.js library files"]
        CDN2["Glitch CDN<br/>[Content Delivery Network]<br/>Image assets"]
    end

    subgraph WebServer["Static Web Server<br/>(Python/Node.js/Apache/Nginx)"]
        Files["Static Files<br/>index.html<br/>script.js<br/>style.css"]
    end

    subgraph ClientDevice["User's Device"]
        Browser["Web Browser<br/>[Chrome/Firefox/Safari]<br/>WebGL enabled"]
        GPU["GPU<br/>Hardware acceleration<br/>for 3D rendering"]
    end

    Browser -->|"HTTP GET /"| Files
    Browser -->|"HTTP GET<br/>p5.js library"| CDN1
    Browser -->|"HTTP GET<br/>texture image"| CDN2
    Browser -->|"Uses for<br/>3D rendering"| GPU

    style Internet fill:#cccccc,stroke:#999999,color:#000000
    style WebServer fill:#1168bd,stroke:#0b4884,color:#ffffff
    style ClientDevice fill:#08427b,stroke:#052e56,color:#ffffff
    style Files fill:#438dd5,stroke:#2e6295,color:#ffffff
    style Browser fill:#85bbf0,stroke:#5d82a8,color:#000000
    style GPU fill:#85bbf0,stroke:#5d82a8,color:#000000
```


class BoxBody {
    constructor(world, material, angle, mass, x, y, width, height) {
        // Create a p2.js body for the box
        this.body = new p2.Body({
            mass: mass,
            position: [x, y],
            angle: angle,
        });
        const boxShape = new p2.Box({ width: width, height: height, material: material });
        this.body.addShape(boxShape);
        world.addBody(this.body);

        // Create a PixiJS graphics object to represent the box
        this.graphics = new PIXI.Graphics();
        this.graphics.beginFill(0x00FF00); // Green color
        this.graphics.drawRect(-width / 2, -height / 2, width, height);
        this.graphics.endFill();

        // Set the initial position and rotation based on the body
        this.graphics.position.set(x, y);
        this.graphics.rotation = this.body.angle;
    }

    draw() {
        // Update the PixiJS graphics position and rotation based on the p2.js body
        this.graphics.position.set(this.body.position[0], this.body.position[1]);
        this.graphics.rotation = this.body.angle;
    }
}

class CircleBody {
    constructor(world, material, mass, x, y, radius) {
        // Create a p2.js body for the circle
        this.body = new p2.Body({
            mass: mass,
            position: [x, y],
        });
        const circleShape = new p2.Circle({ radius:radius, material: material });
        this.body.addShape(circleShape);
        world.addBody(this.body);

        // Create a PixiJS graphics object to represent the circle
        this.graphics = new PIXI.Graphics();
        this.graphics.beginFill(0x0000FF); // Blue color
        this.graphics.drawCircle(0, 0, radius);
        this.graphics.endFill();

        // Set the initial position and rotation based on the body
        this.graphics.position.set(x, y);
        this.graphics.rotation = this.body.angle;
    }

    draw() {
        // Update the PixiJS graphics position and rotation based on the p2.js body
        this.graphics.position.set(this.body.position[0], this.body.position[1]);
        this.graphics.rotation = this.body.angle;
    }
}

class ConvexBody {
    constructor(world, material, mass, _verticesArray) {
      
      const _convexShape = new p2.Convex({ vertices: _verticesArray });
      const verticesArray = _verticesArray.map(vertex => [
        vertex[0] - _convexShape.centerOfMass[0],
        vertex[1] - _convexShape.centerOfMass[1]
      ]);

      const convexShape = new p2.Convex({ vertices: verticesArray, material: material });

      // Create a p2.js body for the convex shape
      this.body = new p2.Body( {
        mass: mass,
        position: [_convexShape.centerOfMass[0], _convexShape.centerOfMass[1]]
      });

      this.body.addShape(convexShape);
      world.addBody(this.body);

      // Create a PixiJS graphics object to represent the convex shape
      this.graphics = new PIXI.Graphics();
      this.graphics.beginFill(0xFFA500); // Orange color
      this.drawVertices(verticesArray);
      this.graphics.endFill();
    }
  
    drawVertices(verticesArray) {
      if (verticesArray.length < 2) return;
  
      this.graphics.moveTo(verticesArray[0][0], verticesArray[0][1]);
  
      for (let i = 1; i < verticesArray.length; i++) {
        this.graphics.lineTo(verticesArray[i][0], verticesArray[i][1]);
      }
  
      this.graphics.lineTo(verticesArray[0][0], verticesArray[0][1]);
    }
  
    draw() {
      // Update the PixiJS graphics position and rotation based on the p2.js body
      this.graphics.position.set(this.body.position[0], this.body.position[1]);
      this.graphics.rotation = this.body.angle;
    }
  }


class ConcaveBody {
    constructor(world, material, mass, verticesArray) {
      

      // Create a p2.js body for the convex shape
      this.body = new p2.Body( {
        mass: mass,
        position: [0.0, 0.0]
      });
    
      this.body.fromPolygon(verticesArray);
      world.addBody(this.body);
      
      
      const verticesArrayDraw = verticesArray.map(vertex => [
        vertex[0] - this.body.position[0],
        vertex[1] - this.body.position[1]
      ]);

      // Create a PixiJS graphics object to represent the convex shape
      this.graphics = new PIXI.Graphics();
      this.graphics.beginFill(0xFFA500); // Orange color
      this.drawVertices(verticesArrayDraw);
      this.graphics.endFill();
    }
  
    drawVertices(verticesArray) {
      if (verticesArray.length < 2) return;
  
      this.graphics.moveTo(verticesArray[0][0], verticesArray[0][1]);
  
      for (let i = 1; i < verticesArray.length; i++) {
        this.graphics.lineTo(verticesArray[i][0], verticesArray[i][1]);
      }
  
      this.graphics.lineTo(verticesArray[0][0], verticesArray[0][1]);
    }
  
    draw() {
      // Update the PixiJS graphics position and rotation based on the p2.js body
      this.graphics.position.set(this.body.position[0], this.body.position[1]);
      this.graphics.rotation = this.body.angle;
    }
  }

var myView = document.getElementById('myCanvas1');
var myslider = document.getElementById('range_friction');
//var renderer = PIXI.autoDetectRenderer(200, 100, myView); 

// Create the application helper and add its render target to the page
screenH = 400
let app = new PIXI.Application({
  height:screenH,
  backgroundColor: 0xeeeeee, 
  view: myView,
  antialias: true
});

canvasW = app.screen.width
canvasH = app.screen.height
// Set the scale and position to flip the Y-axis and change the origin
app.stage.position.x =0.0; // Adjust the position
app.stage.position.y = canvasH; // Adjust the position
app.stage.scale.y = - 1; // Flip the Y-axis

r = 50
bar_height = r/2
L = 5*r
alpha = Math.PI/3
gamma = 90 - alpha
origin = p2.vec2.fromValues(0.0, 0.0)
dir    = p2.vec2.fromValues(Math.cos(alpha), Math.sin(alpha))
normal    = p2.vec2.fromValues(-Math.sin(alpha), Math.cos(alpha))
console.log(dir)

groundmat = new p2.Material()
boxmat = new p2.Material()

var world = new p2.World({
    gravity:[0, -9.82]
});

const ground = new BoxBody(world, groundmat, 0, 0, origin[0]+canvasW/2, origin[1]+r/2, canvasW, r);

wallposX = origin[0] + canvasW - r
wallposY = origin[1] + r
const wall = new BoxBody(world, groundmat, 0, 0, wallposX+r/2, wallposY+canvasH/2, r, canvasH);

barpos_start = new Vec2(wallposX - L*Math.cos(gamma), wallposY)
bardir = new Vec2(Math.cos(gamma), Math.sin(gamma))
barnormal = new Vec2(-Math.sin(gamma), Math.cos(gamma))
barpos = barpos_start.add(bardir.scale(L/2)).add(barnormal.scale(bar_height/2))
const box1 = new BoxBody(world, boxmat, gamma, 50, barpos[0], barpos[1], L, bar_height);

frictionContactMaterial = new p2.ContactMaterial(groundmat, boxmat, {
  friction: 0.3
});
world.addContactMaterial(frictionContactMaterial);

app.stage.addChild(box1.graphics);
app.stage.addChild(ground.graphics);
app.stage.addChild(wall.graphics);

var fixedTimeStep = 1 / 60; // seconds
var maxSubSteps = 10; // Max sub steps to catch up with the wall clock
elapsed = 0.0
app.ticker.add((delta) => {
    elapsed += delta;

    friction_slider_value = parseFloat(myslider.value)
    frictionContactMaterial.friction = friction_slider_value

    world.step(fixedTimeStep, delta, maxSubSteps);
    
    ground.draw()
    wall.draw()
    box1.draw()
  }
);
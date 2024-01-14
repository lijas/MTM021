
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
        this.graphics.beginFill(0x000000); 
        this.graphics.drawCircle(Math.cos(Math.PI/4)*radius*0.5, Math.sin(Math.PI/4)*radius*0.5, radius/10);
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

function calculateAngleAndCenterOfMass(vertex1, vertex2) {
  // Calculate the angle between two vertices
  const dx = vertex2[0] - vertex1[0];
  const dy = vertex2[1] - vertex1[1];
  const angleRadians = Math.atan2(dy, dx);

  // Calculate the center of mass (centroid) between two vertices
  const centerX = (vertex1[0] + vertex2[0]) / 2;
  const centerY = (vertex1[1] + vertex2[1]) / 2;

  return [
    angleRadians, [centerX, centerY],
  ];
}

class RopeBody {
  constructor(world, vertices, mass_per_segment) {
    this.segments = [];
    this.nsegments = vertices.length - 1
    this.rope_graphics = []

    // Create line segments and revolute joints
    for (let i = 0; i < this.nsegments; i++) {
      const startPos = vertices[i];
      const endPos = vertices[i + 1];
      
      const [angle, centerOfMass] = calculateAngleAndCenterOfMass(startPos, endPos)

      // Create a line segment body
      const segmentBody = new p2.Body({
        mass: mass_per_segment, // Adjust the mass as needed
        position: centerOfMass,
        angle: angle
      });

      const segmentlength = p2.vec2.dist(startPos, endPos) * 0.99
      const segmentShape = new p2.Line({
        length: segmentlength,
      });
      segmentBody.addShape(segmentShape);
      world.addBody(segmentBody);
      this.segments.push(segmentBody);

      //draw the segment
      const graphics = new PIXI.Graphics();
      graphics.lineStyle(2, 0x001110); // Line color and width
      
      graphics.moveTo(-segmentlength/2, 0.0);
      graphics.lineTo(+segmentlength/2, 0.0);
      
      this.rope_graphics.push(graphics)
      segmentBody.gravityScale = 0;
    }

    // Create a revolute joint to connect line segments
    for (let i = 0; i < this.nsegments-1; i++) {
      const revoluteJoint = new p2.RevoluteConstraint(
        this.segments[i],
        this.segments[i + 1],
        {
          //localPivotA: [segmentShape.length / 2, 0],
          //localPivotB: [-segmentShape.length / 2, 0],
          worldPivot: vertices[i+1]
        }
      );
      world.addConstraint(revoluteJoint);
      //revoluteJoint.setStiffness(1000)
    }

  }

  draw() {
    // Update the PixiJS graphics position and rotation based on the p2.js body
    for (let i = 0; i < this.nsegments; i++) {
      this.rope_graphics[i].position.set(this.segments[i].position[0], this.segments[i].position[1]);
      this.rope_graphics[i].rotation = this.segments[i].angle;
    }
  }
}
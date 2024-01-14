
var myView = document.getElementById('myCanvas1');
var myslider = document.getElementById('range1');
var myslider_angle = document.getElementById('range_angle');

// Create the application helper and add its render target to the page
screenH = 400
let app = new PIXI.Application({
  height:screenH,
  backgroundColor: 0xeeeeee, 
  view: myView,
  antialias: true
});

// Set the scale and position to flip the Y-axis and change the origin
app.stage.position.x =0.0; // Adjust the position
app.stage.position.y = app.screen.height; // Adjust the position
app.stage.scale.y = - 1; // Flip the Y-axis

//Create button
buttonW = screenH/11
button = PIXI.Sprite.from('/assets/restart.png');
button.alpha = 0.5
button.width = buttonW*1.0
button.height = buttonW*1.0
button.x = (app.screen.width - button.width) ;
button.y = (app.screen.height - button.height);
button.eventMode = 'static';
button.cursor = 'pointer';
app.stage.addChild(button);
button.on('pointertap', () => console.log('onPress'));

function create_world(app, alpha) {
  app.stage.children.forEach(child => {
      // If the child has a texture, destroy it
      if (child.texture) {
          child.texture.destroy();
      }
      // Destroy the child itself
      child.destroy();
  });
  app.stage.removeChildren();

  canvasW = app.screen.width
  canvasH = app.screen.height
  r = 50
  bar_height = r/5
  L = 10*r
  //alpha = 12 * Math.PI/180
  origin = new Vec2(0.0, 0.0)
  dir = new Vec2(Math.cos(alpha), Math.sin(alpha))
  normal = new Vec2(-Math.sin(alpha), Math.cos(alpha))
  console.log(dir)
  //L = canvasW/Math.cos(alpha)

  var world = new p2.World({
      gravity:[0, -9.82]
  });

  const verticesArray = [
      [origin[0], origin[1]],
      [origin[0] + canvasW, origin[1]],
      [origin[0] + canvasW, Math.tan(alpha)*canvasW],
  ];

  groundmat = new p2.Material()
  boxmat = new p2.Material()
  circlemat = new p2.Material()

  const ground = new ConvexBody(world, groundmat, 0, verticesArray);

  barpos = origin.add( dir.scale(0.7*L) ).add( normal.scale(2*r + bar_height/2) )
  barorigin = barpos.subtract( dir.scale(L/2) )
  barend = barpos.add( dir.scale(L/2) )
  const box1 = new BoxBody(world, boxmat, alpha, 50, barpos[0], barpos[1], L, bar_height);

  triaL = r/2
  v1 = new Vec2(barorigin[0], barorigin[1])
  v2 = v1.subtract(dir.scale(triaL)).add( normal.scale(triaL/2))
  v3 = v1.subtract(dir.scale(triaL)).subtract( normal.scale(triaL/2))
  //Triangle for support
  const verticesArray2 = [
    [v1[0], v1[1]],
    [v2[0], v2[1]],
    [v3[0], v3[1]],
  ];
  const triangle = new ConvexBody(world, groundmat, 0, verticesArray2);
  triangle.body.shapes[0].collisionResponse=false

  circlepos = barend.subtract(normal.scale(r + bar_height/2))
  const circle = new CircleBody(world, circlemat, 50, circlepos[0], circlepos[1], r);

  constraint_pivot = barorigin

  var revolute = new p2.RevoluteConstraint(box1.body, ground.body, {
      worldPivot: [constraint_pivot[0], constraint_pivot[1]]
  });
  world.addConstraint(revolute);


  frictionContactMaterial = new p2.ContactMaterial(groundmat, boxmat, {
      friction: Math.tan(alpha)
  });
  world.addContactMaterial(frictionContactMaterial);

  frictionContactMaterial = new p2.ContactMaterial(boxmat, circlemat, {
      friction: Math.tan(alpha)
  });
  world.addContactMaterial(frictionContactMaterial);


  app.stage.addChild(box1.graphics);
  app.stage.addChild(ground.graphics);
  app.stage.addChild(circle.graphics);
  app.stage.addChild(triangle.graphics);

  const style = new PIXI.TextStyle({
      fontFamily: 'Arial',
      fontSize: 16,
      fill: ['#919191']
  });

  const basicText = new PIXI.Text('µ: ', style);
  basicText.x = 0.0;
  basicText.y = canvasH;
  basicText.scale.y = -1;
  app.stage.addChild(basicText);

  const style2 = new PIXI.TextStyle({
    fontFamily: 'Arial',
    fontSize: 20,
    fill: ['black']
  });
  const basicTextA = new PIXI.Text('A', style2);
  basicTextA.x = barend[0];
  basicTextA.y = barend[1];
  basicTextA.scale.y = -1;
  app.stage.addChild(basicTextA);

  circlebase = barend.subtract(normal.scale(2*r + bar_height/2))
  const basicTextB = new PIXI.Text('B', style2);
  basicTextB.x = circlebase[0];
  basicTextB.y = circlebase[1];
  basicTextB.scale.y = -1;
  app.stage.addChild(basicTextB);

  const basicTextC = new PIXI.Text('C', style2);
  basicTextC.x = v1[0];
  basicTextC.y = v1[1];
  basicTextC.scale.y = -1;
  app.stage.addChild(basicTextC);

  return {world, ground, box1, circle, triangle, frictionContactMaterial, basicText}
}

var current_slider_angle = parseFloat(myslider_angle.value)
var {world, ground, box1, circle, triangle, frictionContactMaterial, basicText} = create_world(app, current_slider_angle*Math.PI/180)

var fixedTimeStep = 1 / 60; // seconds
var maxSubSteps = 10; // Max sub steps to catch up with the wall clock
elapsed = 0.0
app.ticker.add((delta) => {
    elapsed += delta;

    friction_slider_value = parseFloat(myslider.value)
    angle_slider_value = parseFloat(myslider_angle.value)

    if(angle_slider_value != current_slider_angle){
      console.log(angle_slider_value)
      console.log(current_slider_angle)
      current_slider_angle = angle_slider_value;
      ({world, ground, box1, circle, triangle, frictionContactMaterial, basicText} = create_world(app, current_slider_angle*Math.PI/180));
    }

    basicText.text = "µ: " + friction_slider_value.toString() + "\nJämvikt: Ja"
    
    frictionContactMaterial.friction = friction_slider_value

    world.step(fixedTimeStep, delta, maxSubSteps);
    ground.draw()
    box1.draw()
    circle.draw()
    triangle.draw()
  }
);
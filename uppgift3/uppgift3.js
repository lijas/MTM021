
function rope_vertices(b1h, b1w, b2h, b2w, t1x, t2x, r1, r2, L, dL, alpha) {

  const vertices = []
  //
  var i1_L = t2x - (L/2 + b2w/2) 
  var N = Math.ceil(i1_L/dL)
  dL1 = i1_L/N
  for(let i=0; i<N+1; i++) {
    var _x = (L/2 + b2w/2) + i*dL1
    var v = new Vec2(_x, b1h + b2h/2)
    vertices.push(v)
  }
  
  //Radius trissa 2
  var t2y = (b1h + b2h/2) - r2 //ycoord of trissa 1
  var i2_L = r2 * Math.PI
  N = Math.ceil(i2_L/dL)
  for(let i=0; i<N+1; i++) {
    var a = (i/N) * Math.PI
    var _x = t2x + (Math.sin(a)*r2)
    var _y = t2y + (Math.cos(a)*r2)
    var v = new Vec2(_x, _y)
    vertices.push(v)
  }

  //Interval 2
  //
  var t1y = box1h/2
  var i3_L = t2x - t1x
  N = Math.ceil(i3_L/dL)
  dL3 = i3_L/N
  for(let i=0; i<N+1; i++) {
    var _x = t2x - i*dL3
    var v = new Vec2(_x, t2y-r2)
    vertices.push(v)
  }

  //Radius trissa 1
  var i4_L = r1 * Math.PI
  N = Math.ceil(i4_L/dL)
  for(let i=0; i<N+1; i++) {
    var a = (i/N) * Math.PI
    var _x = t1x - (Math.sin(a)*r1)
    var _y = t1y + (Math.cos(a)*r1)
    var v = new Vec2(_x, _y)
    vertices.push(v)
  }

  //
  var i5_L = t2x - (t1x) 
  var N = Math.ceil(i5_L/dL)
  dL5 = i5_L/N
  for(let i=0; i<N+1; i++) {
    var _x = t1x + i*dL5
    var v = new Vec2(_x, t1y - r1)
    vertices.push(v)
  }

  for(var i=0; i<vertices.length; i++){
    vertices[i] = vertices[i].rotate(alpha);
  }

  console.log(vertices.length)
  return vertices
}

var myView = document.getElementById('myCanvas1');
var mass1_slider = document.getElementById('range_mass1');
var mass2_slider = document.getElementById('range_mass2');
box_mass1 = parseFloat(mass1_slider.value)
box_mass2 = parseFloat(mass2_slider.value)
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

canvasW = app.screen.width
canvasH = app.screen.height
r = 50
box1h = 50;
box1w = box1h*3
box2h = box1h;
box2w = box2h
radius_trissa1 = box1h / 4
radius_trissa2 = (box1h + box2h/2 - (box1h/2 + radius_trissa1))/2
bar_height = r/5
L = 10*r
circle1x = L/2 + box1w/2 + radius_trissa1*2;
circle2x = L

alpha = 20 * Math.PI/180
origin = new Vec2(0.0, 0.0)
dir = new Vec2(Math.cos(alpha), Math.sin(alpha))
normal = new Vec2(-Math.sin(alpha), Math.cos(alpha))

groundmat = new p2.Material()
boxmat = new p2.Material()
trissamat = new p2.Material()

var world = new p2.World({
    gravity:[0, -9.82]
});

//
// Ground
const verticesArray = [
  [origin[0], origin[1]],
  [origin[0] + canvasW, origin[1]],
  [origin[0] + canvasW, Math.tan(alpha)*canvasW],
];
const ground = new ConvexBody(world, groundmat, 0, verticesArray);

//
// Box
box1pos = origin.add(dir.scale(L/2)).add(normal.scale(box1h/2))
const box1 = new BoxBody(world, boxmat, alpha, box_mass1, box1pos[0], box1pos[1], box1w, box1h);

//
// Box
box2pos = origin.add(dir.scale(L/2)).add(normal.scale(box1h + box2h/2))
const box2 = new BoxBody(world, boxmat, alpha, box_mass2, box2pos[0], box2pos[1], box2w, box2h);

//
// Trissa 1 on box1
circle1pos = origin.add(dir.scale(circle1x)).add(normal.scale(box1h/2))
const circle1 = new CircleBody(world, trissamat, 0.01, circle1pos[0], circle1pos[1], radius_trissa1);

//
// Trissa 2
circle2pos = origin.add(dir.scale(circle2x)).add(normal.scale(box1h/2 + radius_trissa1 + radius_trissa2))
const circle2 = new CircleBody(world, trissamat, 0.01, circle2pos[0], circle2pos[1], radius_trissa2);

//
// Rope
rope_start = box2pos.add( dir.scale(box2w/2) )
rope_end = origin.add( dir.scale(circle2x) ).add( normal.scale(box1h/2 - radius_trissa1) )
dL = radius_trissa1/2
rope_verts = rope_vertices(box1h, box1w, box2h, box2w, circle1x, circle2x, radius_trissa1, radius_trissa2, L, dL, alpha)
const rope = new RopeBody(world, rope_verts, 0.01); // Adjust segmentWidth and segmentHeight as needed



//
// Revoulute join box1 and trissa
const rj_box1_trissa1 = new p2.RevoluteConstraint(
  box1.body,
  circle1.body,
  {
    //localPivotA: [segmentShape.length / 2, 0],
    //localPivotB: [-segmentShape.length / 2, 0],
    worldPivot: circle1pos
  }
);
world.addConstraint(rj_box1_trissa1);

//
//
// Revoulute join trissa2 to ground
const rj_box1_trissa2 = new p2.RevoluteConstraint(
  circle2.body,
  ground.body,
  {
    //localPivotA: [segmentShape.length / 2, 0],
    //localPivotB: [-segmentShape.length / 2, 0],
    worldPivot: circle2pos
  }
);
world.addConstraint(rj_box1_trissa2);

//
//
// Revoulute join box2 with start rope
const rj3 = new p2.RevoluteConstraint(
  box2.body,
  rope.segments[0],
  {
    //localPivotA: [segmentShape.length / 2, 0],
    //localPivotB: [-segmentShape.length / 2, 0],
    worldPivot: rope_start
  }
);
world.addConstraint(rj3);

//
//
// Revoulute join box2 with start rope
console.log(rope.segments.length)
const rj4 = new p2.RevoluteConstraint(
  ground.body,
  rope.segments[rope.segments.length-1],
  {
    //localPivotA: [segmentShape.length / 2, 0],
    //localPivotB: [-segmentShape.length / 2, 0],
    worldPivot: rope_end
  }
);
world.addConstraint(rj4);

//Material friction
const frictionContactMaterial1 = new p2.ContactMaterial(boxmat, boxmat, {
  friction: 0.15
});
world.addContactMaterial(frictionContactMaterial1);

const frictionContactMaterial2 = new p2.ContactMaterial(groundmat, boxmat, {
  friction: 0.15
});
world.addContactMaterial(frictionContactMaterial2);

app.stage.addChild(box2.graphics);
app.stage.addChild(box1.graphics);
app.stage.addChild(ground.graphics);
app.stage.addChild(circle1.graphics);
app.stage.addChild(circle2.graphics);
for(let i=0; i<rope.nsegments; i++){
  app.stage.addChild(rope.rope_graphics[i]);
}

var fixedTimeStep = 1 / 60 / 4; // seconds
var maxSubSteps = 4*10; // Max sub steps to catch up with the wall clock
elapsed = 0.0
app.ticker.add((delta) => {
    elapsed += delta;

    mass1_slider_value = parseFloat(mass1_slider.value)
    mass2_slider_value = parseFloat(mass2_slider.value)
    box1.body.mass = mass1_slider_value
    box2.body.mass = mass2_slider_value

    box1.body.updateMassProperties();
    box2.body.updateMassProperties();

    console.log(box1.body.mass/box2.body.mass)

    world.step(fixedTimeStep, delta, maxSubSteps);
    
    ground.draw()
    box1.draw()
    box2.draw()
    rope.draw()
    circle1.draw()
    circle2.draw()
  }
);
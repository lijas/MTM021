
var myView = document.getElementById('myCanvas1');
var angle_slider = document.getElementById('vinkel');
angle = parseFloat(angle_slider.value) * Math.PI/180

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

box1h = 30
box1w = box1h*3
L = canvasW / 2.0
H = L/20

alpha = 20 * Math.PI/180
origin = new Vec2(0.0, 0.0)
dir = new Vec2(Math.cos(alpha), Math.sin(alpha))
normal = new Vec2(-Math.sin(alpha), Math.cos(alpha))

//
// Ground
// Create a PixiJS graphics object to represent the box
ground_pos = origin.add( dir.scale(L/2) )

ground_g = new PIXI.Graphics();
ground_g.beginFill(0x00FF00); // Green color
ground_g.drawRect(-L / 2, -H / 2, L, H);
ground_g.endFill();
ground_g.position.set(ground_pos[0], ground_pos[1]);
ground_g.rotation = angle;

//
// Box
box_pos = origin.add( dir.scale(L/2) ).add( normal.scale(H/2 + box1h/2))
box_g = new PIXI.Graphics();
box_g.beginFill(0x00FF00); // Green color
box_g.drawRect(-box1w / 2, -box1h / 2, box1w, box1h);
box_g.endFill();
box_g.position.set(box_pos[0], box_pos[1]);
box_g.rotation = angle;

app.stage.addChild(box_g);
app.stage.addChild(ground_g);

app.ticker.add((delta) => {

    angle = parseFloat(angle_slider.value)
    
  }
);
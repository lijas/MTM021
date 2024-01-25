
var myView = document.getElementById('myCanvas1');
var angle_slider = document.getElementById('vinkel');
var vinkel_text = document.getElementById('text_vinkel');
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

box1h = 90
box1w = box1h
L = canvasW / 1.3
H = L/30

alpha = 20 * Math.PI/180
origin = new Vec2(0.0, 0.0)
dir = new Vec2(Math.cos(alpha), Math.sin(alpha))
normal = new Vec2(-Math.sin(alpha), Math.cos(alpha))

//
// Ground
// Create a PixiJS graphics object to represent the box
ground_g = new PIXI.Graphics();
ground_g.beginFill(0x043047); 
ground_g.drawRect(-L / 2, -H / 2, L, H);
ground_g.endFill();

//
// Box
box_g = new PIXI.Graphics();
box_g.beginFill(0x0794e0); // Green color
box_g.drawRect(-box1w / 2, -box1h / 2, box1w, box1h);
box_g.endFill();

line1 = new PIXI.Graphics();

line2 = new PIXI.Graphics();

line3 = new PIXI.Graphics();


semicircle = new PIXI.Graphics();

semicircle2 = new PIXI.Graphics();

const style = new PIXI.TextStyle({
  fontFamily: 'Arial',
  fontSize: 20,
  fill: ['black']
});
const basicText1 = new PIXI.Text('α', style);
basicText1.anchor.set(0.5, 0.5);
basicText1.scale.y = -1;

const basicText2 = new PIXI.Text('α', style);
basicText2.anchor.set(0.5, 0.5);
basicText2.scale.y = -1;

app.stage.addChild(box_g);
app.stage.addChild(ground_g);
app.stage.addChild(line1);
app.stage.addChild(line2);
app.stage.addChild(line3);
app.stage.addChild(semicircle);
app.stage.addChild(semicircle2);
app.stage.addChild(basicText1);
app.stage.addChild(basicText2);

function update_pos(angle){

  origin = new Vec2(0.0, 0.0)
  dir = new Vec2(Math.cos(angle), Math.sin(angle))
  normal = new Vec2(-Math.sin(angle), Math.cos(angle))

  ground_corner_pos = origin.add( new Vec2(L/5, canvasH/10) )
  ground_pos = ground_corner_pos.add( dir.scale(L/2) ).add( normal.scale(H/2))
  ground_g.position.set(ground_pos[0], ground_pos[1]);
  ground_g.rotation = angle;

  box_pos = ground_corner_pos.add( dir.scale(L/2 + box1w/5) ).add( normal.scale(H/2 + box1h/2))
  box_g.position.set(box_pos[0], box_pos[1]);
  box_g.rotation = angle;

  //semicircle.beginFill(0xff0000);
  semicircle.clear();
  semicircle.lineStyle(2, 0x333333);
  semicircle.arc(0, 0, box1h, -Math.PI/2, angle-Math.PI/2); // cx, cy, radius, startAngle, endAngle
  semicircle.position.set(box_pos[0], box_pos[1])

  semicircle2.clear();
  semicircle2.lineStyle(2, 0x333333);
  semicircle2.arc(0, 0, box1h, 0.0, angle); // cx, cy, radius, startAngle, endAngle
  semicircle2.position.set(ground_corner_pos[0], ground_corner_pos[1])

  line1.clear();
  line1.lineStyle(2, 0x707070); // Line color and width
  line1.moveTo(box_pos[0], -2*canvasH);
  line1.lineTo(box_pos[0], 2*canvasH);

  line2.clear();
  line2.lineStyle(2, 0x707070); // Line color and width
  line2.moveTo(-2*canvasW,ground_corner_pos[1]);
  line2.lineTo(2*canvasW, ground_corner_pos[1]);

  line3_start = box_pos.add( normal.scale(canvasH) )
  line3_stop = box_pos.add( normal.scale(-canvasH) )
  line3.clear();
  line3.lineStyle(2, 0x707070); // Line color and width
  line3.moveTo(line3_start[0], line3_start[1]);
  line3.lineTo(line3_stop[0], line3_stop[1]);

  normal_half = new Vec2(-Math.sin(angle/2), Math.cos(angle/2))
  text1pos = box_pos.add( normal_half.scale(-box1h*1.2))
  basicText1.position.set(text1pos[0], text1pos[1])

  dir_half = new Vec2(Math.cos(angle/2), Math.sin(angle/2))
  text1pos = ground_corner_pos.add( dir_half.scale(box1h*1.2))
  basicText2.position.set(text1pos[0], text1pos[1])
}

update_pos(angle)

prev_angle = angle-1
app.ticker.add((delta) => {

    angle = parseFloat(angle_slider.value) * Math.PI/180
    if(angle != prev_angle){
      vinkel_text.innerHTML = "Vinkel: " + String(Math.round(angle * 180/Math.PI)) + "°"
      update_pos(angle)
      prev_angle = angle
    }
  }
);
const Render = Matter.Render;
const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Body = Matter.Body;
const Constraint = Matter.Constraint;
const Composites = Matter.Composites;
const Composite = Matter.Composite;


var engine, world;
var canvas;
var palyer, playerBase, playerArcher;
var fruit,food,brokenfruit,brokenfruitimg,fruit_con,fruit_con_2
var playerArrows = [];
var numberOfArrows = 1;


function preload() {
  backgroundImg = loadImage("./assets/background.png");
  food = loadImage("./assets/melon.png")
  brokenfruitimg = loadImage("./assets/Brokenmelon.png")
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);

  engine = Engine.create();
  world = engine.world;

  playerBase = new PlayerBase(300, 500, 180, 150);
  player = new Player(285, playerBase.body.position.y - 153, 50, 180);
  playerArcher = new PlayerArcher(340,playerBase.body.position.y - 180,120,120);

  rope = new Rope(7,{x:windowWidth - 400,y:90});
  rope2 = new Rope(7,{x:windowWidth - 430,y:600});

  fruit = Bodies.circle(windowWidth - 400,200,20);
  Matter.Composite.add(rope.body,fruit);

  fruit_con = new Link(rope,fruit);
  fruit_con_2 = new Link(rope2,fruit);

  brokenfruit = Bodies.circle(windowWidth - 400,300,20)

}

function draw() {
  background(backgroundImg);

  Engine.update(engine);

  playerBase.display();
  player.display();
  playerArcher.display();


  rope.show()
  rope2.show()

  if(fruit!=null){
    image(food,fruit.position.x,fruit.position.y,70,70);
  }

  for (var i = 0; i < playerArrows.length; i++) {
    if (playerArrows[i] !== undefined) {
      playerArrows[i].display()

      var posX = playerArrows[i].body.position.x;
      var posY = playerArrows[i].body.position.y;

      if (posX > width || posY > height) {
        if (!playerArrows[i].isRemoved) {
          fill("#FFFF");
         textAlign("center");
         textSize(40);
          text("Game Over",800,400);
        } else {
          playerArrows[i].trajectory = [];
        }
      }

      if(collide(playerArrows[i].body,fruit) == true){
       World.remove(world,fruit)
       playerArrows[i].remove(i)
       fruit = null
       rope.break()
       rope2.break()
      }
      
     
      }
    
    }

 if(fruit == null){
    image(brokenfruitimg,brokenfruit.position.x,brokenfruit.position.y,70,70)
      fill("#FFFF");
       textAlign("center");
       textSize(40);
       text("You Won",800,400);
  }

  
  fill("#FFFF");
  textAlign("center");
  textSize(40);
  text("EPIC ARCHERY", width / 2, 100);


  fill("#FFFF");
  textAlign("center");
  textSize(30);
  text("Remaining Arrows : " + numberOfArrows, 200, 100);

}
 

function keyPressed() {
  if (keyCode === 32) {
    if (numberOfArrows > 0) {
      var posX = playerArcher.body.position.x;
      var posY = playerArcher.body.position.y;
      var angle = playerArcher.body.angle;

       var arrow = new PlayerArrow(posX, posY, 100, 10, angle);

      arrow.trajectory = [];
      Matter.Body.setAngle(arrow.body, angle);
      playerArrows.push(arrow);
      numberOfArrows -= 1;
    }
  }
}

function keyReleased() {
  if (keyCode === 32) {
    if (playerArrows.length) {
      var angle = playerArcher.body.angle;
      playerArrows[playerArrows.length - 1].shoot(angle);
    }
  }
}

function collide(object1,sprite)
{
  if(sprite!=null && object1 !=null)
        {
         var d = dist(object1.position.x,object1.position.y,sprite.position.x,sprite.position.y);
          if(d<=80)
            {
               return true; 
            }
            else{
              return false;
            }
         }
}


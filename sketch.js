var dog;
var database, food, foodStock, lastFed;

function preload() {
    dogIMG = loadImage("dog.png");
    dogIMG2 = loadImage("dog2.png");
    //foodIMG = loadImage("food.png");
}

function setup(){
    createCanvas(500,500);

    database = firebase.database();

    foodObj = new Food();

    // food = createSprite(250, 50, 30, 30);
    // food.addImage(foodIMG);
    // food.scale = 0.4;

    

    foodStock = database.ref('Food');
    foodStock.on("value",readStock);

    dog = createSprite(250,250,10,10);
    dog.addImage(dogIMG);

    feed = createButton("feed the dog");
    feed.position(300, 95);
    feed.mousePressed(feedDog)

    addfood = createButton("add Food");
    addfood.position(400, 95);
    addfood.mousePressed(addFoods);

}

function draw(){
    background("yellow");
    fill("red");

    fedTime = database.ref('FeedTime')
    fedTime.on("value", function(data){
        lastFed = data.val();
    })

    foodObj.display();

    drawSprites();

    textSize(15);

    if(lastFed >= 12) {
      text("last Fed = " + lastFed % 12 + "PM", 350, 30);
    }
    else if(lastFed === 0) {
      text("last Fed = 12 AM", 350, 30);
    }
    else {
      text("last Fed = " + lastFed + "AM", 350, 30);
    }

    text(foodStock, 250, 450);
}
function readStock(data) {
    foodStock = data.val();
    foodObj.updateFoodStock(foodStock);
}

function writeStock(x) {

    if(x <= 0) {
      x = 0;
    }
    else {
        x = x - 1
    }

    database.ref('/').update({
        foodStock:x,
    })
}

function feedDog() {
    dog.addImage(dogIMG2);

    foodObj.updateFoodStock(foodObj.getFoodStock() - 1);
    database.ref('/').update({
        Food:foodObj.getFoodStock(),
        FeedTime:hour()
    });
}

function addFoods() {
    foodStock++;
    database.ref('/').update({
        Food:foodStock
    });
}
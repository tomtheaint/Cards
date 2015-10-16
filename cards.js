var myId=0;

var land;

var tank;

var player;
var chipList;

var logo;

var hand;
var card;

var cursors;

var bullets;
var fireRate = 100;
var nextFire = 0;

var ready = false;
var eurecaServer;
//this function will handle client communication with the server
var eurecaClientSetup = function() {
	//create an instance of eureca.io client
	var eurecaClient = new Eureca.Client();
	
	eurecaClient.ready(function (proxy) {		
		eurecaServer = proxy;
	});
	
	//eurecaServer.testText();
	
	//methods defined under "exports" namespace become available in the server side
	
	eurecaClient.exports.setId = function(id) 
	{
		//create() is moved here to make sure nothing is created before uniq id assignation
		myId = id;
		create();
		eurecaServer.handshake();
		ready = true;
		//eurecaServer.exports.testText();
	}	

}

Card = function (name) {
	
	var cName = name;
	var x = 0;
	var y = 0;
	var cardImage;

	//cardImage = game.add.sprite(400, 200, 'ace');
	//cardImage.scale.setTo(.1,.1);
	//cardImage.inputEnabled = true;
	//cardImage.input.enableDrag();

	//cardImage = game.add.bitmapData(100,100);
	
	//cardImage.fill(10,0,0,1);
	
	//cardImage.addToWorld(200,200);
	
	var imageGroup;
	var imageText;
	
	var graphic = game.add.graphics(-300,-300);
	graphic.beginFill(0xcccccc);
	graphic.lineStyle(10, 0xffd900, 1);
	graphic.lineTo(0, 0);
    graphic.lineTo(200, 0);
    graphic.lineTo(200, 300);
    graphic.lineTo(0, 300);
    graphic.lineTo(0, 0);
    graphic.endFill();
	
	
	
	imageText = game.add.text(25,25,cName,{font:"bold 20px Arial",fill:"#000"});
	
	
	cardImage = game.add.sprite(200,200, graphic.generateTexture());
	cardImage.addChild(imageText);
	cardImage.inputEnabled = true;
	cardImage.input.enableDrag();
	
	
};

Hex2 = function () {
	
	var imageGroup;
	
	var cardImage;
	var graphic = game.add.graphics(-300,-300);
	//graphic.beginFill(0xcccccc);
	graphic.lineStyle(2, 0x000000, 2);
	graphic.lineTo(300, 232);
    graphic.lineTo(250, 232);
    graphic.lineTo(225, 275);
    graphic.lineTo(250, 318);
    graphic.lineTo(300, 318);
	graphic.lineTo(325, 275);
	graphic.lineTo(300, 232);
    graphic.endFill();
	
	var WORLDX = 33;
var WORLDY = 16;
var TILESIZEX = 100;
var TILESIZEY = 86;
 
var offsetY = 0;    // odd columns are pushed down half a row
var spacingX = TILESIZEX * 0.75;
for (y = 0; y <= WORLDY; y++) {
    for (x = 0; x <= WORLDX; x++) {
        if ((x % 2) == 1) {
            offsetY = TILESIZEY * 0.5;
        } else {
            offsetY = 0;
        }
 
        // load a sprite for this tile
			
	cardImage = game.add.sprite(x * spacingX, (y * TILESIZEY) + offsetY, graphic.generateTexture());
		
		
        //var s = this.pGroup.create(x * spacingX, (y * TILESIZEY) + offsetY, cardImage);
        //s.anchor.setTo(0.5, 0.5);
		cardImage.anchor.setTo(0.5, 0.5);
    }
}
	
};

Hex = function () {
	
	
	var x = 0;
	var y = 0;
	

	//cardImage = game.add.sprite(400, 200, 'ace');
	//cardImage.scale.setTo(.1,.1);
	//cardImage.inputEnabled = true;
	//cardImage.input.enableDrag();

	//cardImage = game.add.bitmapData(100,100);
	
	//cardImage.fill(10,0,0,1);
	
	//cardImage.addToWorld(200,200);
	
	var imageGroup;
	
	var cardImage;
	var scale = (1/3);
	var graphic = game.add.graphics(200,200);
	//graphic.beginFill(0xcccccc);
	graphic.lineStyle(2, 0x000000, 2);
	graphic.lineTo(300, 232);
    graphic.lineTo(250, 232);
    graphic.lineTo(225, 275);
    graphic.lineTo(250, 318);
    graphic.lineTo(300, 318);
	graphic.lineTo(325, 275);
	graphic.lineTo(300, 232);
    graphic.endFill();
	cardImage = game.add.sprite(100,100, graphic.generateTexture());
	cardImage.inputEnabled = true;
	cardImage.input.enableDrag();
	
	
};

Chip = function (pFP, pRange, pMorale, pElite, pColor) {
	
	var color = pColor;
	var elite = pElite;
	var firePower = pFP;
	var range = pRange;
	var morale = pMorale;
	//var cName = name;
	var x = 0;
	var y = 0;
	var cardImage;

	//cardImage = game.add.sprite(400, 200, 'ace');
	//cardImage.scale.setTo(.1,.1);
	//cardImage.inputEnabled = true;
	//cardImage.input.enableDrag();

	//cardImage = game.add.bitmapData(100,100);
	
	//cardImage.fill(10,0,0,1);
	
	//cardImage.addToWorld(200,200);
	
	var imageGroup;
	var statText,imageText2,imageText3;
	
	var graphic = game.add.graphics(-300,-300);
	graphic.beginFill(color);
	graphic.lineStyle(1, 0xcccccc, 1);
	graphic.lineTo(0, 0);
    graphic.lineTo(75, 0);
    graphic.lineTo(75, 75);
    graphic.lineTo(0, 75);
    graphic.lineTo(0, 0);
    graphic.endFill();
	
	
	var art;
	art = game.add.sprite(11,11,'mmc');
	
	statText = game.add.text(27,70,firePower + "-" + range + "-" + morale,{font:"bold 15px Lucida Console",fill:"#000"});
	//imageText2 = game.add.text(70,10,"",{font:"bold 15px Arial",fill:"#000"});
	

	imageText3 = game.add.text(27,71,"_ _ _",{font:"bold 15px Lucida Console",fill:"#000"});
	
	
	cardImage = game.add.sprite(game.rnd.integerInRange(0, 500),game.rnd.integerInRange(0, 500), graphic.generateTexture());
	//cardImage = game.add.sprite(0,0, graphic.generateTexture());
	cardImage.addChild(art);
	
	cardImage.addChild(statText);
	if (elite==true){
	imageText2 = game.add.text(70,13,"E",{font:"bold 15px Lucida Console",fill:"#000"});
	cardImage.addChild(imageText2);
	};
	
	cardImage.addChild(imageText3);
	cardImage.addChild(imageText3);
	
	cardImage.anchor.setTo(0,0);
	
	cardImage.inputEnabled = true;
	cardImage.input.enableDrag();
	//cardImage.input.enableSnap(5,5,false,true);
	
	//cardImage.scale(.5,.5);
	cardImage.events.onDragStop.add(report, this);
	
};

function report(item, pointer){
	//eurecaServer.handleKeys(this.input);
	//console.log("hi");
	eurecaServer.testText();
	//alert(item.x);
};


var game = new Phaser.Game(2332, 794, Phaser.AUTO, 'phaser-example', { preload: preload, create: eurecaClientSetup, update: update, render: render });

function preload () {
    game.load.image('logo', 'Graphics/logo.png');
    game.load.image('table', 'Graphics/bg.png');
	game.load.image('ace', 'Graphics/ace.png');
    game.load.image('sgt', 'Graphics/sgt.png');
	game.load.image('mmc', 'Graphics/mmc.png');
	game.load.image('board', 'Graphics/board.png');
	game.load.image('map', 'Graphics/map.png');
}



function create () {

    //  Resize our game world to be a 2000 x 2000 square
    game.world.setBounds(0, 0, 2332, 794);
	game.stage.disableVisibilityChange  = true;
	
    //  Our tiled scrolling background
    land = game.add.tileSprite(0, 0, 2332, 794, 'board');
	//land = game.add.tileSprite(0, 0, 1261*2, 700*2, 'map');
	//land.scale.x = 2.25;
	//land.scale.y = 2;
    land.fixedToCamera = true;
    
    chipList = {};
	
	player = new Chip(game.rnd.integerInRange(2, 8),game.rnd.integerInRange(2, 8),game.rnd.integerInRange(2, 8),game.rnd.integerInRange(0, 1), "0x0099ff");
	chipList[myId] = player;
	
	
	
    logo = game.add.sprite(300, 300, 'logo');
    logo.fixedToCamera = true;

    game.input.onDown.add(removeLogo, this);

    game.camera.follow(tank);
    game.camera.deadzone = new Phaser.Rectangle(150, 150, 500, 300);
    game.camera.focusOnXY(0, 0);

    cursors = game.input.keyboard.createCursorKeys();
	
	setTimeout(removeLogo, 1000);


	
	//var card2 = new Card("Ace");
	//var card3 = new Card("Dog");
	//var card4 = new Card("Cat");
	
	//var card1 = new Card("Pirate");
	//var hex2 = new Hex2();
	for (var i = 0; i<0; i++){
		var hex1 = new Chip(game.rnd.integerInRange(2, 8),game.rnd.integerInRange(2, 8),game.rnd.integerInRange(2, 8),game.rnd.integerInRange(0, 1), "0x0099ff");
	}
	for (var i = 0; i<0; i++){
		var hex1 = new Chip(game.rnd.integerInRange(2, 8),game.rnd.integerInRange(2, 8),game.rnd.integerInRange(2, 8),game.rnd.integerInRange(0, 1), "0x66cc66");
	}
	
	//eurecaServer.testText();
}

function removeLogo () {
    game.input.onDown.remove(removeLogo, this);
    logo.kill();
}

function update () {
	//do not update if client not ready
	if (!ready) return;
		
}


function render () {}


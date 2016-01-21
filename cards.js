var myId=0;

var land;

//var tank;
var chip2;

var player;
var chipList;
var markerList;

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
	
	eurecaClient.exports.kill = function(id)
	{	
		if (chipList[id]) {
			chipList[id].kill();
			console.log('killing ', id, chipList[id]);
		}
	}

	eurecaClient.exports.spawnChips = function(i, x, y)
	{
		
		if (i == myId) return; //this is me
		
		console.log('SPAWN');
		var tnk = new Chip2(i, game, chip2);
		chipList[i] = tnk;
	}	
	eurecaClient.exports.updateState = function(id, state)
	{
		if (chipList[id])  {
			chipList[id].cursor = state;
			chipList[id].chip2.x = state.x;
			chipList[id].chip2.y = state.y;
			chipList[id].update();
		}
	}

}

Card = function (name) {
	
	var cName = name;
	var x = 0;
	var y = 0;
	var cardImage;

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

Chip2 = function (index, game, player) {
	this.cursor = {
		left:false,
		right:false,
		up:false,
		fire:false		
	}

	this.input = {
		left:false,
		right:false,
		up:false,
		fire:false
	}
	
	
	var x = 0;
    var y = 0;

    this.game = game;
    this.player = player;
	this.alive = true;
	//this.chip2 = game.add.sprite(x, y, 'mmc');
	this.chip2 = new createChip();
	this.chip2.anchor.set(0);
	
	this.chip2.id = index;
	
	
	
};

Chip2.prototype.update = function() {
	
	var inputChanged = (
		this.cursor.left != this.input.left ||
		this.cursor.right != this.input.right ||
		this.cursor.up != this.input.up ||
		this.cursor.fire != this.input.fire
	);
	
	
	if (inputChanged)
	{
		//Handle input change here
		//send new values to the server		
		if (this.chip2.id == myId)
		{
			// send latest valid state to the server
			this.input.x = this.chip2.x;
			this.input.y = this.chip2.y;

			
			
			eurecaServer.handleKeys(this.input);
			
		}
	}
};

Chip2.prototype.kill = function() {
	
	this.alive = false;
	this.chip2.kill();
}

createChip = function () {
	
	
	//player = new Chip(game.rnd.integerInRange(2, 8),game.rnd.integerInRange(2, 8),game.rnd.integerInRange(2, 8),game.rnd.integerInRange(0, 1), "0x0099ff");
	var color = "0x0099ff";
	var elite = game.rnd.integerInRange(0, 1);
	var firePower = game.rnd.integerInRange(2, 8);
	var range = game.rnd.integerInRange(2, 8);
	var morale = game.rnd.integerInRange(2, 8);
	//var cName = name;
	var x = 0;
	var y = 0;
	var cardImage;
	
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
	
	//this.chip3 = game.add.sprite(50,50, graphic.generateTexture());
	
	
	var art;
	art = game.add.sprite(11,11,'mmc');
	
	statText = game.add.text(27,70,firePower + "-" + range + "-" + morale,{font:"bold 15px Lucida Console",fill:"#000"});
	//imageText2 = game.add.text(70,10,"",{font:"bold 15px Arial",fill:"#000"});
	

	imageText3 = game.add.text(27,71,"_ _ _",{font:"bold 15px Lucida Console",fill:"#000"});
	
	
	cardImage = game.add.sprite(-300,-300, graphic.generateTexture());
	//this.chip3 = game.add.sprite(0,0, graphic.generateTexture());
	
	//this.chip = cardImage;
	cardImage = game.add.sprite(0,0, graphic.generateTexture());
	
	
	cardImage.addChild(art);
	
	cardImage.addChild(statText);
	if (elite==true){
	imageText2 = game.add.text(70,13,"E",{font:"bold 15px Lucida Console",fill:"#000"});
	cardImage.addChild(imageText2);
	};
	
	cardImage.addChild(imageText3);
	cardImage.addChild(imageText3);
	
	return cardImage;
	
};

Chip = function (index, game, player) {
	
	this.cursor = {
		left:false,
		right:false,
		up:false,
		fire:false		
	}

	this.input = {
		left:false,
		right:false,
		up:false,
		fire:false
	}
	
	//player = new Chip(game.rnd.integerInRange(2, 8),game.rnd.integerInRange(2, 8),game.rnd.integerInRange(2, 8),game.rnd.integerInRange(0, 1), "0x0099ff");
	var color = "0x0099ff";
	var elite = 1;
	var firePower = 1;
	var range = 1;
	var morale = 1;
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
	
	this.game = game;
    this.player = player;
	this.alive = true;
	//this.chip = game.add.sprite(0, 0, 'mmc');
	//this.chip2.anchor.set(0);
	
	this.chip.id = index;
	
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
	
	
	cardImage = game.add.sprite(0,0, graphic.generateTexture());
	//this.chip = cardImage;
	//cardImage = game.add.sprite(0,0, graphic.generateTexture());
	cardImage.addChild(art);
	
	cardImage.addChild(statText);
	if (elite==true){
	imageText2 = game.add.text(70,13,"E",{font:"bold 15px Lucida Console",fill:"#000"});
	cardImage.addChild(imageText2);
	};
	
	cardImage.addChild(imageText3);
	cardImage.addChild(imageText3);
	//cardImage.anchor.setTo(0,0);
	
	//cardImage.inputEnabled = true;
	//cardImage.input.enableDrag();
	//cardImage.input.enableSnap(5,5,false,true);
	
	//cardImage.scale(.5,.5);
	//cardImage.events.onDragStop.add(report, this);
	
};

Chip.prototype.update = function() {
	
	var inputChanged = (
		this.cursor.left != this.input.left ||
		this.cursor.right != this.input.right ||
		this.cursor.up != this.input.up ||
		this.cursor.fire != this.input.fire
	);
	
	
	if (inputChanged)
	{
		//Handle input change here
		//send new values to the server		
		if (this.chip.id == myId)
		{
			// send latest valid state to the server
			this.input.x = this.chip.x;
			this.input.y = this.chip.y;

			
			
			eurecaServer.handleKeys(this.input);
			
		}
	}
};

Chip.prototype.kill = function() {
	
	this.alive = false;
	this.chip.kill();
}

function report(item, pointer){
	//eurecaServer.handleKeys(this.input);
	//console.log("hi");
	eurecaServer.testText();
	//alert(item.x);
};


var game = new Phaser.Game(800, 700, Phaser.AUTO, 'phaser-example', { preload: preload, create: eurecaClientSetup, update: update, render: render });

function preload () {
    game.load.image('logo', 'Graphics/logo.png');
    game.load.image('table', 'Graphics/bg.png');
	game.load.image('ace', 'Graphics/ace.png');
    game.load.image('sgt', 'Graphics/sgt.png');
	game.load.image('mmc', 'Graphics/mmc.png');
	game.load.image('board', 'Graphics/board.png');
	game.load.image('map', 'Graphics/map.png');
}

function setStage(){
	//  Resize our game world to be a 2000 x 2000 square
    game.world.setBounds(0, 0, 2332, 794);
	game.stage.disableVisibilityChange  = true;
	
    //  Our tiled scrolling background
    land = game.add.tileSprite(0, 0, 2332, 794, 'board');
	//land = game.add.tileSprite(0, 0, 1261*2, 700*2, 'map');
	//land.scale.x = 2.25;
	//land.scale.y = 2;
    land.fixedToCamera = true;
	
}

function create () {

    setStage();
    //markerList = {};
    chipList = {};
	
	player = new Chip2(myId, game, chip2);
	
	chipList[myId] = player;
	chip2 = player.chip2;
	chip2.x=0;
	chip2.y=0;
	chip2.inputEnabled = true;
	chip2.input.enableDrag();
	chip2.bringToTop();	
	
	
    logo = game.add.sprite(300, 300, 'logo');
    logo.fixedToCamera = true;

    game.input.onDown.add(removeLogo, this);

    game.camera.follow(chip2);
    game.camera.deadzone = new Phaser.Rectangle(150, 150, 500, 300);
    game.camera.focusOnXY(0, 0);

    cursors = game.input.keyboard.createCursorKeys();
	
	setTimeout(removeLogo, 1000);

}

function removeLogo () {
    game.input.onDown.remove(removeLogo, this);
    logo.kill();
}

function update () {
	//do not update if client not ready
	if (!ready) return;
	
	player.input.left = cursors.left.isDown;
	player.input.right = cursors.right.isDown;
	player.input.up = cursors.up.isDown;
	player.input.fire = game.input.activePointer.isDown;
	//player.input.tx = game.input.x+ game.camera.x;
	//player.input.ty = game.input.y+ game.camera.y;

	
    for (var i in chipList)
    {
		if (!chipList[i]) continue;
		var curChip = chipList[i].chip2;
		for (var j in chipList)
		{
			if (!chipList[j]) continue;
			if (j!=i) 
			{
			
				var targetChip = chipList[j].chip2;
				
				//game.physics.arcade.overlap(curBullets, targetTank, bulletHitPlayer, null, this);
			
			}
			if (chipList[j].alive)
			{
				chipList[j].update();
			}			
		}
    }
}

function render () {}
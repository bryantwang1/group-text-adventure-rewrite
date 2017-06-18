// Map object, former room object refactored into map object
class Map {

  constructor(roomName) {
    this.name = roomName;
    this.description = "";
    this.displayName = "";
    this.chests = [];
    this.monsters = [];
    this.doors = [];
    this.waters = [];
    this.lavas = [];
    this.spikes = [];
    this.firepits = [];
    this.switches = [];
    this.mapArrays = [];
    this.atmosphericStrings = ["Something furry scurries by your feet.", "You feel a slow and steady dripping of water from the ceiling.", "A musty and unpleasant smell wafts in front of you.", "A bat flies past your head and disappears into the darkness.", "In the far distance your hear something shuffle toward you.", "The stone floor here is slick and slippery.", "Surely there’s a door nearby?", "You note a trickle of liquid on your arm, feel it, and taste your blood.", "A creaking and groaning as of rusty hinges starts from a far area of the room, then stops just as quickly.", "A tendril of mist curls around you.", "The ceiling seems to be closing in, but maybe that’s just you.", "The tile you’re on is loose, and it rattles loudly beneath you.", "A sound of stone scraping against stone reverberates for a short time, then seems to muffle itself."];
  }

  createMap(ySize, xSize) {
    this.mapArrays = [];
    for(var row = 0; row < ySize; row++) {
      this.mapArrays[row] = [];
      for(var col = 0; col < xSize; col++) {
        var tempTile = new Tile(row, col);
        this.mapArrays[row].push(tempTile);
      }
    }
  }

  displayMap() {
    $("#map").empty();
    for(var row = 0; row < this.mapArrays.length; row++) {
      var tempString = "";
      for(var col = 0; col < this.mapArrays[row].length; col++) {
        tempString += "<span id=\"location-" + row + "-" + col + "\" class=\"" + this.mapArrays[row][col].color + "\">" + this.mapArrays[row][col].symbol +"</span>";
      }
      $("#map").append("<p>" + tempString + "</p>");
    }
  }

  adjustAllSpawns(percentage) {
    for(var row = 0; row < this.mapArrays.length; row++) {
      for(var col = 0; col < this.mapArrays[row].length; col++) {
        this.mapArrays[row][col].increaseSpawn(percentage);
      }
    }
  }

  resetAllSpawns() {
    for(var row = 0; row < this.mapArrays.length; row++) {
      for(var col = 0; col < this.mapArrays[row].length; col++) {
        this.mapArrays[row][col].resetSpawn();
      }
    }
  }

  displayRoomDesc() {
    $("#room-name").text(this.displayName);
    $("#room-info").text(this.description);
  }

  displayAtmospheric() {
    var coinFlip = Math.floor(Math.random() * 2) + 1;
    if(coinFlip == 1) {
      var randomIdx = Math.floor(Math.random() * this.atmosphericStrings.length);
      $("#atmospheric-display").text(this.atmosphericStrings[randomIdx]);
    } else {
      $("#atmospheric-display").text("");
    }
  }

  // function for wall creating methods
  createWall(wallThis) {
    wallThis.canMove = false;
    wallThis.description = "A wall";
    wallThis.terrainType = "wall";
    wallThis.symbol = "^";
    wallThis.color = "wall";
  }

  // converts borders of map into wall tiles
  makeWalls() {
  	var height = this.mapArrays.length;
    var width = this.mapArrays[0].length;
    var bottomRowY = this.mapArrays.length - 1;
    var lastColumnX = this.mapArrays[0].length - 1;

    for(var idx = 0; idx < width; idx++) {
    	var toWall = this.mapArrays[0][idx];
      this.createWall(toWall);
    }
    for(var idx = 0; idx < width; idx++) {
    	var toWall = this.mapArrays[bottomRowY][idx];
      this.createWall(toWall);
    }
    for(var idx = 1; idx < height-1; idx++) {
    	var toWall1 = this.mapArrays[idx][0];
      var toWall2 = this.mapArrays[idx][lastColumnX];
      this.createWall(toWall1);
      this.createWall(toWall2);
    }
  }

  // Makes individual tiles into walls
  makeAWall(yLocation, xLocation) {
    var toWall = this.mapArrays[yLocation][xLocation];
    this.createWall(toWall);
  }

  // Tile creation functions for room objects
  createChest(amount, room) {
    for(var idx = 0; idx < amount; idx++) {
      var chest = new Tile(-1, -1);
      chest.canMove = false;
      chest.description = "An old wooden chest";
      chest.terrainType = "chest";
      chest.symbol = "∃";
      chest.color = "purple";
      chest.searchable = true;
      chest.drops = [];

      room.chests.push(chest);
    }
  }

  createDoor(amount, room) {
    for(var idx = 0; idx < amount; idx++) {
      var door = new Tile(-1, -1);
      door.canMove = false;
      door.description = "A sturdy door of oak planks with iron strips tying it together";
      door.terrainType = "door";
      door.symbol = "∏";
      door.color = "purple";
      door.locked = false;
      door.leadsTo = "";
      door.firstTime = false;
      door.fromWhere = "";

      room.doors.push(door);
    }
  }

  createWater(amount, room) {
    for(var idx = 0; idx < amount; idx++) {
      var water = new Tile(-1, -1);
      water.canMove = true;
      water.description = "Murky water. You can't tell how deep it is.";
      water.terrainType = "water";
      water.symbol = "w";
      water.color = "blue";

      room.waters.push(water);
    }
  }

  createLava(amount, room) {
    for(var idx = 0; idx < amount; idx++) {
      var lava = new Tile(-1, -1);
      lava.canMove = true;
      lava.description = "Fiery hot lava";
      lava.terrainType = "lava";
      lava.symbol = "w";
      lava.color = "bright-red";

      room.lavas.push(lava);
    }
  }

  createSpike(amount, room) {
    for(var idx = 0; idx < amount; idx++) {
      var spike = new Tile(-1, -1);
      spike.canMove = true;
      spike.description = "Several sharp points stick up from the ground";
      spike.terrainType = "spike";
      spike.symbol = "#";
      spike.color = "spikes";

      room.spikes.push(spike);
    }
  }

  createFirepit(amount, room) {
    for(var idx = 0; idx < amount; idx++) {
      var firepit = new Tile(-1, -1);
      firepit.canMove = false;
      firepit.description = "A shallow depression in the ground, filled with ashes. A few embers still glow brightly in the center.";
      firepit.terrainType = "firepit";
      firepit.symbol = "¥";
      firepit.color = "red";

      room.firepits.push(firepit);
    }
  }

  createObjectSwitch(amount, room) {
    for(var idx = 0; idx < amount; idx++) {
      var objectSwitch = new Tile(-1, -1);
      objectSwitch.canMove = false;
      objectSwitch.description = "A stone pillar about chest-high, topped with a stone bowl that shows signs of intense heat";
      objectSwitch.terrainType = "objectSwitch";
      objectSwitch.symbol = "/";
      objectSwitch.color = "red";
      objectSwitch.inside = "";

      room.switches.push(objectSwitch);
    }
  }

  createPlacedMonster(type, room) {
    var monster = new Tile(-1, -1);
    monster.canMove = false;
    monster.terrainType = "monster";
    monster.searchable = false;
    monster.color = "yellow";
    monster.monsterType = "";

    if(type === "golem") {
      monster.description = "A golem, much larger than any you've previously seen.";
      monster.symbol = "Ώ";
      monster.monsterType = "super golem";
    } else if(type === "dragon") {
      monster.description = "A massive scaled creature slumbers here. Its wings flap a little everytime it takes a breath. The air around the beast shimmers like the air around an intense fire."
      monster.symbol = "♠";
      monster.monsterType = "dragon";
    } else if(type === "random") {
      var randomMonster = getMonster();
      monster.description = "A monster of indeterminate type.";
      monster.monsterType = "random";
      monster.symbol = "!";
    }

    room.monsters.push(monster);
  }

}

export default Map

import Tile from './tile.object';

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

  // callback function for wall creating methods
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

}

export default Map

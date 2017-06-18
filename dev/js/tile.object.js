class Tile {

  constructor(yCoord, xCoord) {
    this.y = yCoord;
    this.x = xCoord;
    this.canMove = true;
    this.description = "A floor tile";
    this.terrainType = "floor";
    this.symbol = "#";
    this.color = "tiles";
    this.searchable = false;
    this.spawnChance = 10;
    this.monsterHere = false;
    this.drops = [];
    this.occupiedBy = {};
  }

  increaseSpawn(percentage) {
    this.spawnChance += percentage;
  }

  resetSpawn() {
    this.spawnChance = 8;
  }

}

export default Tile

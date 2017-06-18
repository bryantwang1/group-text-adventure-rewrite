// player-environment interaction, environment object
// Environment holds an array of the 8 tiles surrounding the player:
// [1,2,3
//  4,P,5
//  6,7,8]
// Environments should probably be generated once a turn, so that all the functions that check the surrounding tiles can just refer to it instead of doing the check themselves
class Environment {

  constructor(trackedPlayer) {
    this.surroundings = [];
    this.player = trackedPlayer;
  }

  recordTiles(currentMap) {
    var yStart = this.player.y - 1;
    var xStart = this.player.x - 1;
    this.surroundings = [];

    for(var row = yStart; row < yStart+3; row++) {
      for(var col = xStart; col < xStart+3; col++) {
        if(row != this.player.y && col != this.player.x) {
          this.surroundings.push(currentMap.mapArrays[row][col]);
        }
      }
    }
  }
  // formerly surroundingChecker
  updateCommands() {
    var chestFound = false;
    var doorFound = false;
    var commands = ["equip", "potion", "look"];

    function addCommand(command) {
      if(!commands.includes(command)) {
        commands.push(command);
      }
    }

    for(let tile of this.surroundings) {
      if(tile.searchable) {
        chestFound = true;
        addCommand("search");
      }
      if(tile.terrainType == "monster") {
        addCommand("fight");
      }
      if(tile.terrainType == "door") {
        doorFound = true;
        addCommand("open door");
      }
      if(tile.terrainType == "firepit" || tile.terrainType == "objectSwitch") {
        addCommand("use");
      }
    };
    if(chestFound) {
      $("#door-image").stop().hide();
      $("#chest-image").delay(300).fadeIn(300);
    } else if(doorFound) {
      $("#chest-image").stop().hide();
      $("#door-image").delay(300).fadeIn(300);
    } else {
      $("#door-image").fadeOut(300);
      $("#chest-image").fadeOut(300);
    }
    this.player.commands = commands;
    this.player.setShortcuts();
    this.player.displayCommands();
  }
  // For the "look" command
  lookAround() {
    var descs = [];
    this.surroundings.forEach(function(tile) {
      descs.push(tile);
    });
    var detailString = "NW: " + descs[0] + " || N: " + descs[1] + " || NE: " + descs[2] + " || W: " + descs[3] + " || E: " + descs[4] + " || SW: " + descs[5] + " || S: " + descs[6] + " || SE: " + descs[7] + ".";

    $("#combat-display").text(detailString);
  }
  // For the "Use" command, only deals with the torch puzzle right now
  useObject(player) {

    let y = player.y - 1;
    let x = player.x - 1;
    let whichTorch = player.checkTorch();

    objectLoopBreaker: {
      for(let tile of this.surroundings) {
        if(tile.terrainType === "firepit") {
          switch(whichTorch) {
            case 'none':
              $("#combat-display").text("You reach a hand toward the center of the firepit... Ouch! The faint embers were hotter than they looked. You pull your hand back toward your chest quickly.");
              break;

            case 'unlit':
              for(let item of player.items) {
                if(item.name === "unlitTorch") {
                  item = torch;
                  $("#which-torch").text("Lit Torch");
                }
              }
              $("#combat-display").text("You touch your unlit torch to the embers...your previously unlit torch springs to life with a whoosh.");
              break;

            case 'lit':
              $("#combat-display").text("You thrust your lit torch at the firepit, but nothing happens.");
              break;

            default:
              $("#combat-display").text("You shouldn't be seeing this message.");
              break;
          }
        } else if(tile.terrainType === "objectSwitch") {
          switch(whichTorch) {
            case 'none':
              $("#combat-display").text("You nudge the stone pillar, climb into the bowl on top, push it with all your might. Nothing happens. You sigh and brush the ashes off your clothing.");
              break;

            case 'unlit':
              $("#combat-display").text("You prod the stone pillar with your unlit torch, nothing happens. It feels like you're onto something, though.");
              break;

            case 'lit':
              $("#combat-display").text("You touch your torch's flame to the stone bowl atop the pillar. A groaning sound echoes through the room as somewhere some hidden mechanism activates.");
              var switchRoom = "";
              if(tile.inside === "room3") {
                switchRoom = "room3";
              } else if(tile.inside === "room4") {
                switchRoom = "room4";
              }
              manipulateRoom(player, switchRoom);
              break;

            default:
              $("#combat-display").text("You shouldn't be seeing this message, bro.");
              break;
          }
        }
      }
    }

  }

}

export default Environment

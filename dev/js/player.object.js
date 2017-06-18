class Player {

  constructor(userName) {
    this.name = userName;
    this.type = "player";
    this.alive = true;
    this.inCombat = false;
    this.maxHealth = 500;
    this.currentHealth = 500;
    this.previousHealth = 500;
    this.minDamage = 10;
    this.maxDamage = 10;
    // current location
    this.y = 0;
    this.x = 0;
    this.defense = 1;
    this.symbol = "Δ";
    this.weapons = [];
    this.items = [];
    this.commands = [];
    this.shortcuts = [];
    // crit chance out of 100
    this.critChance = 20;
    this.level = 1;
    this.equippedWeapon = {};
    // this.equippedArmor = {};
  }

  setShortcuts() {
    this.shortcuts = [];
    for(var idx = 0; idx < this.commands.length ;idx++) {
      if(this.commands[idx] === "attack") {
        this.shortcuts.push("a");
      } else if(this.commands[idx] === "potion") {
        this.shortcuts.push("p");
      } else if(this.commands[idx] === "flee") {
        this.shortcuts.push("f");
      }
    }
  }

  calculateDamage() {
    var minDamage = this.minDamage + this.equippedWeapon.minDamage;
    var maxDamage = this.maxDamage + this.equippedWeapon.maxDamage;
  	var damageRange = maxDamage - minDamage;
  	var damage = Math.floor(Math.random() * damageRange) + minDamage;

    var critHit = Math.floor(Math.random() * 100) + 1;
    if(critHit <= (this.critChance + this.equippedWeapon.critChance)) {
      damage += this.equippedWeapon.criticalHit;
    }

    return damage;
  }

  healthbar() {
    var oldHP = this.previousHealth/this.maxHealth;
    var oldHP2 = Math.floor(oldHP * 240);
  	var percentage = (this.currentHealth / this.maxHealth);
    var percentage2 = Math.floor(percentage * 240);
    $("div#hero-health").empty();
    $("div#hero-health").append("<div id=\"player-health-bar-outer\"><div id=\"player-health-bar-inner\"></div></div>");
    $("#player-health-bar-inner").css("width", oldHP2 + "px");
    $("#player-health-bar-inner").animate({width: percentage2 + "px"}, 600);

    $("#hero-health-display").text(this.currentHealth + "/" + this.maxHealth);
  }

  kill() {
    this.alive = false;
    this.inCombat = false;
    this.commands = ["revive", "restart"];
    this.setShortcuts();
    this.displayCommands();
    $("#hero-image").fadeOut("slow");
    $("#hero-dead").delay(600).fadeIn("slow");
    $("#map").fadeOut("slow");
    $("#death-message").delay(600).fadeIn("slow");
    $("#combat-display").empty();
    $("#combat-display").append("<p>You died. Sorry.</p>")
  }

  // player inventory status checker and display methods
  // potion drinking method is in CombatTracker now
  countPotions() {
    var potionAmount = 0;
    for(var idx= 0; idx < this.items.length; idx++) {
      if(this.items[idx].name === "potion") {
        potionAmount++;
      }
    }
    $("span#player-potions").text(potionAmount);
  }

  countRevives() {
    var reviveAmount = 0;
    for(var idx= 0; idx < this.items.length; idx++) {
      if(this.items[idx].name === "revive") {
        reviveAmount++;
      }
    }
    $("span#player-revives").text(reviveAmount);
  }

  countKeys() {
    var keyAmount = 0;
    for(var idx= 0; idx < this.items.length; idx++) {
      if(this.items[idx].name === "key") {
        keyAmount++;
      }
    }
    $("span#player-keys").text(keyAmount);
  }

  displayWeapons() {
    for(var idx= 0; idx < this.weapons.length; idx++) {
      if(this.weapons[idx].name === "wood sword") {
        $("#woodSword").fadeIn("slow");
      } else if(this.weapons[idx].name === "metal sword") {
        $("#metalSword").fadeIn("slow");
      } else if(this.weapons[idx].name === "war hammer") {
        $("#warHammer").fadeIn("slow");
      } else if(this.weapons[idx].name === "mystic bow") {
        $("#bow").fadeIn("slow");
      } else {
        alert("something has gone very wrong!");
      }
    }
  }

  displayPlayer() {
    console.log("#location-" + this.y + "-" + this.x);
    $("#location-" + this.y + "-" + this.x).text(this.symbol);
    $("#location-" + this.y + "-" + this.x).removeClass();
    $("#location-" + this.y + "-" + this.x).addClass("character");
  }

  checkTorch() {
    var torchType = "none";
    for(var idx = 0; idx < this.items.length; idx++) {
      if(this.items[idx].name !== "torch" && this.items[idx].name !== "unlitTorch") {
      } else if(this.items[idx].name === "torch") {
        torchType = "lit";
      } else if(this.items[idx].name === "unlitTorch") {
        torchType = "unlit";
      }
    }
    return torchType;
  }
  // inventory management

  revive(currentMap) {
    $("#combat-display").text("You have no revives left!");
    for(var idx = 0; idx < this.items.length; idx++) {
      if(this.items[idx].name === "revive") {
        this.revives--;
        this.alive = true;
        this.currentHealth = this.maxHealth;
        this.healthbar();
        if(this.InCombat) {
          this.commands = ["attack", "flee", "potion", "equip"];
          this.setShortcuts();
          this.displayCommands();
        } else {
          var newEnvironment = new Environment(this);
          newEnvironment.recordTiles();
          newEnvironment.updateCommands();
        }
        $("#combat-display").text("Before you breathe no more you manage to empty your revival potion into your throat. As the darkness of death lifts, you are comforted by the knowledge that death’s door will not shut on you…this time. ");
        $("#death-message").fadeOut("slow");
        $("#map").delay(600).fadeIn("slow");
        $("#hero-dead").fadeOut("slow");
        $("#hero-image").delay(600).fadeIn("slow");
        currentMap.displayMap();
        this.displayPlayer();
        this.items.splice(idx, 1);
        idx--;
        break;
      }
    }
    this.countRevives();
  }

  equipWeapon(weaponString) {
    var haveWeapon = false;
    for(var idx = 0; idx < this.weapons.length; idx++) {
      if(this.weapons[idx] != weaponString) {
        haveWeapon = false;
      }

      if(this.equippedWeapon.name === weaponString) {
        $("#combat-display").text("You already have this weapon equipped!");
        haveWeapon = true;
      } else {
        if(this.weapons[idx].name === weaponString) {
          this.equippedWeapon = this.weapons[idx];
          $("#combat-display").text("You have equipped " + this.weapons[idx].name + "!");
          $("#weapon-descriptions").text(this.weapons[idx].description);
          haveWeapon = true;
          $(".equipped").children().unwrap();

          if(this.weapons[idx].name === "bare hands") {
          } else if (this.weapons[idx].name === "wood sword") {
            $("#woodSword p").wrap("<div class=\"equipped\"></div>");
          } else if (this.weapons[idx].name === "metal sword") {
            $("#metalSword p").wrap("<div class=\"equipped\"></div>");
          } else if (this.weapons[idx].name === "mystic bow") {
            $("#bow p").wrap("<div class=\"equipped\"></div>");
          } else if (this.weapons[idx].name === "war hammer") {
            $("#warHammer p").wrap("<div class=\"equipped\"></div>");
          }
          break;
        }
      }
    }
    if(!haveWeapon) {
      $("#combat-display").text("You don't have this weapon!");
    }
  }

}

export default Player

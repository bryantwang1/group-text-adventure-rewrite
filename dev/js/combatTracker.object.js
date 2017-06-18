// Combat object (combat-tracker) to handle all combat functions
class CombatTracker {

  constructor(trackedPlayer, otherObject) {
    this.player = trackedPlayer;
    this.opponent = otherObject || {};
  }

  takeDamage(target, damageAmount) {
    target.previousHealth = target.currentHealth;
    target.currentHealth -= damageAmount;
    var targetString = (target.type == "player") ? "You take" : "The monster takes";
    $("#combat-display").append("<p>" + targetString + damageAmount + " damage, you have " + target.currentHealth + " health left.</p>");
    if(target.currentHealth <= 0) {
      target.kill();
      target.currentHealth = 0;
    }
    target.healthbar();
  }

  healTarget(target, healAmount) {
    target.previousHealth = target.currentHealth;
    target.currentHealth += healthAmount;
    target.currentHealth = (target.currentHealth > target.maxHealth) ? target.maxHealth : target.currentHealth;
  }

  playerPotion() {
    $("#combat-display").text("You have no potions to drink!");
    for(var idx = 0; idx < this.player.items.length; idx++) {
      if(this.player.items[idx].name === "potion") {
        this.healTarget(this.player, this.player.items[idx].addHealth);
        $("#combat-display").text("You drank a potion.");
        this.player.healthbar();
        this.player.items.splice(idx, 1);
        idx--;
        break;
      }
    }
    this.player.countPotions();
  }

}

export default CombatTracker

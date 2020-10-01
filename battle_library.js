let IN_BATTLE = false;

let DELAY = 7000;

let battle_player;
let battle_enemy;

let ENEMY_NAME;
let ENEMY_HEALTH;
let ENEMY_STRENGTH;

let PLAYER_STRENGTH = 5;
let PLAYER_HEALTH = PLAYER_STRENGTH * 10;
let old_PLAYER_HEALTH; //keeps track of what the player's health was before a battle

let POINTS; //the battle damage

let displayTXT;
let displayTXT_rect;

let SP_ATK_MIN = 10;
let SP_ATK_MAX = 20;
let SP_ATK_NAME = "Demo Fireball";

async function start() {
  ENEMY_NAME = "Default"; //naturally, the function that initiated the battle would set these variables
  ENEMY_STRENGTH = 5;
  ENEMY_HEALTH = ENEMY_STRENGTH * 10;

  old_PLAYER_HEALTH = PLAYER_HEALTH;
  battle();
}

async function battle() {
  IN_BATTLE = true;
  battle_addPlayer();
  battle_addEnemy(ENEMY_NAME);

  setTimer(battle_movePlayer, 1);
  setTimer(battle_moveEnemy, 1);

  displayText("You have found a '" + ENEMY_NAME + "'!");
  await sleep(DELAY);

  while (true) {
    if (PLAYER_HEALTH > 0 && ENEMY_HEALTH > 0) {
      battle_menu();
      await sleep(24000);
      enemy_attack();
      await sleep(10000);
    } else {
      break;
    }
  }

  if (PLAYER_HEALTH <= 0) {
    lose_battle();
  } else if (ENEMY_HEALTH <= 0) {
    win_battle();
  }

  setTimeout(removeAll, DELAY);
  IN_BATTLE = false;
}

async function battle_menu() {
  drawBattleMenu();
  await sleep(3000);

  while (true) {
    let choice = prompt("What do you want to do?");
    if (choice == "1") {
      POINTS = Randomizer.nextInt(PLAYER_STRENGTH, PLAYER_STRENGTH + 5);
      displayText("PLAYER has chosen to attack!");
      await sleep(DELAY + 2000);
      break;
    } else if (choice == "2") {
      //would be something like drawBattleMenu_Item(), too complicated for a demo
      POINTS = 0;
      displayText("PLAYER tried to use an item, but it is locked!");
      await sleep(DELAY + 2000);
      break;
    } else if (choice == "3") {
      POINTS = Randomizer.nextInt(SP_ATK_MIN, SP_ATK_MAX);
      displayText("PLAYER has chosen SP ATK " + SP_ATK_NAME + "!");
      await sleep(DELAY + 2000);
      break;
    }
  }
  ENEMY_HEALTH -= POINTS;
  displayText("You have dealt " + POINTS + " Points!");
  await sleep(DELAY + 2000);
}

function drawBattleMenu() {
  let width = getWidth() * (2 / 3) - getWidth() / 7;
  let height = getHeight() / 4;
  let rect = new Rectangle(width, height);

  let x = getWidth() / 3 + getWidth() / 7;
  let y = getHeight() - rect.getHeight();
  rect.setPosition(x, y);

  rect.setColor(Color.gray);

  add(rect);

  let FONT = "8pt Arial";

  let txt = new Text("What do you want to do?", FONT);
  txt.setPosition(x, y + txt.getHeight());
  add(txt);

  txt = new Text("1: Attack", FONT);
  txt.setPosition(x, y + txt.getHeight() * 2);
  add(txt);

  txt = new Text("2: Item -LOCKED-", FONT);
  txt.setPosition(x, y + txt.getHeight() * 3);
  add(txt);

  txt = new Text("3: Special Attack " + SP_ATK_NAME, FONT);
  txt.setPosition(x, y + txt.getHeight() * 4);
  add(txt);
}

async function enemy_attack() {
  POINTS = Randomizer.nextInt(ENEMY_STRENGTH, ENEMY_STRENGTH + 5);
  PLAYER_HEALTH -= POINTS;
  displayText("The " + ENEMY_NAME + " has dealt you " + POINTS + " Points!");
  await sleep(DELAY + 2000);
}

async function lose_battle() {
  remove(battle_player);
  displayText("You were defeated!");
  await sleep(DELAY + 2000);
}

async function win_battle() {
  remove(battle_enemy);
  displayText("You beat the '" + ENEMY_NAME + "'!");
  await sleep(DELAY + 2000);
  PLAYER_STRENGTH += ENEMY_STRENGTH / 2;
  displayText(
    "Your strength went up by " +
      ENEMY_STRENGTH / 2 +
      "! It is now " +
      PLAYER_STRENGTH +
      "."
  );
  await sleep(DELAY + 2000);
}

function battle_addPlayer() {
  let height = getHeight() / 2 - getHeight() / 16;
  let width = getWidth() / 3;
  let player = new Rectangle(width, height);
  //let player = new WebImage("example.com/images/player.jpg");
  //player.setSize(width, height);
  player.setPosition(-player.getWidth(), getHeight() - player.getHeight()); //start offscreen
  player.setColor(Color.blue);
  battle_player = player;
  add(player);
}

function battle_movePlayer() {
  let player = battle_player;
  player.move(1, 0);

  if (player.getX() >= 0) {
    stopTimer(battle_movePlayer);
  }
}

function battle_addEnemy(NAME) {
  let width = getWidth() / 3;
  let height = getHeight() / 5;
  let enemy = new Rectangle(width, height);
  //let enemy = new WebImage("example.com/images/" + NAME + ".jpg");
  //enemy.setSize(width, height);
  enemy.setPosition(getWidth() + enemy.getWidth(), getHeight() / 16);
  enemy.setColor(Color.green);
  battle_enemy = enemy;
  add(enemy);
}

function battle_moveEnemy() {
  let enemy = battle_enemy;
  enemy.move(-1, 0);

  if (enemy.getX() <= getWidth() - enemy.getWidth() - getWidth() / 8) {
    stopTimer(battle_moveEnemy);
  }
}

function displayText(TEXT) {
  remove(displayTXT);
  displayTXT = new Text(TEXT, "12pt Arial");
  displayTXT.setPosition(getWidth() / 16, getHeight() / 2);
  displayTXT.setColor(Color.white);

  remove(displayTXT_rect);
  displayTXT_rect = new Rectangle(getWidth(), getHeight() / 8);
  displayTXT_rect.setColor(Color.black);
  displayTXT_rect.setPosition(0, displayTXT.getY() - displayTXT.getHeight());

  add(displayTXT_rect);
  add(displayTXT);

  setTimeout(removeText, DELAY);
}

function removeText() {
  remove(displayTXT);
  remove(displayTXT_rect);
}

async function sleep(ms) {
  await new Promise((r) => setTimeout(r, ms));
}

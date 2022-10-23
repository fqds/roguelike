import { settings } from "./settings.js";
import { playerCoord, enemyArray, map, playerParameters } from "./index.js";
import {
  getSpawnCoord,
  clearTile,
  drawTile,
  isPossibleDirection,
} from "./mixins.js";

function spawnEnemies() {
  for (let enemy = 0; enemy < settings.enemies.length; enemy++) {
    for (let i = 0; i < settings.enemies[enemy][1]; i++) {
      spawnEnemy(settings.enemyParameters[settings.enemies[enemy][0]]);
    }
  }
}

function spawnEnemy(enemyParameters) {
  const enemyId = Object.keys(enemyArray).length;
  var enemyCoord = getSpawnCoord(map);
  drawTile(enemyCoord[0], enemyCoord[1], enemyParameters.name);
  enemyArray[enemyId] = {};
  enemyArray[enemyId]["y"] = enemyCoord[0];
  enemyArray[enemyId]["x"] = enemyCoord[1];
  enemyArray[enemyId]["getDamage"] = function (damage) {
    this.hp -= damage;
    $(".field").children().eq(this.y).children().eq(this.x).children(":first").css({ width: (this.hp / this.maxhp) * 100 + "%" })
    if (this.hp <= 0) {
      clearTile(this.y, this.x, this.name);
      this.y = -100;
      this.x = -100;
    }
  };
  for (var key in enemyParameters) {
    enemyArray[enemyId][key] = enemyParameters[key];
  }
  $("<div>", { class: "health" })
    .css({ width: (enemyArray[enemyId].hp / enemyArray[enemyId].maxhp) * 100 + "%" })
    .appendTo($(".field").children().eq(enemyArray[enemyId].y).children().eq(enemyArray[enemyId].x));
  setTimeout(() => {
    enemyAction(enemyId);
  }, 1000);
}

function enemyAction(enemyId) {
  let enemy = enemyArray[enemyId];
  // рекурсия заканчивается после смерти врага
  if (enemy.hp <= 0) {
    console.log("enemy died");
  }
  // если игрок в радиусе атаки, атакуем
  else if (
    Math.abs(enemy.y - playerCoord[0]) <= enemy["weaponrange"] &&
    Math.abs(enemy.x - playerCoord[1]) <= enemy["weaponrange"]
  ) {
    playerParameters.getDamage(enemy.damage);

    setTimeout(() => {
      enemyAction(enemyId);
    }, 1000);
  }
  // если игрок в области зрения выполняется эта функция, враг идет к нему
  else if (isPlayerDeted(enemy)) {
    moveEnemy(enemy, BresenhamAlgoritm([enemy.y, enemy.x], playerCoord));

    setTimeout(() => {
      enemyAction(enemyId);
    }, 1000);
  }
  // если предыдущие условия не выполнены, враг просто передвигается в рандомном направлении на 1 клетку
  else {
    const directons = [
      [-1, 0],
      [0, -1],
      [1, 0],
      [0, 1],
    ];
    let availableDirections = [];
    for (let i = 0; i < 4; i++) {
      if (
        isPossibleDirection([enemy.y, enemy.x], directons[i]) &&
        map[enemy.y + directons[i][0]][enemy.x + directons[i][1]] === ""
      ) {
        availableDirections.push(directons[i]);
      }
    }
    const direction =
      availableDirections[
        Math.floor(Math.random() * availableDirections.length)
      ];
    if (direction) {
      moveEnemy(enemy, [enemy.y + direction[0], enemy.x + direction[1]]);
    }
    setTimeout(() => {
      enemyAction(enemyId);
    }, 2500);
  }
}

function moveEnemy(enemy, coords) {
  $(".field").children().eq(enemy.y).children().eq(enemy.x).children().remove()
  clearTile(enemy.y, enemy.x, enemy.name);
  enemy.y = coords[0];
  enemy.x = coords[1];
  drawTile(enemy.y, enemy.x, enemy.name);
  $("<div>", { class: "health" })
    .css({ width: (enemy.hp / enemy.maxhp) * 100 + "%" })
    .appendTo($(".field").children().eq(enemy.y).children().eq(enemy.x));
}

function isPlayerDeted(enemy) {
  if (
    Math.abs(enemy.y - playerCoord[0]) <= enemy["visionrange"] &&
    Math.abs(enemy.x - playerCoord[1]) <= enemy["visionrange"] &&
    BresenhamAlgoritm([enemy.y, enemy.x], playerCoord) != false
  ) {
    return true;
  }
  return false;
}

function BresenhamAlgoritm(coord, coord1) {
  var x0 = coord[0];
  var y0 = coord[1];
  var x1 = coord1[0];
  var y1 = coord1[1];
  var dx = Math.abs(x1 - x0);
  var dy = Math.abs(y1 - y0);
  var sx = x0 < x1 ? 1 : -1;
  var sy = y0 < y1 ? 1 : -1;
  var err = dx - dy;
  var moveTo = false;
  while (true) {
    if (x0 === x1 && y0 === y1) return moveTo;
    var e2 = 2 * err;
    if (e2 > -dy) {
      err -= dy;
      x0 += sx;
    }
    if (e2 < dx) {
      err += dx;
      y0 += sy;
    }
    if (map[x0][y0] != "") {
      return false;
    }
    if (moveTo === false) {
      moveTo = [x0, y0];
      console.log(moveTo);
    }
  }
}

export { spawnEnemies };

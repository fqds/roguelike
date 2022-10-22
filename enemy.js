import { settings } from "./settings.js";
import { playerCoord, enemyArray, map } from "./index.js";
import { getSpawnCoord, clearTile, drawTile } from "./mixins.js";

function spawnEnemies() {
  for (let enemy = 0; enemy < settings.enemies.length; enemy++) {
    for (let i = 0; i < settings.enemies[enemy][1]; i++) {
      spawnEnemy(
        settings.enemyParameters[settings.enemies[enemy][0]]
      );
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
    if (this.hp <= 0) {
      clearTile(this.y, this.x, this.name);
      this.y = -100;
      this.x = -100;
    }
  };
  for (var key in enemyParameters) {
    enemyArray[enemyId][key] = enemyParameters[key];
  }
  enemyAction(enemyId);
}

function enemyAction(enemyId) {
  let enemy = enemyArray[enemyId];
  // рекурсия заканчивается после смерти врага
  if (enemy.hp <= 0) {
    console.log("enemy died");
  }
  // если игрок в области зрения выполняется эта функция
  else if (
    Math.abs(enemy["y"] - playerCoord[0]) <= enemy["visionrange"] &&
    Math.abs(enemy["x"] - playerCoord[1]) <= enemy["visionrange"]
  ) {
    setTimeout(() => {
      enemyAction(enemyId);
    }, 100);
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
        enemy["y"] + directons[i][0] >= 0 &&
        enemy["y"] + directons[i][0] < map.length &&
        enemy["x"] + directons[i][1] >= 0 &&
        enemy["x"] + directons[i][1] < map[0].length &&
        map[enemy["y"] + directons[i][0]][enemy["x"] + directons[i][1]] === ""
      ) {
        availableDirections.push(directons[i]);
      }
    }
    const direction =
      availableDirections[
        Math.floor(Math.random() * availableDirections.length)
      ];
    if (direction) {
      clearTile(enemy.y, enemy.x, enemy.name);
      enemy["y"] += direction[0];
      enemy["x"] += direction[1];
      drawTile(enemy.y, enemy.x, enemy.name);
    }
    setTimeout(() => {
      enemyAction(enemyId);
    }, 500);
  }
}

export { spawnEnemies };

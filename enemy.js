import { settings } from "./settings.js";
import { getSpawnCoord } from "./mixins.js";

function spawnEnemies(map, enemyArray, playerCoord) {
  for (let enemy = 0; enemy < settings.enemies.length; enemy++) {
    for (let i = 0; i < settings.enemies[enemy][1]; i++) {
      spawnEnemy(
        map,
        settings.enemyParameters[settings.enemies[enemy][0]],
        Object.keys(enemyArray).length,
        enemyArray,
        playerCoord
      );
    }
  }
}

function spawnEnemy(map, enemyParameters, enemyId, enemyArray, playerCoord) {
  var enemyCoord = getSpawnCoord(map);
  $(".field")
    .children()
    .eq(enemyCoord[0])
    .children()
    .eq(enemyCoord[1])
    .addClass(enemyParameters["name"]);
  enemyArray[enemyId] = {};
  enemyArray[enemyId]["y"] = enemyCoord[0];
  enemyArray[enemyId]["x"] = enemyCoord[1];
  map[enemyCoord[0]][enemyCoord[1]] = enemyParameters["name"];
  for (var key in enemyParameters) {
    enemyArray[enemyId][key] = enemyParameters[key];
  }
  enemyAction(map, enemyId, enemyArray, playerCoord);
}

function enemyAction(map, enemyId, enemyArray, playerCoord) {
  let enemy = enemyArray[enemyId];
  if (
    Math.abs(enemy["y"] - playerCoord[0]) <= enemy["visionrange"] &&
    Math.abs(enemy["x"] - playerCoord[1]) <= enemy["visionrange"]
  ) {
    console.log("enemy detected player! player coord is " + playerCoord);
    setTimeout(() => {
      enemyAction(map, enemyId, enemyArray, playerCoord);
    }, 100);
  } else {
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
      $(".field")
        .children()
        .eq(enemy["y"])
        .children()
        .eq(enemy["x"])
        .removeClass(enemy["name"]);
      map[enemy["y"]][enemy["x"]] = "";
      enemy["y"] += direction[0];
      enemy["x"] += direction[1];
      map[enemy["y"]][enemy["x"]] = enemy["name"];
      $(".field")
        .children()
        .eq(enemy["y"])
        .children()
        .eq(enemy["x"])
        .addClass(enemy["name"]);
    }
    setTimeout(() => {
      enemyAction(map, enemyId, enemyArray, playerCoord);
    }, 2000);
  }
}

export { spawnEnemies };

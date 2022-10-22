import { settings } from "./settings.js";
import { playerCoord, enemyArray, map } from "./index.js";
import { clearTile } from "./mixins.js";

function spawnPlayer() {
  var playerParameters = {};
  for (var key in settings.playerBaseParameters) {
    playerParameters[key] = settings.playerBaseParameters[key];
  }
  $(".field")
    .children()
    .eq(playerCoord[0])
    .children()
    .eq(playerCoord[1])
    .addClass("tileP");
  // направление движения x, y и переменная, показывающая состояние кнопки
  let keys = {
    KeyW: [-1, 0, false],
    KeyA: [0, -1, false],
    KeyS: [1, 0, false],
    KeyD: [0, 1, false],
  };
  let space = { Space: false };
  document.onkeydown = function (e) {
    if (!space[e.code]) {
      space[e.code] = true;
      attackEnemiesAround(playerParameters);
    }
    if (keys[e.code] && keys[e.code][2] === false) {
      keys[e.code][2] = true;
      if (
        playerCoord[0] + keys[e.code][0] >= 0 &&
        playerCoord[0] + keys[e.code][0] < map.length &&
        playerCoord[1] + keys[e.code][1] >= 0 &&
        playerCoord[1] + keys[e.code][1] < map[0].length &&
        map[playerCoord[0] + keys[e.code][0]][
          playerCoord[1] + keys[e.code][1]
        ] != "tileW" &&
        !settings.enemyParameters[
          map[playerCoord[0] + keys[e.code][0]][
            playerCoord[1] + keys[e.code][1]
          ]
        ]
      ) {
        movePlayer(playerCoord, keys[e.code])
        // если в клетке игрока есть предмет, используем его
        if (settings.objectParameters[map[playerCoord[0]][playerCoord[1]]]) {
          useItem(
            settings.objectParameters[map[playerCoord[0]][playerCoord[1]]],
            playerParameters
          );

          clearTile(
            playerCoord[0],
            playerCoord[1],
            map[playerCoord[0]][playerCoord[1]]
          );
        }
      }
    }
  };
  document.onkeyup = function (e) {
    if (keys[e.code] && keys[e.code][2] === true) {
      keys[e.code][2] = false;
    } else if (space[e.code]) {
      space[e.code] = false;
    }
  };
}

function movePlayer(playerCoord, direction) {
  playerCoord[0] = playerCoord[0] + direction[0];
  playerCoord[1] = playerCoord[1] + direction[1];

  // двигаем модельку игрока
  $(".tileP").removeClass("tileP");
  $(".field")
    .children()
    .eq(playerCoord[0])
    .children()
    .eq(playerCoord[1])
    .addClass("tileP");
}

function attackEnemiesAround(playerParameters) {
  for (
    let y = -playerParameters.weaponrange + playerCoord[0];
    y <= playerParameters.weaponrange + playerCoord[0];
    y++
  ) {
    for (
      let x = -playerParameters.weaponrange + playerCoord[1];
      x <= playerParameters.weaponrange + playerCoord[1];
      x++
    ) {
      try {
        if (settings.enemyParameters[map[y][x]]) {
          for (let enemyId in enemyArray) {
            if (enemyArray[enemyId].y === y && enemyArray[enemyId].x === x) {
              enemyArray[enemyId].getDamage(playerParameters.damage);
              console.log(enemyArray[enemyId]);
            }
          }
        }
      } catch {}
    }
  }
}

function useItem(item, playerParameters) {
  item(playerParameters);
}

export { spawnPlayer };

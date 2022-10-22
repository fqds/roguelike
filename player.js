import { settings } from "./settings.js";
import { playerCoord, enemyArray, map, playerParameters } from "./index.js";
import { clearTile, isPossibleDirection } from "./mixins.js";

function spawnPlayer() {
  for (var key in settings.playerBaseParameters) {
    playerParameters[key] = settings.playerBaseParameters[key];
  }
  playerParameters["getDamage"] = function (damage) {
    this.hp -= damage;
    console.log(playerParameters.hp);
    if (this.hp <= 0) {
      gameOver();
    }
  };
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
      attackEnemiesAround();
    }
    if (keys[e.code] && keys[e.code][2] === false) {
      keys[e.code][2] = true;
      if (
        isPossibleDirection(playerCoord, keys[e.code]) &&
        map[playerCoord[0] + keys[e.code][0]][
          playerCoord[1] + keys[e.code][1]
        ] != "tileW" &&
        !settings.enemyParameters[
          map[playerCoord[0] + keys[e.code][0]][
            playerCoord[1] + keys[e.code][1]
          ]
        ]
      ) {
        movePlayer(playerCoord, keys[e.code]);
        // если в клетке игрока есть предмет, используем его
        if (settings.objectParameters[map[playerCoord[0]][playerCoord[1]]]) {
          useItem(
            settings.objectParameters[map[playerCoord[0]][playerCoord[1]]]
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

function attackEnemiesAround() {
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

function gameOver() {
  playerCoord[0] = -200;
  playerCoord[1] = -200;
  $(".tileP").removeClass("tileP");
  $("<div>", { class: "game-over-menu" }).appendTo("body");
  $("<div>", {
    class: "game-over-menu-content",
    text: "RESTART",
    onclick: "window.location.reload();",
  }).appendTo(".game-over-menu");
}

function useItem(item) {
  item(playerParameters);
}

export { spawnPlayer };

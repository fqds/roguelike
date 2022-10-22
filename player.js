import { settings } from "./settings.js";
import { playerCoord } from "./index.js";

function spawnPlayer(map, playerParameters) {
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
  var keys = {
    KeyW: [-1, 0, false],
    KeyA: [0, -1, false],
    KeyS: [1, 0, false],
    KeyD: [0, 1, false],
  };
  document.onkeydown = function (e) {
    if (keys[e.code] && keys[e.code][2] === false) {
      keys[e.code][2] = true;
      // первые 4 условия проверяют не выходит ли игрок за конец карты, последняя не идет ли он в стену
      if (
        playerCoord[0] + keys[e.code][0] >= 0 &&
        playerCoord[0] + keys[e.code][0] < map.length &&
        playerCoord[1] + keys[e.code][1] >= 0 &&
        playerCoord[1] + keys[e.code][1] < map[0].length &&
        map[playerCoord[0] + keys[e.code][0]][
          playerCoord[1] + keys[e.code][1]
        ] != "tileW" &&
            !(settings.enemyParameters[
            map[playerCoord[0] + keys[e.code][0]][
              playerCoord[1] + keys[e.code][1]
            ]
          ])
      ) {
        playerCoord[0] = playerCoord[0] + keys[e.code][0];
        playerCoord[1] = playerCoord[1] + keys[e.code][1];

        // двигаем модельку игрока
        $(".tileP").removeClass("tileP");
        $(".field")
          .children()
          .eq(playerCoord[0])
          .children()
          .eq(playerCoord[1])
          .addClass("tileP");

        // если в клетке игрока есть предмет, используем его
        if (settings.objectParameters[map[playerCoord[0]][playerCoord[1]]]) {
          useItem(
            settings.objectParameters[map[playerCoord[0]][playerCoord[1]]],
            playerParameters
          );
          $(".field")
            .children()
            .eq(playerCoord[0])
            .children()
            .eq(playerCoord[1])
            .removeClass(map[playerCoord[0]][playerCoord[1]]);
          map[playerCoord[0]][playerCoord[1]] = "";
        }
      }
    }
  };
  document.onkeyup = function (e) {
    if (keys[e.code] && keys[e.code][2] === true) {
      keys[e.code][2] = false;
    }
  };
}

function useItem(item, playerParameters) {
  item(playerParameters);
}

export { spawnPlayer };

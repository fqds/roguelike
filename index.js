function startGame(
  height,
  width,
  tunnelsMin = 3,
  tunnelsMax = 5,
  roomsMin = 5,
  roomsMax = 5,
  wMin = 3,
  wMax = 8,
  hMin = 3,
  hMax = 8,
  objects = [
    ["tileSW", 2],
    ["tileHP", 10],
  ],
  objectParameters = {
    tileSW: ["increacePlayerDamage", { modifier: 15 }],
    tileHP: ["healPlayer", {}],
  },
  enemies = [["tileE", 10]],
  enemyParameters = {
    tileE: { damage: 10, hp: 50, maxhp: 50, weaponrange: 1, visionrange: 5, name: "tileE"},
  }
) {
  let map = createMapArray(height, width);
  map = createRooms(map, roomsMin, roomsMax, wMin, wMax, hMin, hMax);
  map = createTunnels(map, tunnelsMin, tunnelsMax);
  map = spawnObjects(map, objects);
  renderMap(map);
  spawnPlayer(map, objectParameters, enemyParameters);
  spawnEnemies(map, enemies, enemyParameters);
}

function renderMap(map) {
  let row;
  for (let y = 0; y < map.length; y++) {
    row = $("<div>", { class: "row" }).appendTo(".field");
    for (let x = 0; x < map[0].length; x++) {
      $("<div>", { class: "tile " + map[y][x] }).appendTo(row);
    }
  }
}

function createMapArray(height, width) {
  let arr = [];
  for (let i = 0; i < height; i++) {
    arr.push([]);
    for (let j = 0; j < width; j++) {
      arr[i].push("tileW"); // wall
    }
  }
  return arr;
}

function createRooms(map, roomsMin, roomsMax, wMin, wMax, hMin, hMax) {
  const roomsAmount =
    Math.floor(Math.random() * (roomsMax - roomsMin + 1)) + roomsMin;
  for (let i = 0; i < roomsAmount; i++) {
    map = createRoom(map, wMin, wMax, hMin, hMax);
  }
  return map;
}

function createRoom(map, wMin, wMax, hMin, hMax) {
  const roomHeight = Math.floor(Math.random() * (hMax - hMin + 1)) + hMin;
  const roomWidth = Math.floor(Math.random() * (wMax - wMin + 1)) + wMin;
  const roomY = Math.floor(Math.random() * (map.length - roomHeight));
  const roomX = Math.floor(Math.random() * (map[0].length - roomWidth));
  for (let y = roomY; y < roomY + roomHeight; y++) {
    for (let x = roomX; x < roomX + roomWidth; x++) {
      map[y][x] = ""; // empty
    }
  }
  return map;
}

function createTunnels(map, tunnelsMin, tunnelsMax) {
  const horizontalTonnelsAmount =
    Math.floor(Math.random() * (tunnelsMax - tunnelsMin + 1)) + tunnelsMin;
  const verticalTonnelsAmount =
    Math.floor(Math.random() * (tunnelsMax - tunnelsMin + 1)) + tunnelsMin;
  for (let i = 0; i < horizontalTonnelsAmount; i++) {
    map = createTunnel(map, true);
  }
  for (let i = 0; i < verticalTonnelsAmount; i++) {
    map = createTunnel(map, false);
  }
  return map;
}

function createTunnel(map, is_horizontal) {
  if (is_horizontal) {
    const y = Math.floor(Math.random() * map.length);
    for (let x = 0; x < map[0].length; x++) {
      map[y][x] = "";
    }
  } else {
    const x = Math.floor(Math.random() * map[0].length);
    for (let y = 0; y < map.length; y++) {
      map[y][x] = "";
    }
  }
  return map;
}

// выводит кол-во свободных координат
function getEmptySpace(map) {
  let emptySpaceArray = [];
  let emptySpaceTotal = 0;
  for (let y = 0; y < map.length; y++) {
    emptySpaceArray.push(0);
    for (let x = 0; x < map[0].length; x++) {
      if (map[y][x] === "") {
        emptySpaceTotal += 1;
        emptySpaceArray[y] += 1;
      }
    }
  }
  return [emptySpaceArray, emptySpaceTotal];
}

function spawnObjects(map, objects) {
  let emptySpace = getEmptySpace(map);
  for (let object_id = 0; object_id < objects.length; object_id++) {
    for (let i = 0; i < objects[object_id][1]; i++) {
      var objectCoord = getSpawnCoord(map, emptySpace);
      map[objectCoord[0]][objectCoord[1]] = objects[object_id][0];
      emptySpace = objectCoord[2];
    }
  }
  return map;
}

// выводит рандомную не занятую координату
function getSpawnCoord(map, emptySpace) {
  let emptySpaceCoord = Math.floor(Math.random() * emptySpace[1]) + 1;
  for (let i = 0; i < emptySpace[0].length; i++) {
    emptySpaceCoord -= emptySpace[0][i];
    if (emptySpaceCoord <= 0) {
      var objectCoord = [i, emptySpaceCoord];
      break;
      z;
    }
  }
  for (let i = map[0].length - 1; i >= 0; i--) {
    if (map[objectCoord[0]][i] === "") {
      if (objectCoord[1] === 0) {
        emptySpace[1] -= 1;
        emptySpace[0][objectCoord[0]] -= 1;
        return [objectCoord[0], i, emptySpace];
      }
      objectCoord[1] += 1;
    }
  }
}

// функции предметов
function increacePlayerDamage(content) {
  playerParameters["damage"] += content["modifier"];
}

function healPlayer(content) {
  playerParameters["hp"] = playerParameters["maxhp"];
}

function spawnPlayer(map, objectParameters, enemyParameters) {
  var emptySpace = getEmptySpace(map);
  playerCoord = getSpawnCoord(map, emptySpace);
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
        !(enemyParameters[
          map[playerCoord[0] + keys[e.code][0]][
            playerCoord[1] + keys[e.code][1]
          ]
        ])
      ) {
        playerCoord = [
          playerCoord[0] + keys[e.code][0],
          playerCoord[1] + keys[e.code][1],
        ];

        // двигаем модельку игрока
        $(".tileP").removeClass("tileP");
        $(".field")
          .children()
          .eq(playerCoord[0])
          .children()
          .eq(playerCoord[1])
          .addClass("tileP");

        // если в клетке игрока есть предмет, используем его
        if (objectParameters[map[playerCoord[0]][playerCoord[1]]]) {
          pickUpItem(objectParameters[map[playerCoord[0]][playerCoord[1]]]);
          $(".field")
            .children()
            .eq(playerCoord[0])
            .children()
            .eq(playerCoord[1])
            .removeClass(map[playerCoord[0]][playerCoord[1]]);
          map[playerCoord[0]][playerCoord[1]] = "";
        }
        console.log(keys[e.code], playerCoord, playerParameters);
      }
    }
  };
  document.onkeyup = function (e) {
    if (keys[e.code] && keys[e.code][2] === true) {
      keys[e.code][2] = false;
    }
  };
}

function useItem(item) {
  window[item[0]](item[1]);
}

function pickUpItem(item) {
  useItem(item);
}

function spawnEnemies(map, enemies, enemyParameters) {
  for (let enemy = 0; enemy < enemies.length; enemy++) {
    for (let i = 0; i < enemies[enemy][1]; i++) { 
      spawnEnemy(
        map,
        enemyParameters[enemies[enemy][0]],
        Object.keys(enemyArray).length
      );
    }
  }
}

function spawnEnemy(map, enemyParameters, enemyId) {
  var emptySpace = getEmptySpace(map);
  var enemyCoord = getSpawnCoord(map, emptySpace);
  $(".field")
    .children()
    .eq(enemyCoord[0])
    .children()
    .eq(enemyCoord[1])
    .addClass(enemyParameters["name"]);
  enemyArray[enemyId] = {};
  enemyArray[enemyId]["y"] = enemyCoord[0];
  enemyArray[enemyId]["x"] = enemyCoord[1];
  map[enemyCoord[0]][enemyCoord[1]] = enemyParameters["name"]
  for (var key in enemyParameters) {
    enemyArray[enemyId][key] = enemyParameters[key];
  }
  enemyAction(map, enemyId);
}

function enemyAction(map, enemyId) {
  let enemy = enemyArray[enemyId];
  if (
    Math.abs(enemy["y"] - playerCoord[0]) <= enemy["visionrange"] &&
    Math.abs(enemy["x"] - playerCoord[1]) <= enemy["visionrange"]
  ) {
    console.log("enemy detected you");
    setTimeout(() => {
      enemyAction(map, enemyId);
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
      map[enemy["y"]][enemy["x"]] = ""
      enemy["y"] += direction[0];
      enemy["x"] += direction[1];
      map[enemy["y"]][enemy["x"]] = enemy["name"]
      $(".field")
        .children()
        .eq(enemy["y"])
        .children()
        .eq(enemy["x"])
        .addClass(enemy["name"]);
    }
    setTimeout(() => {
      enemyAction(map, enemyId);
    }, 2000);
  }
}
var playerCoord = [];
var enemyArray = {};
var playerParameters = { damage: 20, hp: 100, maxhp: 100 };
$(function () {
  startGame(20, 32);
});

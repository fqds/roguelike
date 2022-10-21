function startGame(
  height,
  width,
  tunnelsMin = 3,
  tunnelsMax = 5,
  roomsMin = 5,
  roomsMax = 10,
  wMin = 3,
  wMax = 8,
  hMin = 3,
  hMax = 8,
  objects = [
    ["tileSW", 2],
    ["tileHP", 10],
  ],
  object_parameters = {
    tileSW: ["increaceHeroDamage", { modifier: 1 }],
    tileHP: ["healHero", {}],
  }
) {
  let map = createMapArray(height, width);
  map = createRooms(map, roomsMin, roomsMax, wMin, wMax, hMin, hMax);
  map = createTunnels(map, tunnelsMin, tunnelsMax);
  map = spawnObjects(map, objects);
  renderMap(map);
  spawnHero(map, object_parameters);
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
      map, (emptySpace = spawnObject(map, objects[object_id][0], objectCoord));
    }
  }
  return map;
}

function spawnObject(map, object, objectCoord) {
  map[objectCoord[0]][objectCoord[1]] = object;
  return map, objectCoord[2];
}

function getSpawnCoord(map, emptySpace) {
  let emptySpaceCoord = Math.floor(Math.random() * emptySpace[1]) + 1;
  for (let i = 0; i < emptySpace[0].length; i++) {
    emptySpaceCoord -= emptySpace[0][i];
    if (emptySpaceCoord <= 0) {
      var objectCoord = [i, emptySpaceCoord];
      break;
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

function increaceHeroDamage(content) {
  heroParameters["damage"] += content["modifier"];
}

function healHero(content) {
  heroParameters["hp"] = heroParameters["maxhp"];
}

function spawnHero(map, object_parameters) {
  var emptySpace = getEmptySpace(map);
  var heroCoord = getSpawnCoord(map, emptySpace);
  $(".field")
    .children()
    .eq(heroCoord[0])
    .children()
    .eq(heroCoord[1])
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
        heroCoord[0] + keys[e.code][0] >= 0 &&
        heroCoord[0] + keys[e.code][0] < map.length &&
        heroCoord[1] + keys[e.code][1] >= 0 &&
        heroCoord[1] + keys[e.code][1] < map[0].length &&
        map[heroCoord[0] + keys[e.code][0]][heroCoord[1] + keys[e.code][1]] !=
          "tileW"
      ) {
        heroCoord = [
          heroCoord[0] + keys[e.code][0],
          heroCoord[1] + keys[e.code][1],
        ];

        // двигаем игрока моделько игрока
        $(".tileP").removeClass("tileP");
        $(".field")
          .children()
          .eq(heroCoord[0])
          .children()
          .eq(heroCoord[1])
          .addClass("tileP");

        // если в клетке игрока есть предмет, используем его
        if (map[heroCoord[0]][heroCoord[1]] != "") {
          window[object_parameters[map[heroCoord[0]][heroCoord[1]]][0]](
            object_parameters[map[heroCoord[0]][heroCoord[1]]][1]
          );
          $(".field")
            .children()
            .eq(heroCoord[0])
            .children()
            .eq(heroCoord[1])
            .removeClass(map[heroCoord[0]][heroCoord[1]]);
          map[heroCoord[0]][heroCoord[1]] = "";
        }
        console.log(keys[e.code], heroCoord, heroParameters);
      }
    }
  };
  document.onkeyup = function (e) {
    if (keys[e.code] && keys[e.code][2] === true) {
      keys[e.code][2] = false;
    }
  };
}

var heroParameters = { damage: 2, hp: 100, maxhp: 100 };
$(function () {
  startGame(20, 32);
});

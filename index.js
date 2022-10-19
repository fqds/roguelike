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
    ["sword", 2],
    ["heal", 10],
  ]
) {
  var map = createMapArray(height, width);
  map = createRooms(map, roomsMin, roomsMax, wMin, wMax, hMin, hMax);
  map = createTunnels(map, tunnelsMin, tunnelsMax);
  console.log(map);
  map = spawnObjects(map, objects);
  console.log(map);
}

function createMapArray(height, width) {
  let arr = [];
  for (let i = 0; i < height; i++) {
    arr.push([]);
    for (let j = 0; j < width; j++) {
      arr[i].push("w"); // w == wall
    }
  }
  return arr;
}

function createRooms(map, roomsMin, roomsMax, wMin, wMax, hMin, hMax) {
  const roomsAmount = Math.floor(Math.random() * (roomsMax - roomsMin)) + 1;
  for (let i = 0; i < roomsAmount; i++) {
    map = createRoom(map, wMin, wMax, hMin, hMax);
  }
  return map;
}

function createRoom(map, wMin, wMax, hMin, hMax) {
  const roomHeight = Math.floor(Math.random() * (hMax - hMin)) + hMin + 1;
  const roomWidth = Math.floor(Math.random() * (wMax - wMin)) + wMin + 1;
  const roomY = Math.floor(Math.random() * (map.length - roomHeight));
  const roomX = Math.floor(Math.random() * (map[0].length - roomWidth));
  for (let y = roomY; y < roomY + roomHeight; y++) {
    for (let x = roomX; x < roomX + roomWidth; x++) {
      map[y][x] = "e"; // e == empty
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
      map[y][x] = "e";
    }
  } else {
    const x = Math.floor(Math.random() * map[0].length);
    for (let y = 0; y < map.length; y++) {
      map[y][x] = "e";
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
      if (map[y][x] === "e") {
        emptySpaceTotal += 1;
        emptySpaceArray[y] += 1;
      }
    }
  }
  return [emptySpaceArray, emptySpaceTotal];
}

function spawnObjects(map, objects) {
  for (let object_id = 0; object_id < objects.length; object_id++) {
    for (let i = 0; i < objects[object_id][1]; i++) {
      console.log(object_id, i, objects[object_id][1]);
      map = spawnObject(map, objects[object_id][0]);
    }
  }
  return map;
}

function spawnObject(map, object) {
  const emptySpace = getEmptySpace(map);
  let objectCoord = getSpawnCoord(emptySpace);
  console.log(object, objectCoord);
  for (let i = map[0].length - 1; i >= 0; i--) {
    if (map[objectCoord[0]][i] === "e") {
      if (objectCoord[1] === 0) {
        map[objectCoord[0]][i] = object;
        return map;
      }
      objectCoord[1] += 1;
    }
  }
}

function getSpawnCoord(emptySpace) {
  let emptySpaceCoord = Math.floor(Math.random() * emptySpace[1]);
  for (let i = 0; i < emptySpace[0].length; i++) {
    emptySpaceCoord -= emptySpace[0][i];
    if (emptySpaceCoord <= 0) {
      return [i, emptySpaceCoord];
    }
  }
}

$(function () {
  startGame(20, 32);
});

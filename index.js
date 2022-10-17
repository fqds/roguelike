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
  hMax = 8
) {
  var map = createMapArray(height, width);
  map = createRooms(map, roomsMin, roomsMax, wMin, wMax, hMin, hMax);
  map = createTunnels(map, tunnelsMin, tunnelsMax);
  emptySpace = getEmptySpace(map)
  
  console.log(map);
  console.log(emptySpace);
}

function createMapArray(height, width) {
  arr = [];
  for (i = 0; i < height; i++) {
    arr.push([]);
    for (j = 0; j < width; j++) {
      arr[i].push("wall");
    }
  }
  return arr;
}

function createRooms(map, roomsMin, roomsMax, wMin, wMax, hMin, hMax) {
  roomsAmount = Math.floor(Math.random() * (roomsMax - roomsMin)) + 1;
  for (i = 0; i < roomsAmount; i++) {
    map = createRoom(map, wMin, wMax, hMin, hMax);
  }
  return map;
}

function createRoom(map, wMin, wMax, hMin, hMax) {
  roomHeight = Math.floor(Math.random() * (hMax - hMin)) + hMin + 1;
  roomWidth = Math.floor(Math.random() * (wMax - wMin)) + wMin + 1;
  roomY = Math.floor(Math.random() * (map.length - roomHeight));
  roomX = Math.floor(Math.random() * (map[0].length - roomWidth));
  for (y = roomY; y < roomY + roomHeight; y++) {
    for (x = roomX; x < roomX + roomWidth; x++) {
      map[y][x] = "empty";
    }
  }
  return map;
}

function createTunnels(map, tunnelsMin, tunnelsMax) {
  horizontalTonnelsAmount =
    Math.floor(Math.random() * (tunnelsMax - tunnelsMin + 1)) + tunnelsMin;
  verticalTonnelsAmount =
    Math.floor(Math.random() * (tunnelsMax - tunnelsMin + 1)) + tunnelsMin;
  for (i = 0; i < horizontalTonnelsAmount; i++) {
    map = createTunnel(map, true);
  }
  for (i = 0; i < verticalTonnelsAmount; i++) {
    map = createTunnel(map, false);
  }
  return map;
}

function createTunnel(map, is_horizontal) {
  if (is_horizontal) {
    y = Math.floor(Math.random() * map.length);
    for (x = 0; x < map[0].length; x++) {
      map[y][x] = "empty";
    }
  } else {
    x = Math.floor(Math.random() * map[0].length);
    for (y = 0; y < map.length; y++) {
      map[y][x] = "empty";
    }
  }
  return map;
}

function getEmptySpace(map) {
  emptySpaceArray = [];
  emptySpaceTotal = 0;
  for (y = 0; y < map.length; y++) {
    emptySpaceArray.push(0);
    for (x = 0; x < map[0].length; x++) {
      if (map[y][x] === "empty") {
        emptySpaceTotal += 1;
        emptySpaceArray[y] += 1;
      }
    }
  }
  return [emptySpaceArray, emptySpaceTotal];
}

$(function () {
  startGame(20, 32);
});

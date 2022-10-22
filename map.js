import { settings } from "./settings.js";
import { getSpawnCoord } from "./mixins.js";

function createMapArray() {
  let map = [];
  for (let i = 0; i < settings.height; i++) {
    map.push([]);
    for (let j = 0; j < settings.width; j++) {
      map[i].push("tileW");
    }
  }
  return map;
}

function createRooms(map) {
  const roomAmount =
    Math.floor(
      Math.random() * (settings.roomAmountMax - settings.roomAmountMin + 1)
    ) + settings.roomAmountMin;
  for (let i = 0; i < roomAmount; i++) {
    map = createRoom(map);
  }
  return map;
}

function createRoom(map) {
  const roomHeight =
    Math.floor(
      Math.random() * (settings.roomHeightMax - settings.roomHeightMin + 1)
    ) + settings.roomHeightMin;
  const roomWidth =
    Math.floor(
      Math.random() * (settings.roomWidthMax - settings.roomWidthMin + 1)
    ) + settings.roomWidthMin;
  const roomY = Math.floor(Math.random() * (map.length - roomHeight));
  const roomX = Math.floor(Math.random() * (map[0].length - roomWidth));
  for (let y = roomY; y < roomY + roomHeight; y++) {
    for (let x = roomX; x < roomX + roomWidth; x++) {
      map[y][x] = "";
    }
  }
  return map;
}

function createTunnels(map) {
  const horizontalTonnelsAmount =
    Math.floor(
      Math.random() *
        (settings.tunnelsAmountMax - settings.tunnelsAmountMin + 1)
    ) + settings.tunnelsAmountMin;
  const verticalTonnelsAmount =
    Math.floor(
      Math.random() *
        (settings.tunnelsAmountMax - settings.tunnelsAmountMin + 1)
    ) + settings.tunnelsAmountMin;
  for (let i = 0; i < horizontalTonnelsAmount; i++) {
    const y = Math.floor(Math.random() * map.length);
    for (let x = 0; x < map[0].length; x++) {
      map[y][x] = "";
    }
  }
  for (let i = 0; i < verticalTonnelsAmount; i++) {
    const x = Math.floor(Math.random() * map[0].length);
    for (let y = 0; y < map.length; y++) {
      map[y][x] = "";
    }
  }
  return map;
}

function spawnObjects(map) {
  for (let object_id = 0; object_id < settings.objects.length; object_id++) {
    for (let i = 0; i < settings.objects[object_id][1]; i++) {
      var objectCoord = getSpawnCoord(map);
      map[objectCoord[0]][objectCoord[1]] = settings.objects[object_id][0];
    }
  }
  return map;
}

function generateMap() {
  let map = createMapArray();
  map = createRooms(map);
  map = createTunnels(map);
  map = spawnObjects(map);
  return map;
}

export { generateMap };

import { map } from "./index.js";

// выводит рандомную не занятую координату
function getSpawnCoord(map) {
  var emptySpace = getEmptySpace(map);
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
        return [objectCoord[0], i];
      }
      objectCoord[1] += 1;
    }
  }
}

// получает кол-во свободных координат для работы с getSpawnCoord
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

function clearTile(y, x, name) {
  $(".field").children().eq(y).children().eq(x).removeClass(name);
  map[y][x] = "";
}

function drawTile(y, x, name) {
  $(".field").children().eq(y).children().eq(x).addClass(name);
  map[y][x] = name;
}

function isPossibleDirection(coord, direction) {
  if (
    coord[0] + direction[0] >= 0 &&
    coord[0] + direction[0] < map.length &&
    coord[1] + direction[1] >= 0 &&
    coord[1] + direction[1] < map[0].length
  ) {
    return true;
  }
  return false;
}

export { getSpawnCoord, clearTile, drawTile, isPossibleDirection };

import { generateMap } from "./map.js";
import { spawnPlayer } from "./player.js";
import { spawnEnemies } from "./enemy.js";
import { getSpawnCoord } from "./mixins.js";

function startGame() {
  renderMap(map);
  spawnPlayer(map, playerParameters);
  spawnEnemies(map, enemyArray, playerCoord);
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

var map = generateMap();
var playerCoord = getSpawnCoord(map);
var playerParameters = {};
var enemyArray = {};
$(function () {
  startGame(20, 32);
});

export { playerCoord };

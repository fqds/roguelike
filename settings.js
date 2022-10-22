const settings = {
  height: 20,
  width: 32,
  tunnelsAmountMin: 3,
  tunnelsAmountMax: 5,
  roomAmountMin: 5,
  roomAmountMax: 10,
  roomWidthMin: 3,
  roomWidthMax: 8,
  roomHeightMin: 3,
  roomHeightMax: 8,
  objects: [
    ["tileSW", 2],
    ["tileHP", 10],
  ],
  playerBaseParameters: { damage: 20, hp: 50, maxhp: 100, weaponrange: 1 },
  objectParameters: {
    tileSW: function (playerParameters) {
      playerParameters.damage += 15;
    },
    tileHP: function (playerParameters) {
      playerParameters.hp = playerParameters.maxhp;
    },
  },
  enemies: [["tileE", 10]],
  enemyParameters: {
    tileE: {
      damage: 30,
      hp: 200,
      maxhp: 250,
      weaponrange: 1,
      visionrange: 8,
      name: "tileE",
    },
  },
};

export { settings };

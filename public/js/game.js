(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Overall game object
var Game = function Game() {
  _classCallCheck(this, Game);

  rooms = [];
};

exports.default = GameContainer;

},{}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _tile = require("./tile.object");

var _tile2 = _interopRequireDefault(_tile);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Map object, former room object refactored into map object
var Map = function () {
  function Map(roomName) {
    _classCallCheck(this, Map);

    this.name = roomName;
    this.description = "";
    this.displayName = "";
    this.chests = [];
    this.monsters = [];
    this.doors = [];
    this.waters = [];
    this.lavas = [];
    this.spikes = [];
    this.firepits = [];
    this.switches = [];
    this.mapArrays = [];
    this.atmosphericStrings = ["Something furry scurries by your feet.", "You feel a slow and steady dripping of water from the ceiling.", "A musty and unpleasant smell wafts in front of you.", "A bat flies past your head and disappears into the darkness.", "In the far distance your hear something shuffle toward you.", "The stone floor here is slick and slippery.", "Surely there’s a door nearby?", "You note a trickle of liquid on your arm, feel it, and taste your blood.", "A creaking and groaning as of rusty hinges starts from a far area of the room, then stops just as quickly.", "A tendril of mist curls around you.", "The ceiling seems to be closing in, but maybe that’s just you.", "The tile you’re on is loose, and it rattles loudly beneath you.", "A sound of stone scraping against stone reverberates for a short time, then seems to muffle itself."];
  }

  _createClass(Map, [{
    key: "createMap",
    value: function createMap(ySize, xSize) {
      this.mapArrays = [];
      for (var row = 0; row < ySize; row++) {
        this.mapArrays[row] = [];
        for (var col = 0; col < xSize; col++) {
          var tempTile = new _tile2.default(row, col);
          this.mapArrays[row].push(tempTile);
        }
      }
    }
  }, {
    key: "displayMap",
    value: function displayMap() {
      $("#map").empty();
      for (var row = 0; row < this.mapArrays.length; row++) {
        var tempString = "";
        for (var col = 0; col < this.mapArrays[row].length; col++) {
          tempString += "<span id=\"location-" + row + "-" + col + "\" class=\"" + this.mapArrays[row][col].color + "\">" + this.mapArrays[row][col].symbol + "</span>";
        }
        $("#map").append("<p>" + tempString + "</p>");
      }
    }
  }, {
    key: "adjustAllSpawns",
    value: function adjustAllSpawns(percentage) {
      for (var row = 0; row < this.mapArrays.length; row++) {
        for (var col = 0; col < this.mapArrays[row].length; col++) {
          this.mapArrays[row][col].increaseSpawn(percentage);
        }
      }
    }
  }, {
    key: "resetAllSpawns",
    value: function resetAllSpawns() {
      for (var row = 0; row < this.mapArrays.length; row++) {
        for (var col = 0; col < this.mapArrays[row].length; col++) {
          this.mapArrays[row][col].resetSpawn();
        }
      }
    }
  }, {
    key: "displayRoomDesc",
    value: function displayRoomDesc() {
      $("#room-name").text(this.displayName);
      $("#room-info").text(this.description);
    }
  }, {
    key: "displayAtmospheric",
    value: function displayAtmospheric() {
      var coinFlip = Math.floor(Math.random() * 2) + 1;
      if (coinFlip == 1) {
        var randomIdx = Math.floor(Math.random() * this.atmosphericStrings.length);
        $("#atmospheric-display").text(this.atmosphericStrings[randomIdx]);
      } else {
        $("#atmospheric-display").text("");
      }
    }

    // callback function for wall creating methods

  }, {
    key: "createWall",
    value: function createWall(wallThis) {
      wallThis.canMove = false;
      wallThis.description = "A wall";
      wallThis.terrainType = "wall";
      wallThis.symbol = "^";
      wallThis.color = "wall";
    }

    // converts borders of map into wall tiles

  }, {
    key: "makeWalls",
    value: function makeWalls() {
      var height = this.mapArrays.length;
      var width = this.mapArrays[0].length;
      var bottomRowY = this.mapArrays.length - 1;
      var lastColumnX = this.mapArrays[0].length - 1;

      for (var idx = 0; idx < width; idx++) {
        var toWall = this.mapArrays[0][idx];
        this.createWall(toWall);
      }
      for (var idx = 0; idx < width; idx++) {
        var toWall = this.mapArrays[bottomRowY][idx];
        this.createWall(toWall);
      }
      for (var idx = 1; idx < height - 1; idx++) {
        var toWall1 = this.mapArrays[idx][0];
        var toWall2 = this.mapArrays[idx][lastColumnX];
        this.createWall(toWall1);
        this.createWall(toWall2);
      }
    }

    // Makes individual tiles into walls

  }, {
    key: "makeAWall",
    value: function makeAWall(yLocation, xLocation) {
      var toWall = this.mapArrays[yLocation][xLocation];
      this.createWall(toWall);
    }
  }]);

  return Map;
}();

exports.default = Map;

},{"./tile.object":3}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Tile = function () {
  function Tile(yCoord, xCoord) {
    _classCallCheck(this, Tile);

    this.y = yCoord;
    this.x = xCoord;
    this.canMove = true;
    this.description = "A floor tile";
    this.terrainType = "floor";
    this.symbol = "#";
    this.color = "tiles";
    this.searchable = false;
    this.spawnChance = 10;
    this.monsterHere = false;
    this.drops = [];
    this.occupiedBy = {};
  }

  _createClass(Tile, [{
    key: "increaseSpawn",
    value: function increaseSpawn(percentage) {
      this.spawnChance += percentage;
    }
  }, {
    key: "resetSpawn",
    value: function resetSpawn() {
      this.spawnChance = 8;
    }
  }]);

  return Tile;
}();

exports.default = Tile;

},{}],4:[function(require,module,exports){
'use strict';

var _gameContainer = require('./js/gameContainer');

var _gameContainer2 = _interopRequireDefault(_gameContainer);

var _map = require('./js/map.object');

var _map2 = _interopRequireDefault(_map);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"./js/gameContainer":1,"./js/map.object":2}]},{},[4])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL0FwcERhdGEvUm9hbWluZy9ucG0vbm9kZV9tb2R1bGVzL3dhdGNoaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZXZcXGpzXFxnYW1lQ29udGFpbmVyLmpzIiwiZGV2XFxqc1xcbWFwLm9iamVjdC5qcyIsImRldlxcanNcXHRpbGUub2JqZWN0LmpzIiwiZGV2XFxtYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7QUNBQTtJQUNNLEksR0FDSixnQkFBYztBQUFBOztBQUNaLFVBQVEsRUFBUjtBQUNELEM7O2tCQUdZLGE7Ozs7Ozs7Ozs7O0FDUGY7Ozs7Ozs7O0FBRUE7SUFDTSxHO0FBRUosZUFBWSxRQUFaLEVBQXNCO0FBQUE7O0FBQ3BCLFNBQUssSUFBTCxHQUFZLFFBQVo7QUFDQSxTQUFLLFdBQUwsR0FBbUIsRUFBbkI7QUFDQSxTQUFLLFdBQUwsR0FBbUIsRUFBbkI7QUFDQSxTQUFLLE1BQUwsR0FBYyxFQUFkO0FBQ0EsU0FBSyxRQUFMLEdBQWdCLEVBQWhCO0FBQ0EsU0FBSyxLQUFMLEdBQWEsRUFBYjtBQUNBLFNBQUssTUFBTCxHQUFjLEVBQWQ7QUFDQSxTQUFLLEtBQUwsR0FBYSxFQUFiO0FBQ0EsU0FBSyxNQUFMLEdBQWMsRUFBZDtBQUNBLFNBQUssUUFBTCxHQUFnQixFQUFoQjtBQUNBLFNBQUssUUFBTCxHQUFnQixFQUFoQjtBQUNBLFNBQUssU0FBTCxHQUFpQixFQUFqQjtBQUNBLFNBQUssa0JBQUwsR0FBMEIsQ0FBQyx3Q0FBRCxFQUEyQyxnRUFBM0MsRUFBNkcscURBQTdHLEVBQW9LLDhEQUFwSyxFQUFvTyw2REFBcE8sRUFBbVMsNkNBQW5TLEVBQWtWLCtCQUFsVixFQUFtWCwwRUFBblgsRUFBK2IsNEdBQS9iLEVBQTZpQixxQ0FBN2lCLEVBQW9sQixnRUFBcGxCLEVBQXNwQixpRUFBdHBCLEVBQXl0QixxR0FBenRCLENBQTFCO0FBQ0Q7Ozs7OEJBRVMsSyxFQUFP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bEhULEk7QUFFSixnQkFBWSxNQUFaLEVBQW9CLE1BQXBCLEVBQTRCO0FBQUE7O0FBQzFCLFNBQUssQ0FBTCxHQUFTLE1BQVQ7QUFDQSxTQUFLLENBQUwsR0FBUyxNQUFUO0FBQ0EsU0FBSyxPQUFMLEdBQWUsSUFBZjtBQUNBLFNBQUssV0FBTCxHQUFtQixjQUFuQjtBQUNBLFNBQUssV0FBTCxHQUFtQixPQUFuQjtBQUNBLFNBQUssTUFBTCxHQUFjLEdBQWQ7QUFDQSxTQUFLLEtBQUwsR0FBYSxPQUFiO0FBQ0EsU0FBSyxVQUFMLEdBQWtCLEtBQWxCO0FBQ0EsU0FBSyxXQUFMLEdBQW1CLEVBQW5CO0FBQ0EsU0FBSyxXQUFMLEdBQW1CLEtBQW5CO0FBQ0EsU0FBSyxLQUFMLEdBQWEsRUFBYjtBQUNBLFNBQUssVUFBTCxHQUFrQixFQUFsQjtBQUNEOzs7O2tDQUVhLFUsRUFBWTtBQUN4QixXQUFLLFdBQUwsSUFBb0IsVUFBcEI7QUFDRDs7O2lDQUVZO0FBQ1gsV0FBSyxXQUFMLEdBQW1CLENBQW5CO0FBQ0Q7Ozs7OztrQkFJWSxJOzs7OztBQzNCZjs7OztBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8vIE92ZXJhbGwgZ2FtZSBvYmplY3RcclxuY2xhc3MgR2FtZSB7XHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICByb29tcyA9IFtdO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgR2FtZUNvbnRhaW5lclxyXG4iLCJpbXBvcnQgVGlsZSBmcm9tICcuL3RpbGUub2JqZWN0JztcclxuXHJcbi8vIE1hcCBvYmplY3QsIGZvcm1lciByb29tIG9iamVjdCByZWZhY3RvcmVkIGludG8gbWFwIG9iamVjdFxyXG5jbGFzcyBNYXAge1xyXG5cclxuICBjb25zdHJ1Y3Rvcihyb29tTmFtZSkge1xyXG4gICAgdGhpcy5uYW1lID0gcm9vbU5hbWU7XHJcbiAgICB0aGlzLmRlc2NyaXB0aW9uID0gXCJcIjtcclxuICAgIHRoaXMuZGlzcGxheU5hbWUgPSBcIlwiO1xyXG4gICAgdGhpcy5jaGVzdHMgPSBbXTtcclxuICAgIHRoaXMubW9uc3RlcnMgPSBbXTtcclxuICAgIHRoaXMuZG9vcnMgPSBbXTtcclxuICAgIHRoaXMud2F0ZXJzID0gW107XHJcbiAgICB0aGlzLmxhdmFzID0gW107XHJcbiAgICB0aGlzLnNwaWtlcyA9IFtdO1xyXG4gICAgdGhpcy5maXJlcGl0cyA9IFtdO1xyXG4gICAgdGhpcy5zd2l0Y2hlcyA9IFtdO1xyXG4gICAgdGhpcy5tYXBBcnJheXMgPSBbXTtcclxuICAgIHRoaXMuYXRtb3NwaGVyaWNTdHJpbmdzID0gW1wiU29tZXRoaW5nIGZ1cnJ5IHNjdXJyaWVzIGJ5IHlvdXIgZmVldC5cIiwgXCJZb3UgZmVlbCBhIHNsb3cgYW5kIHN0ZWFkeSBkcmlwcGluZyBvZiB3YXRlciBmcm9tIHRoZSBjZWlsaW5nLlwiLCBcIkEgbXVzdHkgYW5kIHVucGxlYXNhbnQgc21lbGwgd2FmdHMgaW4gZnJvbnQgb2YgeW91LlwiLCBcIkEgYmF0IGZsaWVzIHBhc3QgeW91ciBoZWFkIGFuZCBkaXNhcHBlYXJzIGludG8gdGhlIGRhcmtuZXNzLlwiLCBcIkluIHRoZSBmYXIgZGlzdGFuY2UgeW91ciBoZWFyIHNvbWV0aGluZyBzaHVmZmxlIHRvd2FyZCB5b3UuXCIsIFwiVGhlIHN0b25lIGZsb29yIGhlcmUgaXMgc2xpY2sgYW5kIHNsaXBwZXJ5LlwiLCBcIlN1cmVseSB0aGVyZeKAmXMgYSBkb29yIG5lYXJieT9cIiwgXCJZb3Ugbm90ZSBhIHRyaWNrbGUgb2YgbGlxdWlkIG9uIHlvdXIgYXJtLCBmZWVsIGl0LCBhbmQgdGFzdGUgeW91ciBibG9vZC5cIiwgXCJBIGNyZWFraW5nIGFuZCBncm9hbmluZyBhcyBvZiBydXN0eSBoaW5nZXMgc3RhcnRzIGZyb20gYSBmYXIgYXJlYSBvZiB0aGUgcm9vbSwgdGhlbiBzdG9wcyBqdXN0IGFzIHF1aWNrbHkuXCIsIFwiQSB0ZW5kcmlsIG9mIG1pc3QgY3VybHMgYXJvdW5kIHlvdS5cIiwgXCJUaGUgY2VpbGluZyBzZWVtcyB0byBiZSBjbG9zaW5nIGluLCBidXQgbWF5YmUgdGhhdOKAmXMganVzdCB5b3UuXCIsIFwiVGhlIHRpbGUgeW914oCZcmUgb24gaXMgbG9vc2UsIGFuZCBpdCByYXR0bGVzIGxvdWRseSBiZW5lYXRoIHlvdS5cIiwgXCJBIHNvdW5kIG9mIHN0b25lIHNjcmFwaW5nIGFnYWluc3Qgc3RvbmUgcmV2ZXJiZXJhdGVzIGZvciBhIHNob3J0IHRpbWUsIHRoZW4gc2VlbXMgdG8gbXVmZmxlIGl0c2VsZi5cIl07XHJcbiAgfVxyXG5cclxuICBjcmVhdGVNYXAoeVNpemUsIHhTaXplKSB7XHJcbiAgICB0aGlzLm1hcEFycmF5cyA9IFtdO1xyXG4gICAgZm9yKHZhciByb3cgPSAwOyByb3cgPCB5U2l6ZTsgcm93KyspIHtcclxuICAgICAgdGhpcy5tYXBBcnJheXNbcm93XSA9IFtdO1xyXG4gICAgICBmb3IodmFyIGNvbCA9IDA7IGNvbCA8IHhTaXplOyBjb2wrKykge1xyXG4gICAgICAgIHZhciB0ZW1wVGlsZSA9IG5ldyBUaWxlKHJvdywgY29sKTtcclxuICAgICAgICB0aGlzLm1hcEFycmF5c1tyb3ddLnB1c2godGVtcFRpbGUpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBkaXNwbGF5TWFwKCkge1xyXG4gICAgJChcIiNtYXBcIikuZW1wdHkoKTtcclxuICAgIGZvcih2YXIgcm93ID0gMDsgcm93IDwgdGhpcy5tYXBBcnJheXMubGVuZ3RoOyByb3crKykge1xyXG4gICAgICB2YXIgdGVtcFN0cmluZyA9IFwiXCI7XHJcbiAgICAgIGZvcih2YXIgY29sID0gMDsgY29sIDwgdGhpcy5tYXBBcnJheXNbcm93XS5sZW5ndGg7IGNvbCsrKSB7XHJcbiAgICAgICAgdGVtcFN0cmluZyArPSBcIjxzcGFuIGlkPVxcXCJsb2NhdGlvbi1cIiArIHJvdyArIFwiLVwiICsgY29sICsgXCJcXFwiIGNsYXNzPVxcXCJcIiArIHRoaXMubWFwQXJyYXlzW3Jvd11bY29sXS5jb2xvciArIFwiXFxcIj5cIiArIHRoaXMubWFwQXJyYXlzW3Jvd11bY29sXS5zeW1ib2wgK1wiPC9zcGFuPlwiO1xyXG4gICAgICB9XHJcbiAgICAgICQoXCIjbWFwXCIpLmFwcGVuZChcIjxwPlwiICsgdGVtcFN0cmluZyArIFwiPC9wPlwiKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGFkanVzdEFsbFNwYXducyhwZXJjZW50YWdlKSB7XHJcbiAgICBmb3IodmFyIHJvdyA9IDA7IHJvdyA8IHRoaXMubWFwQXJyYXlzLmxlbmd0aDsgcm93KyspIHtcclxuICAgICAgZm9yKHZhciBjb2wgPSAwOyBjb2wgPCB0aGlzLm1hcEFycmF5c1tyb3ddLmxlbmd0aDsgY29sKyspIHtcclxuICAgICAgICB0aGlzLm1hcEFycmF5c1tyb3ddW2NvbF0uaW5jcmVhc2VTcGF3bihwZXJjZW50YWdlKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmVzZXRBbGxTcGF3bnMoKSB7XHJcbiAgICBmb3IodmFyIHJvdyA9IDA7IHJvdyA8IHRoaXMubWFwQXJyYXlzLmxlbmd0aDsgcm93KyspIHtcclxuICAgICAgZm9yKHZhciBjb2wgPSAwOyBjb2wgPCB0aGlzLm1hcEFycmF5c1tyb3ddLmxlbmd0aDsgY29sKyspIHtcclxuICAgICAgICB0aGlzLm1hcEFycmF5c1tyb3ddW2NvbF0ucmVzZXRTcGF3bigpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBkaXNwbGF5Um9vbURlc2MoKSB7XHJcbiAgICAkKFwiI3Jvb20tbmFtZVwiKS50ZXh0KHRoaXMuZGlzcGxheU5hbWUpO1xyXG4gICAgJChcIiNyb29tLWluZm9cIikudGV4dCh0aGlzLmRlc2NyaXB0aW9uKTtcclxuICB9XHJcblxyXG4gIGRpc3BsYXlBdG1vc3BoZXJpYygpIHtcclxuICAgIHZhciBjb2luRmxpcCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDIpICsgMTtcclxuICAgIGlmKGNvaW5GbGlwID09IDEpIHtcclxuICAgICAgdmFyIHJhbmRvbUlkeCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHRoaXMuYXRtb3NwaGVyaWNTdHJpbmdzLmxlbmd0aCk7XHJcbiAgICAgICQoXCIjYXRtb3NwaGVyaWMtZGlzcGxheVwiKS50ZXh0KHRoaXMuYXRtb3NwaGVyaWNTdHJpbmdzW3JhbmRvbUlkeF0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgJChcIiNhdG1vc3BoZXJpYy1kaXNwbGF5XCIpLnRleHQoXCJcIik7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyBjYWxsYmFjayBmdW5jdGlvbiBmb3Igd2FsbCBjcmVhdGluZyBtZXRob2RzXHJcbiAgY3JlYXRlV2FsbCh3YWxsVGhpcykge1xyXG4gICAgd2FsbFRoaXMuY2FuTW92ZSA9IGZhbHNlO1xyXG4gICAgd2FsbFRoaXMuZGVzY3JpcHRpb24gPSBcIkEgd2FsbFwiO1xyXG4gICAgd2FsbFRoaXMudGVycmFpblR5cGUgPSBcIndhbGxcIjtcclxuICAgIHdhbGxUaGlzLnN5bWJvbCA9IFwiXlwiO1xyXG4gICAgd2FsbFRoaXMuY29sb3IgPSBcIndhbGxcIjtcclxuICB9XHJcblxyXG4gIC8vIGNvbnZlcnRzIGJvcmRlcnMgb2YgbWFwIGludG8gd2FsbCB0aWxlc1xyXG4gIG1ha2VXYWxscygpIHtcclxuICBcdHZhciBoZWlnaHQgPSB0aGlzLm1hcEFycmF5cy5sZW5ndGg7XHJcbiAgICB2YXIgd2lkdGggPSB0aGlzLm1hcEFycmF5c1swXS5sZW5ndGg7XHJcbiAgICB2YXIgYm90dG9tUm93WSA9IHRoaXMubWFwQXJyYXlzLmxlbmd0aCAtIDE7XHJcbiAgICB2YXIgbGFzdENvbHVtblggPSB0aGlzLm1hcEFycmF5c1swXS5sZW5ndGggLSAxO1xyXG5cclxuICAgIGZvcih2YXIgaWR4ID0gMDsgaWR4IDwgd2lkdGg7IGlkeCsrKSB7XHJcbiAgICBcdHZhciB0b1dhbGwgPSB0aGlzLm1hcEFycmF5c1swXVtpZHhdO1xyXG4gICAgICB0aGlzLmNyZWF0ZVdhbGwodG9XYWxsKTtcclxuICAgIH1cclxuICAgIGZvcih2YXIgaWR4ID0gMDsgaWR4IDwgd2lkdGg7IGlkeCsrKSB7XHJcbiAgICBcdHZhciB0b1dhbGwgPSB0aGlzLm1hcEFycmF5c1tib3R0b21Sb3dZXVtpZHhdO1xyXG4gICAgICB0aGlzLmNyZWF0ZVdhbGwodG9XYWxsKTtcclxuICAgIH1cclxuICAgIGZvcih2YXIgaWR4ID0gMTsgaWR4IDwgaGVpZ2h0LTE7IGlkeCsrKSB7XHJcbiAgICBcdHZhciB0b1dhbGwxID0gdGhpcy5tYXBBcnJheXNbaWR4XVswXTtcclxuICAgICAgdmFyIHRvV2FsbDIgPSB0aGlzLm1hcEFycmF5c1tpZHhdW2xhc3RDb2x1bW5YXTtcclxuICAgICAgdGhpcy5jcmVhdGVXYWxsKHRvV2FsbDEpO1xyXG4gICAgICB0aGlzLmNyZWF0ZVdhbGwodG9XYWxsMik7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyBNYWtlcyBpbmRpdmlkdWFsIHRpbGVzIGludG8gd2FsbHNcclxuICBtYWtlQVdhbGwoeUxvY2F0aW9uLCB4TG9jYXRpb24pIHtcclxuICAgIHZhciB0b1dhbGwgPSB0aGlzLm1hcEFycmF5c1t5TG9jYXRpb25dW3hMb2NhdGlvbl07XHJcbiAgICB0aGlzLmNyZWF0ZVdhbGwodG9XYWxsKTtcclxuICB9XHJcblxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBNYXBcclxuIiwiY2xhc3MgVGlsZSB7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHlDb29yZCwgeENvb3JkKSB7XHJcbiAgICB0aGlzLnkgPSB5Q29vcmQ7XHJcbiAgICB0aGlzLnggPSB4Q29vcmQ7XHJcbiAgICB0aGlzLmNhbk1vdmUgPSB0cnVlO1xyXG4gICAgdGhpcy5kZXNjcmlwdGlvbiA9IFwiQSBmbG9vciB0aWxlXCI7XHJcbiAgICB0aGlzLnRlcnJhaW5UeXBlID0gXCJmbG9vclwiO1xyXG4gICAgdGhpcy5zeW1ib2wgPSBcIiNcIjtcclxuICAgIHRoaXMuY29sb3IgPSBcInRpbGVzXCI7XHJcbiAgICB0aGlzLnNlYXJjaGFibGUgPSBmYWxzZTtcclxuICAgIHRoaXMuc3Bhd25DaGFuY2UgPSAxMDtcclxuICAgIHRoaXMubW9uc3RlckhlcmUgPSBmYWxzZTtcclxuICAgIHRoaXMuZHJvcHMgPSBbXTtcclxuICAgIHRoaXMub2NjdXBpZWRCeSA9IHt9O1xyXG4gIH1cclxuXHJcbiAgaW5jcmVhc2VTcGF3bihwZXJjZW50YWdlKSB7XHJcbiAgICB0aGlzLnNwYXduQ2hhbmNlICs9IHBlcmNlbnRhZ2U7XHJcbiAgfVxyXG5cclxuICByZXNldFNwYXduKCkge1xyXG4gICAgdGhpcy5zcGF3bkNoYW5jZSA9IDg7XHJcbiAgfVxyXG5cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgVGlsZVxyXG4iLCJpbXBvcnQgR2FtZUNvbnRhaW5lciBmcm9tICcuL2pzL2dhbWVDb250YWluZXInO1xyXG5pbXBvcnQgTWFwIGZyb20gJy4vanMvbWFwLm9iamVjdCc7XHJcbiJdfQ==

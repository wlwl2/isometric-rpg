levelData = [
  [1,1,1,1,1,1],
  [1,0,0,0,0,1],
  [1,0,0,0,0,1],
  [1,0,0,0,0,1],
  [1,0,0,0,0,1],
  [1,1,1,1,1,1]
]

var game = {
  tileWidth: 30,
  tileHeight: 30
}

for (var i = 0; i < levelData.length; i++)	{
	for (var j = 0; j < levelData; j++) {
    x = j * tileWidth
    y = i * tileHeight
    tileType = levelData[i][j]
    placetile(tileType, x, y)
	}
}

function Point (x, y) {
  this.x = x
  this.y = y
}

function isometricToCartesian (pt) {
  var tempPt = new Point(0, 0)
  tempPt.x = (2 * pt.y + pt.x) / 2
  tempPt.y = (2 * pt.y - pt.x) / 2
  return(tempPt)
}

var test = {x: 10, y: 5}

console.log(cartesianToIsometric(test))

function cartesianToIsometric (pt) {
  var tempPt = new Point(0, 0)
  tempPt.x = pt.x - pt.y
  tempPt.y = (pt.x + pt.y) / 2
  return(tempPt)
}

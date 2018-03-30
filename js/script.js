function init (){
  const canvas = document.createElement('canvas')
  canvas.height = 512
  canvas.width = 512
  const ctx = canvas.getContext('2d')
  document.querySelector('body').appendChild(canvas)
  return { ctx, canvas }
}

const {ctx, canvas} = init()

levelData = [
  [1,1,1,1,1,1],
  [1,0,0,0,0,1],
  [1,0,0,0,0,1],
  [1,0,0,0,0,1],
  [1,0,0,0,0,1],
  [1,1,1,1,1,1]
]

const game = {
  tileWidth: 30,
  tileHeight: 30
}

function placetile (tileType, pt, ctx) {
  if (tileType === 1) {
    ctx.fillStyle = 'brown'
    ctx.fillRect(pt.x + 200, pt.y, 30, 30)
  }
  if (tileType === 0) {
    ctx.fillStyle = 'green'
    ctx.fillRect(pt.x + 200, pt.y, 30, 30)
  }
}

for (var i = 0; i < levelData.length; i++)	{
	for (var j = 0; j < levelData[i].length; j++) {
    x = j * game.tileWidth
    y = i * game.tileHeight
    tileType = levelData[i][j]
    placetile(tileType, cartesianToIsometric({x: x, y: y}), ctx)
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

// console.log(cartesianToIsometric(test))

function cartesianToIsometric (pt) {
  var tempPt = new Point(0, 0)
  tempPt.x = pt.x - pt.y
  tempPt.y = (pt.x + pt.y) / 2
  return(tempPt)
}

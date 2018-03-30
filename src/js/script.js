window.addEventListener('load', function (event) {

  function init () {
    const canvas = document.createElement('canvas')
    canvas.height = 512
    canvas.width = 512
    const ctx = canvas.getContext('2d')
    document.querySelector('body').appendChild(canvas)
    return { ctx, canvas }
  }

  const {ctx, canvas} = init()

  levelData = [
    [1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1],
    [1,0,0,0,0,0,1],
    [1,0,0,0,0,0,1],
    [1,0,0,0,0,0,1],
    [1,0,0,0,0,0,1],
    [1,1,1,1,1,1,1]
  ]

  const game = {tileWidth: 16, tileHeight: 16}

  const image = document.getElementById('source')

  function placetile (tileType, pt, ctx) {
    if (tileType === 1) {
      ctx.drawImage(image, 0, 0, 64, 64, pt.x + 240, pt.y + 176, 32, 32)
    }
    if (tileType === 0) {
      ctx.drawImage(image, 0, 320, 64, 64, pt.x + 240, pt.y + 176, 32, 32)
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

  function cartesianToIsometric (pt) {
    var tempPt = new Point(0, 0)
    tempPt.x = pt.x - pt.y
    tempPt.y = (pt.x + pt.y) / 2
    return(tempPt)
  }
}, false)

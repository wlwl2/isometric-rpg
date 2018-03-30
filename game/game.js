var game = new Phaser.Game(600, 400, Phaser.AUTO, 'TutContainer',
  {preload: preload, create: create, update:update}
)

var upKey
var downKey
var leftKey
var rightKey

// Level array.
var levelData = [
  [1,1,1,1,1,1],
  [1,0,0,0,0,1],
  [1,0,1,2,0,1],
  [1,0,0,0,0,1],
  [1,0,0,0,0,1],
  [1,1,1,1,1,1]
]

// x & y values of the direction vector for character movement.
var dX = 0
var dY = 0

var tileWidth = 50

// To centralize the isometric level display.
var borderOffset = new Phaser.Point(250, 50)

var wallGraphicHeight = 98
var floorGraphicWidth = 103
var floorGraphicHeight = 53
var heroGraphicWidth = 41
var heroGraphicHeight = 62
var wallHeight = wallGraphicHeight-floorGraphicHeight

// Adjustments to make the legs hit the middle of the tile for initial load
var heroHeight = (floorGraphicHeight / 2) + (heroGraphicHeight-floorGraphicHeight) + 6

// For placing hero at the middle of the tile
var heroWidth= (floorGraphicWidth/2)-(heroGraphicWidth/2)

// Direction the character faces.
var facing='south'

// Hero.
var sorcerer
var sorcererShadow
var shadowOffset = new Phaser.Point(heroWidth + 7, 11)

// Title text.
var bmpText

// Text to display hero coordinates.
var normText

// Mini-map holder group.
var minimap

// Hero marker sprite in the minimap.
var heroMapSprite

// This is the render texture onto which we draw depth sorted scene.
var gameScene
var floorSprite
var wallSprite

// Hero tile values in array.
var heroMapTile

// 2D coordinates of hero map marker sprite in minimap, assume this is mid point of graphic.
var heroMapPos
var heroSpeed=1.2

function preload () {
	game.load.crossOrigin='Anonymous'
  // Load all necessary assets.
  game.load.bitmapFont('font', 'https://dl.dropboxusercontent.com/s/z4riz6hymsiimam/font.png?dl=0', 'https://dl.dropboxusercontent.com/s/7caqsovjw5xelp0/font.xml?dl=0')
  game.load.image('greenTile', 'https://dl.dropboxusercontent.com/s/nxs4ptbuhrgzptx/green_tile.png?dl=0')
  game.load.image('redTile', 'https://dl.dropboxusercontent.com/s/zhk68fq5z0c70db/red_tile.png?dl=0')
  game.load.image('heroTile', 'https://dl.dropboxusercontent.com/s/8b5zkz9nhhx3a2i/hero_tile.png?dl=0')
  game.load.image('heroShadow', 'https://dl.dropboxusercontent.com/s/sq6deec9ddm2635/ball_shadow.png?dl=0')
  game.load.image('floor', 'https://dl.dropboxusercontent.com/s/h5n5usz8ejjlcxk/floor.png?dl=0')
  game.load.image('wall', 'https://dl.dropboxusercontent.com/s/uhugfdq1xcwbm91/block.png?dl=0')
  game.load.image('ball', 'https://dl.dropboxusercontent.com/s/pf574jtx7tlmkj6/ball.png?dl=0')
  game.load.atlasJSONArray('hero', 'https://dl.dropboxusercontent.com/s/hradzhl7mok1q25/hero_8_4_41_62.png?dl=0', 'https://dl.dropboxusercontent.com/s/95vb0e8zscc4k54/hero_8_4_41_62.json?dl=0')
}

function create () {
  bmpText = game.add.bitmapText(10, 10, 'font', 'Isometric Tutorial\nUse Arrow Keys', 18)
  normText=game.add.text(10, 360, 'hi')
  upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP)
  downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN)
  leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT)
  rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT)
  game.stage.backgroundColor = '#cccccc'

  // We draw the depth sorted scene into this render texture.
  gameScene = game.add.renderTexture(game.width,game.height)
  game.add.sprite(0, 0, gameScene)
  floorSprite = game.make.sprite(0, 0, 'floor')
  wallSprite = game.make.sprite(0, 0, 'wall')
  sorcererShadow = game.make.sprite(0,0,'heroShadow')
  sorcererShadow.scale = new Phaser.Point(0.5, 0.6)
  sorcererShadow.alpha = 0.4
  createLevel()
}

function update () {
  //check key press
  detectKeyInput()

  //if no key is pressed then stop else play walking animation
  if (dY === 0 && dX === 0) {
    sorcerer.animations.stop()
    sorcerer.animations.currentAnim.frame=0
  } else{
    if (sorcerer.animations.currentAnim !== facing) {
      sorcerer.animations.play(facing)
    }
  }

  //check if we are walking into a wall else move hero in 2D
  if (isWalkable()) {
    heroMapPos.x +=  heroSpeed * dX
    heroMapPos.y +=  heroSpeed * dY
    heroMapSprite.x = heroMapPos.x - heroMapSprite.width / 2
    heroMapSprite.y = heroMapPos.y - heroMapSprite.height / 2

    //get the new hero map tile
    heroMapTile=getTileCoordinates(heroMapPos,tileWidth)

    //depthsort & draw new scene
    renderScene()
  }
}

function createLevel () {
  //create minimap
  minimap = game.add.group()
  var tileType = 0
  for (var i = 0; i < levelData.length; i++) {
    for (var j = 0; j < levelData[0].length; j++) {
      tileType = levelData[i][j]
      placeTile(tileType, i, j)

      // Save hero map tile.
      if (tileType === 2) {
         heroMapTile = new Phaser.Point(i,j)
      }
    }
  }
  addHero()
  heroMapSprite = minimap.create(heroMapTile.y * tileWidth, heroMapTile.x * tileWidth, 'heroTile')
  heroMapSprite.x += (tileWidth / 2) - (heroMapSprite.width / 2)
  heroMapSprite.y += (tileWidth / 2) - (heroMapSprite.height / 2)
  heroMapPos = new Phaser.Point(heroMapSprite.x + heroMapSprite.width / 2, heroMapSprite.y + heroMapSprite.height / 2)
  heroMapTile = getTileCoordinates(heroMapPos, tileWidth)
  minimap.scale = new Phaser.Point(0.3, 0.3)
  minimap.x = 500
  minimap.y = 10
  // Draw once the initial state.
  renderScene()
}

function addHero () {
  // Sprite.
  // Keep him out side screen area.
  sorcerer = game.add.sprite(-50, 0, 'hero', '1.png')

  // Animation.
  sorcerer.animations.add('southeast', ['1.png','2.png','3.png','4.png'], 6, true)
  sorcerer.animations.add('south', ['5.png','6.png','7.png','8.png'], 6, true)
  sorcerer.animations.add('southwest', ['9.png','10.png','11.png','12.png'], 6, true)
  sorcerer.animations.add('west', ['13.png','14.png','15.png','16.png'], 6, true)
  sorcerer.animations.add('northwest', ['17.png','18.png','19.png','20.png'], 6, true)
  sorcerer.animations.add('north', ['21.png','22.png','23.png','24.png'], 6, true)
  sorcerer.animations.add('northeast', ['25.png','26.png','27.png','28.png'], 6, true)
  sorcerer.animations.add('east', ['29.png','30.png','31.png','32.png'], 6, true)
}

// Place minimap.
function placeTile (tileType, i, j) {
  var tile = 'greenTile'
  if (tileType === 1) tile = 'redTile'
  minimap.create(j * tileWidth, i * tileWidth, tile)
}

function renderScene () {
  // Clear the previous frame then draw again.
  gameScene.clear()
  var tileType = 0
  for (var i = 0; i < levelData.length; i++) {
    for (var j = 0; j < levelData[0].length; j++) {
      tileType=levelData[i][j]
      drawTileIso(tileType,i,j)
      if (i === heroMapTile.y && j === heroMapTile.x) drawHeroIso()
    }
  }
  normText.text = 'Hero is on x: ' + heroMapTile.x + ' , y: ' + heroMapTile.y
}

function drawHeroIso () {
  // It is not advisable to create points in update loop.
  var isoPt = new Phaser.Point()
  var heroCornerPt = new Phaser.Point(heroMapPos.x - heroMapSprite.width / 2, heroMapPos.y - heroMapSprite.height / 2)
  // Find new isometric position for hero from 2D map position.
  isoPt = cartesianToIsometric(heroCornerPt)

  //draw shadow to render texture
  gameScene.renderXY(sorcererShadow, isoPt.x + borderOffset.x + shadowOffset.x, isoPt.y + borderOffset.y + shadowOffset.y, false)

  //draw hero to render texture
  gameScene.renderXY(sorcerer, isoPt.x + borderOffset.x + heroWidth, isoPt.y + borderOffset.y - heroHeight, false)
}

// Place isometric level tiles.
function drawTileIso (tileType, i, j) {
  // It is not advisable to create point in update loop.
  var isoPt = new Phaser.Point()
  // This is here for better code readability.
  var cartPt = new Phaser.Point()
  cartPt.x = j * tileWidth
  cartPt.y = i * tileWidth
  isoPt = cartesianToIsometric(cartPt)
  if (tileType === 1) {
    gameScene.renderXY(wallSprite, isoPt.x + borderOffset.x, isoPt.y + borderOffset.y - wallHeight, false)
  } else {
    gameScene.renderXY(floorSprite, isoPt.x + borderOffset.x, isoPt.y + borderOffset.y, false)
  }
}

// It is not advisable to create points in update loop, but for code readability.
function isWalkable () {
  var able = true
  var heroCornerPt = new Phaser.Point(heroMapPos.x - heroMapSprite.width / 2, heroMapPos.y - heroMapSprite.height / 2)
  var cornerTL = new Phaser.Point()
  cornerTL.x = heroCornerPt.x + (heroSpeed * dX)
  cornerTL.y = heroCornerPt.y + (heroSpeed * dY)

  // Now we have the top left corner point.
  // We need to find all 4 corners based on the map marker graphics width & height.
  // Ideally we should just provide the hero a volume instead of using the graphics width & height
  var cornerTR = new Phaser.Point()
  cornerTR.x = cornerTL.x + heroMapSprite.width
  cornerTR.y = cornerTL.y
  var cornerBR = new Phaser.Point()
  cornerBR.x = cornerTR.x
  cornerBR.y = cornerTL.y + heroMapSprite.height
  var cornerBL = new Phaser.Point()
  cornerBL.x = cornerTL.x
  cornerBL.y = cornerBR.y
  var newTileCorner1
  var newTileCorner2
  var newTileCorner3 = heroMapPos

  // Let us get which 2 corners to check based on current facing, may be 3.
  switch (facing) {
    case 'north':
      newTileCorner1=cornerTL
      newTileCorner2=cornerTR
    break
    case 'south':
      newTileCorner1=cornerBL
      newTileCorner2=cornerBR
    break
    case 'east':
      newTileCorner1=cornerBR
      newTileCorner2=cornerTR
    break
    case 'west':
      newTileCorner1=cornerTL
      newTileCorner2=cornerBL
    break
    case 'northeast':
      newTileCorner1=cornerTR
      newTileCorner2=cornerBR
      newTileCorner3=cornerTL
    break
    case 'southeast':
      newTileCorner1=cornerTR
      newTileCorner2=cornerBR
      newTileCorner3=cornerBL
    break
    case 'northwest':
      newTileCorner1=cornerTR
      newTileCorner2=cornerBL
      newTileCorner3=cornerTL
    break
    case 'southwest':
      newTileCorner1=cornerTL
      newTileCorner2=cornerBR
      newTileCorner3=cornerBL
    break
  }

  // Check if those corners fall inside a wall after moving
  newTileCorner1 = getTileCoordinates(newTileCorner1, tileWidth)
  if (levelData[newTileCorner1.y][newTileCorner1.x] === 1) able = false
  newTileCorner2 = getTileCoordinates(newTileCorner2,tileWidth)
  if (levelData[newTileCorner2.y][newTileCorner2.x] === 1) able = false
  newTileCorner3=getTileCoordinates(newTileCorner3,tileWidth);
  if (levelData[newTileCorner3.y][newTileCorner3.x] === 1) able=false
  return able
}

// Assign direction for character & set x, y speed components.
function detectKeyInput () {
  if (upKey.isDown) {
    dY = -1
  } else if (downKey.isDown) {
    dY = 1
  } else {
    dY = 0
  }
  if (rightKey.isDown) {
    dX = 1
    if (dY === 0) {
      facing = 'east'
    } else if (dY === 1) {
      facing = 'southeast'
      dX = dY = 0.5
    } else {
      facing = 'northeast'
      dX = 0.5
      dY = -0.5
    }
  } else if (leftKey.isDown) {
    dX = -1
    if (dY === 0) {
      facing = 'west'
    } else if (dY === 1) {
      facing = 'southwest'
      dY = 0.5
      dX = -0.5
    } else {
      facing = 'northwest'
      dX = dY = -0.5
    }
  } else {
    dX = 0
    if (dY === 0) {
      // facing="west"
    } else if (dY === 1) {
      facing = "south"
    } else {
      facing = "north"
    }
  }
}

function cartesianToIsometric (cartPt) {
  var tempPt = new Phaser.Point()
  tempPt.x = cartPt.x - cartPt.y
  tempPt.y = (cartPt.x + cartPt.y) / 2
  return (tempPt)
}

function isometricToCartesian(isoPt){
  var tempPt = new Phaser.Point()
  tempPt.x = (2 * isoPt.y + isoPt.x) / 2
  tempPt.y = (2 * isoPt.y - isoPt.x) / 2
  return (tempPt)
}

function getTileCoordinates(cartPt, tileHeight){
  var tempPt = new Phaser.Point()
  tempPt.x = Math.floor(cartPt.x / tileHeight)
  tempPt.y = Math.floor(cartPt.y / tileHeight)
  return(tempPt)
}

function getCartesianFromTileCoordinates(tilePt, tileHeight){
  var tempPt = new Phaser.Point()
  tempPt.x = tilePt.x * tileHeight
  tempPt.y = tilePt.y * tileHeight
  return(tempPt)
}

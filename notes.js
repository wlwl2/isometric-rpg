// Cartesian to isometric:
isoX = cartX - cartY
isoY = (cartX + cartY) / 2

// Isometric to Cartesian:
cartX = (2 * isoY + isoX) / 2
cartY = (2 * isoY - isoX) / 2

// Walkable tile
game.Tile0 = function () {}
game.Tile0.prototype.walkable = true
game.Tile0.prototype.frame = 1

// Wall tile
game.Tile1 = function () {}
game.Tile1.prototype.walkable = false
game.Tile1.prototype.frame = 2

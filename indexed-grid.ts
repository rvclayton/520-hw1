var newIndexedGrid = function(

  // Return a new indexed grid.

    paper		// the paper on which the grid will be drawn.
  , ght			// the grid height in pixels.
  , gwd			// the grid width in pixels.
  , gulx		// the x coordinate of the grid's upper-left corner.
  , guly		// the y coordinate of the grid's upper-left corner.
  , cols		// the number of columss in the grid.
  , rows		// the number of rows in the grid.
  , configuration	// an object of grid features.
			//   obstructions, a list of obstructed cell
			//     coordinates.  Default: none.
                        //   start, the coordinate of the start cell.  Default:
                        //     none.
                        //   goals, a list of coordinates for the goal cells.
                        //     Default: none.
  ) {

  var isDefined = function (x) {
    var undefined;
    return x !== undefined;
    };

  var xCoord = function (pt) {
    return pt[0];
    };

  var yCoord = function (pt) {
    return pt[1];
    };

  var rowHt = ght/rows;
  var indexSize = Math.round(rowHt*0.4);

  var grid = newGrid(
    paper, ght - indexSize, gwd - indexSize, gulx + indexSize, guly,
    cols, rows, configuration);    

  var IG = function () {};
  IG.prototype = {
    draw: function () {

      // Draw the grid in its current state.

      grid.draw();

      var i;
      
      for (i = 0; i < cols; ++i) {
	var ul = grid.ul(0, i);
	paper.text(
	  xCoord(ul) - Math.floor(indexSize*0.7),
	  yCoord(ul) + Math.floor(rowHt*0.45),
	  i.toString()).attr({
	    'font-size': indexSize,
	    'fill': 'white'
	    });
        }

      for (i = 0; i < rows; ++i) {
	var ul = grid.ul(i, 0);
	paper.text(
	  xCoord(ul) + Math.floor(grid.colWd()*0.5),
	  yCoord(ul) + Math.floor(rowHt + indexSize*0.5), i.toString()).attr({
	    'font-size': indexSize,
	    'fill': 'white'
	    });
        }
      }
    };

  return new IG();
  }

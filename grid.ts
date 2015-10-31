/// <reference path = "Coordinate.ts"/>


var newGrid = function(

  // Return a new grid.

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

  var drawLabel = function(label, pt) {
    var x = gridUlx + (xCoord(pt) + 0.5)*gridColWd;
    var y = gridUly + (rows - yCoord(pt) - 0.5)*gridRowHt;
    paper.text(x, y, label).attr({
      'font-size': Math.floor(gridRowHt*0.6),
      'fill': 'white'
      });
    };

  var drawLine = function(x, y, deltaX, deltaY) {
    paper.path("M" + x + " " + y + "L" + deltaX + " " + deltaY)
      .attr('stroke', 'white');
    };

  var drawObstruction = function(obstruction) {
    var ulx = gridUlx + xCoord(obstruction)*gridColWd;
    var uly = gridUly + (rows - yCoord(obstruction) - 1)*gridRowHt;
    paper.rect(ulx, uly, gridColWd, gridRowHt)
      .attr('fill', 'rgb(128, 128, 128)');
    };

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

  var gridColWd = Math.floor(gwd/cols);
  var gridRowHt = Math.floor(ght/rows);
  var gridHt = rows*gridRowHt;
  var gridWd = cols*gridColWd;
  var gridUlx = gulx + Math.floor((gwd - gridWd)/2);
  var gridUly = guly + Math.floor((ght - gridHt)/2);
    
  if (!isDefined(configuration))
    configuration = { };
  if (!isDefined(configuration.obstructions))
    configuration.obstructions = [ ];
  
  var G = function () {};
  G.prototype = {

      colWd: function () {
	return gridColWd;
        }    

    , draw: function () {

	// Draw the grid in its current state.

	var i;

	for (i = configuration.obstructions.length - 1; i > -1; --i)
	  drawObstruction(configuration.obstructions[i]);

	for (i = 0; i <= cols; ++i) {
	  var x = gridUlx + i*gridColWd;
	  drawLine(x, gridUly, x, gridUly + gridHt);
	  }

	for (i = 0; i <= rows; ++i) {
	  var y = gridUly + i*gridRowHt;
	  drawLine(gridUlx, y, gridUlx + gridWd, y);
	  }

	if (isDefined(configuration.start))
	  drawLabel("S", configuration.start);
	if (isDefined(configuration.goals))
	  for (i = configuration.goals.length - 1; i > -1; --i)
	    drawLabel("G", configuration.goals[i]);
	}

    , numberCell: function(x, y, n) {

        var fontSize = Math.floor(gridRowHt*0.2);
        x = gridUlx + (x + 0.15)*gridColWd;
	y = gridUly + (rows - y - 0.8)*gridRowHt;

	paper.text(x, y, n.toString()).attr({
          'font-size': fontSize,
          'fill': 'white'
          });
        }

    , ul: function(x, y) {

        // Return the coordinate of upper-left corner of the cell with the
        // given coordinates.

        return [
	  gridUlx + x*gridColWd,
	  gridUly + (rows - y - 1)*gridRowHt
	  ];
        }

    , valueCell: function(c: Coordinate, v: number): void {

        var fontSize = Math.floor(gridRowHt*0.2);
        var x = gridUlx + (c.x() + 0.15)*gridColWd;
	var y = gridUly + (rows - c.y() - 0.2)*gridRowHt;

	paper.text(x, y, v.toString()).attr({
          'font-size': fontSize,
          'fill': 'white'
          });
        }
    };

  return new G();
  }

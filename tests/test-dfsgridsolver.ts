var NullGrid = (function () {
  function F() { }
  F.prototype.numberCell = function (x, y, n) { }
  return F
  })()
var nullGrid = new NullGrid()

function pathLength(state): number {
  var i = 0;
  for ( ; state != undefined; state = state.parent())
    ++i;
  return i;
  }

// a 2x2 problem with no solution.

var start = new Coordinate(0, 0);
var goal = new Coordinate(1, 1);
var p = new DFSGridProblem(
  start, goal, [ new Coordinate(1, 0), new Coordinate(0, 1)], 2, 2);

var pathEnd = DFSGridSolver(p, nullGrid);

if (pathEnd != undefined)
  throw new Error("unsolvable problem has been solved");


if (true) {
  // A 2x2 problem with a solution: up then right.

  p = new DFSGridProblem(start, goal, [ ], 2, 2);
  pathEnd = DFSGridSolver(p, nullGrid);

  if (pathEnd == undefined)
    throw new Error("Solvable problem didn't find a solution");
  if (!p.goalState(pathEnd))
    throw new Error("Solvable problem solution didn't reach the goal state");
  if (pathLength(pathEnd) != 3)
    throw new Error("solution doesn't have three states");
  pathEnd = pathEnd.parent();
  if (!pathEnd.coordinate().equal(new Coordinate(0, 1)))
    throw new Error("solution doesn't favor moving up");
  pathEnd = pathEnd.parent();
  if (!pathEnd.coordinate().equal(start))
    throw new Error("solution begin at the start state");
  }
  

if (true) {

  // A 2x2 problem with a solution: up then right then down.  This solution
  // needs cycle avoidance.


  goal = new Coordinate(1, 0);
  p = new DFSGridProblem(start, goal, [ ], 2, 2);
  pathEnd = DFSGridSolver(p, nullGrid);

  if (pathEnd == undefined)
    throw new Error("Solvable problem didn't find a solution");
  if (!p.goalState(pathEnd))
    throw new Error("Solvable problem didn't reach the goal state");
  if (pathLength(pathEnd) != 4)
    throw new Error(
      "solution should have four states, has " + pathLength(pathEnd));
  pathEnd = pathEnd.parent();
  if (!pathEnd.coordinate().equal(new Coordinate(1, 1)))
    throw new Error("solution doesn't favor moving down");
  pathEnd = pathEnd.parent();
  if (!pathEnd.coordinate().equal(new Coordinate(0, 1)))
    throw new Error("solution doesn't favor moving right");
  pathEnd = pathEnd.parent();
  if (!pathEnd.coordinate().equal(start))
    throw new Error("solution begin at the start state");
  }
  

if (true) {

  // the homework problem 1.
  
  var cols = 8;
  var rows = 8;
  start = new Coordinate(2, 5);
  goal = new Coordinate(4, 3);
  var obstacles = [
    new Coordinate(2, 2), new Coordinate(2, 3), new Coordinate(3, 2),
    new Coordinate(3, 3), new Coordinate(3, 4), new Coordinate(3, 5),
    new Coordinate(4, 4), new Coordinate(5, 4), new Coordinate(6, 3)
    ];
  p = new DFSGridProblem(start, goal, obstacles, rows, cols);

  pathEnd = DFSGridSolver(p, nullGrid);

  if (pathEnd == undefined)
    throw new Error("Solvable problem didn't find a solution");
  if (!p.goalState(pathEnd))
    throw new Error("Solvable problem didn't reach the goal state");
  }

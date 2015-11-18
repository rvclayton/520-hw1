/// <reference path = "../as-grid.ts"/>


var NullGrid = (function () {
  function F() { }
  F.prototype.numberCell = function (x, y, n) { }
  return F
  })();
var nullGrid = new NullGrid();

function announceTest(label) {
  // console.log('\n' + label + ' test.');
  }

function pathLength(state): number {
  var i = 0;
  for ( ; state != undefined; state = state.parent())
    ++i;
  return i;
  }

announceTest('unsolvable 2x2');

var start = new Coordinate(0, 0);
var goal = new Coordinate(1, 1);
var p = new ASGridProblem(
  start, goal, [ new Coordinate(1, 0), new Coordinate(0, 1)], 2, 2);

var pathEnd = ASGridSolver(p, nullGrid);

if (pathEnd != undefined)
  throw new Error("unsolvable problem has been solved");


if (true) {

  announceTest('2-step solvable 2x2');

  p = new ASGridProblem(start, goal, [ ], 2, 2);
  pathEnd = ASGridSolver(p, nullGrid);

  if (pathEnd == undefined)
    throw new Error("Solvable 2x2 problem didn't find a solution");
  if (!p.goalState(pathEnd))
    throw new Error("2x2 problem solution didn't reach the goal state");
  if (pathLength(pathEnd) != 3)
    throw new Error("2x2 solution doesn't have three states");
  pathEnd = pathEnd.parent();
  if (!pathEnd.coordinate().equal(new Coordinate(0, 1)))
    throw new Error("2x2 solution doesn't favor moving up");
  pathEnd = pathEnd.parent();
  if (!pathEnd.coordinate().equal(start))
    throw new Error("2x2 solution didn't begin at the start state");
  }
  

if (true) {

  announceTest('1-step solvable 2x2');

  goal = new Coordinate(1, 0);
  p = new ASGridProblem(start, goal, [ ], 2, 2);
  pathEnd = ASGridSolver(p, nullGrid);

  if (pathEnd == undefined)
    throw new Error("1-step solvable problem didn't find a solution");
  if (!p.goalState(pathEnd))
    throw new Error("1-step solvable problem didn't reach the goal state");
  if (pathLength(pathEnd) != 2)
    throw new Error(
      "solution should have 2 states, has " + pathLength(pathEnd));
  pathEnd = pathEnd.parent();
  if (!pathEnd.coordinate().equal(start))
    throw new Error("solution begin at the start state");
  }
  

if (true) {

  announceTest('solvable homework');
  
  var cols = 8;
  var rows = 8;
  start = new Coordinate(2, 5);
  goal = new Coordinate(4, 3);
  var obstacles = [
    new Coordinate(2, 2), new Coordinate(2, 3), new Coordinate(3, 2),
    new Coordinate(3, 3), new Coordinate(3, 4), new Coordinate(3, 5),
    new Coordinate(4, 4), new Coordinate(5, 4), new Coordinate(6, 3)
    ];
  p = new ASGridProblem(start, goal, obstacles, rows, cols);

  pathEnd = ASGridSolver(p, nullGrid);

  if (pathEnd == undefined)
    throw new Error("Solvable problem didn't find a solution");
  if (!p.goalState(pathEnd))
    throw new Error("Solvable problem didn't reach the goal state");
  }

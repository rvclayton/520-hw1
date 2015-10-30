var start = new Coordinate(0, 0);
var goal = new Coordinate(2, 2);
var p = new DFSGridProblem(start, goal, [ ], 3, 3);

var goalState = new DFSGridState(goal);
var startState = new DFSGridState(start);

if (!p.goalState(goalState))
  throw new Error("Goal state didn't match goal state");
if (p.goalState(startState))
  throw new Error("Goal state matched non-goal state");
if (p.startState().coordinate() != start)
  throw new Error("Start state coordinate mismatch");

function findCoordinate(n, c): boolean {
  for (var i = n.length - 1; i > -1; --i)
    if (n[i].coordinate().equal(c))
      return true;
  return false;
  };

var n = p.neighbors(goalState);

if (n.length != 2)
  throw new Error("Goal-state neighbors count isn't two");
if (!findCoordinate(n, new Coordinate(1, 2)))
  throw new Error("A goal-state neighbor is missing");
if (!findCoordinate(n, new Coordinate(2, 1)))
  throw new Error("A goal-state neighbor is missing");
  
n = p.neighbors(startState);

if (n.length != 2)
  throw new Error("Start-state neighbors count isn't two");
if (!findCoordinate(n, new Coordinate(0, 1)))
  throw new Error("A start-state neighbor is missing");
if (!findCoordinate(n, new Coordinate(1, 0)))
  throw new Error("A start-state neighbor is missing");

n = p.neighbors(new DFSGridState(new Coordinate(1, 1)));

if (n.length != 4)
  throw new Error("Middle-state neighbors count isn't four");
if (!findCoordinate(n, new Coordinate(0, 1)))
  throw new Error("A middle-state neighbor is missing");
if (!findCoordinate(n, new Coordinate(1, 0)))
  throw new Error("A middle-state neighbor is missing");
if (!findCoordinate(n, new Coordinate(1, 2)))
  throw new Error("A middle-state neighbor is missing");
if (!findCoordinate(n, new Coordinate(2, 1)))
  throw new Error("A middle-state neighbor is missing");


var goal = new Coordinate(1, 1);
p = new DFSGridProblem(start, goal, [ new Coordinate(0, 1), new Coordinate(1, 0) ], 2, 2);

goalState = new DFSGridState(goal);

if (!p.goalState(goalState))
  throw new Error("Goal state coordinate mismatch");
if (p.startState().coordinate() != start)
  throw new Error("Start state coordinate mismatch");

n = p.neighbors(goalState);
if (n.length != 0)
  throw new Error("Goal-state neighbors count isn't zero");
n = p.neighbors(startState);
if (n.length != 0)
  throw new Error("Goal-state neighbors count isn't zero");

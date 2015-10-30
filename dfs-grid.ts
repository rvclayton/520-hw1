/// <reference path = "Coordinate.ts"/>
/// <reference path = "GridMove.ts"/>

// Depth-first search.


class DFSGridFrontier {


  add(states: DFSGridState []): void {

    states = states.slice();
    states.sort(
      function (a: DFSGridState, b: DFSGridState): number {
        return a.move() - b.move();
	});
    
    for (var i = states.length - 1; i > -1; --i)
      this.stack.push(states[i]);
    }
    

  constructor(start: DFSGridState) {
    this.stack = [ start ];
    }


  empty(): boolean {
    return this.stack.length == 0;
    }
    

  nextState(): DFSGridState {
    // this.printStack('stack before nextState():');
    if (this.empty())
      throw "calling nextState() on an empty frontier";
    else {
      var s = this.stack.pop();
      // this.printStack('stack after nextState():');
      return s;
      }
    }


  private printStack(label: string) {
    var msg = label;
    var sep = ' ';
    for (var i = 0 ; i < this.stack.length; ++i) {
      var c = this.stack[i].coordinate();
      msg = msg + sep + c.x() + ' ' + c.y();
      sep = ', ';
      }
    console.log(msg);
    }


  private stack: DFSGridState [] = [ ];
  }



class DFSGridProblem {

  private allNeighbors(s: DFSGridState): DFSGridState [] {

    var n: DFSGridState [] = [ ];
    var moves = [ GridMove.up, GridMove.left, GridMove.right, GridMove.down ];
    
    for (var d in moves)
      n.push(new DFSGridState(s, d));

    return n;    
    }


  constructor(
    s: Coordinate,
    private goal: Coordinate,
    private obstructions: Coordinate [],
    private rows: number,
    private cols: number) {

    this.start = s;
    }


  goalState(s: DFSGridState): boolean {
    return this.goal.equal(s.coordinate());
    }


  neighbors(s: DFSGridState): DFSGridState [] {
    if (!this.validState(s))
      throw new Error("invalid state in neighbors()");
    // console.log('Neighbors of ' + s.coordinate().x() + ' ' + s.coordinate().y());
    return this.validNeighbors(this.allNeighbors(s));
    }


  startState(): DFSGridState {
    return new DFSGridState(this.start);
    }


  private validNeighbors(neighbors: DFSGridState []): DFSGridState [] {

    var n: DFSGridState [] = [ ];

    for (var i = neighbors.length - 1; i > -1; --i) {
      var s: DFSGridState = neighbors[i];
      if (this.validState(s)) {
        n.push(s)
        // console.log('  ' + s.coordinate().x() + ' ' + s.coordinate().y());
	}
      }	

    return n;
    }


  private validState(s: DFSGridState): boolean {

    var c = s.coordinate();

    var x = c.x();
    if ((x < 0) || (x >= this.rows))
      return false;
      
    var y = c.y();
    if ((y < 0) || (y >= this.cols))
      return false;
      
    for (var i = this.obstructions.length - 1; i > -1; --i)
      if (this.obstructions[i].equal(c))
        return false;
	
    return true;
    }


  private start: Coordinate;
  }

  
class DFSGridState {


  ancestor(s: DFSGridState): boolean {

    // Return true iff the given state is a not necessarily strict ancestor of
    // this state.
    
    for (var p = this; p != undefined; p = p.parent())
      if (p.equal(s))
        return true;

    return false;
    }


  constructor(source: any, m?: GridMove) {

    // Create a new state.  If source is a coordinate, m should be undefined
    // and the new state has an undefined parent and move.

    if (typeof m == 'undefined') {
      this.c = source;
      }
    else {
      this.m = m;
      this.p = source;

      var x = this.p.coordinate().x();
      var y = this.p.coordinate().y();

      if (m == GridMove.up)
        this.c = new Coordinate(x, y + 1);
      else if (m == GridMove.left)
        this.c = new Coordinate(x - 1, y);
      else if (m == GridMove.right)
        this.c = new Coordinate(x + 1, y);
      else if (m == GridMove.down)
        this.c = new Coordinate(x, y - 1);
      else 
        throw new Error("unrecognized grid move in new DFSGridState()");
      }
    }


  coordinate(): Coordinate {
    return this.c;
    }
    

  equal(s: any): boolean {
    return s.coordinate().equal(this.c);
    }


  move(): GridMove {
    return this.m;
    }


  parent(): DFSGridState {
    return this.p;
    }


  private p: DFSGridState;
  private c: Coordinate;
  private m: GridMove;
  }


function filter(a, p) {

  var newA = [];

  for (var i = 0; i < a.length; ++i)
    if (p(a[i]))
      newA.push(a[i]);

  return newA;
  }

  
function
DFSGridSolver(p: DFSGridProblem, grid): DFSGridState {

  var f: DFSGridFrontier = new DFSGridFrontier(p.startState());
  var stateCount = 0;
  
  do {
    var s: DFSGridState = f.nextState();

    grid.numberCell(s.coordinate().x(), s.coordinate().y(), stateCount++);

    if (p.goalState(s))
      return s;

    f.add(filter(p.neighbors(s), function (n) { return !s.ancestor(n); }));
    }
  while (!f.empty());

  return undefined;
  };

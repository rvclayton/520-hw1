/// <reference path = "Coordinate.ts"/>
/// <reference path = "GridMove.ts"/>

// Heuristic depth-first search.  The heuristic value is the Manhattan distance
// to the goal state.


class HDFSGridFrontier {


  add(states: HDFSGridState []): void {

    states = states.slice();
    states.sort(
      function (a: HDFSGridState, b: HDFSGridState): number {
        if (a.value() != b.value())
	  return a.value() - b.value();
        else	 
          return a.move() - b.move();
	});
    
    // this.printStack('stack before add()');
    for (var i = states.length - 1; i > -1; --i)
      this.stack.push(states[i]);
    // this.printStack('stack after add()');
    }
    

  constructor(start: HDFSGridState) {
    this.stack = [ start ];
    }


  empty(): boolean {
    return this.stack.length == 0;
    }
    

  nextState(): HDFSGridState {
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
      msg = msg + sep + this.stack[i].toString();
      sep = ', ';
      }
    console.log(msg);
    }


  private stack: HDFSGridState [] = [ ];
  }



class HDFSGridProblem {

  private allNeighbors(s: HDFSGridState): HDFSGridState [] {

    var n: HDFSGridState [] = [ ];
    var moves = [ GridMove.up, GridMove.left, GridMove.right, GridMove.down ];
    
    for (var d in moves)
      n.push(new HDFSGridState(s, d));

    return n;    
    }


  constructor(
    s: Coordinate,
    private goal: Coordinate,
    private obstructions: Coordinate [],
    private rows: number,
    private cols: number) {

    this.start = new HDFSGridState(s);
    this.start.setValue(this.manhattanDistance(this.start));
    }


  goalState(s: HDFSGridState): boolean {
    return this.goal.equal(s.coordinate());
    }


  private
  manhattanDistance(s: HDFSGridState): number {

    var c = s.coordinate();

    return Math.abs(c.x() - this.goal.x()) + Math.abs(c.y() - this.goal.y());
    }


  neighbors(s: HDFSGridState): HDFSGridState [] {
    if (!this.validState(s))
      throw new Error("invalid state in neighbors()");
    // console.log('Neighbors of ' + s.coordinate().x() + ' ' + s.coordinate().y());
    return this.validNeighbors(s, this.allNeighbors(s));
    }


  private
  prunable(state: HDFSGridState, neighbor: HDFSGridState): boolean {
    return state.hasAncestor(neighbor);
    }


  startState(): HDFSGridState {
    return this.start;
    }


  private
  validNeighbors(
    state: HDFSGridState, neighbors: HDFSGridState []): HDFSGridState [] {

    var n: HDFSGridState [] = [ ];

    for (var i = neighbors.length - 1; i > -1; --i) {
      var s: HDFSGridState = neighbors[i];
      if (this.validState(s) && !this.prunable(state, s)) {
        s.setValue(this.manhattanDistance(s));
        n.push(s)
        // console.log('  ' + s.coordinate().toString());
	}
      }	

    return n;
    }


  private
  validState(s: HDFSGridState): boolean {

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


  private start: HDFSGridState;
  }

  
class HDFSGridState {


  hasAncestor(s: HDFSGridState): boolean {

    // Return true iff the given state is a (not necessarily strict) ancestor
    // of this state.
    
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
        throw new Error("unrecognized grid move in new HDFSGridState()");
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


  parent(): HDFSGridState {
    return this.p;
    }


  setValue(v: number): void {

    if (this.v != undefined)
      throw new Error("trying to reset a state's value");
      
    this.v = v;
    }


  toString(): string {

    var msg = '{ ' + this.c.toString();

    if (this.m != undefined)
      msg = msg + ', ' + GridMove[this.m] + ', {' + this.p.c.toString() + '}';
      
    if (this.v != undefined)
      msg = msg + ', ' + this.v;

    return msg + ' }';
    }

    
  value(): number {
    return this.v;
    }
    
  private p: HDFSGridState;
  private c: Coordinate;
  private m: GridMove;
  private v: number;
  }


function
HDFSGridSolver(p: HDFSGridProblem, grid): HDFSGridState {

  var f: HDFSGridFrontier = new HDFSGridFrontier(p.startState());
  var stateCount = 0;
  
  do {
    var s: HDFSGridState = f.nextState();

    grid.numberCell(s.coordinate().x(), s.coordinate().y(), stateCount++);
    grid.valueCell(s.coordinate(), s.value());

    if (p.goalState(s))
      return s;

    f.add(p.neighbors(s));
    }
  while (!f.empty());

  return undefined;
  };

/// <reference path = "Coordinate.ts"/>
/// <reference path = "GridMove.ts"/>

// A* search.  The heuristic is the Manhattan distance to the goal.


class ASGridFrontier {


  add(states: ASGridState []): void {

    // this.printStack('p-queue before add():');
    // console.log('states.length = ' + states.length);

    this.stack.sort(
      function (a: ASGridState, b: ASGridState): number {

        var aValue = a.cost() + a.heuristic();
	var bValue = b.cost() + b.heuristic();

        if (aValue != bValue)
	  return aValue - bValue;
	else
	  return a.move() - b.move();
	});

    for (var i = states.length - 1; i > -1; --i)
      this.stack.push(states[i]);

    // this.printStack('p-queue after add():');
    }
    

  constructor(start: ASGridState) {
    this.stack = [ start ];
    }


  empty(): boolean {
    return this.stack.length == 0;
    }
    

  nextState(): ASGridState {
    // this.printStack('p-queue before nextState():');

    if (this.empty())
      throw "calling nextState() on an empty frontier";
    else {
      var s = this.stack.shift();
      // this.printStack('p-queue after nextState():');
      return s;
      }
    }


  private printStack(label: string) {
    console.log(label);
    for (var i = 0 ; i < this.stack.length; ++i)
      console.log('  ' + this.stack[i].toString());
    }


  private stack: ASGridState [];
  }



class ASGridProblem {

  private allNeighbors(s: ASGridState): ASGridState [] {

    // Return an array containing all the neighbors (valid and invalid) of the
    // given state.

    var n: ASGridState [] = [ ];
    var moves = [ GridMove.up, GridMove.left, GridMove.right, GridMove.down ];
    
    for (var d in moves)
      n.push(ASGridState.new(s, d));

    return n;    
    }


  constructor(
    private start: Coordinate,
    private goal: Coordinate,
    private obstructions: Coordinate [],
    private rows: number,
    private cols: number) {
    }


  goalState(s: ASGridState): boolean {
    return this.goal.equal(s.coordinate());
    }


  neighbors(s: ASGridState): ASGridState [] {

    if (!this.validState(s))
      throw new Error("invalid state in neighbors()");

    // console.log('Neighbors of ' + s.coordinate().toString());

    return this.validNeighbors(s, this.allNeighbors(s));
    }


  private
  prunableState(state: ASGridState, neighbor: ASGridState): boolean {

    // Return true iff the given neighbor of the given state can be pruned.

    // A neighbor can be (multi-path) pruned if it's the start state
    // (because the start state is already a member of this path). or the
    // neighbor's parent isn't the given state (which means the neighbor was
    // created on some path earlier in the search).

    return (neighbor == this.startState()) || (neighbor.parent() != state);
    }


  private setHeuristicValue(s: ASGridState): ASGridState {

    // Set the heuristic value of the given state, or die trying.
    
    var c = s.coordinate();

    s.setCost(s.pathLength());
    s.setHeuristic(
      Math.abs(c.x() - this.goal.x()) + Math.abs(c.y() - this.goal.y()));

    return s;
    }


  startState(): ASGridState {

    // Return this problem's start state.

    return ASGridState.new(this.start);
    }


  private
  validNeighbors(
    state: ASGridState, neighbors: ASGridState []): ASGridState [] {

    // Return a list of the valid states in the given list of neighbors of
    // the given state.
    
    var n: ASGridState [] = [ ];

    for (var i = neighbors.length - 1; i > -1; --i) {
      var s: ASGridState = neighbors[i];
      if (this.validState(s) && !this.prunableState(state, s)) {
        n.push(this.setHeuristicValue(s));
        // console.log('  ' + s.coordinate().toString());
	}
      }	

    return n;
    }


  private validState(child: ASGridState): boolean {

    var c = child.coordinate();

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
  }

  
class ASGridState {


  /* private */ constructor(c: Coordinate) {

    // This constructor shouldn't be called outside this class.  Use the
    // ASGridState.new() factory instead.

    this.c = c;
    }


  coordinate(): Coordinate {
    return this.c;
    }
    

  cost(): number {
    return this.cst;
    }
    

  equal(s: any): boolean {
    return s.coordinate().equal(this.c);
    }


  heuristic(): number {
    return this.hst;
    }
    
  private static label(c: Coordinate): string {
    return c.x().toString() + '.' + c.y().toString();
    }


  move(): GridMove {
    return this.m;
    }


  static new(source: any, m?: GridMove) {

    // Return the state associated with a coordinate.  If source is a
    // coordinate, m should be undefined. If source is a state, them m should
    // be defined and the state returned is the one associated with the
    // coordinate generated by applying m to source's coordinate.
    //
    // Each coordinate exactly one associated state, and that state is always
    // returned when given the associated coordinate.  In other words:
    //   s1.coordinate().equal(s2.coordinate()) <=> s2 = s1
    
    var c: Coordinate;
    
    if (m == undefined)
      c = source;
    else {
      c = source.coordinate();
      var x = c.x();
      var y = c.y();

      if (m == GridMove.up)
        c = new Coordinate(x, y + 1);
      else if (m == GridMove.left)
        c = new Coordinate(x - 1, y);
      else if (m == GridMove.right)
        c = new Coordinate(x + 1, y);
      else if (m == GridMove.down)
        c = new Coordinate(x, y - 1);
      else 
        throw new Error("unrecognized grid move in new ASGridState()");
      }

    var l = ASGridState.label(c);
    var s: ASGridState = ASGridState.cache[l];

    if (s == undefined) {
      s = new ASGridState(c);
      if (m != undefined) {
        s.p = source;
	s.m = m;
        }
      ASGridState.cache[l] = s;
      // console.log('cache ' + s.toString() + ' at ' + l);
      }

    return s;
    }


  parent(): ASGridState {
    return this.p;
    }


  pathLength(): number {

    // Return the length of the path from the start state to this state.
    
    var l = 0;

    for (var s = this; s.parent() != undefined; s = s.parent())
      ++l;
      
    return l;
    }


  static reset(): void {
    ASGridState.cache = { };
    }


  setCost(c: number): void {
    if (this.cst != undefined)
      throw new Error(
        "trying to reset a state " + this.toString() + "'s cost");
    this.cst = c;
    }


  setHeuristic(h: number): void {
    if (this.hst != undefined)
      throw new Error(
        "trying to reset a state " + this.toString() + "'s heuristic");
    this.hst = h;
    }


  toString(): string {

    var msg = '{ ' + this.c.toString();

    if (this.m != undefined)
      msg = msg + ', ' + GridMove[this.m] + ', {' + this.p.c.toString() + '}';
      
    if (this.cst != undefined)
      msg = msg + ', ' + this.cst + '+' + this.hst;

    return msg + ' }';
    }

    
  private p: ASGridState;
  private m: GridMove;
  private cst: number;
  private hst: number;
  private c: Coordinate;
  
  private static cache = { };
  }


function
ASGridSolver(p: ASGridProblem, grid): ASGridState {

  ASGridState.reset();
  
  var f: ASGridFrontier = new ASGridFrontier(p.startState());
  var stateCount = 0;

  do {
    var s: ASGridState = f.nextState();

    grid.numberCell(s.coordinate().x(), s.coordinate().y(), stateCount++);

    if (p.goalState(s))
      return s;

    f.add(p.neighbors(s));
    }
  while (!f.empty());

  return undefined;
  };

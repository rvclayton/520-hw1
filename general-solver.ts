interface Frontier {
  add(states: State[]): void;
  empty(): boolean;
  nextState(): State;
  };

interface Problem {
  goalState(s: State): boolean;
  neighbors(s: State): State [];
  startState(): State;
  };

interface State {
  equal(s: State): boolean;
  };


enum GridMove { up, left, right, down };


class Coordinate {

  constructor(x: number, y: number) { this.c = [ x, y ]; }

  equal(c: Coordinate) { return (c[0] == this.c[0]) && (c[1] == this.c[1]); }
  
  x(): number { return this.c[0]; }

  y(): number { return this.c[1]; }
  
  private c: number [ ];
  }

  
class DFSFrontier
implements Frontier {

  add(states: State[]): void {

    if (states.length == 1)
      this.stack.push(states[0]);
    else
      for (var move in [ 'd', 'r', 'l', 'u' ])
	for (var i = states.length - 1; i > -1; --i)
	  if (states[i].move() === move) {
	    this.stack.push(states[i]);
	    break;
	    }
    }
    
  empty(): boolean {
    return this.stack.length == 0;
    }
    
  nextState(): State {
    if (this.empty())
      throw "calling nextState() on an empty frontier";
    else
      return this.stack.shift();
    }

  private stack: State [] = [ ];
  }


class GridProblem
implements Problem {

  private allNeighbors(s: State): State [] {

    var n: State [] = [ ];
    for (var d in [ 'u', 'd', 'l', 'r' ])
      n.push(new GridState(s, d));

    return n;    
    }

  constructor(
    private start: GridState,
    private goal: GridState,
    private obstructions: GridState [],
    private rows,
    private cols) {
    }


  goalState(s: State): boolean {
    return this.goal.equal(s);
    }


  neighbors(s: State): State [] {
    return this.validNeighbors(this.allNeighbors(s));
    }


  startState(): State {
    return this.start;
    }


  private validNeighbors(neighbors: State []): State [] {

    var n: State [] = [ ];

    for (var i = neighbors.length - 1; i > -1; --i) {
      var s: State = neighbors[i];
      if (this.validState(s))
        n.push(s)
      }	

    return n;
    }


  private validState(s: State): boolean {

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
  }

  
class GridState
implements State {

  constructor(source: any, m?: GridMove) {
    if (typeof source == 'Coordinate') {
      if (typeof m !== 'undefined')
        throw "constructing a grid state with a coordinate and a move";
      this.m = m;
      }
    else if (typeof source == 'GridState') {
      if (typeof m !== 'GridMove')
        throw "constructing a grid state with a coordinate and no move";

      }
    }


  coordinate(): Coordinate {
    return this.c;
    }
    

  equal(s: any): boolean {
    if (typeof s != 'GridState')
      return false;
    return (<GridState> s).coordinate().equal(this.c);
    }


  move(): GridMove {
    return this.m;
    }


  private parent: GridState;
  private c: Coordinate;
  private m: GridMove;
  }


var generalSolver =
  function (f: Frontier, p: Problem): void {

    f.add([ p.startState() ]);

    do {
      var s: State = f.nextState();
      if (p.goalState(s))
        return;
      f.add(p.neighbors(s));
      }
    while (!f.empty());
    };

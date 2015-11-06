/// <reference path = "Graph.ts"/>
/// <reference path = "utils.ts"/>


var backgroundColor = 'black';
var foregroundColor = 'white';
  

function
drawGraph(
  g: Graph
  , paper
  , ht
  , wd
  , ul: Coordinate
  , logAnimator: AnimateLog
  , options
  ): void {


  var drawEdge = function (e): void {

    var fromC = transCoord(e.fromNode.center);
    var toC = transCoord(e.toNode.center);

    drawLine(paper, fromC.x(), fromC.y(), toC.x(), toC.y());

    var lx = (fromC.x() + toC.x())/2;
    var ly = (fromC.y() + toC.y())/2;
    
    if (!options.noEdgeWeights) {
      paper.circle(lx, ly, nodeRadius/2)
	.attr({ stroke: backgroundColor, fill: backgroundColor });
      drawText(lx, ly, e.cost.toString());
      }
    }


  var drawNode = function (n): void {

    var c = transCoord(n.center);

    paper.circle(c.x(), c.y(), nodeRadius)
      .attr({ stroke: foregroundColor, fill: backgroundColor });
    if (options.noCostHeuristics)
      drawText(c.x(), c.y(), n.name).attr('font-size', nodeFontSize*1.5);
    else {
      drawText(c.x(), c.y() - nodeRadius*0.5, n.name);
      drawText(c.x(), c.y() + nodeRadius*0.5, n.cost.toString());
      }
    }


  var drawText = function (x, y, t) {
    return paper.text(x, y, t)
      .attr({
        'font-size': nodeFontSize
      , stroke: foregroundColor
      , fill: foregroundColor
      });
    }


  var transCoord = function (c: Coordinate): Coordinate {
    return new Coordinate(
      ul.x() + nodeRadius + c.x()*(wd - 2*nodeRadius),
      ul.y() + nodeRadius + (1 - c.y())*(ht - 2*nodeRadius));
    }

    
  var nodeRadius = Math.min(ht, wd)*0.075;
  var nodeFontSize = nodeRadius*0.7;
  
    var clickPad = paper.rect(ul.x(), ul.y(), wd, ht)
    .attr('fill', backgroundColor)
    .data('logAnimator', logAnimator)
    .click(function (e) {
      this.data('logAnimator').step();
      });
      
  options = options || { };
  
  g.edgeSetIterate(drawEdge);
  g.nodeSetIterate(drawNode);
  }


function
drawLine(paper, x1, y1, x2, y2) {
  paper.path('M' + x1 + ' ' + y1 + 'L' + x2 + ' ' + y2)
    .attr({ stroke: foregroundColor });
  }


function
makeGraph(): Graph {

  // Return a copy of the graph for homework 1.
  
  function newNode(l, c, cx, cy, n, f?) {
    return {
        name: l
      , cost: c
      , center: new Coordinate(cx, cy)
      , neighbors: n
      , flags: f || ""
      };
    }

  var graphConfig = [
       newNode("A",  8, 0.0,  0.8,  [ ["G1", 8], ["B", 3] ])
    ,  newNode("B",  2, 0.2,  0.35, [ ["G1", 4], ["J", 2] ])
    ,  newNode("C",  2, 0.4,  0.6,  [ ["D",  2], ["J", 9], ["F", 7] ])
    ,  newNode("D",  5, 0.575,0.85, [ ["F",  1], ["E", 2] ])
    ,  newNode("E",  3, 0.85, 0.8,  [ ["G2", 6], ["F", 3] ])
    ,  newNode("F",  2, 0.8,  0.1,  [ ["G2", 2] ])
    ,  newNode("G1", 0, 0.0,  0.1,  [ ], "g")
    ,  newNode("G2", 0, 1.0,  0.5,  [ ], "g")
    ,  newNode("J",  1, 0.5,  0.0,  [ ["G1", 1], ["F", 5] ])
    ,  newNode("S",  6, 0.25, 1.0,  [ ["A",  4], ["C", 3] ], "s")
    ];

  return new Graph(graphConfig);
  }


function
BFGraphSearch(g: Graph): any [] {

  var q = new Sequence();
  q.enq(g.startState());
  var visited = { };
  
  do {
    var node = q.deq();
    if (g.isGoalState(node))
      return q.log();

    var neighbors = g.neighbors(node);
    neighbors.sort();
    for (var i = 0; i < neighbors.length; ++i) {
      var n = neighbors[i];
      if (!visited[n]) {
        q.enq(n);
	visited[n] = true;
	}
      }
    }
  while (!q.empty());

  alert("graph bfs didn't find a goal state")
  }


function
dfs(g: Graph, maxDepth, stack: Sequence): any {

  stack.setMaxSize(maxDepth);
  stack.push(g.startState());
  var visited = { }
  
  do {
    var node = stack.pop();
    if (g.isGoalState(node))
      return node;

    var neighbors = g.neighbors(node);
    neighbors.sort();
    for (var i = neighbors.length - 1; i > -1; --i) {
      var nbr = neighbors[i];
      if (visited[nbr] == undefined) {
        stack.push(nbr);
	visited[nbr] = true;
	}
      }
    }
  while ((0 < stack.size()) && (stack.size() <= maxDepth));

  return undefined;
  }


function
DFSGraphSearch(g: Graph): any [] {

  var stack = new Sequence();
  
  if (dfs(g, 100, stack) == undefined)
    alert("graph dfs didn't find a goal state")    

  return stack.log();
  }


function
IDGraphSearch(g: Graph): any [] {

  var stack = new Sequence();
  
  for (var i = 1; i < 100; ++i)
    if (dfs(g, i, stack) != undefined)
      return stack.log();
    else
      stack.clear()
      
  alert("graph iterated deepening didn't find a goal state")    
  }


function
LCFGraphSearch(g: Graph): any [] {

  var newSI = function (n: string, p: number): SequenceItem {
    return new SequenceItem({
        name: n
      , priority: p
      , pRep: n + ':' + p
      });
    }

  var pq = new MultiPathPrunedSequence(
    function(a: SequenceItem, b: SequenceItem): boolean {
      return a.priority() < b.priority();
      });

  pq.enq(newSI(g.startState(), 0));

  do {
    var node = pq.deq();
    if (g.isGoalState(node.name()))
      return pq.log();

    var neighbors = g.neighbors(node.name());
    for (var i = neighbors.length - 1; i > -1; --i) {
      var n = neighbors[i]
      pq.enq(newSI(n, node.priority() + g.edgeCost(node.name(), n)));
      }
    }
  while (pq.size() > 0);

  alert("graph lowest-cost first search didn't find a goal state")
  }


// function
// LCFSGraphSearch(g: Graph): any [] {

//   var queue = [ [ g.startState(), 0 ] ];
//   var log = [ ];
//   log.push(['enq', g.startState() + ':' + 0]);
  
//   do {
//     var node = queue.shift();
//     log.push(['deq']);
//     if (g.isGoalState(node[0]))
//       return log;

//     var neighbors = g.neighbors(node[0]);
//     for (var i = neighbors.length - 1; i > -1; --i) {
//       var n = neighbors[i]
//       queue.push([n, node[1] + g.edgeCost(node[0], n)]);
//       }
//     queue.sort(function (a, b) { return a[1] - b[2]; });
//     }
//   while (queue.length > 0);

//   alert("graph lowest-cost first search didn't find a goal state")
//   }


// function
// BestFSGraphSearch(g: Graph): void {

//   var queue = [ [ g.startState(), 0 ] ];

//   do {
//     var node = queue.shift();
//     if (g.isGoalState(node[0]))
//       return;

//     var neighbors = g.neighbors(node[0]);
//     for (var i = neighbors.length - 1; i > -1; --i) {
//       var n = neighbors[i]
//       queue.push([n, g.edgeCost(node[0], n)]);
//       }
//     queue.sort(function (a, b) { return a[1] - b[2]; });
//     }
//   while (queue.length > 0);

//   alert("graph best first search didn't find a goal state")
//   }


function
BestFSGraphSearch(g: Graph): any [] {

  var newSI = function (n: string, p: number): SequenceItem {
    return new SequenceItem({
        name: n
      , priority: p
      , pRep: n + ':' + p
      });
    }

  var pq = new MultiPathPrunedSequence(
    function(a: SequenceItem, b: SequenceItem): boolean {
      return a.priority() < b.priority();
      });

  pq.enq(newSI(g.startState(), 0));

  do {
    var node = pq.deq();
    if (g.isGoalState(node.name()))
      return pq.log();

    var neighbors = g.neighbors(node.name());
    for (var i = neighbors.length - 1; i > -1; --i) {
      var n = neighbors[i]
      pq.enq(newSI(n, g.edgeCost(node.name(), n)));
      }
    }
  while (pq.size() > 0);

  alert("graph best first search didn't find a goal state")
  }


function
ASGraphSearch(g: Graph): any [] {

  var newSI = function (n: string, pathC: number): SequenceItem {

    var nc = g.nodeCost(n);

    return new SequenceItem({
        name: n
      , priority: nc + pathC
      , pRep: n + ':' + pathC + '+' + nc
      , pathCost: pathC
      });
    }

  var pq = new MultiPathPrunedSequence(
    function(a: SequenceItem, b: SequenceItem): boolean {
      return a.priority() < b.priority();
      });

  pq.enq(newSI(g.startState(), 0));

  do {
    var node = pq.deq();
    if (g.isGoalState(node.name()))
      return pq.log();

    var neighbors = g.neighbors(node.name());
    for (var i = neighbors.length - 1; i > -1; --i) {
      var n = neighbors[i]
      pq.enq(newSI(n, node.pathCost() + g.edgeCost(node.name(), n)));
      }
    }
  while (pq.size() > 0);

  alert("graph A* search didn't find a goal state")
  }


class
Sequence {


  clear() {
    this.script.push(['clear']);
    this.seq = [];
    }

  deq() {
    this.script.push(['deq']);
    return this.seq.shift();
    }


  empty(): boolean {
    return this.seq.length == 0;
    }


  enq(n) {
    this.script.push(['enq', n]);
    this.seq.push(n);
    }


  log(): string [] {
    return this.script;
    }


  pop(): any {
    this.script.push(['pop']);
    return this.seq.pop();
    }


  push(e) {
    this.script.push(['push', e]);
    this.seq.push(e);
    }


  setMaxSize(n) {
    if (n != undefined)
      this.script.push(['msg', 'Maximum size = ' + n]);
    else
      this.script.push(['msg', '']);
      
    this.maxSize = n;
    }


  size(): number {
    return this.seq.length;
    }


  private seq = [];
  private script = [];
  private maxSize;
  }


class
NewSequence {


  clear() {
    this.script.push(['clear']);
    this.seq = [];
    }


  constructor(less: (a: SequenceItem, b: SequenceItem) => boolean) {
    this.less = less;
    }


  deq() {
    this.script.push(['deq']);
    return this.seq.shift();
    }


  empty(): boolean {
    return this.seq.length == 0;
    }


  enq(n: SequenceItem) {
    this.script.push(['enq', n.pRep() || n.name()]);
    this.seq.push(n);
    if (this.less != undefined)
      this.reorder();
    }


  log(): string [] {
    return this.script;
    }


  pop(): SequenceItem {
    this.script.push(['pop']);
    return this.seq.pop();
    }


  push(e: SequenceItem) {
    this.script.push(['push', e.pRep() || e.name()]);
    this.seq.push(e);
    }


  private
  reorder() {

    var n = this.seq.length;
    var i;
    
    for (i = n - 1; i > 0; --i)
      if  (!this.less(this.seq[i - 1], this.seq[i]))
        if (   this.less(this.seq[i], this.seq[i - 1])
	    || (this.seq[i - 1].name() > this.seq[i].name())) {
	  var t = this.seq[i];
	  this.seq[i] = this.seq[i - 1];
	  this.seq[i - 1] = t;
	  this.script.push(['swap', i - 1, i]);
	  }
    }


  setMaxSize(n) {
    if (n != undefined)
      this.script.push(['msg', 'Maximum size = ' + n]);
    else
      this.script.push(['msg', '']);
      
    this.maxSize = n;
    }


  size(): number {
    return this.seq.length;
    }


  private seq: SequenceItem [] = [];
  private script = [];
  private maxSize;
  private less;
  }


class
MultiPathPrunedSequence
extends NewSequence {

  // This class is incorrect because it always prunes the new path in
  // favor of the old path, which may not be the correct thing to do.

  clear() {
    super.clear();
    this.visited = { };
    }


  constructor(less: (a: SequenceItem, b: SequenceItem) => boolean) {
    super(less);
    this.visited = { }
    }


  enq(si: SequenceItem) {
    if (this.unvisited(si.name()))
      super.enq(si);
    }


  push(si: SequenceItem) {
    if (this.unvisited(si.name()))
      super.push(si);
    }


  private
  unvisited(name: string): boolean {

    if (this.visited[name])
      return true;
    
    this.visited[name] = true;
    return false;
    }

    
  private visited;
  }


class
SequenceItem {

  constructor(arg) {
    if (typeof arg == "string")
      this._name = arg;
    else if (typeof arg == "object") {
      if (arg.name == "undefined")
        throw new Error("constructing a sequence item with no name");
      this._name = arg.name;
      this._pRep = arg.pRep;
      this._priority = arg.priority;
      this._pathCost = arg.pathCost;
      }
    }

  name(): string {
    return this._name;
    }
    
  pRep(): string {
    return this._pRep;
    }

  pathCost(): number {
    return this._pathCost;
    }
    
  priority(): number {
    return this._priority;
    }
    
  private _pRep;
  private _name;
  private _priority;
  private _pathCost;
  }


class
AnimateLog {

  // Draw a log animation within a rectangle.
  
  constructor(
      paper		// where to draw the rectangle.
    , ht		// the rectangle's height
    , wd		// the rectangle's width.
    , ul: Coordinate	// The rectangle's upper-left corner.
    , g: Graph		// The graph involved.
    , log		// The log to animate.
    ) {

    this.paper = paper;
    this.ht = ht;
    this.wd = wd;
    this.g = g;

    this.nextStep = 0;
    
    this.fontSize = Math.round(ht*0.8);
    this.msgFontSize = Math.round(this.fontSize*0.5);

    this.qRep = paper.text(ul.x() + 20, ul.y() + ht*0.5, "hello").attr({
        stroke: foregroundColor
      , fill: foregroundColor
      , 'font-size': this.fontSize
      , 'text-anchor': "start"
      });
    this.poppedRep = paper.text(ul.x(), ul.y() + ht*0.5, "").attr({
        stroke: foregroundColor
      , fill: foregroundColor
      , 'font-size': this.fontSize
      , 'text-anchor': "start"
      });
    this.msgRep = this.paper.text(ul.x() + this.wd - 10, ul.y(), "")
      .attr({
	stroke: foregroundColor
      , fill: foregroundColor
      , 'font-size': this.msgFontSize
      , 'text-anchor': "end"
      })
    this.history = this.fillHistory(log);
    }


  private
  drawQ(step) {

    var qStr = ""
    var sep = ""

    for (var i = 0; i < step.q.length; ++i) {
      qStr = qStr + sep + step.q[i]
      sep = "  "
      }

    this.qRep.attr({ text: qStr });
    this.poppedRep.attr({ text: step.lastPopped });
    this.msgRep.attr({ text: step.msg });

    console.log('drew "' + this.qRep.attr('text') + '".');
    }


  private
  fillHistory(log): any [] {

    var q = [];
    var lastPopped = "";
    var msg = "";
    var history = [];
    
    for (var i = 0; i < log.length; ++i) {
      var step = log[i];

      if (step[0] == 'clear') {
	q = [];
	lastPopped = "";
	msg = "";
        }

      else if (step[0] == 'deq')
	lastPopped = q.shift();

      else if (step[0] == 'enq')
	q.push(step[1]);

      else if (step[0] == 'msg')
	msg = step[1];

      else if (step[0] == 'pop')
	lastPopped = q.shift();

      else if (step[0] == 'push')
	q.unshift(step[1]);

      else if (step[0] == 'swap') {
	var t = q[step[1]];
	q[step[1]] = q[step[2]];
	q[step[2]] = t;
	}

      else
	throw new Error('unrecognized operator in log: ' + step[0]);

      history.push({
	  q: q.slice()
	, lastPopped: lastPopped
        , msg: msg
        });
      }

    return history;
    }


  step() {
    this.drawQ(this.history[this.nextStep]);
    this.nextStep = (this.nextStep + 1) % this.history.length;
    }


  private paper;
  private ht: number;
  private wd: number;
  private g: Graph;

  private nextStep: number; 
  private history: any [];

  private fontSize;
  private msgFontSize;

  private qRep;
  private poppedRep;
  private msgRep;
  
  }

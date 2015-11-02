/// <reference path = "Graph.ts"/>
/// <reference path = "utils.ts"/>


var backgroundColor = 'black';
var foregroundColor = 'white';
  

function
drawGraph(
  g: Graph, paper, ht, wd, ul: Coordinate, logAnimator: AnimateLog): void {


  var drawEdge = function (e): void {

    var fromC = transCoord(e.fromNode.center);
    var toC = transCoord(e.toNode.center);

    drawLine(paper, fromC.x(), fromC.y(), toC.x(), toC.y());

    var lx = (fromC.x() + toC.x())/2;
    var ly = (fromC.y() + toC.y())/2;
    
    paper.circle(lx, ly, nodeRadius/2)
      .attr({ stroke: backgroundColor, fill: backgroundColor });
    drawText(lx, ly, e.cost.toString());
    }


  var drawNode = function (n): void {

    var c = transCoord(n.center);

    paper.circle(c.x(), c.y(), nodeRadius)
      .attr({ stroke: foregroundColor, fill: backgroundColor });
    drawText(c.x(), c.y() - nodeRadius*0.5, n.name);
    drawText(c.x(), c.y() + nodeRadius*0.5, n.cost.toString());
    }


  var drawText = function (x, y, t) {
    paper.text(x, y, t)
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
  
  var clickPad = paper.rect(0, 0, ht, wd)
    .attr('fill', backgroundColor)
    .data('logAnimator', logAnimator)
    .click(function (e) {
      this.data('logAnimator').step();
      });
      
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


// function
// ASGraphSearch(g: Graph): void {

//   var ss = g.startState()
//   var queue = [ [ ss, 0, g.nodeCost(ss) ] ];

//   do {
//     var node = queue.shift();
//     if (g.isGoalState(node[0]))
//       return;

//     var neighbors = g.neighbors(node[0]);
//     for (var i = neighbors.length - 1; i > -1; --i) {
//       var n = neighbors[i]
//       queue.push([n, node[1] + g.edgeCost(node[0], n), g.nodeCost(node[0])]);
//       }
//     queue.sort(function (a, b) { return (a[1] + a[2]) - (b[1] + b[2]); });
//     }
//   while (queue.length > 0);

//   alert("graph A* search didn't find a goal state")
//   }


class
AnimateLog {

  constructor(paper, ht, wd, ul: Coordinate, g: Graph, log) {
    this.paper = paper;
    this.ht = ht;
    this.wd = wd;
    this.ul = new Coordinate(ul.x() + 10, ul.y());
    this.g = g;
    this.log = log;

    this.nextStep = 0;
    this.q = [];
    this.qRep = paper.text(ul.x(), ul.y(), "");
    this.fontSize = Math.round(ht*0.6);

    this.msgFontSize = this.fontSize*0.5;
    this.msgText = paper.text(ul.x(), ul.y(), "");
    }


  private
  drawQ() {

    var qStr = ""
    var sep = ""

    for (var i = 0; i < this.q.length; ++i) {
      qStr = qStr + sep + this.q[i]
      sep = "  "
      }

    console.log('draw this: "' + qStr + '" at ' + this.ul.toString() + '.');
    
    return this.paper.text(this.ul.x(), this.ul.y(), qStr).attr({
        stroke: foregroundColor
      , fill: foregroundColor
      , 'font-size': this.fontSize
      , 'text-anchor': "start"
      });
    }


  step() {

    var step = this.log[this.nextStep];
    
    if (this.nextStep == 0)
      this.q = [];

    if (step[0] == 'clear')
      this.q = [];

    else if (this.log[this.nextStep][0] == 'deq')
      this.q.shift();

    else if (this.log[this.nextStep][0] == 'enq')
      this.q.push(this.log[this.nextStep][1]);

    else if (this.log[this.nextStep][0] == 'msg') {
      this.msgText.remove();
      this.msgText = this.paper.text(
	this.ul.x() + this.wd - 10, this.ul.y(), this.log[this.nextStep][1])
	.attr({
	  stroke: foregroundColor
	, fill: foregroundColor
	, 'font-size': this.msgFontSize
	, 'text-anchor': "end"
        })
      }

    else if (this.log[this.nextStep][0] == 'pop')
      this.q.shift();

    else if (this.log[this.nextStep][0] == 'push')
      this.q.unshift(this.log[this.nextStep][1]);

    else if (step[0] == 'swap') {
      var t = this.q[step[1]];
      this.q[step[1]] = this.q[step[2]];
      this.q[step[2]] = t;
      }

    else
      throw new Error('unrecognized operator in log');
      
    this.qRep.remove();
    this.qRep = this.drawQ();

    this.nextStep = (this.nextStep + 1) % this.log.length;
    }


  private log: any [];
  private paper;
  private ht: number;
  private wd: number;
  private ul: Coordinate;
  private g: Graph;

  private nextStep: number;
  private q: string [ ];
  private qRep;
  private fontSize;

  private msgText;
  private msgFontSize;
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
	  console.log(
	    'swap ' + this.seq[i - 1].pRep() + ' and ' + this.seq[i].pRep());
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


  clear() {
    super.clear();
    this.visited = { };
    }


  constructor(less: (a: SequenceItem, b: SequenceItem) => boolean) {
    super(less);
    this.visited = { }
    }


  enq(si: SequenceItem) {
    if (!this.visited[si.name()]) {
      super.enq(si);
      this.visited[si.name()] = true;
      }
    }


  push(si: SequenceItem) {
    if (!this.visited[si.name()]) {
      super.push(si);
      this.visited[si.name()] = true;
      }
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

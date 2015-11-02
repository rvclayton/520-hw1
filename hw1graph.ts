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
    .data('clickCount', 0)
    .data('logAnimator', logAnimator)
    .click(function (e) {
      var cc = this.data('clickCount')
      console.log('click ' + ++cc);
      this.data('clickCount', cc);
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
BFGraphSearch(g: Graph): string [] {

  var q = new Queue();
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
dfs(g: Graph, n) {

  var stack = [ g.startState() ];

  do {
    var node = stack.pop();
    if (g.isGoalState(node))
      return node

    var neighbors = g.neighbors(node);
    for (var i = neighbors.length - 1; i > -1; --i)
      stack.push(neighbors[i]);
    }
  while ((0 < stack.length) && (stack.length <= n));

  return undefined;
  }


function
DFSGraphSearch(g: Graph): void {

  if (dfs(g, 100) == undefined)
    alert("graph dfs didn't find a goal state")    
  }


function
IDGraphSearch(g: Graph): void {

  for (var i = 1; i < 100; ++i)
    if (dfs(g, i) != undefined)
      return;
    
  alert("graph iterated deepening didn't find a goal state")    
  }


function
LCFSGraphSearch(g: Graph): void {

  var queue = [ [ g.startState(), 0 ] ];

  do {
    var node = queue.shift();
    if (g.isGoalState(node[0]))
      return;

    var neighbors = g.neighbors(node[0]);
    for (var i = neighbors.length - 1; i > -1; --i) {
      var n = neighbors[i]
      queue.push([n, node[1] + g.edgeCost(node[0], n)]);
      }
    queue.sort(function (a, b) { return a[1] - b[2]; });
    }
  while (queue.length > 0);

  alert("graph lowest-cost first search didn't find a goal state")
  }


function
BestFSGraphSearch(g: Graph): void {

  var queue = [ [ g.startState(), 0 ] ];

  do {
    var node = queue.shift();
    if (g.isGoalState(node[0]))
      return;

    var neighbors = g.neighbors(node[0]);
    for (var i = neighbors.length - 1; i > -1; --i) {
      var n = neighbors[i]
      queue.push([n, g.edgeCost(node[0], n)]);
      }
    queue.sort(function (a, b) { return a[1] - b[2]; });
    }
  while (queue.length > 0);

  alert("graph best first search didn't find a goal state")
  }


function
ASGraphSearch(g: Graph): void {

  var ss = g.startState()
  var queue = [ [ ss, 0, g.nodeCost(ss) ] ];

  do {
    var node = queue.shift();
    if (g.isGoalState(node[0]))
      return;

    var neighbors = g.neighbors(node[0]);
    for (var i = neighbors.length - 1; i > -1; --i) {
      var n = neighbors[i]
      queue.push([n, node[1] + g.edgeCost(node[0], n), g.nodeCost(node[0])]);
      }
    queue.sort(function (a, b) { return (a[1] + a[2]) - (b[1] + b[2]); });
    }
  while (queue.length > 0);

  alert("graph A* search didn't find a goal state")
  }


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
    if (this.nextStep == 0)
      this.q = [ ];

    if (this.log[this.nextStep][0] == '-')
      this.q.shift();
    else if (this.log[this.nextStep][0] == '+')
      this.q.push(this.log[this.nextStep][1]);
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
  }


class
Queue {


  deq() {
    var e = this.q.shift()
    this.script.push(['-']);
    return e;
    }


  empty(): boolean {
    return this.q.length == 0;
    }


  enq(n) {
    this.q.push(n);
    this.script.push(['+', n]);
    }


  log(): string [] {
    return this.script;
    }


  private q = [ ];
  private script = [];
  }


class
QueuePicture {


  constructor(paper, ht, wd, ul: Coordinate) {
    drawLine(paper, ul.x(), ul.y(), ul.x() + wd, ul.y());  
    drawLine(paper, ul.x(), ul.y(), ul.x(), ul.y() + ht);  
    drawLine(paper, ul.x(), ul.y() + ht, ul.x() + wd, ul.y() + ht);  

    this.fontSize = ht*0.8;
    this.ul = ul;
    this.ht = ht;
    this.wd = wd;
    this.paper = paper;
    this.script = [ ];
    }


  deq() {
    var e = this.q.shift()
    this.script.push('-');
    return e;
    }


  private
  drawQ() {

    for (var e in this.qElements)
      this.qElements[e].remove();
      
    var x = this.ul.x();
    var y = this.ul.y() + this.ht;
    var trail = ""
    
    for (var i = 0; i < this.q.length; ++i) {
      var e = this.q[i];
      var p = this.paper.text(x, y, e).attr({
          'font-size': this.fontSize
        , stroke: foregroundColor
        , fill: foregroundColor
        });
      var bb = p.getBBox();

      trail = trail + " " + e;
      x = x + bb.width + 5;
      this.qElements[e] = p;
      }

    console.log('Q:' + trail);
    }

  empty(): boolean {
    return this.q.length == 0;
    }


  enq(n) {
    this.q.push(n);
    this.script['+ ' + n];
    }


  private q = [ ];
  private qElements = { };
  private fontSize;
  private ul;
  private ht;
  private wd;
  private paper;
  private script;
  }

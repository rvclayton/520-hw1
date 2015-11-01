/// <reference path = "Graph.ts"/>
/// <reference path = "utils.ts"/>


function
drawGraph(g: Graph, paper, ht, wd, ul: Coordinate): void {


  var drawEdge = function (e): void {

    var fromC = transCoord(e.fromNode.center);
    var toC = transCoord(e.toNode.center);

    paper.path(
      'M' + fromC.x() + ' ' + fromC.y() + 'L' + toC.x() + ' ' + toC.y())
      .attr({ stroke: foregroundColor });

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
  
  var backgroundColor = 'black';
  var foregroundColor = 'white';
  
  g.edgeSetIterate(drawEdge);
  g.nodeSetIterate(drawNode);
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
BFSGraphSearch(g: Graph): void {

  var queue = [ g.startState() ];

  do {
    var node = queue.shift();
    if (g.isGoalState(node))
      return;

    var neighbors = g.neighbors(node);
    for (var i = neighbors.length - 1; i > -1; --i)
      queue.push(neighbors[i]);
    }
  while (queue.length > 0);

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

/// <reference path = "Graph.ts"/>
/// <reference path = "utils.ts"/>


function
drawGraph(g: Graph, paper, ht, wd, ul: Coordinate): void {


  var drawEdge = function (e): void {

    var fromC = transCoord(e.fromNode.center);
    var toC = transCoord(e.toNode.center);

    console.log(
      'draw edge from ' + fromC.toString() + ' to ' + toC.toString());
    
    paper.path(
      'M' + fromC.x() + ' ' + fromC.y() + 'L' + toC.x() + ' ' + toC.y());
    }
    

  var drawNode = function (n): void {

    var c = transCoord(n.center);

    paper.circle(c.x(), c.y(), nodeRadius);
    paper.text(c.x(), c.y() - nodeRadius*0.5, n.name)
      .attr({'font-size': nodeFontSize });
    paper.text(c.x(), c.y() + nodeRadius*0.5, n.cost.toString())
      .attr({'font-size': nodeFontSize });
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
  
  function newNode(l, c, cx, cy, n) {
    return {
      name: l, cost: c, center: new Coordinate(cx, cy), neighbors: n };
    }

  var graphConfig = [
       newNode("A",  8, 0.0,  0.8,  [ ["G1", 8], ["B", 3] ])
    ,  newNode("B",  2, 0.25, 0.3,  [ ["G1", 4], ["J", 2] ])
    ,  newNode("C",  2, 0.4,  0.6,  [ ["D",  2], ["J", 9], ["F", 7] ])
    ,  newNode("D",  5, 0.6,  0.8,  [ ["F",  1], ["E", 2] ])
    ,  newNode("E",  3, 0.8,  0.65, [ ["G2", 6], ["F", 3] ])
    ,  newNode("F",  2, 0.75, 0.2,  [ ["G2", 2] ])
    ,  newNode("G1", 0, 0.0,  0.1,  [ ])
    ,  newNode("G2", 0, 1.0,  0.5,  [ ])
    ,  newNode("J",  1, 0.5,  0.0,  [ ["G1", 1], ["F", 5] ])
    ,  newNode("S",  6, 0.25, 1.0,  [ ["A",  4], ["C", 3] ])
    ];

  return new Graph(graphConfig);
  }

/// <reference path = "Graph.ts"/>
/// <reference path = "utils.ts"/>


function
drawGraph(g: Graph, paper, ht, wd, ul: Coordinate): void {


  var drawEdge = function (e): void {

    var fromC = transCoord(e.fromNode.center);
    var toC = transCoord(e.toNode.center);

    console.log('draw edge from ' + fromC.toString() + ' to ' + toC.toString());
    
    paper.path(
      'M' + fromC.x() + ' ' + fromC.y() + 'L' + toC.x() + ' ' + toC.y());
    }
    

  var transCoord = function (c: Coordinate): Coordinate {
    return new Coordinate(ul.x() + c.x()*wd, ul.y() + (1 - c.y())*ht);
    }

  console.log('draw graph');
  
  g.edgeSetIterate(drawEdge);
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
    ,  newNode("B",  2, 0.25, 0.2,  [ ["G1", 4], ["J", 2] ])
    ,  newNode("C",  2, 0.5,  0.5,  [ ["D",  2], ["J", 9], ["F", 7] ])
    ,  newNode("D",  5, 0.8,  0.8,  [ ["F",  1], ["E", 2] ])
    ,  newNode("E",  3, 0.9,  0.65, [ ["G2", 6], ["F", 3] ])
    ,  newNode("F",  2, 0.75, 0.2,  [ ["G2", 2] ])
    ,  newNode("G1", 0, 0.0,  0.1,  [ ])
    ,  newNode("G2", 0, 1.0,  0.5,  [ ])
    ,  newNode("J",  1, 0.5,  0.0,  [ ["G1", 1], ["F", 5] ])
    ,  newNode("S",  6, 0.25, 0.9,  [ ["A", 4], ["C", 3] ])
    ];

  return new Graph(graphConfig);
  }

/// <reference path = "Graph.ts"/>
/// <reference path = "utils.ts"/>

function
drawGraph(g: Graph, paper, hw, wd, ul: Coordinate): void {
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
    ,  newNode("B",  2, 0.25, 0.2,  [ ["G1", 4], ["B", 3] ])
    ,  newNode("C",  2, 0.5,  0.5,  [ ["J",  9], ["F", 7] ])
    ,  newNode("D",  5, 0.8,  0.8,  [ ["F",  1], ["E", 2] ])
    ,  newNode("E",  3, 0.9,  0.65, [ ["G2", 6], ["F", 3] ])
    ,  newNode("F",  2, 0.75, 0.2,  [ ["G2", 2] ])
    ,  newNode("G1", 0, 0.0,  0.1,  [ ])
    ,  newNode("G2", 0, 1.0,  0.5,  [ ])
    ,  newNode("J",  1, 0.5,  0.0,  [ ["G1", 1], ["F", 5] ])
    ];

  return new Graph(graphConfig);
  }

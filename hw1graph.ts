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
  
  function newNode(l, c, cx, cy, n) {
    return {
      name: l, cost: c, center: new Coordinate(cx, cy), neighbors: n };
    }

  var graphConfig = [
       newNode("A",  8, 0.0,  0.8,  [ ["G1", 8], ["B", 3] ])
    ,  newNode("B",  2, 0.2,  0.35, [ ["G1", 4], ["J", 2] ])
    ,  newNode("C",  2, 0.4,  0.6,  [ ["D",  2], ["J", 9], ["F", 7] ])
    ,  newNode("D",  5, 0.575,0.85, [ ["F",  1], ["E", 2] ])
    ,  newNode("E",  3, 0.85, 0.8,  [ ["G2", 6], ["F", 3] ])
    ,  newNode("F",  2, 0.8,  0.1,  [ ["G2", 2] ])
    ,  newNode("G1", 0, 0.0,  0.1,  [ ])
    ,  newNode("G2", 0, 1.0,  0.5,  [ ])
    ,  newNode("J",  1, 0.5,  0.0,  [ ["G1", 1], ["F", 5] ])
    ,  newNode("S",  6, 0.25, 1.0,  [ ["A",  4], ["C", 3] ])
    ];

  return new Graph(graphConfig);
  }

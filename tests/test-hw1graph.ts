/// <reference path = "../hw1graph.ts"/>

var g: Graph = new Graph([]);
assert(g != undefined, "graph not made");

g = new Graph([{
  name: "S", cost: 0, flags: "s", center: new Coordinate(0, 0), neighbors: []
  }]);
assert("S" == g.startState(), "start state not found");

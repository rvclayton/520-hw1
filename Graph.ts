/// <reference path = "Coordinate.ts"/>
/// <reference path = "utils.ts"/>


class
Graph {

  private
  checkNodeDefinitions(ndefs: any []): void {
    setIterate(ndefs, function (nd) {
      assert(nd.name != undefined, "node definition has no name");
      assert(nd.cost != undefined, "node definition has no cost");
      assert(nd.center != undefined, "node definition has no center");
      assert(nd.neighbors != undefined, "node definition has no neighbors");
      assert(nd.flags != undefined, "node definition has no flags");
      });

    var names = { };
    setIterate(ndefs, function (nd) {
      assert(names[nd.name] == undefined,
	"node name " + nd.name + " is multiply defined");
      names[nd.name] = true;
      });
    }


  constructor(ndefs: any []) {

    this.checkNodeDefinitions(ndefs);

    var nodeSet = {};
    var edgeSet = {};

    setIterate(ndefs, function(n) {
      nodeSet[n.name] = {
          name: n.name
	, center: n.center
	, cost: n.cost
	, neighbors: { }
	, start: n.flags.indexOf("s") != -1
	, goal: n.flags.indexOf("g") != -1
	}
      });

    setIterate(ndefs, function(node) {
      setIterate(node.neighbors, function (edge) {
        var e = {
	    fromNode: nodeSet[node.name]
	  , toNode: nodeSet[edge[0]]
	  , cost: edge[1]
	  };
	edgeSet[node.name + edge[0]] = e;
	nodeSet[node.name].neighbors[edge[0]] = e;
	})
      });
      
    for (var s in nodeSet)
      if (nodeSet[s].start) {
        this.start = s;
	break;
	}
	
    this.nodeSet = nodeSet;
    this.edgeSet = edgeSet;
    }


  edgeCost(from, to): number {

    var e = this.edgeSet[from + to];

    assert(e != undefined,
      "edgeCost(" + from + ", " + to + ") failed to find the edge");

    return e.cost;
    }


  edgeSetIterate(f: (e: any) => any): void {
    for (var nodeName in this.nodeSet) {
     var neighbors = this.nodeSet[nodeName].neighbors
     for (var edgeName in neighbors) {
        // console.log('do edge ' + nodeName + ' -> ' + edgeName);
        f(neighbors[edgeName]);
	}
      }
    }


  isGoalState(s): boolean {
    return this.nodeSet[s].goal;
    }


  neighbors(s) {

    var n = [];

    for (var e in this.nodeSet[s].neighbors)
      n.push(e);
      
    return n;
    }


  nodeCost(n): number {
    assert(this.nodeSet[n] != undefined, "nodeCost(" + n + ") is undefined");
    return this.nodeSet[n].cost;
    }


  nodeSetIterate(f: (n: any) => any): void {
    for (var nodeName in this.nodeSet)
      f(this.nodeSet[nodeName]);
    }


  startState() {
    return this.start;
    }


  private nodeSet;
  private edgeSet;
  private start;
  }


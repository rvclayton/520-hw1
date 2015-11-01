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
      
    this.nodeSet = nodeSet;
    this.edgeSet = edgeSet;
    }


  edgeSetIterate(f: (e: any) => any): void {
    for (var nodeName in this.nodeSet) {
      for (var edgeName in this.nodeSet[nodeName].neighbors) {
        // console.log('do edge ' + nodeName + ' -> ' + edgeName);
        f(this.nodeSet[nodeName].neighbors[edgeName]);
	}
      }
    }

  private nodeSet;
  private edgeSet;
  }


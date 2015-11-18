var c = new Coordinate(3, 14);
var s = new DFSGridState(c);
var f = new DFSGridFrontier(s);

if (f.empty())
  throw new Error("non-empty frontier is empty");
if (f.nextState() != s)
  throw new Error("frontier returned wrong state");
if (!f.empty())
  throw new Error("empty frontier isn't empty");

var su = new DFSGridState(s, GridMove.up);
var sd = new DFSGridState(s, GridMove.down);
var sl = new DFSGridState(s, GridMove.left);
var sr = new DFSGridState(s, GridMove.right);


function testAdd(f: DFSGridFrontier, moves: DFSGridState []) {

  if (!f.empty())
    throw new Error("Frontier should be empty in testAdd()");
    
  var movesCopy = moves.slice();
  f.add(moves);

  if (f.empty())
    throw new Error("four-state frontier is empty");

  if (f.nextState() != su)
    throw new Error("most-favored (up) move isn't first");
  if (f.empty())
    throw new Error("three-state frontier is empty");

  if (f.nextState() != sl)
    throw new Error("second most-favored move (left) isn't second");
  if (f.empty())
    throw new Error("two-state frontier is empty");

  if (f.nextState() != sr)
    throw new Error("third most-favored move (right) isn't third");
  if (f.empty())
    throw new Error("one-state frontier is empty");

  if (f.nextState() != sd)
    throw new Error("fourth most-favored move (down) isn't fourth");
  if (!f.empty())
    throw new Error("no-state frontier isn't empty");

  if (moves.length != movesCopy.length)
    throw new Error("moves array length has been changed");
  for (var i = moves.length - 1; i > -1; --i)
    if (moves[i] != movesCopy[i])
      throw new Error("moves array elements have been changed");
  }

testAdd(f, [ su, sd, sl, sr ]);
testAdd(f, [ sd, sr, su, sl ]);

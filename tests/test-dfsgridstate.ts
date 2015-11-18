var x = 2;
var y = 1;
var c = new Coordinate(x, y);
var s1 = new DFSGridState(c);

if (s1.coordinate() != c)
  throw new Error("same coordinates aren't the same");
if (s1.coordinate() == new Coordinate(y, x))
  throw new Error("different coordinates are the same");
if (s1.parent() != undefined)
  throw new Error("state from a coordinate has a non-undefined parent");
if (!s1.equal(new DFSGridState(new Coordinate(x, y))))
  throw new Error("same states aren't equal");
if (s1.equal(new DFSGridState(new Coordinate(x + 1, y + 1))))
  throw new Error("different states are equal");
if (!s1.ancestor(s1))
  throw new Error("state isn't its own ancestor");
  
var s2 = new DFSGridState(s1, GridMove.up);

if (s2.equal(s1))
  throw new Error("up state equals parent");
if (!s2.coordinate().equal(new Coordinate(x, y + 1)))
  throw new Error(
    "up coordinate isn't correct: " + s2.coordinate().y() + " vs " + (y + 1));
if (s2.move() != GridMove.up)
  throw new Error(
    "up move isn't correct:  " + s2.move() + " vs " + GridMove.up);
if (s2.parent() != s1)
  throw new Error("state from a move has an incorrect parent");
if (!s2.ancestor(s1))
  throw new Error("can't find a state's parent as an ancestor");
if (s1.ancestor(s2))
  throw new Error("root state has an ancestor");

s2 = new DFSGridState(s1, GridMove.down);

if (s2.equal(s1))
  throw new Error("down state equals parent");
if (!s2.coordinate().equal(new Coordinate(x, y - 1)))
  throw new Error(
    "down coordinate isn't correct: " + s2.coordinate().y() + " vs " + (y - 1));
if (s2.move() != GridMove.down)
  throw new Error(
    "down move isn't correct:  " + s2.move() + " vs " + GridMove.down);
  
s2 = new DFSGridState(s1, GridMove.left);

if (s2.equal(s1))
  throw new Error("left state equals parent");
if (!s2.coordinate().equal(new Coordinate(x - 1, y)))
  throw new Error(
    "left coordinate isn't correct: " + s2.coordinate().x() + " vs " + (x - 1));
if (s2.move() != GridMove.left)
  throw new Error(
    "left move isn't correct:  " + s2.move() + " vs " + GridMove.left);
  
s2 = new DFSGridState(s1, GridMove.right);

if (s2.equal(s1))
  throw new Error("right state equals parent");
if (!s2.coordinate().equal(new Coordinate(x + 1, y)))
  throw new Error(
    "right coordinate isn't correct: " + s2.coordinate().x() + " vs " + (x + 1));
if (s2.move() != GridMove.right)
  throw new Error(
    "right move isn't correct:  " + s2.move() + " vs " + GridMove.right);

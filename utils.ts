function
manhattanDistance(s1: GridState, s2: GridState): number {

  // Return the Manhattan distance between the given points.
  
  var c1 = s1.coordinate()
  var c2 = s2.coordinate()

  return Math.abs(c1.x() - c2.x()) + Math.abs(c1.y() - c2.y())
  }

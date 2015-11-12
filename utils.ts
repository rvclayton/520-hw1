var
  backgroundColor = 'black',
  foregroundColor = 'white';
  

function
assert(test: boolean, msg: string): void {
  if (!test) throw new Error(msg);
  }


function
drawLine(paper, x1, y1, x2, y2) {
  return paper.path('M' + x1 + ' ' + y1 + 'L' + x2 + ' ' + y2)
    .attr({ stroke: foregroundColor });
  }


function
setIterate(l, f) {
  for (var i = l.length - 1; i > -1; --i) f(l[i]);
  }

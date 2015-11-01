function
assert(test: boolean, msg: string): void {
  if (!test) throw new Error(msg);
  }


function
setIterate(l, f) {
  for (var i = l.length - 1; i > -1; --i) f(l[i]);
  }

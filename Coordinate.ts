class Coordinate {

  
  // Make a coordinate with the given values.

     constructor(x: number, y: number) { this.c = [ x, y ]; }


  // Return true iff the given coordinate equals this one.

     equal(c2: Coordinate): boolean{
       return (c2.x() == this.x()) && (c2.y() == this.y());
       }


  // Return a printed representation of this point.

     toString(): string {
       return '(' + this.x() + ', ' + this.y() + ')';
       }


  // Return this coordinate's x value.
  
     x(): number { return this.c[0]; }


  // Return this coordinate's y value.
  
     y(): number { return this.c[1]; }
  

  // The coordinates, x first.

     private c: number [ ];
  }

/*

# Algebra Design

Be careful not to define the semantic model so narrowly that it precludes useful operations.
More expressive than you know how to use today, but still implementable.

---

## Sets

What do the types mean?
ex. What is a Result?

---

Event
Stream
SLO
Point[]
  - interpretation unknown
Result[]
  - interpratable by an SLO

---

## Functions

What do the operations mean?
Can I define these operations out of simpler pieces?
What if this Thing is a case of something more general?
If I make it general, I make it simpler by removing particularities.
Perhaps by making meaning hardwired in, make it into a parameter.

Shooting for simplicity and precision.
Later when implementing, shoot for minimality like restrictiveness (e.g. operations we don't support)

---

add :: Stream -> (Event -> Point[])
shape :: SLO -> (Point[] -> Result[])
percentage :: SLO -> Result[] -> Percentage
budget :: SLO -> Result[] -> Budget

---

## Laws

What are the properties?
How can I reason equationally about the operations?
How can I reason compositionally about the operations?
Laws are sanity checks that indicate the design is sound. Tao check, in the flow of the problem-space.

---

*/

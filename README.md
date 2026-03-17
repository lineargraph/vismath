```
define reals {
    the set of all real numbers
}
notation RR {
    $\mathbb R$
}
axiom reals.assoc {
    forall((x,y,z) in RR)
}
```

```js
const reals = define("reals", <>the {set} of all real numbers</>);
const RR = notation("RR", <>ℝ</>);
axiom("reals.assoc", <>For all x,y,z in {RR}: (x+y)+z = x+(y+z)</>);
```

import type { ComponentChild, FunctionComponent } from "preact";
import {
  dots,
  mrow,
  func,
  mathOp,
  mEq,
  mIff,
  mImplies,
  mPlus,
  mSet,
  mVar,
  par,
  vars,
  wrapMath,
  type MathWrapped,
  unwrapMath,
  lst,
} from "./mathutil";

export interface SharedStatement {
  id: string;
  body: FunctionComponent;
}

export interface Definition extends SharedStatement {
  type: "definition";
  title: string;
}

export interface Notation extends SharedStatement {
  type: "notation";
  child: ComponentChild;
}

export interface TheoremType<type extends string> extends SharedStatement {
  type: type;
  title: string;
}

export type Statement = Definition | Notation | TheoremType<"axiom">;

export let statements: Statement[] = [];

function pushStatement<T extends Statement>(statement: T): ComponentChild {
  statements.push(statement);
  const l = link(statement.id, statement.id);
  return l;
}
function define(id: string, title: string, body: FunctionComponent) {
  return pushStatement({ type: "definition", id, body, title });
}
function link(id: string, body: ComponentChild) {
  return <a href={`#${id}`}>{body}</a>;
}
function TODO() {
  return <div class="todo">This section has not been declared yet.</div>;
}
function notation(
  id: string,
  child: MathWrapped,
  Body: FunctionComponent<{ self: ComponentChild }>,
) {
  pushStatement({
    type: "notation",
    id,
    body: () => <Body self={child} />,
    child,
  });

  return wrapMath(
    <a href={`#${id}`} class="notation">
      {unwrapMath(child)}
    </a>,
  );
}
function axiom(id: string, title: string, body: FunctionComponent) {
  return pushStatement({ type: "axiom", title, id, body });
}

const set = define("set", "Sets", () => (
  <>
    <p>
      A <em>small</em> unordered collection of things, much like a list:
    </p>
    <ul>
      <li>{mSet(1, 2, 3)}</li>
      <li>{mSet(1, 2, dots, 100)}</li>
      <li>{emptySet}</li>
      <li>all natural numbers: {mrow(NN, mEq, mSet(0, 1, 2, 3, dots))}</li>
      <li>and many more...</li>
    </ul>
  </>
));
const mIn = notation("set.in", mathOp("∈"), () => {
  const { M, x } = vars;
  return (
    <>
      For a {set} {M}, we write {mrow(x, mIn, M)}, if {x} is contained in that
      set.
    </>
  );
});
const emptySet = notation("set.empty", wrapMath(<mi>∅</mi>), () => (
  <>
    The empty set is the set that contains no elements. It is denoted{" "}
    {mrow(emptySet, mEq, mSet())}.
  </>
));
axiom("set.extensionality", "Set Extensionality", () => {
  const { M, N, x } = vars;
  return (
    <>
      Two {set}s are considered equal if they contain the same elements:{" "}
      {mrow(mrow(M, mEq, N), mIff, par(mrow(x, mIn, M), mIff, mrow(x, mIn, N)))}
    </>
  );
});
const nat = define("nat", "Natural Numbers", () => (
  <>A natural number is a non-negative whole number.</>
));
const NN = notation("nat.NN", wrapMath(<mi>ℕ</mi>), ({ self }) => (
  <>
    i will use {self} to mean the {set} of all {nat}: {mSet(0, 1, 2, dots)}
  </>
));
define("nat.peano", "The Peano Axioms", () => {
  const S = func("S");
  const phi = func("φ");
  const n = mVar("n");
  return (
    <>
      One characterization of the naturals is via the Peano axioms:
      <ol>
        <li>There exists a number {mrow(0, mIn, NN)}</li>
        <li>
          For every natural number {mrow(n, mIn, NN)}, there a successor{" "}
          {mrow(S(n), mIn, NN)} (logically {mrow(n, mPlus, 1)})
        </li>
        <li>
          The successor function {S} is {injective}, so{" "}
          {mrow(mrow(S(n), mEq, S("m")), mImplies, mrow(n, mEq, "m"))}
        </li>
        <li>
          {mrow(0)} is not the successor of any number, or for every natural
          number {mrow(n, mIn, NN)}, {mrow(S(n), mEq, 0)} is false
        </li>
        <li>
          Additionally induction must work in the naturals, or if {phi} is a{" "}
          {predicate} then
          <ul>
            <li>If {phi(0)} is true</li>
            <li>
              And for every number {mrow(n, mIn, NN)},{" "}
              {mrow(phi(n), mImplies, phi(S(n)))}
            </li>
            <li>
              then {phi(n)} holds for every natural {mrow(n, mIn, NN)}
            </li>
          </ul>
        </li>
      </ol>
      Additionally the peano axioms usually come with a definition of addition
      and order:
      <TODO />
    </>
  );
});
const predicate = "predicate";
const injective = "injective";

const reals = define("reals", "The real numbers", () => (
  <>
    The {set} of all real numbers. There are multiple ways to define the real
    numbers, such as {realsCauchy} or {realsDedekind}
  </>
));
const realsDedekind = define(
  "reals.dedekind",
  "The reals via dedekind cuts",
  TODO,
);
const realsCauchy = define(
  "reals.cauchy",
  "The reals as equivalence classes of cauchy sequences",
  TODO,
);
const RR = notation("reals.RR", wrapMath(<mi>ℝ</mi>), ({ self }) => (
  <>
    i will use {self} to mean the {reals}
  </>
));
axiom("reals.assoc", "The reals are associative", () => {
  const { x, y, z } = vars;
  return (
    <>
      For all {mrow(lst(x, y, z), mIn, RR)}:{" "}
      {mrow(
        mrow(par(x, mPlus, y), mPlus, z),
        mEq,
        mrow(x, mPlus, par(y, mPlus, z)),
      )}
    </>
  );
});

console.log("defined all statements", statements);
if (import.meta.hot) {
  import.meta.hot.invalidate();
}

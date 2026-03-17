import type { ComponentChild, FunctionComponent } from "preact";

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
  child: ComponentChild,
  Body: FunctionComponent<{ self: ComponentChild }>,
) {
  pushStatement({
    type: "notation",
    id,
    body: () => <Body self={child} />,
    child,
  });
  return (
    <a href={`#${id}`} class="notation">
      {child}
    </a>
  );
}
function axiom(id: string, title: string, body: FunctionComponent) {
  return pushStatement({ type: "axiom", title, id, body });
}

type VarType = string | number | ComponentChild;
function vs(...elements: [VarType]): [ComponentChild];
function vs(...elements: [VarType, VarType]): [ComponentChild, ComponentChild];
function vs(
  ...elements: [VarType, VarType, VarType]
): [ComponentChild, ComponentChild, ComponentChild];
function vs(...elements: VarType[]): ComponentChild[] {
  return elements.map(v);
}
function v(element: VarType): ComponentChild {
  if (typeof element === "number") return <mn>{element}</mn>;
  if (typeof element === "string") return <mi>{element}</mi>;
  return element;
}
const mathList =
  (start: ComponentChild | undefined, end: ComponentChild | undefined) =>
  (...elements: VarType[]) => (
    <mrow>
      {start && <mo>{start}</mo>}
      {elements.map((el, idx) => (
        <>
          {idx !== 0 && <mo>,</mo>}
          {v(el)}
        </>
      ))}
      {end && <mo>{end}</mo>}
    </mrow>
  );

const sl = mathList("{", "}");
const parLst = mathList("(", ")");
const par = (...elements: VarType[]) => (
  <mrow>
    <mo>(</mo>
    {elements.map(v)}
    <mo>)</mo>
  </mrow>
);
const lst = mathList(undefined, undefined);
const set = define("set", "Sets", () => (
  <>
    <p>
      A <em>small</em> unordered collection of things:
    </p>
    <ul>
      <li>{m(sl(1, 2, 3))}</li>
      <li>
        <math>{sl(1, 2, dots, 100)}</math>
      </li>
      <li>
        <math>{emptySet}</math>
      </li>
      <li>{m(NN)}</li>
    </ul>
  </>
));
const nat = define("nat", "Natural Numbers", () => (
  <>A natural number is a non-negative whole number.</>
));
const NN = notation("NN", <mi>ℕ</mi>, ({ self }) => (
  <>
    i will use {self} to mean the {nat}
  </>
));
const m = (...x: ComponentChild[]) => <math>{x.map(v)}</math>;
const mIn = <mo>∈</mo>;
const mPlus = <mo>+</mo>;
const func = (name: string) => {
  const func = (...args: ComponentChild[]) => (
    <>
      <mrow>
        <mi>{name}</mi>
        <mo>&#x2061;</mo>
        {parLst(...args)}
      </mrow>
    </>
  );
  return Object.assign(
    func,
    <>
      <mi>{name}</mi>
    </>,
  );
};
define("nat.peano", "The Peano Axioms", () => {
  const S = func("S");
  const phi = func("φ");
  const n = v("n");
  return (
    <>
      One characterization of the naturals is via the Peano axioms:
      <ol>
        <li>There exists a number {m(v(0), mIn, NN)}</li>
        <li>
          For every natural number {m(n, mIn, NN)}, there a successor{" "}
          {m(S(n), mIn, NN)} (logically {m(n, mPlus, 1)})
        </li>
        <li>
          The successor function {m(S)} is {injective}, so{" "}
          {m(mrow(S(n), mEq, S("m")), mImplies, mrow(n, mEq, "m"))}
        </li>
        <li>
          {m(0)} is not the successor of any number, or for every natural number{" "}
          {m(n, mIn, NN)}, {m(S(n), mEq, 0)} is false
        </li>
        <li>
          Additionally induction must work in the naturals, or if {m(phi)} is a{" "}
          {predicate} then
          <ul>
            <li>If {m(phi(0))} is true</li>
            <li>
              And for every number {m(n, mIn, NN)},{" "}
              {m(phi(n), mImplies, phi(S(n)))}
            </li>
            <li>
              then {m(phi(n))} holds for every natural {m(n, mIn, NN)}
            </li>
          </ul>
        </li>
      </ol>
      Additionally the peano axioms usually come with a definition of addition
      and order:
    </>
  );
});
const predicate = "predicate";
const mrow = (...args: VarType[]) => <mrow>{args.map(v)}</mrow>;
const mEq = <mo>=</mo>;
const mImplies = <mo>⇒</mo>;
const injective = "injective";
const emptySet = notation("set.empty", <mi>∅</mi>, () => <></>);

const dots = <mo>…</mo>;
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
const RR = notation("RR", <mi>ℝ</mi>, ({ self }) => (
  <>
    i will use {self} to mean the {reals}
  </>
));
axiom("reals.assoc", "The reals are associative", () => {
  const [x, y, z] = vs("x", "y", "z");
  return (
    <>
      For all {m(lst(x, y, z), mIn, RR)}:{" "}
      {m(
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

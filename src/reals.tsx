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

export const statements: Statement[] = [];

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
  return child;
}
function axiom(id: string, title: string, body: FunctionComponent) {
  return pushStatement({ type: "axiom", title, id, body });
}

const set = define("set", "Sets", () => <>a small collection of things</>);
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
const RR = notation("RR", <>ℝ</>, ({ self }) => (
  <>
    i will use {self} to mean the {reals}
  </>
));
axiom("reals.assoc", "the reals are associative", () => (
  <>For all x,y,z in {RR}: (x+y)+z = x+(y+z)</>
));

console.log("defined all statements", statements);

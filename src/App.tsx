import "./App.css";
import type { PropsWithChildren } from "preact/compat";
import { statements, type Statement } from "./reals";
import type { ComponentChild } from "preact";

export function App() {
  return (
    <>
      {statements.map((el) => (
        <RenderAnyStatement key={el.id} statement={el} />
      ))}
    </>
  );
}

function RenderAnyStatement({ statement }: { statement: Statement }) {
  console.log("rendering", statement);
  switch (statement.type) {
    case "axiom":
      return (
        <Axiom id={statement.id} title={statement.title}>
          <statement.body />
        </Axiom>
      );
    case "definition":
      return (
        <GenericStatement
          id={statement.id}
          title={statement.title}
          kind="definition"
          displayKind="Definition"
        >
          <statement.body />
        </GenericStatement>
      );
    case "notation":
      return (
        <GenericStatement
          id={statement.id}
          title={statement.child}
          kind="notation"
          displayKind="Notation"
        >
          <statement.body />
        </GenericStatement>
      );
      return (
        <p>
          Defining notation {statement.id} ({statement.child}){" "}
          <statement.body />
        </p>
      );

    default:
      statement satisfies never;
  }
}
function GenericStatement(
  props: PropsWithChildren<{
    title: ComponentChild;
    id: string;
    kind: string;
    displayKind: string;
  }>,
) {
  return (
    <div id={props.id} class={`statement statement-${props.kind}`}>
      <h2>
        <span class="statement-kind">{props.displayKind}</span>:{" "}
        <a href={`#${props.id}`} class="statement-link">
          {props.title} <span class="statement-id">[{props.id}]</span>
        </a>
      </h2>
      {props.children}
    </div>
  );
}

function Axiom(props: PropsWithChildren<{ title: string; id: string }>) {
  return <GenericStatement kind="axiom" displayKind="Axiom" {...props} />;
}

import type { ComponentChild, VNode } from "preact";

type _VarNamesFromAlphabet<T extends string[]> =
  | T[number]
  | Uppercase<T[number]>;

const latinAlphabetLower = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
] as const;
function completeAlphabet<T extends string>(
  strs: readonly T[],
): (T | Uppercase<T>)[] {
  return [...strs, ...strs.map((it) => it.toUpperCase())] as any;
}
export const latinAlphabet = completeAlphabet(latinAlphabetLower);

const greekAlphabetLower = [
  "α",
  "β",
  "γ",
  "δ",
  "ε",
  "ζ",
  "η",
  "θ",
  "ι",
  "κ",
  "λ",
  "μ",
  "ν",
  "ξ",
  "ο",
  "π",
  "ρ",
  "σ",
  "τ",
  "υ",
  "φ",
  "χ",
  "ψ",
  "ω",
] as const;
export const greekAlphabet = completeAlphabet(greekAlphabetLower);
export const variableNames = [...greekAlphabet, ...latinAlphabet] as const;

type VariableName = (typeof variableNames)[number];

export type MathWrapped = VNode & {
  _math_render: ComponentChild;
};
type ImplicitMathWrapped = MathWrapped | ImplicitSimpleObjects;

export function unwrapMath(component: ImplicitMathWrapped): ComponentChild {
  if (typeof component == "string" || typeof component == "number") {
    return renderSimpleObject(component);
  }
  return component._math_render;
}
export function wrapMath(component: ComponentChild): MathWrapped {
  if (
    typeof component === "object" &&
    component &&
    Object.hasOwn(component, "_math_render")
  )
    return component as MathWrapped;
  return Object.assign(<math>{component}</math>, {
    _math_render: component,
  });
}
type ImplicitSimpleObjects = VariableName | number;

function renderSimpleObject(obj: ImplicitSimpleObjects): ComponentChild {
  switch (typeof obj) {
    case "string":
      return <mi>{obj}</mi>;
    case "number":
      return <mn>{obj}</mn>;
    default:
      obj satisfies never;
  }
}

type MathParensList = [
  ["(", ")"],
  ["{", "}"],
  ["[", "]"],
  [undefined, undefined],
];
function wrapWithParens<T extends MathParensList[number]>(
  start: T[0],
  end: T[1],
  child: MathWrapped,
) {
  return wrapMath(
    <mrow>
      {start && <mo>{start}</mo>}
      {unwrapMath(child)}
      {end && <mo>{end}</mo>}
    </mrow>,
  );
}

function joinWith(
  joiner: ImplicitMathWrapped | undefined,
  elements: ImplicitMathWrapped[],
) {
  return wrapMath(
    <mrow>
      {elements.map((it, idx) => (
        <>
          {idx !== 0 && joiner && unwrapMath(joiner)}
          {unwrapMath(it)}
        </>
      ))}
    </mrow>,
  );
}
export function mathOp(op: string): MathWrapped {
  return wrapMath(<mo>{op}</mo>);
}

export type MathFunc = MathWrapped &
  ((...args: ImplicitMathWrapped[]) => MathWrapped);

export function mVar(name: VariableName): MathWrapped {
  return wrapMath(renderSimpleObject(name));
}
export function func(name: VariableName): MathFunc {
  const v = renderSimpleObject(name);
  return Object.assign((...args: ImplicitMathWrapped[]) => {
    return wrapMath(
      <mrow>
        <mi>{name}</mi>
        <mo>&#x2061;</mo>
        {unwrapMath(tuple(...args))}
      </mrow>,
    );
  }, wrapMath(v));
}
export const funcs = Object.fromEntries(
  variableNames.map((x: VariableName) => [x, func(x)]),
) satisfies { [K in string]: MathFunc } as { [K in VariableName]: MathFunc };

export const vars: { [K in VariableName]: MathWrapped } = Object.fromEntries(
  variableNames.map((x: VariableName) => [x, wrapMath(renderSimpleObject(x))]),
) satisfies { [K in string]: MathWrapped } as {
  [K in VariableName]: MathWrapped;
};

export const mPlus = mathOp("+");
export const cdot = mathOp("·");
export const dots = mathOp("…");
export const mEq = mathOp("=");
export const mImplies = mathOp("⇒");
export const mIff = mathOp("⟺");
export const mMinus = mathOp("-");
export const mathComma = mathOp(",");
export const lst = (...args: ImplicitMathWrapped[]) =>
  joinWith(mathComma, args);
export const mSet = (...args: ImplicitMathWrapped[]) =>
  wrapWithParens("{", "}", joinWith(mathComma, args));
export const tuple = (...args: ImplicitMathWrapped[]) =>
  wrapWithParens("(", ")", joinWith(mathComma, args));
export const mrow = (...args: ImplicitMathWrapped[]) =>
  joinWith(undefined, args);
export const par = (...args: ImplicitMathWrapped[]) =>
  wrapWithParens("(", ")", joinWith(undefined, args));

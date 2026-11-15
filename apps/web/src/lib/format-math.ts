/** @purpose Deterministic typographic Unicode math formatter that strips raw LaTeX delimiters in learner workspaces */

export function formatMathText(input: string): string {
  if (!input) return '';

  let result = input;

  // 1. Strip display $$...$$ and inline $...$ LaTeX delimiters while leaving currency like "$45 or $90" untouched
  result = result.replace(/\$\$([\s\S]*?)\$\$/g, '$1');
  result = result.replace(/\$(\S(?:[^$\n]*?\S)?)\$/g, '$1');

  // 2. Convert fractions and square roots (iterative pass for shallow nesting)
  for (let i = 0; i < 3; i += 1) {
    const next = result
      .replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, '($1 / $2)')
      .replace(/\\sqrt\{([^{}]+)\}/g, '√($1)');
    if (next === result) break;
    result = next;
  }

  // 3. Convert LaTeX operators and symbols using negative lookahead so commands like \left are never mangled
  result = result
    .replace(/\\pi(?![a-zA-Z])/g, 'π')
    .replace(/\\leq(?![a-zA-Z])/g, '≤')
    .replace(/\\le(?![a-zA-Z])/g, '≤')
    .replace(/\\geq(?![a-zA-Z])/g, '≥')
    .replace(/\\ge(?![a-zA-Z])/g, '≥')
    .replace(/\\neq(?![a-zA-Z])/g, '≠')
    .replace(/\\ne(?![a-zA-Z])/g, '≠')
    .replace(/\\times(?![a-zA-Z])/g, '×')
    .replace(/\\div(?![a-zA-Z])/g, '÷')
    .replace(/\\pm(?![a-zA-Z])/g, '±')
    .replace(/\\infty(?![a-zA-Z])/g, '∞')
    .replace(/\\cdot(?![a-zA-Z])/g, '·');

  // 4. Convert superscripts and subscripts
  result = result
    .replace(/\^\{-1\}/g, '⁻¹')
    .replace(/\^2\b/g, '²')
    .replace(/\^3\b/g, '³')
    .replace(/\^4\b/g, '⁴')
    .replace(/\^n\b/g, 'ⁿ')
    .replace(/\^\{([^{}]+)\}/g, '^($1)')
    .replace(/_0\b/g, '₀')
    .replace(/_1\b/g, '₁')
    .replace(/_2\b/g, '₂')
    .replace(/_n\b/g, 'ₙ');

  return result;
}

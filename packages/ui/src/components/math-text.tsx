/** @purpose Accessible, deterministic mathematical expression renderer using KaTeX */
import * as React from 'react';
import katex from 'katex';
import { cn } from '../lib/utils';

export interface MathSegment {
  type: 'text' | 'math';
  value: string;
  displayMode: boolean;
}

/**
 * Parses a string containing LaTeX inline ($...$) and block ($$...$$) expressions
 * into an array of typed segments.
 */
export function parseMathSegments(text: string): MathSegment[] {
  if (!text) return [];

  const segments: MathSegment[] = [];
  // Match $$...$$ (block) or $...$ (inline, non-empty)
  const mathRegex = /\$\$([\s\S]+?)\$\$|\$([^\$\n]+?)\$/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = mathRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({
        type: 'text',
        value: text.slice(lastIndex, match.index),
        displayMode: false,
      });
    }

    if (match[1] !== undefined) {
      segments.push({
        type: 'math',
        value: match[1].trim(),
        displayMode: true,
      });
    } else if (match[2] !== undefined) {
      segments.push({
        type: 'math',
        value: match[2].trim(),
        displayMode: false,
      });
    }

    lastIndex = mathRegex.lastIndex;
  }

  if (lastIndex < text.length) {
    segments.push({
      type: 'text',
      value: text.slice(lastIndex),
      displayMode: false,
    });
  }

  return segments;
}

export function renderKatexToString(latex: string, displayMode: boolean): string {
  try {
    return katex.renderToString(latex, {
      displayMode,
      throwOnError: false,
      output: 'htmlAndMathml',
      strict: false,
    });
  } catch {
    return latex;
  }
}

export interface MathTextProps {
  content?: string | null;
  className?: string;
  as?: 'span' | 'div' | 'p';
}

export function MathText({
  content,
  className,
  as: Component = 'span',
}: MathTextProps) {
  if (!content) return null;

  const segments = React.useMemo(() => parseMathSegments(content), [content]);

  return (
    <Component className={cn('math-text', className)}>
      {segments.map((segment, idx) => {
        if (segment.type === 'text') {
          return <React.Fragment key={idx}>{segment.value}</React.Fragment>;
        }
        const renderedHtml = renderKatexToString(segment.value, segment.displayMode);
        return (
          <span
            key={idx}
            className={segment.displayMode ? 'katex-block my-2 block text-center' : 'katex-inline inline'}
            dangerouslySetInnerHTML={{ __html: renderedHtml }}
          />
        );
      })}
    </Component>
  );
}

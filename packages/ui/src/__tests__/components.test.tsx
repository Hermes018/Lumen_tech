/** @purpose Unit and render smoke tests for core UI primitives */
import { describe, it, expect } from 'vitest';
import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { Button } from '../components/button';
import { Badge } from '../components/badge';
import { Card, CardHeader, CardTitle, CardContent } from '../components/card';
import { Input } from '../components/input';
import { ProgressBar } from '../components/progress-bar';
import { Callout } from '../components/callout';
import { MathText, parseMathSegments } from '../components/math-text';

describe('UI Primitives Smoke Suite', () => {
  it('renders Button with primary academic blue variant', () => {
    render(<Button variant="primary">Start IELTS Mock</Button>);
    const btn = screen.getByRole('button', { name: /start ielts mock/i });
    expect(btn).toBeDefined();
    expect(btn.className).toContain('bg-accent');
  });

  it('renders Badge with semantic warning variant', () => {
    render(<Badge variant="warning">High Trap Rate</Badge>);
    const badge = screen.getByText('High Trap Rate');
    expect(badge).toBeDefined();
    expect(badge.className).toContain('bg-warning-soft');
  });

  it('renders Card with header and content', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>GRE Quant Diagnostic</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Score: 162</p>
        </CardContent>
      </Card>
    );
    expect(screen.getByText('GRE Quant Diagnostic')).toBeDefined();
    expect(screen.getByText('Score: 162')).toBeDefined();
  });

  it('renders Callout for Tier 1 Hint and Trap Diagnostic', () => {
    render(
      <div>
        <Callout type="concept" title="Tier 1: Concept Nudge">
          Look for pivot words like &apos;although&apos;.
        </Callout>
        <Callout type="trap" title="Why Choice B is a Trap">
          Orphan synonym with no matching pair in sentence.
        </Callout>
      </div>
    );
    expect(screen.getByText('Tier 1: Concept Nudge')).toBeDefined();
    expect(screen.getByText('Why Choice B is a Trap')).toBeDefined();
  });

  it('renders Input with proper accessible styling', () => {
    render(<Input placeholder="Enter target band score" />);
    const input = screen.getByPlaceholderText('Enter target band score');
    expect(input).toBeDefined();
  });

  it('calculates ProgressBar width percentage correctly', () => {
    const { container } = render(<ProgressBar value={75} max={100} label="Vocabulary Mastery" />);
    expect(screen.getByText('Vocabulary Mastery')).toBeDefined();
    expect(screen.getByText('75%')).toBeDefined();
    const bar = container.querySelector('[role="progressbar"] > div') as HTMLElement;
    expect(bar.style.width).toBe('75%');
  });

  describe('MathText and KaTeX mathematical rendering', () => {
    it('parses inline and block math segments correctly', () => {
      const text = 'Let $x$ be an integer such that $x^2 = 16$. $$y = \\sqrt{z}$$';
      const segments = parseMathSegments(text);
      expect(segments).toHaveLength(6);
      expect(segments[0]).toEqual({ type: 'text', value: 'Let ', displayMode: false });
      expect(segments[1]).toEqual({ type: 'math', value: 'x', displayMode: false });
      expect(segments[2]).toEqual({ type: 'text', value: ' be an integer such that ', displayMode: false });
      expect(segments[3]).toEqual({ type: 'math', value: 'x^2 = 16', displayMode: false });
      expect(segments[4]).toEqual({ type: 'text', value: '. ', displayMode: false });
      expect(segments[5]).toEqual({ type: 'math', value: 'y = \\sqrt{z}', displayMode: true });
    });

    it('renders math expressions cleanly with KaTeX MathML/HTML and zero raw $ signs', () => {
      const raw = 'Let $x$ be an integer such that $x^2 = 16$. Quantity A is $x$, Quantity B is $0$ ($x = \\pm 4$).';
      const { container } = render(<MathText content={raw} />);
      
      // Zero raw $ characters in the rendered text
      expect(container.textContent).not.toContain('$');
      // KaTeX rendered spans should be present
      const katexElements = container.querySelectorAll('.katex');
      expect(katexElements.length).toBe(5);
    });

    it('handles fractions, square roots, inequalities, subscripts and superscripts', () => {
      const raw = 'Evaluate $\\frac{a}{b}$, $\\sqrt{x}$, $x \\leq 4$, $y \\geq 2$, and $x_1 \\neq x_2$.';
      const { container } = render(<MathText content={raw} />);
      expect(container.textContent).not.toContain('$');
      const katexElements = container.querySelectorAll('.katex');
      expect(katexElements.length).toBe(5);
    });

    it('renders block math equations ($$...$$) with block display styling', () => {
      const raw = '$$\\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$';
      const { container } = render(<MathText content={raw} />);
      expect(container.textContent).not.toContain('$');
      const blockSpan = container.querySelector('.katex-block');
      expect(blockSpan).toBeDefined();
      expect(blockSpan?.className).toContain('block');
    });

    it('handles empty or null content gracefully without throwing', () => {
      const { container: c1 } = render(<MathText content="" />);
      expect(c1.innerHTML).toBe('');
      const { container: c2 } = render(<MathText content={null} />);
      expect(c2.innerHTML).toBe('');
    });
  });
});

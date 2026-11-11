/** @purpose Unit and render smoke tests for core UI primitives */
import { describe, it, expect } from 'vitest';
import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { Button } from '../components/button.js';
import { Badge } from '../components/badge.js';
import { Card, CardHeader, CardTitle, CardContent } from '../components/card.js';
import { Input } from '../components/input.js';
import { ProgressBar } from '../components/progress-bar.js';
import { Callout } from '../components/callout.js';

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
});

/** @purpose Unit and accessibility tests for analytics UI components */
import { describe, it, expect, afterEach } from 'vitest';
import * as React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { StreakPill } from '../components/streak-pill';
import { LevelProgressBar } from '../components/level-progress-bar';
import { ScorePredictorChart } from '../components/score-predictor-chart';

describe('Analytics UI Components', () => {
  afterEach(() => {
    cleanup();
  });

  describe('StreakPill', () => {
    it('renders streak days and active status', () => {
      render(<StreakPill streak={7} isActiveToday={true} />);
      expect(screen.getByText('7 days')).toBeDefined();
      expect(screen.getByRole('status')).toBeDefined();
    });

    it('renders singular day when streak is 1', () => {
      render(<StreakPill streak={1} />);
      expect(screen.getByText('1 day')).toBeDefined();
    });

    it('displays streak freeze shield count when available', () => {
      render(<StreakPill streak={5} freezesRemaining={2} />);
      expect(screen.getByText('2')).toBeDefined();
    });
  });

  describe('LevelProgressBar', () => {
    it('renders level number, title, and XP progress bar', () => {
      const { container } = render(
        <LevelProgressBar
          level={3}
          title="Adept Thinker"
          totalXp={850}
          currentLevelXp={250}
          xpForNextLevel={500}
          progressPct={50}
          nextLevelTitle="Analytical Strategist"
        />
      );

      expect(screen.getByText('Level 3')).toBeDefined();
      expect(screen.getAllByText(/Adept Thinker/).length).toBeGreaterThan(0);
      expect(screen.getByText('250 / 500 XP')).toBeDefined();
      expect(screen.getByText('250 XP to Level 4')).toBeDefined();

      const progressbar = screen.getByRole('progressbar');
      expect(progressbar.getAttribute('aria-valuenow')).toBe('50');
      const innerBar = container.querySelector('[role="progressbar"] > div') as HTMLElement;
      expect(innerBar.style.width).toBe('50%');
    });
  });

  describe('ScorePredictorChart', () => {
    it('renders scaled GRE scores and target comparison', () => {
      render(
        <ScorePredictorChart
          estimatedQuant={164}
          estimatedVerbal={156}
          estimatedTotal={320}
          estimatedAwa={4.5}
          targetScore={{ quant: 165, verbal: 160, total: 325 }}
          confidence="high"
          trendHistory={[
            { date: '2026-11-01', quant: 160, verbal: 152, total: 312 },
            { date: '2026-11-10', quant: 164, verbal: 156, total: 320 },
          ]}
        />
      );

      expect(screen.getByText('Estimated GRE Score Predictor')).toBeDefined();
      expect(screen.getAllByText('320').length).toBeGreaterThan(0);
      expect(screen.getByText('Q164')).toBeDefined();
      expect(screen.getByText('V156')).toBeDefined();
      expect(screen.getByText('4.5')).toBeDefined();
      expect(screen.getByText('5 pts to target (325)')).toBeDefined();
      expect(screen.getByText('High Confidence')).toBeDefined();
      expect(screen.getByRole('img')).toBeDefined();
    });

    it('renders disclaimer notice conforming to ETS trademark requirements', () => {
      render(
        <ScorePredictorChart
          estimatedQuant={155}
          estimatedVerbal={150}
          estimatedTotal={305}
          confidence="low"
        />
      );

      expect(screen.getByText(/Not an official ETS result/i)).toBeDefined();
    });
  });
});

/** @purpose Render smoke and interaction tests for GRE pedagogy components (P1-20) */
import { describe, it, expect, vi } from 'vitest';
import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  GreCalculator,
  HintLadder,
  TrapDiagnostic,
  SocraticStepper,
  VerbalDeconstructor,
} from '../components/gre/index';

describe('GRE Interactive Pedagogy Components', () => {
  describe('GreCalculator', () => {
    it('renders on-screen calculator and executes operations with Transfer Display', () => {
      const handleTransfer = vi.fn();
      const handleClose = vi.fn();

      render(
        <GreCalculator
          isOpen={true}
          onClose={handleClose}
          onTransferDisplay={handleTransfer}
        />
      );

      expect(screen.getByRole('dialog', { name: /gre calculator/i })).toBeDefined();

      // Click 7 + 5 = 12
      fireEvent.click(screen.getByRole('button', { name: '7' }));
      fireEvent.click(screen.getByRole('button', { name: '+' }));
      fireEvent.click(screen.getByRole('button', { name: '5' }));
      fireEvent.click(screen.getByRole('button', { name: '=' }));

      expect(screen.getByText('12')).toBeDefined();

      // Transfer Display
      const transferBtn = screen.getByRole('button', { name: /transfer display/i });
      fireEvent.click(transferBtn);
      expect(handleTransfer).toHaveBeenCalledWith('12');

      // Close calculator
      const closeBtn = screen.getByRole('button', { name: /close calculator/i });
      fireEvent.click(closeBtn);
      expect(handleClose).toHaveBeenCalled();
    });
  });

  describe('HintLadder', () => {
    it('renders 3-tier hints and reveals progressively with budget warning', () => {
      const handleReveal = vi.fn();
      const hints = [
        { tier: 1 as const, label: 'Concept Nudge', content_md: 'Look for the sign of x^2.' },
        { tier: 2 as const, label: 'Setup / Elimination', content_md: 'x can be +4 or -4.' },
        { tier: 3 as const, label: 'Final Bridge', content_md: 'Substitute both into x+y.' },
      ];

      const { rerender } = render(
        <HintLadder
          hints={hints}
          revealedTiers={[1]}
          hintBudgetRemaining={1} // Low budget triggers warning
          onRevealNextHint={handleReveal}
        />
      );

      // Verify Tier 1 is rendered
      expect(screen.getByText(/Hint Tier 1: Concept Nudge/i)).toBeDefined();
      expect(screen.getByText('Look for the sign of x^2.')).toBeDefined();

      // Verify low budget warning
      expect(screen.getByText(/Caution: Hint budget is almost depleted/i)).toBeDefined();

      // Click unlock next hint
      const unlockBtn = screen.getByRole('button', { name: /unlock hint 2/i });
      fireEvent.click(unlockBtn);
      expect(handleReveal).toHaveBeenCalled();

      // Rerender with all revealed
      rerender(
        <HintLadder
          hints={hints}
          revealedTiers={[1, 2, 3]}
          hintBudgetRemaining={0}
          onRevealNextHint={handleReveal}
        />
      );

      expect(screen.getByText(/All 3 progressive hints revealed/i)).toBeDefined();
    });
  });

  describe('TrapDiagnostic', () => {
    it('renders trap warning with label and distractor analysis', () => {
      render(
        <TrapDiagnostic
          choiceId="A"
          choiceText="Quantity A is greater"
          trapTag="forgot_zero_or_negative"
          trapLabel="Overlooked Negative Numbers"
          explanationMd="You calculated x = 4 but forgot that (-4)^2 is also 16."
        />
      );

      expect(screen.getByRole('alert')).toBeDefined();
      expect(screen.getByText(/Choice A Trap/i)).toBeDefined();
      expect(screen.getByText(/Overlooked Negative Numbers/i)).toBeDefined();
      expect(screen.getByText(/Selected Choice \[A\]/i)).toBeDefined();
      expect(screen.getByText(/forgot that \(-4\)\^2 is also 16/i)).toBeDefined();
    });
  });

  describe('SocraticStepper', () => {
    it('renders micro-steps and advances when option is selected', () => {
      const handleSelect = vi.fn();
      const steps = [
        {
          step_index: 0,
          prompt_md: 'What are the possible solutions to x^2 = 16?',
          options: ['x = 4 only', 'x = 4 and x = -4', 'x = 16 and x = -16'],
          correct_option_index: 1,
          takeaway_md: 'Even powers have two opposite roots.',
        },
        {
          step_index: 1,
          prompt_md: 'What is y when y^3 = -27?',
          options: ['y = -3', 'y = 3', 'y = -9'],
          correct_option_index: 0,
          takeaway_md: 'Odd powers preserve sign.',
        },
      ];

      render(
        <SocraticStepper
          steps={steps}
          currentStepIndex={0}
          completedStepIndices={[]}
          isCompleted={false}
          onSelectStepOption={handleSelect}
        />
      );

      expect(screen.getByText(/Walk Me Through It/i)).toBeDefined();
      expect(screen.getByText('What are the possible solutions to x^2 = 16?')).toBeDefined();

      // Select correct option B
      const optionB = screen.getByText('x = 4 and x = -4');
      fireEvent.click(optionB);
      expect(handleSelect).toHaveBeenCalledWith(0, 1);
    });
  });

  describe('VerbalDeconstructor', () => {
    it('supports Predict First toggle, choice blurring, and click-to-deck word event', () => {
      const handlePredictFirstToggle = vi.fn();
      const handleRevealToggle = vi.fn();
      const handleAddToDeck = vi.fn();
      const handlePredictionChange = vi.fn();

      render(
        <VerbalDeconstructor
          passageOrSentence="The politician was notoriously mercurial, changing stances frequently."
          predictFirstEnabled={true}
          predictionText="unpredictable"
          choicesRevealed={false}
          onPredictionChange={handlePredictionChange}
          onToggleReveal={handleRevealToggle}
          onTogglePredictFirst={handlePredictFirstToggle}
          onAddToDeck={handleAddToDeck}
        >
          <div data-testid="choices-container">
            <button type="button">A. Steadfast</button>
            <button type="button">B. Capricious</button>
          </div>
        </VerbalDeconstructor>
      );

      expect(screen.getByText(/Predict First: ON/i)).toBeDefined();

      // Check that words can be clicked to fire onAddToDeck
      const mercurialWord = screen.getByText('mercurial,');
      fireEvent.click(mercurialWord);
      expect(handleAddToDeck).toHaveBeenCalledWith('mercurial');

      // Click Reveal Choices overlay button
      const revealBtn = screen.getByRole('button', { name: /i have my prediction/i });
      fireEvent.click(revealBtn);
      expect(handleRevealToggle).toHaveBeenCalled();
    });
  });
});

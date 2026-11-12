/** @purpose Accessible on-screen 4-function calculator with Transfer Display for GRE CBT Quant (08 §5.1.17) */
'use client';

import * as React from 'react';
import { cn } from '../../lib/utils';
import { X, ArrowDownToLine } from 'lucide-react';

export interface GreCalculatorProps {
  isOpen?: boolean;
  onClose?: () => void;
  onTransferDisplay?: (value: string) => void;
  className?: string;
}

export function GreCalculator({
  isOpen = true,
  onClose,
  onTransferDisplay,
  className,
}: GreCalculatorProps) {
  const [display, setDisplay] = React.useState('0');
  const [previousValue, setPreviousValue] = React.useState<number | null>(null);
  const [operation, setOperation] = React.useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = React.useState(false);
  const [memory, setMemory] = React.useState<number>(0);
  const [hasMemory, setHasMemory] = React.useState(false);

  // Handle digit input
  const inputDigit = React.useCallback(
    (digit: string) => {
      if (waitingForOperand) {
        setDisplay(digit);
        setWaitingForOperand(false);
      } else {
        setDisplay(display === '0' ? digit : display + digit);
      }
    },
    [display, waitingForOperand]
  );

  // Handle decimal dot
  const inputDecimal = React.useCallback(() => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
      return;
    }
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  }, [display, waitingForOperand]);

  // Handle clear
  const clearAll = React.useCallback(() => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  }, []);

  const clearEntry = React.useCallback(() => {
    setDisplay('0');
  }, []);

  // Arithmetic operations
  const performOperation = React.useCallback(
    (nextOperator: string) => {
      const inputValue = parseFloat(display);

      if (previousValue === null) {
        setPreviousValue(inputValue);
      } else if (operation) {
        const currentValue = previousValue;
        let newValue = currentValue;

        switch (operation) {
          case '+':
            newValue = currentValue + inputValue;
            break;
          case '-':
            newValue = currentValue - inputValue;
            break;
          case '*':
            newValue = currentValue * inputValue;
            break;
          case '/':
            newValue = inputValue === 0 ? 0 : currentValue / inputValue;
            break;
          default:
            break;
        }

        const formatted = Number(newValue.toFixed(8)).toString();
        setPreviousValue(newValue);
        setDisplay(formatted);
      }

      setWaitingForOperand(true);
      setOperation(nextOperator === '=' ? null : nextOperator);
    },
    [display, operation, previousValue]
  );

  // Special functions
  const handleSquareRoot = React.useCallback(() => {
    const val = parseFloat(display);
    if (val < 0) {
      setDisplay('Error');
    } else {
      const result = Math.sqrt(val);
      setDisplay(Number(result.toFixed(8)).toString());
    }
    setWaitingForOperand(true);
  }, [display]);

  const handleReciprocal = React.useCallback(() => {
    const val = parseFloat(display);
    if (val === 0) {
      setDisplay('Error');
    } else {
      const result = 1 / val;
      setDisplay(Number(result.toFixed(8)).toString());
    }
    setWaitingForOperand(true);
  }, [display]);

  const handleToggleSign = React.useCallback(() => {
    const val = parseFloat(display);
    setDisplay((-val).toString());
  }, [display]);

  // Memory functions
  const handleMemoryAdd = React.useCallback(() => {
    const val = parseFloat(display);
    if (!isNaN(val)) {
      setMemory((prev) => prev + val);
      setHasMemory(true);
    }
  }, [display]);

  const handleMemoryRecall = React.useCallback(() => {
    setDisplay(memory.toString());
    setWaitingForOperand(true);
  }, [memory]);

  const handleMemoryClear = React.useCallback(() => {
    setMemory(0);
    setHasMemory(false);
  }, []);

  // Transfer display value
  const handleTransfer = React.useCallback(() => {
    if (onTransferDisplay && display !== 'Error') {
      onTransferDisplay(display);
    }
  }, [display, onTransferDisplay]);

  // Global keydown handler
  React.useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') {
        inputDigit(e.key);
      } else if (e.key === '.') {
        inputDecimal();
      } else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
        performOperation(e.key);
      } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        performOperation('=');
      } else if (e.key === 'Escape') {
        onClose?.();
      } else if (e.key === 'Backspace') {
        if (!waitingForOperand && display.length > 1) {
          setDisplay(display.slice(0, -1));
        } else {
          setDisplay('0');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, inputDigit, inputDecimal, performOperation, onClose, display, waitingForOperand]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-label="GRE Calculator"
      className={cn(
        'w-[280px] select-none rounded-xl border border-control bg-surface p-3 shadow-xl text-fg',
        className
      )}
    >
      {/* Title Bar */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-control/40">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-semibold tracking-wider uppercase text-fg-muted">
            GRE Calculator
          </span>
          {hasMemory && (
            <span className="px-1 py-0.2 text-[10px] font-bold rounded bg-accent-soft text-accent">
              M
            </span>
          )}
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Calculator"
            className="rounded p-1 text-fg-muted hover:bg-surface-2 hover:text-fg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Main Display */}
      <div className="mb-3 rounded-lg border border-control bg-surface-2 px-3 py-2 text-right font-mono text-xl font-medium tracking-tight overflow-x-auto text-fg">
        {display}
      </div>

      {/* Transfer Display Button */}
      {onTransferDisplay && (
        <button
          type="button"
          onClick={handleTransfer}
          aria-label="Transfer Display"
          className="mb-3 flex w-full items-center justify-center gap-1.5 rounded-lg border border-accent bg-accent-soft py-1.5 text-xs font-semibold text-accent hover:bg-accent hover:text-accent-fg active:scale-[0.98] transition-all"
        >
          <ArrowDownToLine className="w-3.5 h-3.5" />
          Transfer Display
        </button>
      )}

      {/* Keypad Grid */}
      <div className="grid grid-cols-4 gap-1.5 text-sm font-medium">
        {/* Row 1: Memory & Clears */}
        <button
          type="button"
          onClick={handleMemoryClear}
          className="h-9 rounded bg-surface-2 text-fg-muted hover:bg-surface-3 active:scale-95 transition-all text-xs"
        >
          MC
        </button>
        <button
          type="button"
          onClick={handleMemoryRecall}
          className="h-9 rounded bg-surface-2 text-fg-muted hover:bg-surface-3 active:scale-95 transition-all text-xs"
        >
          MR
        </button>
        <button
          type="button"
          onClick={handleMemoryAdd}
          className="h-9 rounded bg-surface-2 text-fg-muted hover:bg-surface-3 active:scale-95 transition-all text-xs"
        >
          M+
        </button>
        <button
          type="button"
          onClick={clearAll}
          className="h-9 rounded bg-danger/10 text-danger hover:bg-danger/20 active:scale-95 transition-all text-xs font-bold"
        >
          C
        </button>

        {/* Row 2: CE, Sqrt, 1/x, Div */}
        <button
          type="button"
          onClick={clearEntry}
          className="h-9 rounded bg-surface-2 text-fg hover:bg-surface-3 active:scale-95 transition-all text-xs"
        >
          CE
        </button>
        <button
          type="button"
          onClick={handleSquareRoot}
          className="h-9 rounded bg-surface-2 text-fg hover:bg-surface-3 active:scale-95 transition-all"
        >
          √
        </button>
        <button
          type="button"
          onClick={handleReciprocal}
          className="h-9 rounded bg-surface-2 text-fg hover:bg-surface-3 active:scale-95 transition-all text-xs"
        >
          1/x
        </button>
        <button
          type="button"
          onClick={() => performOperation('/')}
          className="h-9 rounded bg-surface-3 text-fg hover:bg-surface-4 active:scale-95 transition-all font-bold"
        >
          ÷
        </button>

        {/* Row 3: 7, 8, 9, Mul */}
        <button
          type="button"
          onClick={() => inputDigit('7')}
          className="h-9 rounded border border-control/30 bg-surface text-fg hover:bg-surface-2 active:scale-95 transition-all"
        >
          7
        </button>
        <button
          type="button"
          onClick={() => inputDigit('8')}
          className="h-9 rounded border border-control/30 bg-surface text-fg hover:bg-surface-2 active:scale-95 transition-all"
        >
          8
        </button>
        <button
          type="button"
          onClick={() => inputDigit('9')}
          className="h-9 rounded border border-control/30 bg-surface text-fg hover:bg-surface-2 active:scale-95 transition-all"
        >
          9
        </button>
        <button
          type="button"
          onClick={() => performOperation('*')}
          className="h-9 rounded bg-surface-3 text-fg hover:bg-surface-4 active:scale-95 transition-all font-bold"
        >
          ×
        </button>

        {/* Row 4: 4, 5, 6, Sub */}
        <button
          type="button"
          onClick={() => inputDigit('4')}
          className="h-9 rounded border border-control/30 bg-surface text-fg hover:bg-surface-2 active:scale-95 transition-all"
        >
          4
        </button>
        <button
          type="button"
          onClick={() => inputDigit('5')}
          className="h-9 rounded border border-control/30 bg-surface text-fg hover:bg-surface-2 active:scale-95 transition-all"
        >
          5
        </button>
        <button
          type="button"
          onClick={() => inputDigit('6')}
          className="h-9 rounded border border-control/30 bg-surface text-fg hover:bg-surface-2 active:scale-95 transition-all"
        >
          6
        </button>
        <button
          type="button"
          onClick={() => performOperation('-')}
          className="h-9 rounded bg-surface-3 text-fg hover:bg-surface-4 active:scale-95 transition-all font-bold"
        >
          −
        </button>

        {/* Row 5: 1, 2, 3, Add */}
        <button
          type="button"
          onClick={() => inputDigit('1')}
          className="h-9 rounded border border-control/30 bg-surface text-fg hover:bg-surface-2 active:scale-95 transition-all"
        >
          1
        </button>
        <button
          type="button"
          onClick={() => inputDigit('2')}
          className="h-9 rounded border border-control/30 bg-surface text-fg hover:bg-surface-2 active:scale-95 transition-all"
        >
          2
        </button>
        <button
          type="button"
          onClick={() => inputDigit('3')}
          className="h-9 rounded border border-control/30 bg-surface text-fg hover:bg-surface-2 active:scale-95 transition-all"
        >
          3
        </button>
        <button
          type="button"
          onClick={() => performOperation('+')}
          className="h-9 rounded bg-surface-3 text-fg hover:bg-surface-4 active:scale-95 transition-all font-bold"
        >
          +
        </button>

        {/* Row 6: ±, 0, ., Equals */}
        <button
          type="button"
          onClick={handleToggleSign}
          className="h-9 rounded border border-control/30 bg-surface text-fg hover:bg-surface-2 active:scale-95 transition-all text-xs"
        >
          ±
        </button>
        <button
          type="button"
          onClick={() => inputDigit('0')}
          className="h-9 rounded border border-control/30 bg-surface text-fg hover:bg-surface-2 active:scale-95 transition-all"
        >
          0
        </button>
        <button
          type="button"
          onClick={inputDecimal}
          className="h-9 rounded border border-control/30 bg-surface text-fg hover:bg-surface-2 active:scale-95 transition-all"
        >
          .
        </button>
        <button
          type="button"
          onClick={() => performOperation('=')}
          className="h-9 rounded bg-accent text-accent-fg hover:bg-accent-hover active:scale-95 transition-all font-bold"
        >
          =
        </button>
      </div>
    </div>
  );
}

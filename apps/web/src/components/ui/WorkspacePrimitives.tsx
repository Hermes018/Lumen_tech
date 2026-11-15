/** @purpose Closed-vocabulary Claude Editorial Workspace primitives for learner and admin surfaces */
'use client';

import React, { useState, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { LocaleLink } from '@/app/[locale]/_components/LocaleLink';

export interface WorkspaceAction {
  label: string;
  href?: string;
  onClick?: () => void;
}

function WorkspaceActionControl({
  action,
  variant,
}: {
  action: WorkspaceAction;
  variant: 'primary' | 'secondary';
}) {
  const className =
    variant === 'primary'
      ? 'inline-flex items-center justify-center bg-[var(--brand)] text-white px-4 py-2.5 text-sm font-semibold rounded-[4px] hover:bg-[var(--link)] transition-colors leading-relaxed'
      : 'inline-flex items-center underline underline-offset-4 text-sm font-medium text-[var(--brand-deep)] hover:text-[var(--brand)] transition-colors leading-relaxed';

  if (action.href) {
    return (
      <LocaleLink href={action.href} onClick={action.onClick} className={className}>
        {action.label}
      </LocaleLink>
    );
  }

  return (
    <button type="button" onClick={action.onClick} className={className}>
      {action.label}
    </button>
  );
}

export interface WorkspaceContainerProps {
  children: ReactNode;
  className?: string;
}

export function WorkspaceContainer({ children, className = '' }: WorkspaceContainerProps) {
  return (
    <div className={`max-w-[1040px] mx-auto px-5 sm:px-8 py-8 md:py-12 ${className}`.trim()}>
      {children}
    </div>
  );
}

export interface WorkspaceHeaderProps {
  title: string;
  subtitle?: string;
  metaText?: string;
  primaryAction?: WorkspaceAction;
  secondaryAction?: WorkspaceAction;
}

export function WorkspaceHeader({
  title,
  subtitle,
  metaText,
  primaryAction,
  secondaryAction,
}: WorkspaceHeaderProps) {
  return (
    <header className="border-b border-[var(--hairline)] pb-6 mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="min-w-0">
        <h1 className="text-2xl md:text-3xl font-bold text-[var(--brand-deep)] tracking-tight leading-snug">
          {title}
        </h1>
        {subtitle ? (
          <p className="text-[15px] text-[var(--text)] mt-1.5 max-w-[65ch] leading-relaxed">
            {subtitle}
          </p>
        ) : null}
        {metaText ? (
          <p className="text-sm text-[var(--text-muted)] mt-2 leading-relaxed">{metaText}</p>
        ) : null}
      </div>

      {primaryAction || secondaryAction ? (
        <div className="flex flex-wrap items-center gap-4 shrink-0">
          {primaryAction ? <WorkspaceActionControl action={primaryAction} variant="primary" /> : null}
          {secondaryAction ? (
            <WorkspaceActionControl action={secondaryAction} variant="secondary" />
          ) : null}
        </div>
      ) : null}
    </header>
  );
}

export interface WorkspaceFocusSheetProps {
  title: string;
  body: string;
  meta?: string;
  primaryAction: WorkspaceAction;
  secondaryAction?: WorkspaceAction;
}

export function WorkspaceFocusSheet({
  title,
  body,
  meta,
  primaryAction,
  secondaryAction,
}: WorkspaceFocusSheetProps) {
  return (
    <section className="bg-[var(--surface-paper)] border border-[var(--hairline)] border-l-[3px] border-l-[var(--brand)] p-6 mb-10 rounded-none">
      <h2 className="text-lg md:text-xl font-bold text-[var(--brand-deep)] leading-snug">
        {title}
      </h2>
      <p className="text-[15px] text-[var(--text)] mt-2 max-w-[65ch] leading-relaxed">{body}</p>
      {meta ? <p className="text-sm text-[var(--text-muted)] mt-2 leading-relaxed">{meta}</p> : null}
      <div className="mt-5 flex flex-wrap items-center gap-5">
        <WorkspaceActionControl action={primaryAction} variant="primary" />
        {secondaryAction ? (
          <WorkspaceActionControl action={secondaryAction} variant="secondary" />
        ) : null}
      </div>
    </section>
  );
}

export interface WorkspaceStatItem {
  value: string;
  label: string;
  detail?: string;
  href?: string;
  hrefLabel?: string;
}

export interface WorkspaceStatRowProps {
  stats: WorkspaceStatItem[];
}

export function WorkspaceStatRow({ stats }: WorkspaceStatRowProps) {
  return (
    <dl className="grid grid-cols-2 lg:grid-cols-4 border-y border-[var(--hairline)] py-6 mb-10 gap-y-6 lg:gap-y-0 lg:divide-x lg:divide-[var(--hairline)]">
      {stats.map((stat) => (
        <div key={`${stat.label}-${stat.value}`} className="pr-4 lg:px-6 first:lg:pl-0 last:lg:pr-0">
          <dd className="text-2xl md:text-3xl font-extrabold text-[var(--brand-deep)] tracking-tight leading-tight">
            {stat.value}
          </dd>
          <dt className="text-sm text-[var(--text)] mt-1 leading-relaxed">{stat.label}</dt>
          {stat.detail ? (
            <p className="text-xs text-[var(--text-muted)] mt-1 leading-relaxed">{stat.detail}</p>
          ) : null}
          {stat.href ? (
            <LocaleLink
              href={stat.href}
              className="inline-block mt-2 text-xs font-medium underline underline-offset-4 text-[var(--brand-deep)] hover:text-[var(--brand)] leading-relaxed"
            >
              {stat.hrefLabel ?? '→'}
            </LocaleLink>
          ) : null}
        </div>
      ))}
    </dl>
  );
}

export interface WorkspaceTabItem {
  id: string;
  label: string;
  count?: number;
}

export interface WorkspaceTabsProps {
  tabs: WorkspaceTabItem[];
  activeTab: string;
  onSelect: (id: string) => void;
}

export function WorkspaceTabs({ tabs, activeTab, onSelect }: WorkspaceTabsProps) {
  return (
    <div role="tablist" className="flex flex-wrap gap-6 border-b border-[var(--hairline)] mb-8">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onSelect(tab.id)}
            className={
              isActive
                ? 'border-b-2 border-[var(--brand)] text-[var(--brand-deep)] font-semibold pb-3 -mb-px text-sm transition-colors leading-relaxed'
                : 'text-[var(--text)] hover:text-[var(--brand-deep)] pb-3 -mb-px text-sm transition-colors leading-relaxed'
            }
          >
            <span>{tab.label}</span>
            {typeof tab.count === 'number' ? (
              <span className="ml-1.5 text-xs text-[var(--text-muted)]">({tab.count})</span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

export interface WorkspaceSectionTitleProps {
  title: string;
  subtitle?: string;
  rightAction?: ReactNode;
}

export function WorkspaceSectionTitle({ title, subtitle, rightAction }: WorkspaceSectionTitleProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-4">
      <div>
        <h2 className="text-lg md:text-xl font-bold text-[var(--brand-deep)] leading-snug">
          {title}
        </h2>
        {subtitle ? (
          <p className="text-sm text-[var(--text)] mt-1 leading-relaxed">{subtitle}</p>
        ) : null}
      </div>
      {rightAction ? <div className="shrink-0">{rightAction}</div> : null}
    </div>
  );
}

export interface WorkspaceLedgerProps {
  children: ReactNode;
  className?: string;
}

export function WorkspaceLedger({ children, className = '' }: WorkspaceLedgerProps) {
  return (
    <div className={`divide-y divide-[var(--hairline)] border-y border-[var(--hairline)] ${className}`.trim()}>
      {children}
    </div>
  );
}

export interface WorkspaceLedgerRowProps {
  left?: ReactNode;
  right?: ReactNode;
  children?: ReactNode;
  className?: string;
}

export function WorkspaceLedgerRow({
  left,
  right,
  children,
  className = '',
}: WorkspaceLedgerRowProps) {
  return (
    <div
      className={`py-4 px-2 hover:bg-[var(--bg-warm)]/60 transition-colors duration-150 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${className}`.trim()}
    >
      {left !== undefined ? (
        <>
          <div className="min-w-0 flex-1">{left}</div>
          {right !== undefined ? (
            <div className="flex flex-wrap items-center gap-4 shrink-0 text-sm text-[var(--text)]">
              {right}
            </div>
          ) : null}
        </>
      ) : (
        children
      )}
    </div>
  );
}

export interface WorkspaceTableColumn {
  key: string;
  header: string;
  align?: 'left' | 'right' | 'center';
  widthClass?: string;
}

export interface WorkspaceTableRow {
  id: string;
  rowHeader: ReactNode;
  rowSubheader?: string;
  cells: Record<string, ReactNode>;
  expandedContent?: ReactNode;
}

export interface WorkspaceDataTableProps {
  columns: WorkspaceTableColumn[];
  rows: WorkspaceTableRow[];
  emptyMessage?: string;
  caption?: string;
}

function getTableAlignClass(align?: 'left' | 'right' | 'center'): string {
  if (align === 'right') return 'text-right';
  if (align === 'center') return 'text-center';
  return 'text-left';
}

export function WorkspaceDataTable({
  columns,
  rows,
  emptyMessage = 'No records found.',
  caption,
}: WorkspaceDataTableProps) {
  const firstCol = columns[0];
  const restCols = columns.slice(1);

  return (
    <div className="border border-[var(--hairline)] rounded-[4px] overflow-x-auto bg-[var(--surface-paper)] mb-8">
      <table className="w-full border-collapse text-left">
        {caption ? <caption className="sr-only">{caption}</caption> : null}
        <thead className="bg-[var(--bg-warm)] border-b border-[var(--hairline)]">
          <tr className="divide-x divide-[var(--hairline)]">
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                className={`px-4 py-3 text-xs font-semibold text-[var(--brand-deep)] tracking-normal ${getTableAlignClass(col.align)} ${col.widthClass ?? ''}`.trim()}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--hairline)]">
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={Math.max(1, columns.length)}
                className="px-4 py-8 text-center text-sm text-[var(--text-muted)]"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <React.Fragment key={row.id}>
                <tr className="divide-x divide-[var(--hairline)] even:bg-[var(--bg)]/45 hover:bg-[var(--bg-warm)]/65 transition-colors duration-150">
                  {firstCol ? (
                    <th
                      scope="row"
                      className={`px-4 py-3.5 font-semibold text-sm text-[var(--brand-deep)] bg-[var(--bg)]/35 align-middle ${getTableAlignClass(firstCol.align)} ${firstCol.widthClass ?? ''}`.trim()}
                    >
                      <div>{row.rowHeader}</div>
                      {row.rowSubheader ? (
                        <span className="block text-xs font-normal text-[var(--text-muted)] mt-0.5">
                          {row.rowSubheader}
                        </span>
                      ) : null}
                    </th>
                  ) : null}
                  {restCols.map((col) => (
                    <td
                      key={col.key}
                      className={`px-4 py-3.5 text-sm text-[var(--text)] tabular-nums align-middle ${getTableAlignClass(col.align)} ${col.widthClass ?? ''}`.trim()}
                    >
                      {row.cells[col.key] ?? null}
                    </td>
                  ))}
                </tr>
                {row.expandedContent ? (
                  <tr className="bg-[var(--bg-warm)]/40 border-t border-[var(--hairline)]">
                    <td colSpan={Math.max(1, columns.length)} className="p-5">
                      {row.expandedContent}
                    </td>
                  </tr>
                ) : null}
              </React.Fragment>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export interface WorkspaceProgressBarProps {
  value: number;
  max?: number;
  tone?: 'espresso' | 'crimson';
  label?: string;
}

export function WorkspaceProgressBar({
  value,
  max = 100,
  tone = 'espresso',
  label,
}: WorkspaceProgressBarProps) {
  const safeMax = max > 0 ? max : 100;
  const pct = Math.max(0, Math.min(100, (value / safeMax) * 100));

  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      className="h-[4px] w-full bg-[var(--hairline)] overflow-hidden rounded-none"
    >
      <div
        className={
          tone === 'crimson'
            ? 'h-full bg-[var(--brand)] transition-all duration-300'
            : 'h-full bg-[var(--brand-deep)] transition-all duration-300'
        }
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

function normalizeWorkspacePath(pathname: string): string {
  const stripped = pathname.replace(/^\/(en|bn)(?=\/|$)/, '');
  return stripped || '/';
}

export interface WorkspaceNavLinkProps {
  href: string;
  exact?: boolean;
  children: ReactNode;
  onNavigate?: () => void;
}

export function WorkspaceNavLink({
  href,
  exact = false,
  children,
  onNavigate,
}: WorkspaceNavLinkProps) {
  const rawPathname = usePathname() || '/';
  const pathname = normalizeWorkspacePath(rawPathname);
  const isActive = exact
    ? pathname === href
    : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <LocaleLink
      href={href}
      onClick={onNavigate}
      aria-current={isActive ? 'page' : undefined}
      className={
        isActive
          ? 'flex items-center gap-2.5 bg-[var(--surface-paper)] text-[var(--brand-deep)] font-semibold border-l-[3px] border-[var(--brand)] px-3 py-2.5 text-sm leading-relaxed rounded-none'
          : 'flex items-center gap-2.5 text-[var(--text)] hover:text-[var(--brand-deep)] hover:bg-[var(--surface-paper)]/50 px-3 py-2.5 text-sm leading-relaxed transition-colors rounded-none'
      }
    >
      {children}
    </LocaleLink>
  );
}

export interface WorkspaceMobileSheetProps {
  brandHeader: ReactNode;
  navigation: ReactNode;
  footer: ReactNode;
  openLabel: string;
  closeLabel: string;
}

export function WorkspaceMobileSheet({
  brandHeader,
  navigation,
  footer,
  openLabel,
  closeLabel,
}: WorkspaceMobileSheetProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden border-b border-[var(--hairline)] bg-[var(--bg-warm)]">
      <div className="flex items-center justify-between px-4 py-3">
        {brandHeader}
        <button
          type="button"
          aria-expanded={open}
          aria-label={open ? closeLabel : openLabel}
          onClick={() => setOpen((prev) => !prev)}
          className="inline-flex items-center justify-center border border-[var(--hairline)] bg-[var(--surface-paper)] px-2.5 py-2 text-[var(--brand-deep)] rounded-[4px]"
        >
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {open ? (
        <div
          className="border-t border-[var(--hairline)] px-4 py-4 space-y-5 bg-[var(--bg-warm)]"
          onClick={(e) => {
            const target = e.target as HTMLElement | null;
            if (target?.closest('a')) {
              setOpen(false);
            }
          }}
        >
          {navigation}
          <div className="border-t border-[var(--hairline)] pt-4">{footer}</div>
        </div>
      ) : null}
    </div>
  );
}

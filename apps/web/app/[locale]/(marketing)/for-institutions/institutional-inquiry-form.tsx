/** @purpose Interactive institutional seat licensing & cohort inquiry form */
'use client';

import React, { useState } from 'react';
import { Button, Input } from '@lumen/ui';
import { brand } from '@lumen/config';
import { CheckCircle2, Send, Building2 } from 'lucide-react';

export function InstitutionalInquiryForm() {
  const [institutionName, setInstitutionName] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [cohortSize, setCohortSize] = useState('50-200');
  const [targetExam, setTargetExam] = useState<'gre' | 'ielts' | 'both'>('both');
  const [notes, setNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (institutionName && contactEmail) {
      setIsSubmitted(true);
    }
  };

  if (isSubmitted) {
    return (
      <div className="rounded-2xl border border-success/40 bg-success-soft/60 p-8 text-center space-y-4 animate-in fade-in duration-300">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-success text-white">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <h3 className="text-xl font-bold text-slate-900">Inquiry Received</h3>
        <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
          Thank you, <strong>{contactName || institutionName}</strong>. Our Institutional Partnerships team will review your cohort requirements and provide a customized seat licensing proposal within 1 business day.
        </p>
        <div className="pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setIsSubmitted(false);
              setInstitutionName('');
              setContactEmail('');
              setNotes('');
            }}
          >
            Submit Another Inquiry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-surface p-6 sm:p-8 shadow-sm space-y-5">
      <div className="flex items-center gap-2 border-b border-border pb-3">
        <Building2 className="h-5 w-5 text-accent" />
        <h3 className="text-lg font-bold text-fg">Request Institutional Proposal & Demo Access</h3>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="instName" className="text-xs font-semibold uppercase tracking-wider text-fg-muted">
            Institution / Organization Name *
          </label>
          <Input
            id="instName"
            required
            value={institutionName}
            onChange={(e) => setInstitutionName(e.target.value)}
            placeholder="e.g. BUET, IBA, BRAC University, Standard Chartered"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="contactName" className="text-xs font-semibold uppercase tracking-wider text-fg-muted">
            Contact Person & Title *
          </label>
          <Input
            id="contactName"
            required
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            placeholder="e.g. Dr. Shamsul Alam, Head of Career Services"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="contactEmail" className="text-xs font-semibold uppercase tracking-wider text-fg-muted">
            Official Work Email *
          </label>
          <Input
            id="contactEmail"
            type="email"
            required
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            placeholder="name@university.edu.bd"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="cohortSize" className="text-xs font-semibold uppercase tracking-wider text-fg-muted">
            Estimated Cohort Size
          </label>
          <select
            id="cohortSize"
            value={cohortSize}
            onChange={(e) => setCohortSize(e.target.value)}
            className="flex h-10 w-full rounded-md border border-control bg-surface px-3 py-2 text-sm text-fg shadow-xs outline-none focus:border-accent"
          >
            <option value="25-50">25 – 50 Students</option>
            <option value="50-200">50 – 200 Students</option>
            <option value="200-500">200 – 500 Students</option>
            <option value="500+">500+ Students (Campus-Wide License)</option>
          </select>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted">
          Target Track & Curriculum
        </label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 text-xs font-medium text-fg cursor-pointer">
            <input
              type="radio"
              name="targetExam"
              checked={targetExam === 'both'}
              onChange={() => setTargetExam('both')}
              className="accent-accent"
            />
            <span>Both GRE & IELTS</span>
          </label>
          <label className="flex items-center gap-2 text-xs font-medium text-fg cursor-pointer">
            <input
              type="radio"
              name="targetExam"
              checked={targetExam === 'gre'}
              onChange={() => setTargetExam('gre')}
              className="accent-accent"
            />
            <span>GRE Quant & Verbal (330+ Focus)</span>
          </label>
          <label className="flex items-center gap-2 text-xs font-medium text-fg cursor-pointer">
            <input
              type="radio"
              name="targetExam"
              checked={targetExam === 'ielts'}
              onChange={() => setTargetExam('ielts')}
              className="accent-accent"
            />
            <span>IELTS Academic CBT (Band 7.5+ Focus)</span>
          </label>
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="notes" className="text-xs font-semibold uppercase tracking-wider text-fg-muted">
          Specific Goals or Custom Requirements (Optional)
        </label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="Mention semester timelines, scholarship evaluation diagnostics, proctored mock sessions, or invoice procurement requirements..."
          className="flex w-full rounded-md border border-control bg-surface px-3 py-2 text-sm text-fg shadow-xs outline-none focus:border-accent"
        />
      </div>

      <div className="pt-2 flex items-center justify-between">
        <span className="text-xs text-fg-muted">
          Prefer direct email? Contact us at{' '}
          <a href={`mailto:${brand.supportEmail}`} className="text-accent underline font-semibold">
            {brand.supportEmail}
          </a>
        </span>
        <Button type="submit" size="md" className="gap-2">
          <span>Submit Inquiry</span>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}

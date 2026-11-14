/** @purpose Institutional partnerships, bulk seat licensing, and campus cohort analytics page */
import React from 'react';
import { brand } from '@lumen/config';
import { Badge, Card, CardHeader, CardTitle, CardContent } from '@lumen/ui';
import {
  GraduationCap,
  Users,
  BarChart3,
  ShieldCheck,
  Award,
  Sparkles,
  FileSpreadsheet,
  CheckCircle,
} from 'lucide-react';
import { InstitutionalInquiryForm } from './institutional-inquiry-form';

export const metadata = {
  title: `For Universities, Colleges & Corporate Cohorts | ${brand.name}`,
  description: `Partner with ${brand.name} for bulk seat licensing, standardized GRE/IELTS diagnostic assessments, campus cohort analytics, and corporate upskilling in Bangladesh.`,
};

export default function ForInstitutionsPage() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Header */}
      <section className="w-full border-b border-border/40 bg-surface/40 px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl text-center space-y-5">
          <Badge variant="outline" className="border-accent text-accent gap-1.5 px-3 py-1 font-medium">
            <GraduationCap className="h-4 w-4" />
            Institutional Partnerships & Campus Cohorts
          </Badge>

          <h1 className="text-fg text-3xl font-extrabold tracking-tight sm:text-5xl max-w-3xl mx-auto leading-tight">
            Empower Your Entire Student Body to Win Global Scholarships
          </h1>

          <p className="text-fg-muted mx-auto max-w-2xl text-base sm:text-lg leading-relaxed">
            Leading universities, departments, and educational organizations in Bangladesh partner with {brand.name} for bulk seat licensing, campus-wide diagnostic baseline screening, and enterprise cohort analytics.
          </p>
        </div>
      </section>

      {/* Feature Pillars */}
      <section className="w-full max-w-6xl px-4 py-16 sm:py-20 space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-fg sm:text-3xl">
            Why Academic Institutions Choose {brand.name}
          </h2>
          <p className="text-fg-muted text-sm max-w-xl mx-auto">
            Everything your career center, study-abroad cell, or corporate department needs to monitor student progress with enterprise reliability.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Feature 1 */}
          <Card className="border-border bg-surface transition-all hover:shadow-md">
            <CardHeader>
              <div className="bg-accent/10 text-accent mb-3 flex h-10 w-10 items-center justify-center rounded-lg">
                <Users className="h-5 w-5" />
              </div>
              <CardTitle className="text-lg">Bulk Seat Licensing</CardTitle>
            </CardHeader>
            <CardContent className="text-fg-muted text-sm space-y-2">
              <p>
                Volume discounted pricing with tax-compliant institutional invoicing (Mushak-6.3 VAT receipts) for departmental procurement.
              </p>
              <p className="text-xs text-fg-subtle">
                Instant roster CSV onboarding and single-click license assignment via Organization Admin portal.
              </p>
            </CardContent>
          </Card>

          {/* Feature 2 */}
          <Card className="border-border bg-surface transition-all hover:shadow-md">
            <CardHeader>
              <div className="bg-accent/10 text-accent mb-3 flex h-10 w-10 items-center justify-center rounded-lg">
                <BarChart3 className="h-5 w-5" />
              </div>
              <CardTitle className="text-lg">Org Admin Cohort Analytics</CardTitle>
            </CardHeader>
            <CardContent className="text-fg-muted text-sm space-y-2">
              <p>
                Dedicated department dashboard tracking student study hours, mock exam completion rates, and predicted GRE/IELTS score distributions.
              </p>
              <p className="text-xs text-fg-subtle">
                Export aggregated CSV performance benchmarks for accreditation reports and scholarship committees.
              </p>
            </CardContent>
          </Card>

          {/* Feature 3 */}
          <Card className="border-border bg-surface transition-all hover:shadow-md">
            <CardHeader>
              <div className="bg-accent/10 text-accent mb-3 flex h-10 w-10 items-center justify-center rounded-lg">
                <Award className="h-5 w-5" />
              </div>
              <CardTitle className="text-lg">Proctored Diagnostics</CardTitle>
            </CardHeader>
            <CardContent className="text-fg-muted text-sm space-y-2">
              <p>
                Conduct campus-wide scholarship aptitude screenings with our calibrated Computer-Based Test engine.
              </p>
              <p className="text-xs text-fg-subtle">
                Identify high-potential scholars early with psychometrically calibrated Rasch/IRT ability ratings.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Interactive Inquiry Form Section */}
      <section className="w-full max-w-4xl px-4 pb-20">
        <InstitutionalInquiryForm />
      </section>
    </div>
  );
}

/** @purpose Question Bank authoring and item management table (/studio) */
import Link from 'next/link';
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@lumen/ui';
import {
  PlusCircle,
  FileText,
  Filter,
  CheckCircle2,
  Clock,
  Archive,
  AlertCircle,
} from 'lucide-react';
import { listStudioQuestionsAction } from '../../../actions/studio';
import { GRE_MAGOOSH_SEED_QUESTIONS } from '@lumen/db';

export default async function StudioOverviewPage() {
  const existingQuestions = await listStudioQuestionsAction();

  // Combine with seed questions for initial exploration
  const questions = existingQuestions.length > 0 ? existingQuestions : GRE_MAGOOSH_SEED_QUESTIONS.map((q, idx) => ({
    id: q.id,
    examType: 'gre',
    section: (q.questionType.includes('qc') || q.questionType.includes('numeric') || q.topicSlug.includes('algebra') || q.topicSlug.includes('geometry') || q.topicSlug.includes('arithmetic') || q.topicSlug.includes('statistics') ? 'quant' : 'verbal') as 'quant' | 'verbal',
    topicSlug: q.topicSlug,
    questionType: q.questionType,
    promptSnippet: q.promptMd.slice(0, 90) + '...',
    status: (idx % 4 === 0 ? 'in_review' : idx % 5 === 0 ? 'draft' : 'published') as 'draft' | 'in_review' | 'published' | 'retired',
    versionNumber: idx === 1 ? 2 : 1, // sample v2 to show D6 versioning
    authorId: 'staff-editor-01',
    updatedAt: new Date().toISOString(),
    stats: {
      pValue: 0.62 + (idx * 0.03) % 0.3,
      pointBiserial: 0.38 + (idx * 0.05) % 0.25,
      attempts: 140 + idx * 30,
      flags: idx === 2 ? ['time_outlier'] : [],
    },
  }));

  const getStatusBadge = (status: string, versionNumber: number) => {
    switch (status) {
      case 'published':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
            <CheckCircle2 className="h-3 w-3" /> Published (v{versionNumber})
          </span>
        );
      case 'in_review':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-700 dark:text-amber-300 border border-amber-500/20">
            <Clock className="h-3 w-3" /> In Review (v{versionNumber})
          </span>
        );
      case 'retired':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-surface-2 px-2.5 py-0.5 text-xs font-semibold text-fg-muted border border-border">
            <Archive className="h-3 w-3" /> Retired (v{versionNumber})
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-sky-500/10 px-2.5 py-0.5 text-xs font-semibold text-sky-700 dark:text-sky-300 border border-sky-500/20">
            <FileText className="h-3 w-3" /> Draft (v{versionNumber})
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Quick Stats */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-fg text-2xl font-bold tracking-tight">Question Bank Studio</h1>
          <p className="text-fg-muted text-sm">
            Author, inspect, review, and version authentic GRE CBT items with D13 interactive pedagogy.
          </p>
        </div>
        <Link href="/studio/questions/new">
          <Button className="gap-2">
            <PlusCircle className="h-4 w-4" /> Author New Item
          </Button>
        </Link>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card className="p-4">
          <div className="text-fg-muted text-xs font-medium uppercase">Active Questions</div>
          <div className="text-fg text-2xl font-bold mt-1">{questions.length}</div>
          <p className="text-fg-muted text-xs mt-1">Pinned to live forms</p>
        </Card>
        <Card className="p-4">
          <div className="text-fg-muted text-xs font-medium uppercase">In Review Queue</div>
          <div className="text-amber-600 dark:text-amber-400 text-2xl font-bold mt-1">
            {questions.filter((q) => q.status === 'in_review').length}
          </div>
          <p className="text-fg-muted text-xs mt-1">Needs editor sign-off</p>
        </Card>
        <Card className="p-4">
          <div className="text-fg-muted text-xs font-medium uppercase">D6 Multi-Versions</div>
          <div className="text-accent text-2xl font-bold mt-1">
            {questions.filter((q) => q.versionNumber > 1).length}
          </div>
          <p className="text-fg-muted text-xs mt-1">Immutable forks</p>
        </Card>
        <Card className="p-4">
          <div className="text-fg-muted text-xs font-medium uppercase">Flagged Items (P1-68)</div>
          <div className="text-fg text-2xl font-bold mt-1">
            {questions.filter((q) => q.stats?.flags && q.stats.flags.length > 0).length}
          </div>
          <p className="text-fg-muted text-xs mt-1">Psychometric warnings</p>
        </Card>
      </div>

      {/* Question Table Card */}
      <Card>
        <CardHeader className="border-b border-border pb-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <FileText className="h-4 w-4 text-accent" />
              Item Inventory & Pedagogical Health
            </CardTitle>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-fg-muted flex items-center gap-1">
                <Filter className="h-3.5 w-3.5" /> All Sections
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-2 text-fg-muted text-xs uppercase border-b border-border">
                <tr>
                  <th className="px-4 py-3">Question ID & Prompt Snippet</th>
                  <th className="px-4 py-3">Section / Type</th>
                  <th className="px-4 py-3">Status / Version</th>
                  <th className="px-4 py-3">Psychometrics (07 §8.6)</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {questions.map((q) => (
                  <tr key={q.id} className="hover:bg-surface-2/50 transition-colors">
                    <td className="px-4 py-3 font-medium">
                      <div className="text-fg">{q.promptSnippet}</div>
                      <div className="text-fg-muted text-xs font-mono mt-0.5">
                        {q.id} • Topic: {q.topicSlug}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-fg font-semibold uppercase text-xs">{q.section}</div>
                      <div className="text-fg-muted text-xs">{q.questionType}</div>
                    </td>
                    <td className="px-4 py-3">
                      {getStatusBadge(q.status, q.versionNumber)}
                    </td>
                    <td className="px-4 py-3">
                      {q.stats ? (
                        <div className="space-y-0.5 text-xs">
                          <div className="flex items-center gap-2">
                            <span>p: <strong className="text-fg">{q.stats.pValue.toFixed(2)}</strong></span>
                            <span>r_pbis: <strong className="text-fg">{q.stats.pointBiserial.toFixed(2)}</strong></span>
                          </div>
                          <div className="text-fg-muted text-[11px]">
                            {q.stats.attempts} attempts
                            {q.stats.flags.length > 0 && (
                              <span className="ml-1 text-amber-600 dark:text-amber-400 font-semibold inline-flex items-center gap-0.5">
                                <AlertCircle className="h-3 w-3" /> {q.stats.flags.join(', ')}
                              </span>
                            )}
                          </div>
                        </div>
                      ) : (
                        <span className="text-fg-muted text-xs">Unscored pretest</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <Link href={`/studio/questions/new?edit=${q.id}`}>
                          <Button variant="outline" size="sm" className="h-7 px-2.5 text-xs">
                            Edit
                          </Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/** @purpose Vocab Decks overview page (/app/vocab) with deck selection & stats */
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent, Button, ProgressBar, Badge } from '@lumen/ui';
import { Brain, Play, ArrowRight } from 'lucide-react';
import { fetchVocabCards } from '@/app/actions/practice';

export default async function VocabHubPage() {
  const cards = await fetchVocabCards(20);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-control/30 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-accent uppercase tracking-wider">
            <Brain className="w-4 h-4" />
            Spaced Repetition System (FSRS v4.5)
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-fg mt-1">
            Active Recall Vocabulary & Formula Decks
          </h1>
          <p className="text-sm text-fg-muted mt-0.5">
            Optimize long-term memory with 4 study modes: Flip, Cloze, 15s Synonym Speed Drill, and Quant Traps.
          </p>
        </div>

        <Link href="/app/vocab/play?mode=flip">
          <Button className="gap-2 shadow-sm">
            <Play className="w-4 h-4 fill-current" /> Start Daily 10-Card Review
          </Button>
        </Link>
      </div>

      {/* 4 Study Mode Selection Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Mode 1: Classic Flip */}
        <Link href="/app/vocab/play?mode=flip" className="group">
          <Card className="h-full border-control hover:border-accent transition-all group-hover:shadow-sm">
            <CardHeader className="pb-2">
              <Badge variant="default" className="w-fit mb-1 text-[10px]">
                Mode 1
              </Badge>
              <CardTitle className="text-base group-hover:text-accent transition-colors">
                Classic Flip
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-fg-muted space-y-2">
              <p>Word, POS, Bangla gloss, mnemonic hooks, and 4-button FSRS rating.</p>
              <span className="inline-flex items-center gap-1 font-semibold text-accent pt-1">
                Play Mode <ArrowRight className="w-3 h-3" />
              </span>
            </CardContent>
          </Card>
        </Link>

        {/* Mode 2: Cloze Context */}
        <Link href="/app/vocab/play?mode=cloze" className="group">
          <Card className="h-full border-control hover:border-accent transition-all group-hover:shadow-sm">
            <CardHeader className="pb-2">
              <Badge variant="secondary" className="w-fit mb-1 text-[10px]">
                Mode 2
              </Badge>
              <CardTitle className="text-base group-hover:text-accent transition-colors">
                Cloze Context
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-fg-muted space-y-2">
              <p>GRE-style sentences with blanks; test your sentence completion recall.</p>
              <span className="inline-flex items-center gap-1 font-semibold text-accent pt-1">
                Play Mode <ArrowRight className="w-3 h-3" />
              </span>
            </CardContent>
          </Card>
        </Link>

        {/* Mode 3: Synonym Speed Drill */}
        <Link href="/app/vocab/play?mode=se_pair_drill" className="group">
          <Card className="h-full border-warning/40 bg-warning-soft/10 hover:border-warning transition-all group-hover:shadow-sm">
            <CardHeader className="pb-2">
              <Badge variant="warning" className="w-fit mb-1 text-[10px]">
                Mode 3 &bull; Speed
              </Badge>
              <CardTitle className="text-base group-hover:text-warning transition-colors">
                15s Synonym Pair
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-fg-muted space-y-2">
              <p>15-second countdown timer. Identify the 2 exact synonym choices before time runs out!</p>
              <span className="inline-flex items-center gap-1 font-semibold text-warning pt-1">
                Play Mode <ArrowRight className="w-3 h-3" />
              </span>
            </CardContent>
          </Card>
        </Link>

        {/* Mode 4: Quant Formula Traps */}
        <Link href="/app/vocab/play?mode=quant_formula" className="group">
          <Card className="h-full border-info/40 bg-info-soft/10 hover:border-info transition-all group-hover:shadow-sm">
            <CardHeader className="pb-2">
              <Badge variant="outline" className="w-fit mb-1 text-[10px] text-info border-info/40">
                Mode 4 &bull; Quant
              </Badge>
              <CardTitle className="text-base group-hover:text-info transition-colors">
                Quant Formulas & Traps
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-fg-muted space-y-2">
              <p>Geometry theorems, exponent laws, and the F.R.O.Z.E.N. checklist traps.</p>
              <span className="inline-flex items-center gap-1 font-semibold text-info pt-1">
                Play Mode <ArrowRight className="w-3 h-3" />
              </span>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Available Decks Progress */}
      <div className="space-y-4 pt-4">
        <h2 className="text-lg font-bold text-fg">Active Curated Decks</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">GRE High-Frequency Core 1000</CardTitle>
                <span className="text-xs font-semibold text-accent">Tier 1: Common</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <ProgressBar value={cards.length} max={30} label="Seed Deck Progress (30 Original Words)" />
              <div className="flex items-center justify-between text-xs text-fg-muted pt-1">
                <span>Bangla glosses + IPA included</span>
                <Link href="/app/vocab/play?deck=core-1000">
                  <Button size="sm" variant="outline" className="h-7 text-xs">
                    Review Due
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">GregMat Sentence Equivalence Clusters</CardTitle>
                <span className="text-xs font-semibold text-warning">Synonym Pairs</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <ProgressBar value={12} max={50} label="Synonym Pair Accuracy" />
              <div className="flex items-center justify-between text-xs text-fg-muted pt-1">
                <span>15s speed drill practice</span>
                <Link href="/app/vocab/play?mode=se_pair_drill">
                  <Button size="sm" variant="outline" className="h-7 text-xs">
                    Start Drill
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

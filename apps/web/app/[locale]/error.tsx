// @purpose Institutional bilingual 500 (error) recovery stationery page.
"use client";

import { usePathname } from "next/navigation";
import { brand } from "@lumen/config";
import { LumenSparkMotif } from "@/src/components/ui/primitives";
import { LocaleLink } from "./_components/LocaleLink";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const pathname = usePathname();
  const isBn = pathname === "/bn" || pathname?.startsWith("/bn/") || false;

  return (
    <main className="min-h-[75vh] bg-[var(--bg)] text-[var(--text)] px-6 py-20 md:py-28 flex items-center justify-center">
      <section className="w-full max-w-[640px] rounded-[4px] border border-[var(--hairline)] bg-[var(--surface-paper)] p-8 md:p-12 space-y-6">
        <div className="flex items-center gap-3">
          <LumenSparkMotif />
          <span className="text-sm font-medium text-[var(--muted)]">
            {brand.name}
          </span>
        </div>

        <p className="font-display text-5xl font-extrabold text-[var(--brand)]">
          500
        </p>

        <h1 className="lumen-h1">
          {isBn ? "কিছু একটা সমস্যা হয়েছে" : "Something went wrong"}
        </h1>

        <p className="lumen-body max-w-[54ch] text-[var(--muted)]">
          {isBn
            ? "এই পৃষ্ঠাটি লোড করার সময় একটি অপ্রত্যাশিত ত্রুটি ঘটেছে। অনুগ্রহ করে আবার চেষ্টা করুন অথবা সহায়তা কেন্দ্রে যোগাযোগ করুন।"
            : "An unexpected error occurred while loading this page. Please try again, or visit the Help Center if the issue persists."}
        </p>

        {error.digest ? (
          <p className="text-xs text-[var(--muted)]">
            {isBn ? "রেফারেন্স:" : "Reference:"} {error.digest}
          </p>
        ) : null}

        <div className="pt-2 flex flex-wrap items-center gap-6">
          <button
            type="button"
            onClick={() => reset()}
            className="rounded-[4px] bg-[var(--brand)] px-6 py-3 text-white font-semibold cursor-pointer"
          >
            {isBn ? "পুনরায় চেষ্টা করুন" : "Try again"}
          </button>

          <LocaleLink
            href="/"
            className="text-[var(--link)] underline underline-offset-4"
          >
            {isBn ? "হোমপেজে ফিরে যান" : "Return to homepage"}
          </LocaleLink>

          <LocaleLink
            href="/help"
            className="text-[var(--link)] underline underline-offset-4"
          >
            {isBn ? "সহায়তা কেন্দ্র" : "Help Center"}
          </LocaleLink>
        </div>
      </section>
    </main>
  );
}

// @purpose Institutional bilingual 404 (not-found) stationery page.
"use client";

import { usePathname } from "next/navigation";
import { brand } from "@lumen/config";
import { LumenSparkMotif } from "@/src/components/ui/primitives";
import { LocaleLink } from "./_components/LocaleLink";

export default function NotFoundPage() {
  const pathname = usePathname();
  const isBn = pathname === "/bn" || pathname?.startsWith("/bn/") || false;

  return (
    <main className="min-h-[75vh] bg-[var(--bg)] text-[var(--text)] px-6 py-20 md:py-28 flex items-center justify-center">
      <div className="w-full max-w-[680px] space-y-6">
        <div className="flex items-center gap-3">
          <LumenSparkMotif />
          <span className="text-sm font-medium text-[var(--muted)]">
            {brand.name}
          </span>
        </div>

        <p className="font-display text-5xl font-extrabold text-[var(--brand)]">
          404
        </p>

        <h1 className="lumen-h1">
          {isBn ? "পৃষ্ঠাটি খুঁজে পাওয়া যায়নি" : "Page not found"}
        </h1>

        <p className="lumen-body max-w-[54ch] text-[var(--muted)]">
          {isBn
            ? "আপনি যে পৃষ্ঠাটি খুঁজছেন তা সরানো হয়েছে, নাম পরিবর্তন করা হয়েছে, অথবা লিঙ্কটি পুরনো হয়ে গেছে।"
            : "The page you are looking for may have moved, been renamed, or the link is outdated."}
        </p>

        <div className="pt-2 flex flex-wrap items-center gap-6">
          <LocaleLink
            href="/"
            className="inline-block rounded-[4px] bg-[var(--brand)] px-6 py-3 text-white font-semibold"
          >
            {isBn ? "হোমপেজে ফিরে যান" : "Return to homepage"}
          </LocaleLink>
        </div>

        <nav
          aria-label={isBn ? "সহায়ক লিঙ্ক" : "Helpful links"}
          className="pt-4 flex flex-wrap gap-x-6 gap-y-3 text-sm"
        >
          <LocaleLink
            href="/courses"
            className="text-[var(--link)] underline underline-offset-4"
          >
            {isBn
              ? "GRE ও IELTS কোর্স দেখুন"
              : "Explore GRE & IELTS courses"}
          </LocaleLink>
          <LocaleLink
            href="/exam/diagnostic"
            className="text-[var(--link)] underline underline-offset-4"
          >
            {isBn
              ? "১৫ মিনিটের ফ্রি ডায়াগনস্টিক দিন"
              : "Take 15-min free diagnostic"}
          </LocaleLink>
          <LocaleLink
            href="/help"
            className="text-[var(--link)] underline underline-offset-4"
          >
            {isBn ? "সহায়তা কেন্দ্র" : "Help Center"}
          </LocaleLink>
        </nav>
      </div>
    </main>
  );
}

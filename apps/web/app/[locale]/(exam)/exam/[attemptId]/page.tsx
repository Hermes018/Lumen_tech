/** @purpose Full-screen CBT exam attempt runner with authentic question canvas */
export default async function ExamAttemptPage({
  params,
}: {
  params: Promise<{ attemptId: string; locale: string }>;
}) {
  const { attemptId } = await params;

  return (
    <div className="flex flex-1 flex-col justify-between rounded border border-[#cccccc] bg-white p-6 shadow-xs sm:p-8">
      {/* Question Counter Sub-Header */}
      <div className="mb-6 flex items-center justify-between border-b border-[#eeeeee] pb-4">
        <span className="text-sm font-bold text-[#333]">Question 1 of 20</span>
        <span className="font-mono text-xs text-[#777]">Attempt #{attemptId.slice(0, 8)}</span>
      </div>

      {/* Question Content (Authentic GRE Quant Problem) */}
      <div className="flex-1 space-y-6 text-[#222]">
        <div className="text-sm leading-relaxed sm:text-base">
          <p className="font-serif">
            If <span className="font-bold italic">x</span> and{' '}
            <span className="font-bold italic">y</span> are integers such that{' '}
            <span className="font-mono">3x + 2y = 18</span> and{' '}
            <span className="font-mono">x &gt; y &gt; 0</span>, what is the value of{' '}
            <span className="font-bold italic">x</span>?
          </p>
        </div>

        {/* Options List (Radio choices with ETS styling) */}
        <div className="space-y-3 pt-2">
          {['2', '3', '4', '5', '6'].map((val, idx) => (
            <label
              key={val}
              className="flex cursor-pointer items-center gap-3 rounded border border-[#dddddd] p-2.5 transition-colors hover:bg-[#f6f8fa]"
            >
              <input
                type="radio"
                name="gre-question-1"
                value={val}
                className="focus:ring-focus h-4 w-4 border-[#888] text-[#1a56db]"
              />
              <span className="font-serif text-sm font-medium">
                ({String.fromCharCode(65 + idx)}) {val}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Question Footer Note */}
      <div className="mt-8 flex items-center justify-between border-t border-[#eeeeee] pt-6 text-xs text-[#888]">
        <span>Click on the answer button to select your answer.</span>
        <span>Section adaptive delivery enabled</span>
      </div>
    </div>
  );
}

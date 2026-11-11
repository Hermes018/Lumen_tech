/** @purpose Full-screen CBT exam attempt runner */
export default async function ExamAttemptPage({
  params,
}: {
  params: Promise<{ attemptId: string; locale: string }>;
}) {
  const { attemptId } = await params;
  return (
    <div className="exam-runner mx-auto max-w-4xl rounded border bg-white p-8 shadow-sm">
      <h2 className="mb-4 text-xl font-bold">Attempt ID: {attemptId}</h2>
      <p className="text-gray-700">Section 1: Quantitative Reasoning</p>
    </div>
  );
}

/** @purpose Organization cohort dashboard */
export default async function OrgCohortPage({
  params,
}: {
  params: Promise<{ orgSlug: string; locale: string }>;
}) {
  const { orgSlug } = await params;
  return (
    <div className="org-page">
      <h2 className="mb-4 text-2xl font-bold">Organization: {orgSlug}</h2>
      <p>Manage student cohorts, mock test assignments, and performance analytics.</p>
    </div>
  );
}

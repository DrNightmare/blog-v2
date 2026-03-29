export default function ProjectsLoading() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 animate-pulse">
      <main className="max-w-4xl mx-auto">
        <div className="text-center mb-12 space-y-4">
          <div className="h-10 bg-border rounded-lg w-48 mx-auto" />
          <div className="h-5 bg-border rounded w-80 max-w-full mx-auto" />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex flex-col p-6 bg-surface rounded-2xl border border-border space-y-4"
            >
              <div className="flex justify-between">
                <div className="h-5 bg-border rounded-full w-28" />
                <div className="h-5 bg-border rounded w-16" />
              </div>
              <div className="h-6 bg-border rounded w-3/4" />
              <div className="space-y-2 flex-grow">
                <div className="h-3 bg-border rounded w-full" />
                <div className="h-3 bg-border rounded w-full" />
                <div className="h-3 bg-border rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

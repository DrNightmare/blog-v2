export default function NotesLoading() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 animate-pulse">
      <main className="max-w-3xl mx-auto">
        <div className="text-center mb-12 space-y-4">
          <div className="h-10 bg-border rounded-lg w-40 mx-auto" />
          <div className="h-5 bg-border rounded w-96 max-w-full mx-auto" />
        </div>
        <div className="space-y-8">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-surface rounded-2xl border border-border p-8 space-y-4"
            >
              <div className="flex justify-between">
                <div className="h-8 bg-border rounded w-48" />
                <div className="h-6 bg-border rounded-full w-24" />
              </div>
              <div className="space-y-2 pt-4">
                <div className="h-4 bg-border rounded w-full" />
                <div className="h-4 bg-border rounded w-11/12" />
                <div className="h-4 bg-border rounded w-4/5" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

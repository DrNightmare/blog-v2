export default function EssayLoading() {
  return (
    <div className="flex justify-center m-5 animate-pulse">
      <div className="flex-col w-full max-w-3xl space-y-6">
        <div className="h-10 bg-border rounded-lg w-3/4 mx-auto" />
        <div className="space-y-3 prose dark:prose-invert max-w-none">
          <div className="h-4 bg-border rounded w-full" />
          <div className="h-4 bg-border rounded w-11/12" />
          <div className="h-4 bg-border rounded w-[80%]" />
          <div className="h-32 bg-border rounded-lg w-full mt-8" />
          <div className="h-4 bg-border rounded w-full" />
          <div className="h-4 bg-border rounded w-5/6" />
        </div>
      </div>
    </div>
  );
}

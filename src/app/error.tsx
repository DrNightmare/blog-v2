"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] px-4 py-16">
      <h1 className="text-2xl font-bold text-foreground mb-2">
        Something went wrong
      </h1>
      <p className="text-text-secondary text-center max-w-md mb-8">
        {error.message || "An unexpected error occurred."}
      </p>
      <div className="flex flex-wrap gap-4 justify-center">
        <button
          type="button"
          onClick={() => reset()}
          className="px-4 py-2 rounded-lg bg-primary text-white font-medium hover:opacity-90 transition-opacity"
        >
          Try again
        </button>
        <Link
          href="/"
          className="px-4 py-2 rounded-lg border border-border text-text-secondary hover:border-primary hover:text-primary transition-colors"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}

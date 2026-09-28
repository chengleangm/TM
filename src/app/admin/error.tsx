"use client";
export default function Error({ reset }: { reset: () => void }) {
  return (
    <main className="container platform-section empty-state">
      <h1>We couldn’t save that change.</h1>
      <p>
        Check the dates, required fields, prices and capacity. Payment-related
        registration changes have restrictions.
      </p>
      <button className="button" onClick={reset}>
        Try again
      </button>
    </main>
  );
}

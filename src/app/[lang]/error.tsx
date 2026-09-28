"use client";
import { useParams } from "next/navigation";
export default function Error({ reset }: { reset: () => void }) {
  const km = useParams().lang === "km";
  return (
    <section className="container platform-section empty-state">
      <h1>{km ? "សូមព្យាយាមម្តងទៀត។" : "Something needs another moment."}</h1>
      <p>
        {km
          ? "មិនអាចបញ្ចប់សំណើបានទេ។"
          : "We couldn’t complete this request. Please try again."}
      </p>
      <button className="button" onClick={reset}>
        {km ? "ព្យាយាមម្តងទៀត" : "Try again"}
      </button>
    </section>
  );
}

"use client";
import { TypographyH2, TypographyP } from "@components/ui/typography";

const dummyReviews = [
  {
    id: 1,
    client: "Sarah Lim",
    rating: 5,
    comment: "Very professional and friendly!",
  },
  {
    id: 2,
    client: "Aminah Tan",
    rating: 4,
    comment: "Great massage, thank you!",
  },
];

export default function TherapistReviewsPage() {
  return (
    <div className="max-w-2xl mx-auto py-8">
      <TypographyH2>Reviews</TypographyH2>
      <div className="space-y-6 mt-6">
        {dummyReviews.map((r) => (
          <div key={r.id} className="border rounded p-4 bg-white dark:bg-zinc-900">
            <div className="font-semibold">Client: {r.client}</div>
            <div className="text-sm">Rating: {"★".repeat(r.rating)}<span className="text-zinc-400">{"★".repeat(5 - r.rating)}</span></div>
            <div className="text-sm mt-2 italic">"{r.comment}"</div>
          </div>
        ))}
      </div>
    </div>
  );
}

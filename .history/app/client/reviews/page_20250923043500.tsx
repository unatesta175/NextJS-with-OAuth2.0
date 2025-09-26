"use client";
import { TypographyH2, TypographyP } from "@components/ui/typography";

const dummyReviews = [
  {
    id: 1,
    service: "Classic Facial",
    therapist: "Alicia Tan",
    rating: 5,
    comment: "Amazing experience! Highly recommend.",
  },
  {
    id: 2,
    service: "Swedish Massage",
    therapist: "Maya Lee",
    rating: 4,
    comment: "Very relaxing, will book again.",
  },
];

export default function MyReviewsPage() {
  return (
    <div className="max-w-2xl mx-auto py-8">
      <TypographyH2>My Reviews</TypographyH2>
      <div className="space-y-6 mt-6">
        {dummyReviews.map((r) => (
          <div key={r.id} className="border rounded p-4 bg-white dark:bg-zinc-900">
            <div className="font-semibold">{r.service}</div>
            <div className="text-sm text-zinc-500">Therapist: {r.therapist}</div>
            <div className="text-sm">Rating: {"★".repeat(r.rating)}<span className="text-zinc-400">{"★".repeat(5 - r.rating)}</span></div>
            <div className="text-sm mt-2 italic">"{r.comment}"</div>
          </div>
        ))}
      </div>
    </div>
  );
}

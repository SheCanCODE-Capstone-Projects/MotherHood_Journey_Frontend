"use client";

import { PageHeader } from "@/shared/components/layout";
import { Lightbulb } from "lucide-react";

export default function TipsPage() {
  const tips = [
    {
      id: 1,
      title: "Third Trimester Essentials",
      image: "/imagefood.webp",
      description: "Essential nutrition and care tips for your third trimester",
      category: "Nutrition"
    },
    {
      id: 2,
      title: "Managing Sleep Positions",
      image: "/sleepPosition.png",
      description: "Best sleeping positions for comfort and safety during pregnancy",
      category: "Wellness"
    },
    {
      id: 3,
      title: "Preparing for Labor",
      image: "/imagefood.webp",
      description: "What to expect and how to prepare for your delivery day",
      category: "Labor"
    },
    {
      id: 4,
      title: "Postpartum Care",
      image: "/sleepPosition.png",
      description: "Taking care of yourself after delivery",
      category: "Recovery"
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Health Tips"
        subtitle="Educational resources for your maternal health journey"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {tips.map((tip) => (
          <div key={tip.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer group">
            <div className="relative h-48 overflow-hidden">
              <img 
                src={tip.image} 
                alt={tip.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <div className="absolute top-3 right-3">
                <span className="px-3 py-1 bg-teal-600 text-white text-xs font-semibold rounded-full">
                  {tip.category}
                </span>
              </div>
            </div>
            <div className="p-5">
              <div className="flex items-start gap-3 mb-2">
                <Lightbulb size={20} className="text-teal-600 flex-shrink-0 mt-1" />
                <h3 className="font-bold text-gray-900 text-lg">{tip.title}</h3>
              </div>
              <p className="text-sm text-gray-600">{tip.description}</p>
              <button className="mt-4 text-sm font-semibold text-teal-600 hover:text-teal-700">
                Read More →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

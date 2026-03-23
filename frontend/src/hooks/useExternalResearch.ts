import { useState, useEffect } from "react";

export interface ResearchData {
  citations: number;
  hIndex: number;
  i10Index: number;
  recentPublications: {
    title: string;
    journal: string;
    year: number;
    citations: number;
  }[];
  trendingMetric: string;
}

export function useExternalResearch() {
  const [data, setData] = useState<ResearchData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1200));

      setData({
        citations: 1452,
        hIndex: 24,
        i10Index: 38,
        trendingMetric: "+15.2% ACCELERATING",
        recentPublications: [
          {
            title: "Advancements in LLM Architecture Efficiency",
            journal: "IEEE Transactions on AI",
            year: 2025,
            citations: 45,
          },
          {
            title: "Predictive Analytics for Student Dropouts",
            journal: "Journal of Educational Tech",
            year: 2024,
            citations: 112,
          },
        ]
      });
      setLoading(false);
    };

    fetchData();
  }, []);

  return { data, loading };
}

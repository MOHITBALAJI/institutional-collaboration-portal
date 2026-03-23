import { useState, useEffect } from "react";

export interface ComplianceData {
  facultyStudentRatio: string;
  phdPercentage: number;
  nbaReadinessScore: number;
  naacCycleStatus: "On Track" | "Review Needed" | "Delayed";
  upcomingDeadlines: {
    task: string;
    daysLeft: number;
  }[];
}

export function useCompliance() {
  const [compliance, setCompliance] = useState<ComplianceData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompliance = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 700));

      setCompliance({
        facultyStudentRatio: "1:15",
        phdPercentage: 68,
        nbaReadinessScore: 92,
        naacCycleStatus: "On Track",
        upcomingDeadlines: [
          { task: "Submit SSR for NAAC Cycle 2", daysLeft: 14 },
          { task: "Faculty Qualification Update", daysLeft: 3 },
        ]
      });
      setLoading(false);
    };

    fetchCompliance();
  }, []);

  return { compliance, loading };
}

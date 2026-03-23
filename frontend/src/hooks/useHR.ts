import { useState, useEffect } from "react";

export interface HRData {
  leaveBalance: {
    casual: number;
    earned: number;
    medical: number;
  };
  recentLogs: {
    date: string;
    status: "present" | "on-leave" | "half-day";
    checkIn?: string;
    checkOut?: string;
  }[];
  pendingApprovals: number;
}

export function useHR() {
  const [hrData, setHrData] = useState<HRData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHR = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500));

      setHrData({
        leaveBalance: {
          casual: 4,
          earned: 12,
          medical: 8,
        },
        pendingApprovals: 2,
        recentLogs: [
          { date: "Today", status: "present", checkIn: "08:45 AM" },
          { date: "Yesterday", status: "present", checkIn: "08:52 AM", checkOut: "05:10 PM" },
          { date: "Mar 15", status: "on-leave" },
        ]
      });
      setLoading(false);
    };

    fetchHR();
  }, []);

  return { hrData, loading };
}

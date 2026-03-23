import { useState, useEffect } from "react";

export interface FinancesData {
  feeCollection: {
    target: number;
    collected: number;
    percentage: number;
  };
  grantsReceived: number;
  pendingDues: number;
  recentTransactions: {
    id: string;
    description: string;
    amount: number;
    type: "credit" | "debit";
    date: string;
  }[];
}

export function useFinances() {
  const [finances, setFinances] = useState<FinancesData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFinances = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 600));

      setFinances({
        feeCollection: {
          target: 50000000,
          collected: 42500000,
          percentage: 85,
        },
        grantsReceived: 12500000, // ₹1.25 Cr
        pendingDues: 7500000,
        recentTransactions: [
          { id: "TXN1", description: "AICTE Research Grant", amount: 1500000, type: "credit", date: "Today" },
          { id: "TXN2", description: "Campus Wi-Fi Renewal", amount: 450000, type: "debit", date: "Yesterday" },
          { id: "TXN3", description: "Sem 4 Fee - Batch A", amount: 2500000, type: "credit", date: "Mar 16" },
        ]
      });
      setLoading(false);
    };

    fetchFinances();
  }, []);

  return { finances, loading };
}

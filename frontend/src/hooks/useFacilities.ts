import { useState, useEffect } from "react";

export interface FacilitiesData {
  hostelOccupancy: {
    total: number;
    occupied: number;
    percentage: number;
  };
  libraryFootfallToday: number;
  wifiLoad: {
    currentTbps: number;
    capacityTbps: number;
    percentage: number;
  };
  serverHealth: "Optimal" | "Degraded" | "Critical";
}

export function useFacilities() {
  const [facilities, setFacilities] = useState<FacilitiesData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFacilities = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500));

      setFacilities({
        hostelOccupancy: {
          total: 1200,
          occupied: 1140,
          percentage: 95,
        },
        libraryFootfallToday: 845,
        wifiLoad: {
          currentTbps: 1.2,
          capacityTbps: 2.0,
          percentage: 60,
        },
        serverHealth: "Optimal",
      });
      setLoading(false);
    };

    fetchFacilities();
  }, []);

  return { facilities, loading };
}

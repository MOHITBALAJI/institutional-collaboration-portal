import { useState, useEffect } from "react";

export interface ScheduleEvent {
  id: string;
  title: string;
  type: "class" | "lab" | "office-hours" | "meeting";
  time: string;
  duration: string;
  location: string;
}

export function useSchedule() {
  const [schedule, setSchedule] = useState<ScheduleEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchedule = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 600));

      setSchedule([
        {
          id: "EVT01",
          title: "Data Structures & Algorithms",
          type: "class",
          time: "09:00 AM",
          duration: "1h 30m",
          location: "Room 302, Block A",
        },
        {
          id: "EVT02",
          title: "AI & Neural Networks Lab",
          type: "lab",
          time: "11:00 AM",
          duration: "2h 00m",
          location: "Computer Lab 4",
        },
        {
          id: "EVT03",
          title: "Student Office Hours",
          type: "office-hours",
          time: "02:00 PM",
          duration: "1h 30m",
          location: "Faculty Cabin 12",
        },
        {
          id: "EVT04",
          title: "Department Curriculum Mtg",
          type: "meeting",
          time: "04:00 PM",
          duration: "1h 00m",
          location: "Conference Room B",
        },
      ]);
      setLoading(false);
    };

    fetchSchedule();
  }, []);

  return { schedule, loading };
}

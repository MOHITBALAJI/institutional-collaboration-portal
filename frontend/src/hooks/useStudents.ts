import { useState, useEffect } from "react";

export interface Mentee {
  id: string;
  name: string;
  program: string;
  cgpa: number;
  trend: "up" | "down" | "stable";
  status: "on-track" | "at-risk" | "failing";
  lastMeeting: string;
}

export function useStudents() {
  const [mentees, setMentees] = useState<Mentee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch
    const fetchMentees = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      setMentees([
        {
          id: "STU001",
          name: "Rahul Sharma",
          program: "B.Tech CSE",
          cgpa: 8.5,
          trend: "up",
          status: "on-track",
          lastMeeting: "2 days ago",
        },
        {
          id: "STU002",
          name: "Priya Patel",
          program: "B.Tech ECE",
          cgpa: 6.2,
          trend: "down",
          status: "at-risk",
          lastMeeting: "1 week ago",
        },
        {
          id: "STU003",
          name: "Amit Kumar",
          program: "M.Tech CSE",
          cgpa: 9.1,
          trend: "stable",
          status: "on-track",
          lastMeeting: "3 weeks ago",
        },
        {
          id: "STU004",
          name: "Sneha Reddy",
          program: "B.Tech IT",
          cgpa: 5.4,
          trend: "down",
          status: "failing",
          lastMeeting: "1 month ago",
        },
      ]);
      setLoading(false);
    };

    fetchMentees();
  }, []);

  return { mentees, loading };
}

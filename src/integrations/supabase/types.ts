export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      alumni: {
        Row: {
          availability: string | null
          created_at: string
          current_company: string | null
          current_position: string | null
          degree: string | null
          department: string | null
          email: string | null
          full_name: string
          graduation_year: number | null
          id: string
          is_mentor: boolean | null
          linkedin_url: string | null
          mentorship_areas: string[] | null
          phone: string | null
          updated_at: string
          user_id: string | null
          verified: boolean | null
        }
        Insert: {
          availability?: string | null
          created_at?: string
          current_company?: string | null
          current_position?: string | null
          degree?: string | null
          department?: string | null
          email?: string | null
          full_name: string
          graduation_year?: number | null
          id?: string
          is_mentor?: boolean | null
          linkedin_url?: string | null
          mentorship_areas?: string[] | null
          phone?: string | null
          updated_at?: string
          user_id?: string | null
          verified?: boolean | null
        }
        Update: {
          availability?: string | null
          created_at?: string
          current_company?: string | null
          current_position?: string | null
          degree?: string | null
          department?: string | null
          email?: string | null
          full_name?: string
          graduation_year?: number | null
          id?: string
          is_mentor?: boolean | null
          linkedin_url?: string | null
          mentorship_areas?: string[] | null
          phone?: string | null
          updated_at?: string
          user_id?: string | null
          verified?: boolean | null
        }
        Relationships: []
      }
      collaboration_stats: {
        Row: {
          active_internships: number | null
          active_mous: number | null
          created_at: string
          events_conducted: number | null
          id: string
          industry_partners: number | null
          publications: number | null
          research_projects: number | null
          stat_date: string
          students_placed: number | null
          total_internships: number | null
          total_mous: number | null
        }
        Insert: {
          active_internships?: number | null
          active_mous?: number | null
          created_at?: string
          events_conducted?: number | null
          id?: string
          industry_partners?: number | null
          publications?: number | null
          research_projects?: number | null
          stat_date: string
          students_placed?: number | null
          total_internships?: number | null
          total_mous?: number | null
        }
        Update: {
          active_internships?: number | null
          active_mous?: number | null
          created_at?: string
          events_conducted?: number | null
          id?: string
          industry_partners?: number | null
          publications?: number | null
          research_projects?: number | null
          stat_date?: string
          students_placed?: number | null
          total_internships?: number | null
          total_mous?: number | null
        }
        Relationships: []
      }
      event_registrations: {
        Row: {
          attended: boolean | null
          certificate_issued: boolean | null
          check_in_time: string | null
          event_id: string
          id: string
          registered_at: string
          user_id: string
        }
        Insert: {
          attended?: boolean | null
          certificate_issued?: boolean | null
          check_in_time?: string | null
          event_id: string
          id?: string
          registered_at?: string
          user_id: string
        }
        Update: {
          attended?: boolean | null
          certificate_issued?: boolean | null
          check_in_time?: string | null
          event_id?: string
          id?: string
          registered_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_registrations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          banner_url: string | null
          certificate_template: string | null
          created_at: string
          created_by: string | null
          current_registrations: number | null
          description: string | null
          end_datetime: string | null
          event_type: string | null
          id: string
          max_participants: number | null
          mode: string | null
          organizer: string | null
          partner_id: string | null
          registration_deadline: string | null
          speakers: string[] | null
          start_datetime: string | null
          status: Database["public"]["Enums"]["event_status"]
          title: string
          updated_at: string
          venue: string | null
        }
        Insert: {
          banner_url?: string | null
          certificate_template?: string | null
          created_at?: string
          created_by?: string | null
          current_registrations?: number | null
          description?: string | null
          end_datetime?: string | null
          event_type?: string | null
          id?: string
          max_participants?: number | null
          mode?: string | null
          organizer?: string | null
          partner_id?: string | null
          registration_deadline?: string | null
          speakers?: string[] | null
          start_datetime?: string | null
          status?: Database["public"]["Enums"]["event_status"]
          title: string
          updated_at?: string
          venue?: string | null
        }
        Update: {
          banner_url?: string | null
          certificate_template?: string | null
          created_at?: string
          created_by?: string | null
          current_registrations?: number | null
          description?: string | null
          end_datetime?: string | null
          event_type?: string | null
          id?: string
          max_participants?: number | null
          mode?: string | null
          organizer?: string | null
          partner_id?: string | null
          registration_deadline?: string | null
          speakers?: string[] | null
          start_datetime?: string | null
          status?: Database["public"]["Enums"]["event_status"]
          title?: string
          updated_at?: string
          venue?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "industry_partners"
            referencedColumns: ["id"]
          },
        ]
      }
      industry_partners: {
        Row: {
          address: string | null
          contact_email: string | null
          contact_person: string | null
          contact_phone: string | null
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          industry_type: string | null
          logo_url: string | null
          name: string
          partnership_since: string | null
          status: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          address?: string | null
          contact_email?: string | null
          contact_person?: string | null
          contact_phone?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          industry_type?: string | null
          logo_url?: string | null
          name: string
          partnership_since?: string | null
          status?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          address?: string | null
          contact_email?: string | null
          contact_person?: string | null
          contact_phone?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          industry_type?: string | null
          logo_url?: string | null
          name?: string
          partnership_since?: string | null
          status?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      internship_applications: {
        Row: {
          applied_at: string
          cover_letter: string | null
          feedback: string | null
          id: string
          internship_id: string
          resume_url: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string | null
          student_id: string
        }
        Insert: {
          applied_at?: string
          cover_letter?: string | null
          feedback?: string | null
          id?: string
          internship_id: string
          resume_url?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          student_id: string
        }
        Update: {
          applied_at?: string
          cover_letter?: string | null
          feedback?: string | null
          id?: string
          internship_id?: string
          resume_url?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "internship_applications_internship_id_fkey"
            columns: ["internship_id"]
            isOneToOne: false
            referencedRelation: "internships"
            referencedColumns: ["id"]
          },
        ]
      }
      internships: {
        Row: {
          application_deadline: string | null
          company_name: string | null
          created_at: string
          created_by: string | null
          description: string | null
          duration: string | null
          id: string
          location: string | null
          mode: string | null
          partner_id: string | null
          positions: number | null
          requirements: string[] | null
          skills_required: string[] | null
          start_date: string | null
          status: Database["public"]["Enums"]["internship_status"]
          stipend: number | null
          title: string
          updated_at: string
        }
        Insert: {
          application_deadline?: string | null
          company_name?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          duration?: string | null
          id?: string
          location?: string | null
          mode?: string | null
          partner_id?: string | null
          positions?: number | null
          requirements?: string[] | null
          skills_required?: string[] | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["internship_status"]
          stipend?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          application_deadline?: string | null
          company_name?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          duration?: string | null
          id?: string
          location?: string | null
          mode?: string | null
          partner_id?: string | null
          positions?: number | null
          requirements?: string[] | null
          skills_required?: string[] | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["internship_status"]
          stipend?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "internships_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "industry_partners"
            referencedColumns: ["id"]
          },
        ]
      }
      mentorship_sessions: {
        Row: {
          created_at: string
          duration_minutes: number | null
          feedback: string | null
          id: string
          meeting_link: string | null
          mentor_id: string
          notes: string | null
          rating: number | null
          scheduled_at: string | null
          status: string | null
          student_id: string
          topic: string | null
        }
        Insert: {
          created_at?: string
          duration_minutes?: number | null
          feedback?: string | null
          id?: string
          meeting_link?: string | null
          mentor_id: string
          notes?: string | null
          rating?: number | null
          scheduled_at?: string | null
          status?: string | null
          student_id: string
          topic?: string | null
        }
        Update: {
          created_at?: string
          duration_minutes?: number | null
          feedback?: string | null
          id?: string
          meeting_link?: string | null
          mentor_id?: string
          notes?: string | null
          rating?: number | null
          scheduled_at?: string | null
          status?: string | null
          student_id?: string
          topic?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mentorship_sessions_mentor_id_fkey"
            columns: ["mentor_id"]
            isOneToOne: false
            referencedRelation: "alumni"
            referencedColumns: ["id"]
          },
        ]
      }
      mou_status_history: {
        Row: {
          change_reason: string | null
          changed_by: string | null
          created_at: string
          id: string
          mou_id: string
          new_status: Database["public"]["Enums"]["mou_status"]
          old_status: Database["public"]["Enums"]["mou_status"] | null
        }
        Insert: {
          change_reason?: string | null
          changed_by?: string | null
          created_at?: string
          id?: string
          mou_id: string
          new_status: Database["public"]["Enums"]["mou_status"]
          old_status?: Database["public"]["Enums"]["mou_status"] | null
        }
        Update: {
          change_reason?: string | null
          changed_by?: string | null
          created_at?: string
          id?: string
          mou_id?: string
          new_status?: Database["public"]["Enums"]["mou_status"]
          old_status?: Database["public"]["Enums"]["mou_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "mou_status_history_mou_id_fkey"
            columns: ["mou_id"]
            isOneToOne: false
            referencedRelation: "mous"
            referencedColumns: ["id"]
          },
        ]
      }
      mous: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          assigned_faculty: string | null
          budget: number | null
          created_at: string
          created_by: string | null
          description: string | null
          document_url: string | null
          end_date: string | null
          id: string
          key_deliverables: string[] | null
          objectives: string[] | null
          partner_id: string | null
          partner_name: string | null
          start_date: string | null
          status: Database["public"]["Enums"]["mou_status"]
          title: string
          updated_at: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          assigned_faculty?: string | null
          budget?: number | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          document_url?: string | null
          end_date?: string | null
          id?: string
          key_deliverables?: string[] | null
          objectives?: string[] | null
          partner_id?: string | null
          partner_name?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["mou_status"]
          title: string
          updated_at?: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          assigned_faculty?: string | null
          budget?: number | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          document_url?: string | null
          end_date?: string | null
          id?: string
          key_deliverables?: string[] | null
          objectives?: string[] | null
          partner_id?: string | null
          partner_name?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["mou_status"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "mous_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "industry_partners"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean | null
          link: string | null
          message: string
          title: string
          type: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          link?: string | null
          message: string
          title: string
          type?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          link?: string | null
          message?: string
          title?: string
          type?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          department: string | null
          designation: string | null
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          department?: string | null
          designation?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          department?: string | null
          designation?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      research_projects: {
        Row: {
          abstract: string | null
          co_investigators: string[] | null
          created_at: string
          created_by: string | null
          end_date: string | null
          funding_amount: number | null
          funding_source: string | null
          id: string
          methodology: string | null
          objectives: string[] | null
          partner_id: string | null
          patents: string[] | null
          principal_investigator: string | null
          publications: string[] | null
          start_date: string | null
          status: Database["public"]["Enums"]["research_status"]
          title: string
          updated_at: string
        }
        Insert: {
          abstract?: string | null
          co_investigators?: string[] | null
          created_at?: string
          created_by?: string | null
          end_date?: string | null
          funding_amount?: number | null
          funding_source?: string | null
          id?: string
          methodology?: string | null
          objectives?: string[] | null
          partner_id?: string | null
          patents?: string[] | null
          principal_investigator?: string | null
          publications?: string[] | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["research_status"]
          title: string
          updated_at?: string
        }
        Update: {
          abstract?: string | null
          co_investigators?: string[] | null
          created_at?: string
          created_by?: string | null
          end_date?: string | null
          funding_amount?: number | null
          funding_source?: string | null
          id?: string
          methodology?: string | null
          objectives?: string[] | null
          partner_id?: string | null
          patents?: string[] | null
          principal_investigator?: string | null
          publications?: string[] | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["research_status"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "research_projects_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "industry_partners"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "industry_partner" | "faculty" | "student" | "alumni"
      event_status: "upcoming" | "ongoing" | "completed" | "cancelled"
      internship_status: "open" | "closed" | "in_progress" | "completed"
      mou_status:
        | "draft"
        | "pending_approval"
        | "active"
        | "expired"
        | "terminated"
      research_status:
        | "proposal"
        | "approved"
        | "in_progress"
        | "completed"
        | "published"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "industry_partner", "faculty", "student", "alumni"],
      event_status: ["upcoming", "ongoing", "completed", "cancelled"],
      internship_status: ["open", "closed", "in_progress", "completed"],
      mou_status: [
        "draft",
        "pending_approval",
        "active",
        "expired",
        "terminated",
      ],
      research_status: [
        "proposal",
        "approved",
        "in_progress",
        "completed",
        "published",
      ],
    },
  },
} as const

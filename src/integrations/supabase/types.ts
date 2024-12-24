export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      event_attendees: {
        Row: {
          created_at: string | null
          event_id: string
          last_notification_sent_at: string | null
          notification_status: string | null
          registration_type: string | null
          status: string | null
          user_id: string
          waitlist_position: number | null
        }
        Insert: {
          created_at?: string | null
          event_id: string
          last_notification_sent_at?: string | null
          notification_status?: string | null
          registration_type?: string | null
          status?: string | null
          user_id: string
          waitlist_position?: number | null
        }
        Update: {
          created_at?: string | null
          event_id?: string
          last_notification_sent_at?: string | null
          notification_status?: string | null
          registration_type?: string | null
          status?: string | null
          user_id?: string
          waitlist_position?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "event_attendees_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_attendees_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      event_invitation_batches: {
        Row: {
          created_at: string | null
          created_by: string | null
          email_template: string | null
          event_id: string | null
          failed_invitations: number | null
          id: string
          sent_invitations: number | null
          status: string | null
          total_invitations: number | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          email_template?: string | null
          event_id?: string | null
          failed_invitations?: number | null
          id?: string
          sent_invitations?: number | null
          status?: string | null
          total_invitations?: number | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          email_template?: string | null
          event_id?: string | null
          failed_invitations?: number | null
          id?: string
          sent_invitations?: number | null
          status?: string | null
          total_invitations?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "event_invitation_batches_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_invitation_batches_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      event_invitations: {
        Row: {
          batch_id: string | null
          created_at: string | null
          email_sent: boolean | null
          email_sent_at: string | null
          event_id: string
          expiration_date: string | null
          id: string
          invitee_id: string
          inviter_id: string
          last_viewed_at: string | null
          reminder_sent_at: string | null
          response_notes: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          batch_id?: string | null
          created_at?: string | null
          email_sent?: boolean | null
          email_sent_at?: string | null
          event_id: string
          expiration_date?: string | null
          id?: string
          invitee_id: string
          inviter_id: string
          last_viewed_at?: string | null
          reminder_sent_at?: string | null
          response_notes?: string | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          batch_id?: string | null
          created_at?: string | null
          email_sent?: boolean | null
          email_sent_at?: string | null
          event_id?: string
          expiration_date?: string | null
          id?: string
          invitee_id?: string
          inviter_id?: string
          last_viewed_at?: string | null
          reminder_sent_at?: string | null
          response_notes?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_invitations_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "event_invitation_batches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_invitations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_invitations_invitee_id_fkey"
            columns: ["invitee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_invitations_inviter_id_fkey"
            columns: ["inviter_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          category: string | null
          category_color: string | null
          cover_image: string | null
          created_at: string | null
          current_attendees: number | null
          description: string | null
          end_time: string
          id: string
          is_online: boolean | null
          is_private: boolean | null
          location: string | null
          max_capacity: number | null
          meeting_url: string | null
          notification_preferences: Json | null
          organizer_id: string
          start_time: string
          status: string | null
          tags: string[] | null
          timezone: string
          title: string
          updated_at: string | null
          waitlist_enabled: boolean | null
        }
        Insert: {
          category?: string | null
          category_color?: string | null
          cover_image?: string | null
          created_at?: string | null
          current_attendees?: number | null
          description?: string | null
          end_time: string
          id?: string
          is_online?: boolean | null
          is_private?: boolean | null
          location?: string | null
          max_capacity?: number | null
          meeting_url?: string | null
          notification_preferences?: Json | null
          organizer_id: string
          start_time: string
          status?: string | null
          tags?: string[] | null
          timezone: string
          title: string
          updated_at?: string | null
          waitlist_enabled?: boolean | null
        }
        Update: {
          category?: string | null
          category_color?: string | null
          cover_image?: string | null
          created_at?: string | null
          current_attendees?: number | null
          description?: string | null
          end_time?: string
          id?: string
          is_online?: boolean | null
          is_private?: boolean | null
          location?: string | null
          max_capacity?: number | null
          meeting_url?: string | null
          notification_preferences?: Json | null
          organizer_id?: string
          start_time?: string
          status?: string | null
          tags?: string[] | null
          timezone?: string
          title?: string
          updated_at?: string | null
          waitlist_enabled?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "events_organizer_id_fkey"
            columns: ["organizer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          author_id: string
          content: string
          created_at: string
          id: string
          title: string
          updated_at: string
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string
          id?: string
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          badge_style: string | null
          bio: string | null
          created_at: string
          custom_username: string | null
          email_notifications: boolean | null
          full_name: string | null
          id: string
          is_admin: boolean | null
          is_public: boolean | null
          location: string | null
          marketing_emails: boolean | null
          onboarding_step: string | null
          points: number | null
          profile_completed: boolean | null
          role: string | null
          security_emails: boolean | null
          social_links: Json | null
          updated_at: string
          username: string | null
          verification_status: string | null
        }
        Insert: {
          avatar_url?: string | null
          badge_style?: string | null
          bio?: string | null
          created_at?: string
          custom_username?: string | null
          email_notifications?: boolean | null
          full_name?: string | null
          id: string
          is_admin?: boolean | null
          is_public?: boolean | null
          location?: string | null
          marketing_emails?: boolean | null
          onboarding_step?: string | null
          points?: number | null
          profile_completed?: boolean | null
          role?: string | null
          security_emails?: boolean | null
          social_links?: Json | null
          updated_at?: string
          username?: string | null
          verification_status?: string | null
        }
        Update: {
          avatar_url?: string | null
          badge_style?: string | null
          bio?: string | null
          created_at?: string
          custom_username?: string | null
          email_notifications?: boolean | null
          full_name?: string | null
          id?: string
          is_admin?: boolean | null
          is_public?: boolean | null
          location?: string | null
          marketing_emails?: boolean | null
          onboarding_step?: string | null
          points?: number | null
          profile_completed?: boolean | null
          role?: string | null
          security_emails?: boolean | null
          social_links?: Json | null
          updated_at?: string
          username?: string | null
          verification_status?: string | null
        }
        Relationships: []
      }
      sub_events: {
        Row: {
          created_at: string | null
          description: string | null
          end_time: string
          event_id: string
          id: string
          is_online: boolean | null
          location: string | null
          meeting_url: string | null
          start_time: string
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          end_time: string
          event_id: string
          id?: string
          is_online?: boolean | null
          location?: string | null
          meeting_url?: string | null
          start_time: string
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          end_time?: string
          event_id?: string
          id?: string
          is_online?: boolean | null
          location?: string | null
          meeting_url?: string | null
          start_time?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sub_events_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      verification_criteria: {
        Row: {
          created_at: string | null
          description: string
          id: string
          name: string
          order_position: number
          required: boolean | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          name: string
          order_position: number
          required?: boolean | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          name?: string
          order_position?: number
          required?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      verification_requests: {
        Row: {
          created_at: string | null
          criteria_met: Json | null
          documents: string[] | null
          id: string
          reviewed_at: string | null
          reviewer_notes: string | null
          status: string | null
          submitted_at: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          criteria_met?: Json | null
          documents?: string[] | null
          id?: string
          reviewed_at?: string | null
          reviewer_notes?: string | null
          status?: string | null
          submitted_at?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          criteria_met?: Json | null
          documents?: string[] | null
          id?: string
          reviewed_at?: string | null
          reviewer_notes?: string | null
          status?: string | null
          submitted_at?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "verification_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

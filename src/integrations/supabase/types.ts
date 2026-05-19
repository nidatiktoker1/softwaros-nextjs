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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      categories: {
        Row: {
          created_at: string
          description: string | null
          icon: string | null
          id: string
          name: string
          slug: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          slug: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          slug?: string
          sort_order?: number
        }
        Relationships: []
      }
      comparisons: {
        Row: {
          cached_at: string
          cohere_verdict: string | null
          consensus: string | null
          gemini_verdict: string | null
          groq_verdict: string | null
          id: string
          mistral_verdict: string | null
          software_a: string
          software_b: string
        }
        Insert: {
          cached_at?: string
          cohere_verdict?: string | null
          consensus?: string | null
          gemini_verdict?: string | null
          groq_verdict?: string | null
          id?: string
          mistral_verdict?: string | null
          software_a: string
          software_b: string
        }
        Update: {
          cached_at?: string
          cohere_verdict?: string | null
          consensus?: string | null
          gemini_verdict?: string | null
          groq_verdict?: string | null
          id?: string
          mistral_verdict?: string | null
          software_a?: string
          software_b?: string
        }
        Relationships: []
      }
      leads: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string | null
          software_slug: string | null
          source: string
          tags: Json
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name?: string | null
          software_slug?: string | null
          source?: string
          tags?: Json
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string | null
          software_slug?: string | null
          source?: string
          tags?: Json
        }
        Relationships: []
      }
      price_alerts: {
        Row: {
          created_at: string
          current_price: number | null
          email: string
          id: string
          software_id: string
        }
        Insert: {
          created_at?: string
          current_price?: number | null
          email: string
          id?: string
          software_id: string
        }
        Update: {
          created_at?: string
          current_price?: number | null
          email?: string
          id?: string
          software_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "price_alerts_software_id_fkey"
            columns: ["software_id"]
            isOneToOne: false
            referencedRelation: "software"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          comparisons_reset_at: string
          comparisons_today: number
          created_at: string
          email: string | null
          id: string
          plan: Database["public"]["Enums"]["user_plan"]
        }
        Insert: {
          comparisons_reset_at?: string
          comparisons_today?: number
          created_at?: string
          email?: string | null
          id: string
          plan?: Database["public"]["Enums"]["user_plan"]
        }
        Update: {
          comparisons_reset_at?: string
          comparisons_today?: number
          created_at?: string
          email?: string | null
          id?: string
          plan?: Database["public"]["Enums"]["user_plan"]
        }
        Relationships: []
      }
      reviews: {
        Row: {
          author_name: string | null
          created_at: string
          id: string
          rating: number
          software_id: string
          team_size: string | null
          text: string
          use_case: string | null
        }
        Insert: {
          author_name?: string | null
          created_at?: string
          id?: string
          rating: number
          software_id: string
          team_size?: string | null
          text: string
          use_case?: string | null
        }
        Update: {
          author_name?: string | null
          created_at?: string
          id?: string
          rating?: number
          software_id?: string
          team_size?: string | null
          text?: string
          use_case?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_software_id_fkey"
            columns: ["software_id"]
            isOneToOne: false
            referencedRelation: "software"
            referencedColumns: ["id"]
          },
        ]
      }
      software: {
        Row: {
          affiliate_link: string | null
          category: string
          category_id: string | null
          competitors: Json
          cons: Json
          created_at: string
          description: string | null
          id: string
          is_new_arrival: boolean
          is_trending: boolean
          learning_curve: string | null
          logo: string | null
          name: string
          platforms: Json
          pricing: Json
          pros: Json
          shortcuts: Json
          slug: string
          trust_score: number | null
        }
        Insert: {
          affiliate_link?: string | null
          category: string
          category_id?: string | null
          competitors?: Json
          cons?: Json
          created_at?: string
          description?: string | null
          id?: string
          is_new_arrival?: boolean
          is_trending?: boolean
          learning_curve?: string | null
          logo?: string | null
          name: string
          platforms?: Json
          pricing?: Json
          pros?: Json
          shortcuts?: Json
          slug: string
          trust_score?: number | null
        }
        Update: {
          affiliate_link?: string | null
          category?: string
          category_id?: string | null
          competitors?: Json
          cons?: Json
          created_at?: string
          description?: string | null
          id?: string
          is_new_arrival?: boolean
          is_trending?: boolean
          learning_curve?: string | null
          logo?: string | null
          name?: string
          platforms?: Json
          pricing?: Json
          pros?: Json
          shortcuts?: Json
          slug?: string
          trust_score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "software_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
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
      user_plan: "free" | "pro" | "teams"
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
      user_plan: ["free", "pro", "teams"],
    },
  },
} as const

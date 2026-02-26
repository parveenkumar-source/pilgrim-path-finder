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
      bookings: {
        Row: {
          contact_email: string | null
          contact_name: string | null
          contact_phone: string | null
          created_at: string
          food_details: string | null
          hotel_details: string | null
          id: string
          num_travelers: number
          package_id: string | null
          package_name: string
          payment_status: string | null
          special_requests: string | null
          status: Database["public"]["Enums"]["booking_status"]
          tier: Database["public"]["Enums"]["package_tier"]
          total_price: number
          travel_date: string
          travel_details: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string
          food_details?: string | null
          hotel_details?: string | null
          id?: string
          num_travelers?: number
          package_id?: string | null
          package_name?: string
          payment_status?: string | null
          special_requests?: string | null
          status?: Database["public"]["Enums"]["booking_status"]
          tier?: Database["public"]["Enums"]["package_tier"]
          total_price?: number
          travel_date?: string
          travel_details?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string
          food_details?: string | null
          hotel_details?: string | null
          id?: string
          num_travelers?: number
          package_id?: string | null
          package_name?: string
          payment_status?: string | null
          special_requests?: string | null
          status?: Database["public"]["Enums"]["booking_status"]
          tier?: Database["public"]["Enums"]["package_tier"]
          total_price?: number
          travel_date?: string
          travel_details?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "packages"
            referencedColumns: ["id"]
          },
        ]
      }
      cleaners: {
        Row: {
          created_at: string
          full_name: string
          hotel_id: string | null
          id: string
          is_active: boolean
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          full_name?: string
          hotel_id?: string | null
          id?: string
          is_active?: boolean
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          full_name?: string
          hotel_id?: string | null
          id?: string
          is_active?: boolean
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cleaners_hotel_id_fkey"
            columns: ["hotel_id"]
            isOneToOne: false
            referencedRelation: "hotels"
            referencedColumns: ["id"]
          },
        ]
      }
      cleaning_schedules: {
        Row: {
          cleaner_id: string
          created_at: string
          hotel_id: string
          id: string
          notes: string | null
          scheduled_date: string
          status: Database["public"]["Enums"]["cleaning_status"]
          updated_at: string
        }
        Insert: {
          cleaner_id: string
          created_at?: string
          hotel_id: string
          id?: string
          notes?: string | null
          scheduled_date?: string
          status?: Database["public"]["Enums"]["cleaning_status"]
          updated_at?: string
        }
        Update: {
          cleaner_id?: string
          created_at?: string
          hotel_id?: string
          id?: string
          notes?: string | null
          scheduled_date?: string
          status?: Database["public"]["Enums"]["cleaning_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cleaning_schedules_cleaner_id_fkey"
            columns: ["cleaner_id"]
            isOneToOne: false
            referencedRelation: "cleaners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cleaning_schedules_hotel_id_fkey"
            columns: ["hotel_id"]
            isOneToOne: false
            referencedRelation: "hotels"
            referencedColumns: ["id"]
          },
        ]
      }
      destinations: {
        Row: {
          created_at: string
          description: string | null
          highlights: string[] | null
          id: string
          image_url: string | null
          is_active: boolean
          location: string | null
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          highlights?: string[] | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          location?: string | null
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          highlights?: string[] | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          location?: string | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      food_plans: {
        Row: {
          created_at: string
          description: string | null
          dining_location: string | null
          id: string
          meal_type: string
          meals_per_day: number
          name: string
          price: number
          quality_standard: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          dining_location?: string | null
          id?: string
          meal_type?: string
          meals_per_day?: number
          name: string
          price?: number
          quality_standard?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          dining_location?: string | null
          id?: string
          meal_type?: string
          meals_per_day?: number
          name?: string
          price?: number
          quality_standard?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      hotels: {
        Row: {
          address: string | null
          category: string | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          destination_id: string
          facilities: string[] | null
          id: string
          image_url: string | null
          is_active: boolean
          map_url: string | null
          name: string
          room_types: string[] | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          category?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          destination_id: string
          facilities?: string[] | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          map_url?: string | null
          name: string
          room_types?: string[] | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          category?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          destination_id?: string
          facilities?: string[] | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          map_url?: string | null
          name?: string
          room_types?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "hotels_destination_id_fkey"
            columns: ["destination_id"]
            isOneToOne: false
            referencedRelation: "destinations"
            referencedColumns: ["id"]
          },
        ]
      }
      packages: {
        Row: {
          accommodation_cost: number
          created_at: string
          description: string | null
          destination_id: string | null
          duration_days: number
          food_cost: number
          food_plan_id: string | null
          group_size: string | null
          highlights: string[] | null
          hotel_id: string | null
          id: string
          image_url: string | null
          is_active: boolean
          is_featured: boolean
          itinerary: Json | null
          name: string
          rating: number | null
          tax_amount: number
          tier: Database["public"]["Enums"]["package_tier"]
          total_price: number
          travel_cost: number
          travel_type: string | null
          updated_at: string
        }
        Insert: {
          accommodation_cost?: number
          created_at?: string
          description?: string | null
          destination_id?: string | null
          duration_days?: number
          food_cost?: number
          food_plan_id?: string | null
          group_size?: string | null
          highlights?: string[] | null
          hotel_id?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          is_featured?: boolean
          itinerary?: Json | null
          name: string
          rating?: number | null
          tax_amount?: number
          tier?: Database["public"]["Enums"]["package_tier"]
          total_price?: number
          travel_cost?: number
          travel_type?: string | null
          updated_at?: string
        }
        Update: {
          accommodation_cost?: number
          created_at?: string
          description?: string | null
          destination_id?: string | null
          duration_days?: number
          food_cost?: number
          food_plan_id?: string | null
          group_size?: string | null
          highlights?: string[] | null
          hotel_id?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          is_featured?: boolean
          itinerary?: Json | null
          name?: string
          rating?: number | null
          tax_amount?: number
          tier?: Database["public"]["Enums"]["package_tier"]
          total_price?: number
          travel_cost?: number
          travel_type?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "packages_destination_id_fkey"
            columns: ["destination_id"]
            isOneToOne: false
            referencedRelation: "destinations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "packages_food_plan_id_fkey"
            columns: ["food_plan_id"]
            isOneToOne: false
            referencedRelation: "food_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "packages_hotel_id_fkey"
            columns: ["hotel_id"]
            isOneToOne: false
            referencedRelation: "hotels"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
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
          role?: Database["public"]["Enums"]["app_role"]
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
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "pilgrim" | "cleaner"
      booking_status: "pending" | "confirmed" | "cancelled" | "completed"
      cleaning_status: "pending" | "in_progress" | "completed"
      package_tier: "basic" | "premium"
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
      app_role: ["admin", "pilgrim", "cleaner"],
      booking_status: ["pending", "confirmed", "cancelled", "completed"],
      cleaning_status: ["pending", "in_progress", "completed"],
      package_tier: ["basic", "premium"],
    },
  },
} as const

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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      courses: {
        Row: {
          created_at: string
          exam_date: string | null
          id: string
          name: string
          past_questions: Json
          revision_notes: string
          study_hours: number
          updated_at: string
          user_id: string
          weekly_progress: Json
        }
        Insert: {
          created_at?: string
          exam_date?: string | null
          id?: string
          name: string
          past_questions?: Json
          revision_notes?: string
          study_hours?: number
          updated_at?: string
          user_id: string
          weekly_progress?: Json
        }
        Update: {
          created_at?: string
          exam_date?: string | null
          id?: string
          name?: string
          past_questions?: Json
          revision_notes?: string
          study_hours?: number
          updated_at?: string
          user_id?: string
          weekly_progress?: Json
        }
        Relationships: []
      }
      expenses: {
        Row: {
          amount: number
          category: string
          created_at: string
          date: string
          description: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount?: number
          category?: string
          created_at?: string
          date?: string
          description: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          date?: string
          description?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      forex_classes: {
        Row: {
          completed: boolean
          created_at: string
          id: string
          notes: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed?: boolean
          created_at?: string
          id?: string
          notes?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed?: boolean
          created_at?: string
          id?: string
          notes?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      forex_trades: {
        Row: {
          created_at: string
          date: string
          entry_price: number
          exit_price: number | null
          id: string
          notes: string
          pair: string
          profit_loss: number | null
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          date?: string
          entry_price?: number
          exit_price?: number | null
          id?: string
          notes?: string
          pair: string
          profit_loss?: number | null
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          date?: string
          entry_price?: number
          exit_price?: number | null
          id?: string
          notes?: string
          pair?: string
          profit_loss?: number | null
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      fyp_sections: {
        Row: {
          created_at: string
          deadline: string | null
          id: string
          notes: string
          progress_percent: number
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          deadline?: string | null
          id?: string
          notes?: string
          progress_percent?: number
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          deadline?: string | null
          id?: string
          notes?: string
          progress_percent?: number
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      growth_items: {
        Row: {
          created_at: string
          id: string
          notes: string
          progress_percent: number
          title: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          notes?: string
          progress_percent?: number
          title: string
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string
          progress_percent?: number
          title?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      habits: {
        Row: {
          completed_dates: Json
          created_at: string
          id: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_dates?: Json
          created_at?: string
          id?: string
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_dates?: Json
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      job_applications: {
        Row: {
          company: string
          created_at: string
          date_applied: string
          id: string
          notes: string
          platform: string
          role: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          company: string
          created_at?: string
          date_applied?: string
          id?: string
          notes?: string
          platform?: string
          role: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          company?: string
          created_at?: string
          date_applied?: string
          id?: string
          notes?: string
          platform?: string
          role?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      learning_tools: {
        Row: {
          created_at: string
          id: string
          lessons_completed: number
          name: string
          notes: string
          total_lessons: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          lessons_completed?: number
          name: string
          notes?: string
          total_lessons?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          lessons_completed?: number
          name?: string
          notes?: string
          total_lessons?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      okads_admin_users: {
        Row: {
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      okads_cart_items: {
        Row: {
          created_at: string
          id: string
          product_id: string
          quantity: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          quantity?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          quantity?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "okads_cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "okads_products"
            referencedColumns: ["id"]
          },
        ]
      }
      okads_categories: {
        Row: {
          created_at: string
          description: string
          id: string
          image_url: string | null
          name: string
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string
          id?: string
          image_url?: string | null
          name: string
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          image_url?: string | null
          name?: string
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      okads_customers: {
        Row: {
          address: string
          city: string
          created_at: string
          full_name: string
          id: string
          phone: string
          state: string
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string
          city?: string
          created_at?: string
          full_name?: string
          id?: string
          phone?: string
          state?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string
          city?: string
          created_at?: string
          full_name?: string
          id?: string
          phone?: string
          state?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      okads_order_items: {
        Row: {
          created_at: string
          id: string
          order_id: string
          product_id: string | null
          product_name: string
          quantity: number
          unit_price: number
        }
        Insert: {
          created_at?: string
          id?: string
          order_id: string
          product_id?: string | null
          product_name?: string
          quantity?: number
          unit_price?: number
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string
          product_id?: string | null
          product_name?: string
          quantity?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "okads_order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "okads_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "okads_order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "okads_products"
            referencedColumns: ["id"]
          },
        ]
      }
      okads_orders: {
        Row: {
          created_at: string
          customer_id: string | null
          delivery_address: string
          delivery_fee: number
          id: string
          order_number: string
          payment_reference: string | null
          status: string
          total: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          customer_id?: string | null
          delivery_address?: string
          delivery_fee?: number
          id?: string
          order_number: string
          payment_reference?: string | null
          status?: string
          total?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          customer_id?: string | null
          delivery_address?: string
          delivery_fee?: number
          id?: string
          order_number?: string
          payment_reference?: string | null
          status?: string
          total?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "okads_orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "okads_customers"
            referencedColumns: ["id"]
          },
        ]
      }
      okads_products: {
        Row: {
          category_id: string | null
          compare_price: number | null
          created_at: string
          description: string
          featured: boolean
          id: string
          image_url: string | null
          in_stock: boolean
          name: string
          price: number
          slug: string
          updated_at: string
          weight_unit: string
        }
        Insert: {
          category_id?: string | null
          compare_price?: number | null
          created_at?: string
          description?: string
          featured?: boolean
          id?: string
          image_url?: string | null
          in_stock?: boolean
          name: string
          price?: number
          slug: string
          updated_at?: string
          weight_unit?: string
        }
        Update: {
          category_id?: string | null
          compare_price?: number | null
          created_at?: string
          description?: string
          featured?: boolean
          id?: string
          image_url?: string | null
          in_stock?: boolean
          name?: string
          price?: number
          slug?: string
          updated_at?: string
          weight_unit?: string
        }
        Relationships: [
          {
            foreignKeyName: "okads_products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "okads_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      savings_goals: {
        Row: {
          created_at: string
          current_amount: number
          id: string
          target_amount: number
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_amount?: number
          id?: string
          target_amount?: number
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_amount?: number
          id?: string
          target_amount?: number
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      siwes_items: {
        Row: {
          created_at: string
          id: string
          notes: string
          progress_percent: number
          title: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          notes?: string
          progress_percent?: number
          title: string
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string
          progress_percent?: number
          title?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      skill_courses: {
        Row: {
          created_at: string
          deadline: string | null
          id: string
          lessons: Json
          name: string
          notes: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          deadline?: string | null
          id?: string
          lessons?: Json
          name: string
          notes?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          deadline?: string | null
          id?: string
          lessons?: Json
          name?: string
          notes?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      social_metrics: {
        Row: {
          created_at: string
          date: string
          engagement: number
          followers: number
          id: string
          platform: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          date?: string
          engagement?: number
          followers?: number
          id?: string
          platform: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          date?: string
          engagement?: number
          followers?: number
          id?: string
          platform?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      social_posts: {
        Row: {
          content: string
          created_at: string
          id: string
          platform: string
          scheduled_date: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content?: string
          created_at?: string
          id?: string
          platform: string
          scheduled_date?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          platform?: string
          scheduled_date?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      special_projects: {
        Row: {
          created_at: string
          deadline: string | null
          description: string
          id: string
          progress_percent: number
          tasks: Json
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          deadline?: string | null
          description?: string
          id?: string
          progress_percent?: number
          tasks?: Json
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          deadline?: string | null
          description?: string
          id?: string
          progress_percent?: number
          tasks?: Json
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      tasks: {
        Row: {
          category: string | null
          completed: boolean
          created_at: string
          deadline: string | null
          estimated_minutes: number | null
          id: string
          priority: string
          progress_percent: number
          time_block: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string | null
          completed?: boolean
          created_at?: string
          deadline?: string | null
          estimated_minutes?: number | null
          id?: string
          priority?: string
          progress_percent?: number
          time_block?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string | null
          completed?: boolean
          created_at?: string
          deadline?: string | null
          estimated_minutes?: number | null
          id?: string
          priority?: string
          progress_percent?: number
          time_block?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      tt_audit_logs: {
        Row: {
          action: string
          actor_user_id: string | null
          created_at: string
          id: string
          metadata: Json | null
          target_id: string | null
          target_type: string | null
        }
        Insert: {
          action: string
          actor_user_id?: string | null
          created_at?: string
          id?: string
          metadata?: Json | null
          target_id?: string | null
          target_type?: string | null
        }
        Update: {
          action?: string
          actor_user_id?: string | null
          created_at?: string
          id?: string
          metadata?: Json | null
          target_id?: string | null
          target_type?: string | null
        }
        Relationships: []
      }
      tt_business_profiles: {
        Row: {
          api_key: string | null
          business_address: string | null
          business_email: string | null
          business_name: string
          business_phone: string | null
          business_type: string
          cac_number: string | null
          contact_person: string | null
          created_at: string
          docs: Json
          id: string
          plan: string
          status: Database["public"]["Enums"]["tt_dealer_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          api_key?: string | null
          business_address?: string | null
          business_email?: string | null
          business_name: string
          business_phone?: string | null
          business_type?: string
          cac_number?: string | null
          contact_person?: string | null
          created_at?: string
          docs?: Json
          id?: string
          plan?: string
          status?: Database["public"]["Enums"]["tt_dealer_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          api_key?: string | null
          business_address?: string | null
          business_email?: string | null
          business_name?: string
          business_phone?: string | null
          business_type?: string
          cac_number?: string | null
          contact_person?: string | null
          created_at?: string
          docs?: Json
          id?: string
          plan?: string
          status?: Database["public"]["Enums"]["tt_dealer_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      tt_items: {
        Row: {
          additional_identifiers: string | null
          brand: string | null
          chassis_number: string | null
          color: string | null
          created_at: string
          engine_number: string | null
          frame_number: string | null
          id: string
          imei_1: string | null
          imei_2: string | null
          item_category: string
          item_name: string
          item_photos: Json
          kva_rating: string | null
          mac_address: string | null
          model: string | null
          owner_id: string
          plate_number: string | null
          purchase_date: string | null
          purchase_location: string | null
          purchase_price: number | null
          qr_url: string | null
          screen_size: string | null
          serial_number: string | null
          status: Database["public"]["Enums"]["tt_item_status"]
          updated_at: string
          vin: string | null
          vivesa_asset_id: string | null
        }
        Insert: {
          additional_identifiers?: string | null
          brand?: string | null
          chassis_number?: string | null
          color?: string | null
          created_at?: string
          engine_number?: string | null
          frame_number?: string | null
          id?: string
          imei_1?: string | null
          imei_2?: string | null
          item_category?: string
          item_name: string
          item_photos?: Json
          kva_rating?: string | null
          mac_address?: string | null
          model?: string | null
          owner_id: string
          plate_number?: string | null
          purchase_date?: string | null
          purchase_location?: string | null
          purchase_price?: number | null
          qr_url?: string | null
          screen_size?: string | null
          serial_number?: string | null
          status?: Database["public"]["Enums"]["tt_item_status"]
          updated_at?: string
          vin?: string | null
          vivesa_asset_id?: string | null
        }
        Update: {
          additional_identifiers?: string | null
          brand?: string | null
          chassis_number?: string | null
          color?: string | null
          created_at?: string
          engine_number?: string | null
          frame_number?: string | null
          id?: string
          imei_1?: string | null
          imei_2?: string | null
          item_category?: string
          item_name?: string
          item_photos?: Json
          kva_rating?: string | null
          mac_address?: string | null
          model?: string | null
          owner_id?: string
          plate_number?: string | null
          purchase_date?: string | null
          purchase_location?: string | null
          purchase_price?: number | null
          qr_url?: string | null
          screen_size?: string | null
          serial_number?: string | null
          status?: Database["public"]["Enums"]["tt_item_status"]
          updated_at?: string
          vin?: string | null
          vivesa_asset_id?: string | null
        }
        Relationships: []
      }
      tt_notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          link: string | null
          message: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          link?: string | null
          message: string
          type?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          link?: string | null
          message?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      tt_profiles: {
        Row: {
          account_type: Database["public"]["Enums"]["tt_account_type"]
          created_at: string
          email: string | null
          full_name: string
          id: string
          phone_number: string | null
          profile_photo_url: string | null
          updated_at: string
          user_id: string
          verification_status: Database["public"]["Enums"]["tt_verification_status"]
        }
        Insert: {
          account_type?: Database["public"]["Enums"]["tt_account_type"]
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          phone_number?: string | null
          profile_photo_url?: string | null
          updated_at?: string
          user_id: string
          verification_status?: Database["public"]["Enums"]["tt_verification_status"]
        }
        Update: {
          account_type?: Database["public"]["Enums"]["tt_account_type"]
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          phone_number?: string | null
          profile_photo_url?: string | null
          updated_at?: string
          user_id?: string
          verification_status?: Database["public"]["Enums"]["tt_verification_status"]
        }
        Relationships: []
      }
      tt_search_logs: {
        Row: {
          created_at: string
          id: string
          item_found: boolean
          item_id: string | null
          item_status: string | null
          search_query: string
          searcher_ip: string | null
          searcher_user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          item_found?: boolean
          item_id?: string | null
          item_status?: string | null
          search_query: string
          searcher_ip?: string | null
          searcher_user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          item_found?: boolean
          item_id?: string | null
          item_status?: string | null
          search_query?: string
          searcher_ip?: string | null
          searcher_user_id?: string | null
        }
        Relationships: []
      }
      tt_stolen_reports: {
        Row: {
          additional_description: string | null
          circumstance: string | null
          created_at: string
          date_stolen: string | null
          id: string
          item_id: string
          lga_stolen: string | null
          location_stolen: string | null
          police_doc_url: string | null
          police_report_number: string | null
          police_state: string | null
          police_station: string | null
          reported_by: string
          reward_amount: number | null
          reward_offered: boolean
          state_stolen: string | null
          status: string
          time_stolen: string | null
        }
        Insert: {
          additional_description?: string | null
          circumstance?: string | null
          created_at?: string
          date_stolen?: string | null
          id?: string
          item_id: string
          lga_stolen?: string | null
          location_stolen?: string | null
          police_doc_url?: string | null
          police_report_number?: string | null
          police_state?: string | null
          police_station?: string | null
          reported_by: string
          reward_amount?: number | null
          reward_offered?: boolean
          state_stolen?: string | null
          status?: string
          time_stolen?: string | null
        }
        Update: {
          additional_description?: string | null
          circumstance?: string | null
          created_at?: string
          date_stolen?: string | null
          id?: string
          item_id?: string
          lga_stolen?: string | null
          location_stolen?: string | null
          police_doc_url?: string | null
          police_report_number?: string | null
          police_state?: string | null
          police_station?: string | null
          reported_by?: string
          reward_amount?: number | null
          reward_offered?: boolean
          state_stolen?: string | null
          status?: string
          time_stolen?: string | null
        }
        Relationships: []
      }
      tt_tips: {
        Row: {
          created_at: string
          id: string
          item_id: string | null
          photo_urls: Json
          search_query: string | null
          seller_contact: string | null
          seller_location: string | null
          seller_platform: string | null
          status: Database["public"]["Enums"]["tt_tip_status"]
          submitted_by: string | null
          submitter_ip: string | null
          tip_description: string
        }
        Insert: {
          created_at?: string
          id?: string
          item_id?: string | null
          photo_urls?: Json
          search_query?: string | null
          seller_contact?: string | null
          seller_location?: string | null
          seller_platform?: string | null
          status?: Database["public"]["Enums"]["tt_tip_status"]
          submitted_by?: string | null
          submitter_ip?: string | null
          tip_description: string
        }
        Update: {
          created_at?: string
          id?: string
          item_id?: string | null
          photo_urls?: Json
          search_query?: string | null
          seller_contact?: string | null
          seller_location?: string | null
          seller_platform?: string | null
          status?: Database["public"]["Enums"]["tt_tip_status"]
          submitted_by?: string | null
          submitter_ip?: string | null
          tip_description?: string
        }
        Relationships: []
      }
      tt_transfers: {
        Row: {
          created_at: string
          from_user_id: string
          id: string
          item_id: string
          sale_price: number | null
          status: Database["public"]["Enums"]["tt_transfer_status"]
          to_user_email: string | null
          to_user_id: string | null
          to_user_phone: string | null
          transfer_notes: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          from_user_id: string
          id?: string
          item_id: string
          sale_price?: number | null
          status?: Database["public"]["Enums"]["tt_transfer_status"]
          to_user_email?: string | null
          to_user_id?: string | null
          to_user_phone?: string | null
          transfer_notes?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          from_user_id?: string
          id?: string
          item_id?: string
          sale_price?: number | null
          status?: Database["public"]["Enums"]["tt_transfer_status"]
          to_user_email?: string | null
          to_user_id?: string | null
          to_user_phone?: string | null
          transfer_notes?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      tt_user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["tt_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["tt_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["tt_role"]
          user_id?: string
        }
        Relationships: []
      }
      tt_verification_checks: {
        Row: {
          checked_by: string
          created_at: string
          id: string
          item_id: string | null
          item_identifier: string
          result: string
        }
        Insert: {
          checked_by: string
          created_at?: string
          id?: string
          item_id?: string | null
          item_identifier: string
          result: string
        }
        Update: {
          checked_by?: string
          created_at?: string
          id?: string
          item_id?: string | null
          item_identifier?: string
          result?: string
        }
        Relationships: []
      }
      weekly_reviews: {
        Row: {
          challenges: string
          created_at: string
          id: string
          next_week_goals: string
          rating: number
          updated_at: string
          user_id: string
          week_start: string
          wins: string
        }
        Insert: {
          challenges?: string
          created_at?: string
          id?: string
          next_week_goals?: string
          rating?: number
          updated_at?: string
          user_id: string
          week_start: string
          wins?: string
        }
        Update: {
          challenges?: string
          created_at?: string
          id?: string
          next_week_goals?: string
          rating?: number
          updated_at?: string
          user_id?: string
          week_start?: string
          wins?: string
        }
        Relationships: []
      }
      wishlist_items: {
        Row: {
          created_at: string
          estimated_cost: number
          id: string
          purchased: boolean
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          estimated_cost?: number
          id?: string
          purchased?: boolean
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          estimated_cost?: number
          id?: string
          purchased?: boolean
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_okads_admin: { Args: { _user_id: string }; Returns: boolean }
      tt_has_role: {
        Args: {
          _role: Database["public"]["Enums"]["tt_role"]
          _user_id: string
        }
        Returns: boolean
      }
      tt_verify_search: {
        Args: { _ip?: string; _query: string }
        Returns: Json
      }
    }
    Enums: {
      tt_account_type: "individual" | "dealer" | "business" | "admin"
      tt_dealer_status: "pending" | "approved" | "rejected" | "suspended"
      tt_item_status: "clean" | "stolen" | "recovered" | "transferred"
      tt_role: "user" | "dealer" | "admin"
      tt_tip_status: "new" | "investigating" | "resolved" | "dismissed"
      tt_transfer_status: "pending" | "accepted" | "rejected" | "cancelled"
      tt_verification_status: "pending" | "verified" | "rejected"
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
      tt_account_type: ["individual", "dealer", "business", "admin"],
      tt_dealer_status: ["pending", "approved", "rejected", "suspended"],
      tt_item_status: ["clean", "stolen", "recovered", "transferred"],
      tt_role: ["user", "dealer", "admin"],
      tt_tip_status: ["new", "investigating", "resolved", "dismissed"],
      tt_transfer_status: ["pending", "accepted", "rejected", "cancelled"],
      tt_verification_status: ["pending", "verified", "rejected"],
    },
  },
} as const

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
      tt_chat_messages: {
        Row: {
          body: string
          created_at: string
          flagged: boolean
          id: string
          sanitized_body: string
          sender_id: string | null
          thread_id: string
        }
        Insert: {
          body: string
          created_at?: string
          flagged?: boolean
          id?: string
          sanitized_body?: string
          sender_id?: string | null
          thread_id: string
        }
        Update: {
          body?: string
          created_at?: string
          flagged?: boolean
          id?: string
          sanitized_body?: string
          sender_id?: string | null
          thread_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tt_chat_messages_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "tt_chat_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      tt_chat_threads: {
        Row: {
          created_at: string
          id: string
          item_id: string | null
          other_user_id: string | null
          owner_id: string
          subject: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          item_id?: string | null
          other_user_id?: string | null
          owner_id: string
          subject?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          item_id?: string | null
          other_user_id?: string | null
          owner_id?: string
          subject?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tt_chat_threads_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "tt_items"
            referencedColumns: ["id"]
          },
        ]
      }
      tt_found_reports: {
        Row: {
          created_at: string
          finder_anon_token: string | null
          finder_user_id: string | null
          id: string
          location: string | null
          lost_report_id: string
          message: string | null
          photo_url: string | null
          thread_id: string | null
        }
        Insert: {
          created_at?: string
          finder_anon_token?: string | null
          finder_user_id?: string | null
          id?: string
          location?: string | null
          lost_report_id: string
          message?: string | null
          photo_url?: string | null
          thread_id?: string | null
        }
        Update: {
          created_at?: string
          finder_anon_token?: string | null
          finder_user_id?: string | null
          id?: string
          location?: string | null
          lost_report_id?: string
          message?: string | null
          photo_url?: string | null
          thread_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tt_found_reports_lost_report_id_fkey"
            columns: ["lost_report_id"]
            isOneToOne: false
            referencedRelation: "tt_lost_reports"
            referencedColumns: ["id"]
          },
        ]
      }
      tt_fraud_flags: {
        Row: {
          created_at: string
          entity_id: string | null
          entity_type: string
          id: string
          reason: string
          resolved: boolean
          severity: string
        }
        Insert: {
          created_at?: string
          entity_id?: string | null
          entity_type: string
          id?: string
          reason: string
          resolved?: boolean
          severity?: string
        }
        Update: {
          created_at?: string
          entity_id?: string | null
          entity_type?: string
          id?: string
          reason?: string
          resolved?: boolean
          severity?: string
        }
        Relationships: []
      }
      tt_items: {
        Row: {
          brand: string | null
          category: string | null
          created_at: string
          description: string | null
          id: string
          model: string | null
          name: string
          owner_id: string
          photos: Json
          product_id: string | null
          purchase_date: string | null
          serial_number: string | null
          status: string
          updated_at: string
        }
        Insert: {
          brand?: string | null
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          model?: string | null
          name: string
          owner_id: string
          photos?: Json
          product_id?: string | null
          purchase_date?: string | null
          serial_number?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          brand?: string | null
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          model?: string | null
          name?: string
          owner_id?: string
          photos?: Json
          product_id?: string | null
          purchase_date?: string | null
          serial_number?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tt_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "tt_products"
            referencedColumns: ["id"]
          },
        ]
      }
      tt_lost_reports: {
        Row: {
          created_at: string
          description: string | null
          id: string
          item_id: string
          last_location: string | null
          reported_by: string
          reward_amount: number | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          item_id: string
          last_location?: string | null
          reported_by: string
          reward_amount?: number | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          item_id?: string
          last_location?: string | null
          reported_by?: string
          reward_amount?: number | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tt_lost_reports_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "tt_items"
            referencedColumns: ["id"]
          },
        ]
      }
      tt_manufacturers: {
        Row: {
          company_name: string
          created_at: string
          description: string | null
          id: string
          logo_url: string | null
          updated_at: string
          user_id: string
          verification_status: string
          verified: boolean
          website: string | null
        }
        Insert: {
          company_name: string
          created_at?: string
          description?: string | null
          id?: string
          logo_url?: string | null
          updated_at?: string
          user_id: string
          verification_status?: string
          verified?: boolean
          website?: string | null
        }
        Update: {
          company_name?: string
          created_at?: string
          description?: string | null
          id?: string
          logo_url?: string | null
          updated_at?: string
          user_id?: string
          verification_status?: string
          verified?: boolean
          website?: string | null
        }
        Relationships: []
      }
      tt_notifications: {
        Row: {
          body: string | null
          created_at: string
          id: string
          link: string | null
          read: boolean
          title: string
          type: string
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          link?: string | null
          read?: boolean
          title: string
          type?: string
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          link?: string | null
          read?: boolean
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      tt_ownership_history: {
        Row: {
          from_user: string | null
          id: string
          item_id: string
          reason: string | null
          to_user: string | null
          transferred_at: string
        }
        Insert: {
          from_user?: string | null
          id?: string
          item_id: string
          reason?: string | null
          to_user?: string | null
          transferred_at?: string
        }
        Update: {
          from_user?: string | null
          id?: string
          item_id?: string
          reason?: string | null
          to_user?: string | null
          transferred_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tt_ownership_history_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "tt_items"
            referencedColumns: ["id"]
          },
        ]
      }
      tt_products: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          manufacturer_id: string
          model: string | null
          name: string
          updated_at: string
          warranty_months: number | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          manufacturer_id: string
          model?: string | null
          name: string
          updated_at?: string
          warranty_months?: number | null
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          manufacturer_id?: string
          model?: string | null
          name?: string
          updated_at?: string
          warranty_months?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "tt_products_manufacturer_id_fkey"
            columns: ["manufacturer_id"]
            isOneToOne: false
            referencedRelation: "tt_manufacturers"
            referencedColumns: ["id"]
          },
        ]
      }
      tt_profiles: {
        Row: {
          avatar_url: string | null
          country: string | null
          created_at: string
          full_name: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          country?: string | null
          created_at?: string
          full_name?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          country?: string | null
          created_at?: string
          full_name?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      tt_qr_batches: {
        Row: {
          created_at: string
          id: string
          manufacturer_id: string
          name: string
          product_id: string | null
          size: number
        }
        Insert: {
          created_at?: string
          id?: string
          manufacturer_id: string
          name: string
          product_id?: string | null
          size?: number
        }
        Update: {
          created_at?: string
          id?: string
          manufacturer_id?: string
          name?: string
          product_id?: string | null
          size?: number
        }
        Relationships: [
          {
            foreignKeyName: "tt_qr_batches_manufacturer_id_fkey"
            columns: ["manufacturer_id"]
            isOneToOne: false
            referencedRelation: "tt_manufacturers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tt_qr_batches_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "tt_products"
            referencedColumns: ["id"]
          },
        ]
      }
      tt_qr_codes: {
        Row: {
          batch_id: string | null
          created_at: string
          id: string
          item_id: string | null
          product_id: string | null
          scan_count: number
          token: string
        }
        Insert: {
          batch_id?: string | null
          created_at?: string
          id?: string
          item_id?: string | null
          product_id?: string | null
          scan_count?: number
          token: string
        }
        Update: {
          batch_id?: string | null
          created_at?: string
          id?: string
          item_id?: string | null
          product_id?: string | null
          scan_count?: number
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "tt_qr_codes_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "tt_qr_batches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tt_qr_codes_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "tt_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tt_qr_codes_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "tt_products"
            referencedColumns: ["id"]
          },
        ]
      }
      tt_scans: {
        Row: {
          created_at: string
          id: string
          ip_city: string | null
          ip_country: string | null
          qr_code_id: string | null
          result: string
          scanner_user_id: string | null
          token: string | null
          user_agent: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          ip_city?: string | null
          ip_country?: string | null
          qr_code_id?: string | null
          result?: string
          scanner_user_id?: string | null
          token?: string | null
          user_agent?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          ip_city?: string | null
          ip_country?: string | null
          qr_code_id?: string | null
          result?: string
          scanner_user_id?: string | null
          token?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tt_scans_qr_code_id_fkey"
            columns: ["qr_code_id"]
            isOneToOne: false
            referencedRelation: "tt_qr_codes"
            referencedColumns: ["id"]
          },
        ]
      }
      tt_transfers: {
        Row: {
          created_at: string
          from_user: string
          id: string
          item_id: string
          status: string
          to_user_email: string
          to_user_id: string | null
          token: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          from_user: string
          id?: string
          item_id: string
          status?: string
          to_user_email: string
          to_user_id?: string | null
          token: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          from_user?: string
          id?: string
          item_id?: string
          status?: string
          to_user_email?: string
          to_user_id?: string | null
          token?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tt_transfers_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "tt_items"
            referencedColumns: ["id"]
          },
        ]
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
      tt_verify_qr: { Args: { _token: string }; Returns: Json }
    }
    Enums: {
      tt_role: "user" | "manufacturer" | "admin"
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
      tt_role: ["user", "manufacturer", "admin"],
    },
  },
} as const

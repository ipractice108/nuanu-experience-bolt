export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      experiences: {
        Row: {
          id: string
          name: string
          description: string
          category: 'art' | 'education' | 'wellness' | 'creative'
          is_paid: boolean
          price: number | null
          image_url: string | null
          created_by: string
          is_visible: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          category: 'art' | 'education' | 'wellness' | 'creative'
          is_paid: boolean
          price?: number | null
          image_url?: string | null
          created_by: string
          is_visible?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          category?: 'art' | 'education' | 'wellness' | 'creative'
          is_paid?: boolean
          price?: number | null
          image_url?: string | null
          created_by?: string
          is_visible?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      experience_dates: {
        Row: {
          id: string
          experience_id: string
          date: string | null
          start_time: string
          end_time: string
          is_recurring: boolean
          recurrence_type: 'daily' | 'weekly' | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          experience_id: string
          date?: string | null
          start_time: string
          end_time: string
          is_recurring?: boolean
          recurrence_type?: 'daily' | 'weekly' | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          experience_id?: string
          date?: string | null
          start_time?: string
          end_time?: string
          is_recurring?: boolean
          recurrence_type?: 'daily' | 'weekly' | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      experience_category: 'art' | 'education' | 'wellness' | 'creative'
    }
  }
}
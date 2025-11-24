
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
      profiles: {
        Row: {
          id: string
          user_id: string
          display_name: string
          photo_url: string | null
          city: string | null
          created_at: string
          deleted_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          display_name: string
          photo_url?: string | null
          city?: string | null
          created_at?: string
          deleted_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          display_name?: string
          photo_url?: string | null
          city?: string | null
          created_at?: string
          deleted_at?: string | null
        }
      }
      interests: {
        Row: {
          id: string
          label: string
          created_at: string
        }
        Insert: {
          id?: string
          label: string
          created_at?: string
        }
        Update: {
          id?: string
          label?: string
          created_at?: string
        }
      }
      user_interests: {
        Row: {
          id: string
          profile_id: string
          interest_id: string | null
          free_text_label: string | null
          created_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          interest_id?: string | null
          free_text_label?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          interest_id?: string | null
          free_text_label?: string | null
          created_at?: string
        }
      }
      sessions: {
        Row: {
          id: string
          user_id: string
          profile_id: string
          is_open: boolean
          location: string | null
          opened_at: string
          closes_at: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          profile_id: string
          is_open?: boolean
          location?: string | null
          opened_at?: string
          closes_at: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          profile_id?: string
          is_open?: boolean
          location?: string | null
          opened_at?: string
          closes_at?: string
          created_at?: string
        }
      }
      matches: {
        Row: {
          id: string
          user_a_id: string
          user_b_id: string
          session_a_id: string
          session_b_id: string
          shared_interests: string[]
          status: 'pending' | 'user_a_accepted' | 'user_b_accepted' | 'both_accepted' | 'declined' | 'expired'
          user_a_message: string | null
          user_b_message: string | null
          created_at: string
          expires_at: string
        }
        Insert: {
          id?: string
          user_a_id: string
          user_b_id: string
          session_a_id: string
          session_b_id: string
          shared_interests: string[]
          status?: 'pending' | 'user_a_accepted' | 'user_b_accepted' | 'both_accepted' | 'declined' | 'expired'
          user_a_message?: string | null
          user_b_message?: string | null
          created_at?: string
          expires_at: string
        }
        Update: {
          id?: string
          user_a_id?: string
          user_b_id?: string
          session_a_id?: string
          session_b_id?: string
          shared_interests?: string[]
          status?: 'pending' | 'user_a_accepted' | 'user_b_accepted' | 'both_accepted' | 'declined' | 'expired'
          user_a_message?: string | null
          user_b_message?: string | null
          created_at?: string
          expires_at?: string
        }
      }
      blocks: {
        Row: {
          id: string
          blocker_user_id: string
          blocked_user_id: string
          reason: string | null
          created_at: string
        }
        Insert: {
          id?: string
          blocker_user_id: string
          blocked_user_id: string
          reason?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          blocker_user_id?: string
          blocked_user_id?: string
          reason?: string | null
          created_at?: string
        }
      }
    }
  }
}

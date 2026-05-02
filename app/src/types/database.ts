/** 
 * Supabase Database type definitions
 * These types mirror the database schema and give us full type-safety
 * when querying Supabase from the client.
 */

export type UserRole = 'visitor' | 'member' | 'admin';
export type EventCategory = 'workshop' | 'competition' | 'seminar' | 'meetup' | 'other';
export type ProjectStatus = 'active' | 'completed' | 'archived';

export interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
  role: UserRole;
  ieee_member_id: string | null;
  skills: string[] | null;
  bio: string | null;
  joined_at: string;
  updated_at: string;
}

export interface Event {
  id: string;
  title: string;
  description: string | null;
  date: string;
  location: string | null;
  max_attendees: number | null;
  image_url: string | null;
  category: EventCategory;
  created_by: string | null;
  created_at: string;
}

export interface EventRegistration {
  id: string;
  event_id: string;
  user_id: string;
  registered_at: string;
}

export interface Project {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  github_url: string | null;
  video_url: string | null;
  team_members: string[] | null;
  technologies: string[] | null;
  status: ProjectStatus;
  created_by: string | null;
  created_at: string;
}

export interface Resource {
  id: string;
  title: string;
  description: string | null;
  file_url: string | null;
  category: string | null;
  members_only: boolean;
  uploaded_by: string | null;
  created_at: string;
}

// Supabase expects this shape for the generic createClient<Database>()
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Partial<Profile> & { id: string };
        Update: Partial<Profile>;
      };
      events: {
        Row: Event;
        Insert: Omit<Event, 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<Event>;
      };
      event_registrations: {
        Row: EventRegistration;
        Insert: Omit<EventRegistration, 'id' | 'registered_at'>;
        Update: Partial<EventRegistration>;
      };
      projects: {
        Row: Project;
        Insert: Omit<Project, 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<Project>;
      };
      resources: {
        Row: Resource;
        Insert: Omit<Resource, 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<Resource>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      user_role: UserRole;
      event_category: EventCategory;
      project_status: ProjectStatus;
    };
  };
}

import { VerificationStatus, UserRole, isVerificationStatus } from "./verification";

export interface Profile {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  location: string | null;
  created_at: string;
  updated_at: string;
  profile_completed: boolean | null;
  onboarding_step: string | null;
  verification_status: VerificationStatus;
  role: UserRole;
  points: number | null;
  is_admin: boolean | null;
  email_notifications: boolean | null;
  marketing_emails: boolean | null;
  security_emails: boolean | null;
  is_public: boolean | null;
  social_links: Record<string, string> | null | Json;
  custom_username: string | null;
  badge_style: string | null;
}

// Add Json type to handle Supabase JSONB
type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// Add a type guard to ensure profile data matches the Profile interface
export function isProfile(data: any): data is Profile {
  return (
    typeof data === 'object' &&
    data !== null &&
    typeof data.id === 'string' &&
    (data.verification_status === null || isVerificationStatus(data.verification_status))
  );
}
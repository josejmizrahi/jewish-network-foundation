import { VerificationStatus, UserRole } from "./verification";

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
}
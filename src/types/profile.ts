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
  verification_status: 'pending' | 'verified' | 'rejected';
  role: 'basic_member' | 'verified_member' | 'leader';
  points: number | null;
}
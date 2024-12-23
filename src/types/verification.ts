export type VerificationStatus = "pending" | "verified" | "rejected";
export type UserRole = "basic_member" | "verified_member" | "leader";

export interface VerificationCriteria {
  id: string;
  name: string;
  description: string;
  required: boolean;
  order_position: number;
  created_at: string;
  updated_at: string;
}

export interface VerificationRequest {
  id: string;
  user_id: string;
  status: "pending" | "approved" | "rejected";
  submitted_at: string;
  reviewed_at: string | null;
  reviewer_notes: string | null;
  documents: string[];
  criteria_met: string[];
  created_at: string;
  updated_at: string;
}
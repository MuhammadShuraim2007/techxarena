export type HackathonStatus = 'draft' | 'upcoming' | 'open' | 'closed' | 'live' | 'completed';
export type ModeType = 'In-Person (Karachi)' | 'Online / Hybrid' | 'In-Person (Karachi Campus)';
export type TeamType = 'individual' | 'team';
export type RegistrationStatus = 'registered' | 'confirmed' | 'attended' | 'winner' | 'disqualified' | 'cancelled';

export interface PrizeCategory {
  title: string;
  amount: string; // e.g. "PKR 100,000"
  description: string;
}

export interface TrackCategory {
  id: string;
  name: string;
  description: string;
  iconName?: string;
}

export interface TimelineItem {
  title: string;
  date: string;
  description: string;
  isCompleted?: boolean;
}

export interface Hackathon {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  bannerUrl: string;
  startDate: string;
  endDate: string;
  registrationStartDate: string;
  registrationEndDate: string;
  venue: string;
  mode: ModeType;
  maxParticipants: number;
  teamSizeLimit: number; // e.g. 1 to 4
  allowTeams: boolean;
  registrationFee?: string; // e.g. "PKR 200"
  prizes: PrizeCategory[];
  rules: string[];
  eligibility: string[];
  tracks: TrackCategory[];
  timeline: TimelineItem[];
  status: HackathonStatus;
  featured: boolean;
  organizer: string;
  createdAt: string;
  updatedAt: string;
}

export interface Registration {
  id: string; // Internal UUID
  hackathonId: string;
  hackathonTitle: string;
  hackathonIdCode: string; // e.g. TXA-ARENA-2026-0001
  fullName: string;
  fatherName: string;
  email: string;
  phone: string;
  whatsapp: string;
  city: string;
  institution: string;
  courseOrMajor: string; // FIT or other CS/IT background
  experienceLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  age: number;
  gender: 'Male' | 'Female' | 'Other' | 'Prefer not to say';
  teamType: TeamType;
  teamName?: string;
  roleInTeam?: string;
  teamMembersCount?: number;
  trackId: string;
  trackName: string;
  portfolioUrl?: string;
  cnicOrStudentId?: string;
  notes?: string;
  consentAccepted: boolean;
  registrationDate: string;
  status: RegistrationStatus;
  paymentMethod?: 'jazzcash' | 'campus_desk';
  paymentTransactionId?: string;
  paymentScreenshotUrl?: string;
  paymentStatus?: 'pending' | 'verified' | 'paid_on_campus';
  whatsappNotificationSent: boolean;
  whatsappMessageText?: string;
}

export interface Announcement {
  id: string;
  hackathonId: string;
  title: string;
  content: string;
  createdAt: string;
  author: string;
  important: boolean;
}

export interface AnalyticsData {
  totalHackathons: number;
  activeHackathons: number;
  totalRegistrations: number;
  registrationsThisWeek: number;
  registrationsByHackathon: { hackathonTitle: string; count: number }[];
  registrationsByTrack: { trackName: string; count: number }[];
  cityBreakdown: { city: string; count: number }[];
  statusBreakdown: { status: string; count: number }[];
  recentRegistrations: Registration[];
}

export interface AdminAuth {
  isAuthenticated: boolean;
  token?: string;
}

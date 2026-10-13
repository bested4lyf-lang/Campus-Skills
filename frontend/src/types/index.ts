// Shared TypeScript interfaces (The API Contract)

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

export interface StudentProfile {
  id: number;
  user: User;
  avatar?: string;
  bio: string;
  institution: string;
  phone_number?: string;
  skills: string[];
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
}

export interface ServiceListing {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  skill: string;
  provider: {
    id: number;
    username: string;
    avatar?: string;
  };
  image?: string;
  created_at: string;
}

export type RequestStatus = 'pending' | 'accepted' | 'rejected' | 'completed';

export interface ServiceRequest {
  id: number;
  service_id: number;
  service_title: string;
  customer: {
    id: number;
    username: string;
  };
  provider: {
    id: number;
    username: string;
  };
  status: RequestStatus;
  note: string;
  requested_at: string;
}

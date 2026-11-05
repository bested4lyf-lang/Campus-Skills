// Types for the My Services page.

export interface OwnService {
  id: string;
  title: string;
  category: string;
  skills: string[];
  price: number; // naira
  description: string;
  coverImageUrl?: string;
  rating: number | null; // null when there are no reviews yet
  reviewCount: number;
}

// What the create / edit form sends back
export interface ServiceFormValues {
  title: string;
  category: string;
  price: number;
  skills: string[];
  description: string;
  coverImage: File | null;
}

// Numbers and text shown in the profile card and the "One account, two roles" card
export interface ProfileSummary {
  bio: string;
  skills: string[];
  jobsDone: number;
  rating: number | null;
  pendingClientWork: number; // requests waiting for me as a provider
  totalHires: number; // services I requested as a customer
}
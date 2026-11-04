export interface ProfileListing {
  id: string;
  title: string;
  category: string;
  /** Naira */
  price: number;
  /** null when the listing has no reviews yet */
  rating: number | null;
  reviewCount: number;
}

export interface ProfileReview {
  id: string;
  reviewer: string;
  /** 1 to 5 */
  rating: number;
  comment: string;
  serviceTitle: string;
  /** True when the review comes from a completed request */
  verified: boolean;
}

export interface StudentProfile {
  id: string;
  fullName: string;
  department: string;
  /** e.g. "300 level" */
  level: string;
  bio: string;
  skills: string[];
  /** Ten digits after +234, e.g. "8035550142". Empty for everyone except the profile's owner */
  whatsapp: string;
  /** Image address or data URL. The profile shows initials when it is missing */
  photoUrl?: string;
  jobsDone: number;
  /** null until the student has a review */
  rating: number | null;
  reviewCount: number;
  listings: ProfileListing[];
  reviews: ProfileReview[];
}

/** The fields a student can change in the Edit profile popup */
export interface ProfileFormValues {
  department: string;
  level: string;
  bio: string;
  whatsapp: string;
  skills: string[];
  photoUrl?: string;
}
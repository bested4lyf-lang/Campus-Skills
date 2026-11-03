export interface ServiceImage {
  id: string;
  src: string;
  alt: string;
}

export interface ServiceReview {
  id: string;
  reviewer: string;
  rating: number;
  comment: string;
  /** True when the review comes from a completed request */
  verified: boolean;
}

export interface ServiceProviderDetail {
  id: string;
  name: string;
  /** e.g. "300L CompSci" */
  departmentLevel: string;
  bio: string;
  activeListings: number;
}

export interface ServiceDetail {
  id: string;
  title: string;
  category: string;
  description: string;
  /** Naira */
  price: number;
  /** e.g. "2-3 days" */
  turnaround: string;
  included: string[];
  images: ServiceImage[];
  provider: ServiceProviderDetail;
  /** null when the service has no reviews yet */
  rating: number | null;
  reviewCount: number;
  reviews: ServiceReview[];
  /** True when the signed-in student already has a pending or accepted request for this service */
  hasActiveRequest: boolean;
}

export interface RequestPayload {
  serviceId: string;
  brief: string;
  files: File[];
}
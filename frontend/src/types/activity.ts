export type RequestStatus = "pending" | "accepted" | "rejected" | "completed";

/** Client work: I am the provider. My hires: I am the customer. */
export type ActivityTab = "client-work" | "my-hires";

export interface RequestPerson {
  id: string;
  name: string;
  /** e.g. "Theatre Arts • 200L" */
  departmentLevel: string;
  /** International format. Only present once the request has been accepted */
  whatsapp?: string;
}

export interface RequestAttachment {
  id: string;
  name: string;
  kind: "image" | "pdf";
}

export interface ServiceRequest {
  id: string;
  status: RequestStatus;
  serviceTitle: string;
  /** Naira */
  price: number;
  requestedAt: string;
  neededBy: string;
  campusLocation: string;
  brief: string;
  attachments: RequestAttachment[];
  /** The other student: the customer in client work, the provider in my hires */
  person: RequestPerson;
  /** My hires only: true once the customer has left a review */
  reviewed: boolean;
}

export interface ReviewInput {
  /** 1 to 5 */
  rating: number;
  highlights: string[];
  comment: string;
}

export interface ActivityData {
  clientWork: ServiceRequest[];
  myHires: ServiceRequest[];
}
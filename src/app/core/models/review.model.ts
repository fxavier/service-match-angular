export interface Review {
  id: string;
  serviceId: string;
  bookingId: string;
  userId: string;
  author: ReviewAuthor;
  rating: number;
  comment: string;
  photos?: string[];
  helpful: number;
  response?: ProviderResponse;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewAuthor {
  id: string;
  name: string;
  avatar?: string;
}

export interface ProviderResponse {
  text: string;
  createdAt: string;
}
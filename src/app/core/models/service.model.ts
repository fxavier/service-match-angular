export interface Category {
  id: string;
  name: string;
  icon: string;
  description?: string;
  featured?: boolean;
}

export interface ServiceItem {
  id: string;
  title: string;
  categoryId: string;
  category?: Category;
  description: string;
  price: number;
  priceUnit: 'hour' | 'project' | 'visit';
  rating: number;
  reviewsCount: number;
  distanceKm: number;
  duration?: number;
  images: string[];
  tags: string[];
  providerId: string;
  provider?: Provider;
  featured?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceDetails extends ServiceItem {
  longDescription: string;
  features: string[];
  requirements?: string[];
  availability: string[];
  cancellationPolicy: string;
  warranty?: string;
}

export interface Provider {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  bio: string;
  skills: string[];
  rating: number;
  reviewsCount: number;
  completedJobs: number;
  responseTime: string;
  city: string;
  neighborhood: string;
  portfolio: PortfolioItem[];
  certifications: Certification[];
  verified: boolean;
  memberSince: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  images: string[];
  date: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  verified: boolean;
}
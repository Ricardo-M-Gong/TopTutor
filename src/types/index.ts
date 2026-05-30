export interface Tutor {
  id: string;
  name: string;
  avatar: string;
  subjects: string[];
  university: string;
  major: string;
  grade: string;
  hourlyRate: number;
  rating: number;
  reviewCount: number;
  bio: string;
  tags: string[];
  regions: string[];
  available: boolean;
}

export interface Testimonial {
  id: string;
  studentName: string;
  avatar: string;
  content: string;
  rating: number;
  subject: string;
}

export interface Subject {
  id: string;
  name: string;
  icon: string;
  tutorCount: number;
}

export interface Book {
  id: number;
  title: string;
  author: string;
  cover: string;
  rating: number;
  category: string;
  description?: string;
  publisher?: string;
  publicationDate?: string;
  pages?: number;
  authorInfo?: string;
}

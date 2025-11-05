export interface Book {
  id: string;
  volumeInfo: {
    title: string;
    authors: string[];
    publisher: string;
    publishedDate: string;
    description: string;
    categories?: string[];
    averageRating?: number;
    ratingsCount?: number;
    pageCount?: number;
    imageLinks?: {
      thumbnail: string;
      smallThumbnail: string;
    };
  };
}

export interface UserProfile {
  id: number;
  email: string;
  nickname: string;
  name?: string;
  bio: string;
  favoriteGenres: string[];
  readingGoal: number;
  readingAmount: number;
  readingStyle: string;
}

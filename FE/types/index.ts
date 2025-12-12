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

export interface LibraryBook {
  id: number;
  isbn: string;
  count: number;
  isRead: boolean | null;
  isRecom: boolean | null;
  createdAt: string;
}

// Book 인터페이스를 확장하여 LibraryBook의 속성을 포함하는 새로운 인터페이스 정의
export interface LibraryBookWithDetails extends Book {
  count: number;
  isRead: boolean | null;
  isRecom: boolean | null;
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

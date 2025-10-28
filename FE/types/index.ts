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

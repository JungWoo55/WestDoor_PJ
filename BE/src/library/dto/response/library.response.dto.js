/**
 * @description '내 서재 항목' 표준 응답 DTO
 * @property {string} id - 서재 항목의 고유 ID
 * @property {string} isbn - 도서 ISBN
 * @property {boolean} isRead - 읽은 책 여부
 * @property {boolean} isRecom - 추천 책 여부
 * @property {Date} createdAt - 추가된 날짜
 */
export class LibraryEntryResponseDto {
  constructor(entry) {
    this.id = entry.id;
    this.isbn = entry.isbn;
    this.isRead = entry.isRead;
    this.isRecom = entry.isRecom;
    this.createdAt = entry.createdAt;
  }
}

/**
 * @description '내 서재 목록' 조회 응답 DTO
 * @property {LibraryEntryResponseDto[]} books - 서재 항목(책) 리스트
 * @property {number} count - 항목 개수
 */
export class LibraryListResponseDto {
  constructor(entries) {
    // entries가 LibraryEntryResponseDto의 배열이라고 가정합니다.
    this.books = entries;
    this.count = entries.length;
  }
}

/**
 * @description '내 서재 책 삭제/수정' 응답 DTO
 * @property {LibraryEntryResponseDto | null} entry - 'updated'일 경우 변경된 항목의 현재 상태
 */
export class RemoveBookResponseDto {
  constructor({ status, entryData = null }) {
    if (status !== 'updated' && status !== 'deleted') {
      throw new Error("Status must be 'updated' or 'deleted'.");
    }
    
    this.status = status;
    // 'updated'일 때만 entry 데이터를 포함
    this.entry = (status === 'updated' && entryData) 
      ? new LibraryEntryResponseDto(entryData) 
      : null;
  }
}

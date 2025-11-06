import {findEntryByIsbn, updateEntryFlags, createEntry,deleteEntryById, findEntriesByUserId,findEntriesByUserIdAndCount, updateEntryCount}  from "../repository/library.repository.js";

/**
 * @description 서재에 도서 추가
 * 컨트롤러에서 {userId, addBookDto}를 받음
 * 1. 이미 책이 있는지 확인
 * 2. 있다면 -> 플래그 업데이트 (upsert 로직)
 * 3. 없다면 -> 새로 생성
 */
export const addBookToUserLibrary = async (userId, addBookDto) => {
    const {isbn, isRead, isRecom} = addBookDto;

    // 1. 이미 책이 있는지 확인
    const existingEntry = await findEntryByIsbn(userId, isbn);

    if (existingEntry) {
        // 2. 있다면 -> 플래그 업데이트 (upsert 로직)
        const updatedEntry = await updateEntryFlags(existingEntry.id,existingEntry.isbn, { isRead: isRead, isRecom: isRecom,});
        return updatedEntry;
    } else {
        // 3. 없다면 -> 새로 생성
        const newEntry = await createEntry({
            userId: userId,
            isbn: isbn,
            isRead: isRead,
            isRecom: isRecom,
        });
        return newEntry;
    }
};


/**
 * @description 서재에서 도서 삭제/수정
 * 컨트롤러에서 {userId, isbn, page}를 받음
 * 1. 책을 찾음 (없으면 404 에러)
 * 2. page에 따라 isRead 또는 isRecom 플래그를 false로 업데이트
 * 3. 업데이트 후, isRead와 isRecom가 모두 false이면 항목 삭제 (status : 'deleted' 반환)
 * 4. 그렇지 않으면 -> 항목 유지 (status : 'updated' 반환)
 */
export const removeBookFromUserLibrary = async (userId, isbn, page) => {
    // 1. 책을 찾음 (없으면 404 에러)
    const existingEntry = await findEntryByIsbn(userId, isbn);
    if (!existingEntry) {
        const error = new Error("서재에 해당 도서가 없습니다.");
        error.statusCode = 404;
        throw error;
    }
    // 2. page에 따라 해당 플래그를 false로 업데이트
    const dataToUpdate = {};
    if (page === 'isRead') {
        dataToUpdate.isRead = false;
    } else if (page === 'isRecom') {
        dataToUpdate.isRecom = false;
    }
    const updatedEntry = await updateEntryFlags(existingEntry.id, existingEntry.isbn, dataToUpdate);
    // 3. 업데이트 후, 두 플래그 모두 false인지 확인
    if (updatedEntry.isRead === false && updatedEntry.isRecom === false && updatedEntry.count < 1) {
        // 모두 false이면 항목 삭제
        await deleteEntryById(updatedEntry.id);
        return { status: 'deleted' };
    } else {
        // 4. 그렇지 않으면 -> 항목 유지
        return { status: 'updated', entryData: updatedEntry };
    }
};

/**
 * @description 서재 목록 조회
 * 컨트롤러에서 {userId, page}를 받음
 * 책 객체 배열 반환
 */
export const getLibraryList = async (userId, page) => {
    if (page === "isFinish") {
        const entries = await findEntriesByUserIdAndCount(userId);
        return entries;
    }
    
    const entries = await findEntriesByUserId(userId, page);
    
    return entries;
};

/**
 * @description 서쟈애 았는 도서 정독 횟수 증가
 * 컨트롤러에서 {readBookDto}를 받음
 * 1. 이미 책이 있는지 확인
 * 2. 있다면 -> 정독횟수 업데이트 (upsert 로직)
 * 3. 없다면 -> 404 Error
 */
export const readBookToUserLibrary = async (userId, readBookDto) => {
    const {isbn} = readBookDto;

    // 1. 이미 책이 있는지 확인
    const existingEntry = await findEntryByIsbn(userId, isbn);

    if (existingEntry) {
        // 2. 있다면 -> 정독 횟수 증가
        const updatedEntry = await updateEntryCount(existingEntry.id,existingEntry.isbn);
        return updatedEntry;
    } 
    else{
        const error = new Error("서재에 해당 도서가 없습니다.");
        error.statusCode = 404;
        throw error;
    }
};


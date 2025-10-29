import { prisma } from "../../db.config.js";

/* userId와 isbn으로 서재 항목 단일 조회 */
export const findEntryByIsbn = async (userId, isbn) => {
    return prisma.library.findFirst({
        where: {
            userId: userId,
            isbn: isbn,
        },
        orderBy: { created_at: "desc" },
    });
};

/* 서재 항목 생성 */
export const createEntry = async (data) => {
    return prisma.library.create({
        data: {
            userId: data.userId,
            isbn: data.isbn,
            isRead: data.isRead,
            isRecom: data.isRecom,
        },
    });
};

/* 
* 서재 항목의 플래그 (isRead, isRecom) 업데이트 
* data 예시 : { isRead: false } or { isRecom: false }
*/
export const updateEntryFlags = async (id, isbn, data) => { 
    const entryToUpdate = await prisma.library.findFirst({
        where: {
            id: id,
            isbn: isbn
        },
        select: {id: true}
    });
    if (!entryToUpdate){
        throw new Error("Library entry not found.");
    }

    const entryId = entryToUpdate.id;
    const updatedEntry = await prisma.library.update({
        where: {id: entryId},
        data: data
    });
    return updatedEntry;
};

/*
* Id로 서재 항목 삭제 
*/
export const deleteEntryById = async (id) => {
    return prisma.library.delete({
        where: { id },
    });
};

/*
* userIdd와 page 타입으로 '서재 항목 객체 리스트' 조회
*/
export const findEntriesByUserId = async (userId, page) => {
    if(!userId){
        console.error("findEntriesByUserId: userId is undefined!");
        return [];
    }
    const whereCondition = { userId: userId };

    if (page === 'isRead') {
        whereCondition.isRead = true;
    } else if (page === 'isRecom') {
        whereCondition.isRecom = true;
    }

    return prisma.library.findMany({
        where: whereCondition,
        orderBy: { created_at: "desc" },
    });
};
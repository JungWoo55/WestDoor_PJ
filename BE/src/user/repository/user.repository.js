import {prisma} from "../../config/prisma.js"
export const findUsers = async () => {
    const users = await prisma.user.findMany();
    return users;
};
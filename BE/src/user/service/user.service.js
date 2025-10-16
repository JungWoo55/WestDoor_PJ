import { findUsers as findUsersRepository } from "../repository/user.repository.js";

export const findUsers = async () => {
    const users = await findUsersRepository();
    return users;
};
import {findUsers as findUsersService} from "../service/user.service.js"
export const getUsers = async (req, res) => {
    try {
        const users = await findUsersService();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};
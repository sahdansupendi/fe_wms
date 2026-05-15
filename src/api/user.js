import api from "./axios";

export const getAllUsersApi = async () => {
    return await api.get("/users/getalluser");
};

export const getUserByUsernameApi = async (username) => {
    return await api.get("/users/getbyusername", {
        params: { username },
    });
};
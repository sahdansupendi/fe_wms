import api from "./axios";

export const getAllUsersApi = async () => {
    return await api.get("/users/all");
};

export const getUserByUsernameApi = async (username) => {
    return await api.get("/users", {
        params: { username },
    });
};

export const registerserApi = async (data) => {
    return await api.post("/users",data);
}

export const updateuserApi = async (data) => {
    return await api.put("/users", data);
}

export const  countusersApi = async () => {
    return await api.get("/users/count");
}

export const findmeApi = async () => {
    return await api.get("/users/me");
}
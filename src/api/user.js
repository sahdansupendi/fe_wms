import api from "./axios";

export const getAllUsersApi = async () => {
    return await api.get("/users/getalluser");
};

export const getUserByUsernameApi = async (username) => {
    return await api.get("/users/getbyusername");
}

export const registerserApi = async (data) => {
    return await api.post("/users/registeruser",data);
}

export const updateuserApi = async (data) => {
    return await api.put("/users/updateuser", data);
}

export const  countusersApi = async () => {
    return await api.get("/users/countusers");
}

export const findmeApi = async () => {
    return await api.get("/users/me");
}
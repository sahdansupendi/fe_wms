import api from "./axios";

export const getAllUsersApi = async () => {
    return await api.get("/users/getalluser");
};

export const getUserByUsernameApi = async (username) => {
    return await api.get("/users/getbyusername", {
        params: { username },
    });
};

export const registerserApi = async (data) => {
    return await api.post("/users/registeruser",data);
}

export const updateuserApi = async (userid,data) => {
    return await api.put("/users/updateuser",data, {
        params: {userid},
    });
};

export const  countusersApi = async (data) => {
    return await api.get("/users/countusers")
}
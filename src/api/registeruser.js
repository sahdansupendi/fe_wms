import api from "./axios.js"

export const registerserApi = async (data) => {
    return await api.post("/users/registeruser",data);
}
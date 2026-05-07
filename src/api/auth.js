import api from "./axios";

export const loginApi = async (data) => {
    return await api.post("/auth/login", data);
};

export const logoutApi = async () => {
    const  refreshToken = localStorage.getItem("refreshToken");

    return await api.post("/auth/logout",{},{
        headers: {
            "Refresh-Token": refreshToken,
        }
    });
};

export const refreshApi = async (refreshToken) => {
    return await api.post("/auth/refresh", {}, {
        headers: {
            "Refresh-Token" : refreshToken,
        },
    });
};
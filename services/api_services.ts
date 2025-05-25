import { EventEmitter } from "events";

const API_URL = "https://example.com/api";

export const ErrorModalEmitter = new EventEmitter();

const handleAxiosError = (error: any) => {
    let errorMessage = "An unknown error occurred";
    if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
    } else if (error.request) {
        errorMessage = "No response received from the server";
    } else {
        errorMessage = error.message;
    }

    ErrorModalEmitter.emit("SHOW_ERROR", errorMessage);
};

export const register = async (email: string, password: string) => {
    try {
        // const response = await axios.post(`${API_URL}/register`, {
        //     email,
        //     password,
        // });
        // return response.data;

        return {
            uid: "dummy-uid-123",
            email: email,
            token: "dummy-token-abc123"
        };
    } catch (error) {
        handleAxiosError(error);
        throw error;
    }
};

export const login = async (email: string, password: string) => {
    try {
        // const response = await axios.post(`${API_URL}/login`, {
        //     email,
        //     password,
        // });
        // return response.data;

        return {
            uid: "dummy-uid-123",
            email: email,
            token: "dummy-token-abc123"
        };
    } catch (error) {
        console.error("Error during login request:", error);
        handleAxiosError(error);
        throw error;
    }
};

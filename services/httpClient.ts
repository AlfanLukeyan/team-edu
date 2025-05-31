import { ModalEmitter } from "@/services/modalEmitter";
import { tokenService } from "@/services/tokenService";
import axios, { AxiosInstance, AxiosResponse } from 'axios';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

interface RequestConfig {
    headers?: Record<string, string>;
    timeout?: number;
}

class HttpClient {
    private static instance: HttpClient;
    private axiosInstance: AxiosInstance;
    private defaultTimeout = 10000;

    constructor() {
        this.axiosInstance = axios.create({
            baseURL: API_URL,
            timeout: this.defaultTimeout,
        });

        this.setupInterceptors();
    }

    static getInstance() {
        if (!HttpClient.instance) {
            HttpClient.instance = new HttpClient();
        }
        return HttpClient.instance;
    }

    private setupInterceptors() {
        // Request interceptor
        this.axiosInstance.interceptors.request.use(
            async (config) => {
                // Add auth token if needed (unless explicitly disabled)
                if (config.headers && !config.headers['skipAuth']) {
                    const token = await tokenService.getValidToken();
                    if (token) {
                        config.headers.Authorization = `Bearer ${token}`;
                    }
                }

                // Remove skipAuth flag
                if (config.headers) {
                    delete config.headers['skipAuth'];
                }

                return config;
            },
            (error) => Promise.reject(error)
        );

        // Response interceptor
        this.axiosInstance.interceptors.response.use(
            (response: AxiosResponse) => response,
            async (error) => {
                const { response } = error;

                if (response?.status === 401) {
                    await tokenService.clearTokens();
                    ModalEmitter.unauthorized();
                    throw new Error("Unauthorized");
                } else if (response?.status === 403) {
                    const errorData = response.data || {};

                    if (errorData.error === "Crucial verification required") {
                        const customError = new Error("Crucial verification required");
                        (customError as any).isCrucialRequired = true;
                        (customError as any).response = { status: response.status, data: errorData };
                        throw customError;
                    } else {
                        // Handle other 403 errors (like another device login)
                        await tokenService.clearTokens();
                        ModalEmitter.anotherDeviceLogin(errorData.msg);
                        throw new Error("Another device login detected");
                    }
                } else if (response) {
                    // Handle other HTTP errors
                    const message = response.data?.error || response.data?.message || `Request failed with status ${response.status}`;
                    ModalEmitter.showError(message);

                    const customError = new Error(message);
                    (customError as any).response = { status: response.status, data: response.data };
                    throw customError;
                } else if (error.code === 'ECONNABORTED') {
                    // Handle timeout
                    ModalEmitter.showError("Request timeout");
                    throw new Error('Request timeout');
                } else {
                    // Handle network errors
                    const message = error.message || "Network error";
                    ModalEmitter.showError(message);
                    throw error;
                }
            }
        );
    }

    async get<T = any>(url: string, config?: RequestConfig): Promise<T> {
        const response = await this.axiosInstance.get<T>(url, {
            headers: config?.headers,
            timeout: config?.timeout,
        });
        return response.data;
    }

    async post<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> {
        const headers: Record<string, string> = { ...config?.headers };

        const response = await this.axiosInstance.post<T>(url, data, {
            headers,
            timeout: config?.timeout,
        });
        return response.data;
    }

    async put<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> {
        const headers: Record<string, string> = { ...config?.headers };

        const response = await this.axiosInstance.put<T>(url, data, {
            headers,
            timeout: config?.timeout,
        });
        return response.data;
    }

    async delete<T = any>(url: string, config?: RequestConfig): Promise<T> {
        const response = await this.axiosInstance.delete<T>(url, {
            headers: config?.headers,
            timeout: config?.timeout,
        });
        return response.data;
    }

    // No auth requests
    async postNoAuth<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> {
        const headers: Record<string, string> = {
            ...config?.headers,
            skipAuth: 'true'
        };

        const response = await this.axiosInstance.post<T>(url, data, {
            headers,
            timeout: config?.timeout,
        });
        return response.data;
    }
}

export const httpClient = HttpClient.getInstance();
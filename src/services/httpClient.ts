import { crucialAuthManager } from "@/services/crucialAuthManager";
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
    public axiosInstance: AxiosInstance;
    private defaultTimeout = 30000;

    constructor() {
        console.log('HttpClient: Creating axios instance with baseURL:', API_URL);
        this.axiosInstance = axios.create({
            baseURL: API_URL,
            timeout: this.defaultTimeout,
        });

        this.setupInterceptors();
    }

    static getInstance() {
        if (!HttpClient.instance) {
            console.log('HttpClient: Creating new instance');
            HttpClient.instance = new HttpClient();
        }
        return HttpClient.instance;
    }

    private setupInterceptors() {
        console.log('HttpClient: Setting up interceptors');

        this.axiosInstance.interceptors.request.use(
            async (config) => {
                console.log('HttpClient: Request interceptor - URL:', config.url);
                const token = await tokenService.getValidToken();
                if (token) {
                    console.log('HttpClient: Adding authorization token to request');
                    config.headers.Authorization = `Bearer ${token}`;
                } else {
                    console.log('HttpClient: No token available for request');
                }
                return config;
            },
            (error) => {
                console.log('HttpClient: Request interceptor error:', error.message);
                return Promise.reject(error);
            }
        );

        this.axiosInstance.interceptors.response.use(
            (response: AxiosResponse) => {
                console.log('HttpClient: Response received - Status:', response.status, 'URL:', response.config.url);
                return response;
            },
            async (error) => {
                const { response, config } = error;
                console.log('HttpClient: Response error interceptor - Status:', response?.status, 'URL:', config?.url);

                if (response?.status === 401) {
                    console.log('HttpClient: 401 Unauthorized - Clearing tokens');
                    await tokenService.clearTokens();
                    ModalEmitter.unauthorized();
                    throw new Error("Unauthorized");
                } else if (response?.status === 403) {
                    const errorData = response.data || {};
                    console.log('HttpClient: 403 Forbidden - Error data:', errorData);

                    if (errorData.error === "CRUCIAL_FEATURE_AUTH_REQUIRED") {
                        console.log('HttpClient: Crucial feature auth required');
                        if (config?.headers?.['X-Crucial-Verified']) {
                            console.log('HttpClient: Crucial verification failed (already verified)');
                            throw new Error("Crucial verification failed");
                        }

                        try {
                            console.log('HttpClient: Requiring crucial auth');
                            return await crucialAuthManager.requireCrucialAuth(config);
                        } catch (crucialError) {
                            console.log('HttpClient: Crucial verification cancelled or failed');
                            throw new Error("Crucial verification required but cancelled");
                        }
                    } else {
                        console.log('HttpClient: Another device login detected');
                        await tokenService.clearTokens();
                        ModalEmitter.anotherDeviceLogin(errorData.msg);
                        throw new Error("Another device login detected");
                    }
                } else if (response) {
                    const message = response.data?.error || response.data?.message || `Request failed with status ${response.status}`;
                    console.log('HttpClient: Response error with status:', response.status, 'Message:', message);
                    ModalEmitter.showError(message);

                    const customError = new Error(message);
                    (customError as any).response = { status: response.status, data: response.data };
                    throw customError;
                } else if (error.code === 'ECONNABORTED') {
                    console.log('HttpClient: Request timeout');
                    ModalEmitter.showError("Request timeout");
                    throw new Error('Request timeout');
                } else {
                    const message = error.message || "Network error";
                    console.log('HttpClient: Network or other error:', message);
                    ModalEmitter.showError(message);
                    throw error;
                }
            }
        );
    }

    async get<T = any>(url: string, config?: RequestConfig): Promise<T> {
        console.log('HttpClient: GET request to:', url);
        const response = await this.axiosInstance.get<T>(url, config);
        return response.data;
    }

    async post<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> {
        console.log('HttpClient: POST request to:', url, 'with data:', data);
        const response = await this.axiosInstance.post<T>(url, data, config);
        return response.data;
    }

    async postFormData<T = any>(url: string, formData: FormData, config?: RequestConfig): Promise<T> {
        console.log('HttpClient: POST FormData request to:', url);
        const response = await this.axiosInstance.post<T>(url, formData, {
            ...config,
            headers: {
                'Content-Type': 'multipart/form-data',
                ...config?.headers,
            },
        });
        return response.data;
    }

    async putFormData<T = any>(url: string, formData: FormData, config?: RequestConfig): Promise<T> {
        console.log('HttpClient: PUT FormData request to:', url);
        const response = await this.axiosInstance.put<T>(url, formData, {
            ...config,
            headers: {
                'Content-Type': 'multipart/form-data',
                ...config?.headers,
            },
        });
        return response.data;
    }

    async put<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> {
        console.log('HttpClient: PUT request to:', url, 'with data:', data);
        const response = await this.axiosInstance.put<T>(url, data, config);
        return response.data;
    }

    async delete<T = any>(url: string, config?: RequestConfig): Promise<T> {
        console.log('HttpClient: DELETE request to:', url);
        const response = await this.axiosInstance.delete<T>(url, config);
        return response.data;
    }

    async deleteWithData<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> {
        console.log('HttpClient: DELETE request with data to:', url, 'with data:', data);
        const response = await this.axiosInstance.delete<T>(url, {
            ...config,
            data,
        });
        return response.data;
    }

    async postNoAuth<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> {
        console.log('HttpClient: POST request (no auth) to:', url, 'with data:', data);
        const configWithoutAuth = {
            ...config,
            headers: {
                ...config?.headers,
            },
        };
        delete configWithoutAuth.headers?.Authorization;

        const response = await this.axiosInstance.post<T>(url, data, configWithoutAuth);
        return response.data;
    }

    async postFormDataNoAuth<T = any>(url: string, formData: FormData, config?: RequestConfig): Promise<T> {
        console.log('HttpClient: POST FormData request (no auth) to:', url);
        const configWithoutAuth = {
            ...config,
            headers: {
                'Content-Type': 'multipart/form-data',
                ...config?.headers,
            },
        };
        delete (configWithoutAuth.headers as any)?.Authorization;

        const response = await this.axiosInstance.post<T>(url, formData, configWithoutAuth);
        return response.data;
    }
}

export const httpClient = HttpClient.getInstance();
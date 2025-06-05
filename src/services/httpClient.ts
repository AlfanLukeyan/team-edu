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
    public axiosInstance: AxiosInstance; // Made public for crucial auth retry
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
                const token = await tokenService.getValidToken();
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }

                console.log('🟡 API Request:', {
                    method: config.method?.toUpperCase(),
                    url: config.url,
                    fullUrl: `${config.baseURL}${config.url}`,
                    hasAuth: !!token,
                    timestamp: new Date().toISOString()
                });

                return config;
            },
            (error) => {
                console.error('🔴 Request Error:', error);
                return Promise.reject(error);
            }
        );

        // Response interceptor with global crucial auth handling
        this.axiosInstance.interceptors.response.use(
            (response: AxiosResponse) => {
                console.log('🟢 API Response Success:', {
                    method: response.config.method?.toUpperCase(),
                    url: response.config.url,
                    status: response.status,
                    statusText: response.statusText,
                    timestamp: new Date().toISOString()
                });
                return response;
            },
            async (error) => {
                const { response, config } = error;

                console.log('🔴 API Response Error:', {
                    method: config?.method?.toUpperCase(),
                    url: config?.url,
                    fullUrl: `${config?.baseURL}${config?.url}`,
                    status: response?.status,
                    statusText: response?.statusText,
                    data: response?.data,
                    timestamp: new Date().toISOString()
                });

                if (response?.status === 401) {
                    console.log('🚫 401 Unauthorized - Clearing tokens for:', config?.url);
                    await tokenService.clearTokens();
                    ModalEmitter.unauthorized();
                    throw new Error("Unauthorized");
                } else if (response?.status === 403) {
                    const errorData = response.data || {};

                    console.log('🚫 403 Forbidden - Details:', {
                        url: config?.url,
                        errorData,
                        isCrucialRequired: errorData.error === "CRUCIAL_FEATURE_AUTH_REQUIRED"
                    });

                    if (errorData.error === "CRUCIAL_FEATURE_AUTH_REQUIRED") {
                        console.log('🔐 Crucial verification required for:', config?.url);

                        // Check if this is already a retry after crucial auth
                        if (config?.headers?.['X-Crucial-Verified']) {
                            console.log('🚨 Crucial verification failed even after auth');
                            throw new Error("Crucial verification failed");
                        }

                        // Use the global crucial auth manager
                        try {
                            return await crucialAuthManager.requireCrucialAuth(config);
                        } catch (crucialError) {
                            throw new Error("Crucial verification required but cancelled");
                        }
                    } else {
                        console.log('🔄 Another device login detected for:', config?.url);
                        await tokenService.clearTokens();
                        ModalEmitter.anotherDeviceLogin(errorData.msg);
                        throw new Error("Another device login detected");
                    }
                } else if (response) {
                    // Handle other HTTP errors
                    const message = response.data?.error || response.data?.message || `Request failed with status ${response.status}`;
                    console.log('⚠️ HTTP Error:', {
                        url: config?.url,
                        status: response.status,
                        message,
                        data: response.data
                    });

                    ModalEmitter.showError(message);

                    const customError = new Error(message);
                    (customError as any).response = { status: response.status, data: response.data };
                    throw customError;
                } else if (error.code === 'ECONNABORTED') {
                    // Handle timeout
                    console.log('⏱️ Request timeout for:', config?.url);
                    ModalEmitter.showError("Request timeout");
                    throw new Error('Request timeout');
                } else {
                    // Handle network errors
                    const message = error.message || "Network error";
                    console.log('🌐 Network error for:', config?.url, message);
                    ModalEmitter.showError(message);
                    throw error;
                }
            }
        );
    }

    // HTTP method implementations remain the same
    async get<T = any>(url: string, config?: RequestConfig): Promise<T> {
        const response = await this.axiosInstance.get<T>(url, config);
        return response.data;
    }

    async post<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> {
        const response = await this.axiosInstance.post<T>(url, data, config);
        return response.data;
    }

    async postFormData<T = any>(url: string, formData: FormData, config?: RequestConfig): Promise<T> {
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
        const response = await this.axiosInstance.put<T>(url, data, config);
        return response.data;
    }

    async delete<T = any>(url: string, config?: RequestConfig): Promise<T> {
        const response = await this.axiosInstance.delete<T>(url, config);
        return response.data;
    }

    async deleteWithData<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> {
        const response = await this.axiosInstance.delete<T>(url, {
            ...config,
            data,
        });
        return response.data;
    }

    // No auth requests
    async postNoAuth<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> {
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
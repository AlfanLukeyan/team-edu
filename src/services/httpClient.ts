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
                // ✅ Log the API request being made
                console.log('🔵 API Request:', {
                    method: config.method?.toUpperCase(),
                    url: `${config.baseURL}${config.url}`,
                    fullUrl: config.url,
                    params: config.params,
                    timestamp: new Date().toISOString()
                });

                // Add auth token if needed (unless explicitly disabled)
                if (config.headers && !config.headers['skipAuth']) {
                    const token = await tokenService.getValidToken();
                    if (token) {
                        config.headers.Authorization = `Bearer ${token}`;
                        console.log('🔑 Token added to request for:', config.url);
                    } else {
                        console.log('⚠️ No token available for request:', config.url);
                    }
                }

                // Remove skipAuth flag
                if (config.headers) {
                    delete config.headers['skipAuth'];
                }

                return config;
            },
            (error) => {
                console.log('🔴 Request interceptor error:', error);
                return Promise.reject(error);
            }
        );

        // Response interceptor
        this.axiosInstance.interceptors.response.use(
            (response: AxiosResponse) => {
                // ✅ Log successful responses
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

                // ✅ Log detailed error information
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
                        isCrucialRequired: errorData.error === "Crucial verification required"
                    });

                    if (errorData.error === "Crucial verification required") {
                        console.log('🔐 Crucial verification required for:', config?.url);
                        const customError = new Error("Crucial verification required");
                        (customError as any).isCrucialRequired = true;
                        (customError as any).response = { status: response.status, data: errorData };
                        throw customError;
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

    async get<T = any>(url: string, config?: RequestConfig): Promise<T> {
        try {
            const response = await this.axiosInstance.get<T>(url, {
                headers: config?.headers,
                timeout: config?.timeout,
            });
            return response.data;
        } catch (error) {
            const errorMessage = (error instanceof Error) ? error.message : String(error);
            console.log('❌ GET request failed:', { url, error: errorMessage });
            throw error;
        }
    }

    async post<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> {
        try {
            const headers: Record<string, string> = { ...config?.headers };

            const response = await this.axiosInstance.post<T>(url, data, {
                headers,
                timeout: config?.timeout,
            });
            return response.data;
        } catch (error) {
            const errorMessage = (error instanceof Error) ? error.message : String(error);
            console.log('❌ POST request failed:', { url, error: errorMessage });
            throw error;
        }
    }

    async postFormData<T = any>(url: string, formData: FormData, config?: RequestConfig): Promise<T> {
        try {
            const headers: Record<string, string> = {
                ...config?.headers,
            };

            const response = await this.axiosInstance.post<T>(url, formData, {
                headers,
                timeout: config?.timeout || 30000,
            });
            return response.data;
        } catch (error) {
            const errorMessage = (error instanceof Error) ? error.message : String(error);
            console.log('❌ POST FormData request failed:', { url, error: errorMessage });
            throw error;
        }
    }

    async put<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> {
        try {
            const headers: Record<string, string> = { ...config?.headers };

            const response = await this.axiosInstance.put<T>(url, data, {
                headers,
                timeout: config?.timeout,
            });
            return response.data;
        } catch (error) {
            const errorMessage = (error instanceof Error) ? error.message : String(error);
            console.log('❌ PUT request failed:', { url, error: errorMessage });
            throw error;
        }
    }

    async delete<T = any>(url: string, config?: RequestConfig): Promise<T> {
        try {
            const response = await this.axiosInstance.delete<T>(url, {
                headers: config?.headers,
                timeout: config?.timeout,
            });
            return response.data;
        } catch (error) {
            const errorMessage = (error instanceof Error) ? error.message : String(error);
            console.log('❌ DELETE request failed:', { url, error: errorMessage });
            throw error;
        }
    }

    // No auth requests
    async postNoAuth<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> {
        try {
            const headers: Record<string, string> = {
                ...config?.headers,
                skipAuth: 'true'
            };

            const response = await this.axiosInstance.post<T>(url, data, {
                headers,
                timeout: config?.timeout,
            });
            return response.data;
        } catch (error) {
            const errorMessage = (error instanceof Error) ? error.message : String(error);
            console.log('❌ POST NoAuth request failed:', { url, error: errorMessage });
            throw error;
        }
    }
}

export const httpClient = HttpClient.getInstance();
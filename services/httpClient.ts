import { ModalEmitter } from "@/services/modalEmitter";
import { tokenService } from "@/services/tokenService";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

interface RequestConfig {
    headers?: Record<string, string>;
    timeout?: number;
}

class HttpClient {
    private static instance: HttpClient;
    private defaultTimeout = 10000;

    constructor() { }

    static getInstance() {
        if (!HttpClient.instance) {
            HttpClient.instance = new HttpClient();
        }
        return HttpClient.instance;
    }

    private async makeRequest<T = any>(
        url: string,
        options: RequestInit & { timeout?: number } = {},
        includeAuth: boolean = true
    ): Promise<T> {
        const { timeout = this.defaultTimeout, ...fetchOptions } = options;

        // Setup headers
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            ...(options.headers && typeof options.headers === 'object' && !(options.headers instanceof Headers) && !Array.isArray(options.headers) ? options.headers : {}),
        };

        // Add auth token if needed
        if (includeAuth) {
            const token = await tokenService.getValidToken();
            if (token) {
                headers.Authorization = `Bearer ${token}`;
            }
        }

        // Create abort controller for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        try {
            const response = await fetch(`${API_URL}${url}`, {
                ...fetchOptions,
                headers,
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            // Handle response errors
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));

                if (response.status === 401) {
                    await tokenService.clearTokens();
                    ModalEmitter.unauthorized();
                    throw new Error("Unauthorized");
                } else if (response.status === 403) {
                    if (errorData.error === "Crucial verification required") {
                        const error = new Error("Crucial verification required");
                        (error as any).isCrucialRequired = true;
                        (error as any).response = { status: response.status, data: errorData };
                        throw error;
                    } else {
                        // Handle other 403 errors (like another device login)
                        await tokenService.clearTokens();
                        ModalEmitter.anotherDeviceLogin(errorData.msg);
                        throw new Error("Another device login detected");
                    }
                } else {
                    // Handle other errors
                    const message = errorData.error || errorData.message || `Request failed with status ${response.status}`;
                    ModalEmitter.showError(message);

                    const error = new Error(message);
                    (error as any).response = { status: response.status, data: errorData };
                    throw error;
                }
            }

            // Parse response
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return await response.json();
            }
            return await response.text() as any;

        } catch (error: any) {
            clearTimeout(timeoutId);

            if (error.name === 'AbortError') {
                const timeoutError = new Error('Request timeout');
                ModalEmitter.showError("Request timeout");
                throw timeoutError;
            }

            if (!error.response && !error.isCrucialRequired) {
                const message = error.message || "Network error";
                ModalEmitter.showError(message);
            }

            throw error;
        }
    }

    async get<T = any>(url: string, config?: RequestConfig): Promise<T> {
        return this.makeRequest<T>(url, {
            method: 'GET',
            headers: config?.headers,
            timeout: config?.timeout,
        });
    }

    async post<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> {
        const isFormData = data instanceof FormData;
        const headers = { ...config?.headers };

        // Don't set Content-Type for FormData, let browser set it with boundary
        if (!isFormData) {
            headers['Content-Type'] = 'application/json';
        }

        return this.makeRequest<T>(url, {
            method: 'POST',
            body: isFormData ? data : JSON.stringify(data),
            headers,
            timeout: config?.timeout,
        });
    }

    async put<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> {
        const isFormData = data instanceof FormData;
        const headers = { ...config?.headers };

        if (!isFormData) {
            headers['Content-Type'] = 'application/json';
        }

        return this.makeRequest<T>(url, {
            method: 'PUT',
            body: isFormData ? data : JSON.stringify(data),
            headers,
            timeout: config?.timeout,
        });
    }

    async delete<T = any>(url: string, config?: RequestConfig): Promise<T> {
        return this.makeRequest<T>(url, {
            method: 'DELETE',
            headers: config?.headers,
            timeout: config?.timeout,
        });
    }

    // No auth requests
    async postNoAuth<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> {
        const isFormData = data instanceof FormData;
        const headers = { ...config?.headers };

        if (!isFormData) {
            headers['Content-Type'] = 'application/json';
        }

        return this.makeRequest<T>(url, {
            method: 'POST',
            body: isFormData ? data : JSON.stringify(data),
            headers,
            timeout: config?.timeout,
        }, false); // false = don't include auth
    }
}

export const httpClient = HttpClient.getInstance();
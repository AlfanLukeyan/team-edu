import { getGlobalCurrentPath } from '@/contexts/NavigationContext';
import { ModalEmitter } from '@/services/modalEmitter';
import { router } from 'expo-router';

interface PendingRequest {
    config: any;
    resolve: (value: any) => void;
    reject: (reason: any) => void;
}

class CrucialAuthManager {
    private static instance: CrucialAuthManager;
    private pendingRequest: PendingRequest | null = null;
    private isAuthInProgress = false;

    static getInstance(): CrucialAuthManager {
        if (!CrucialAuthManager.instance) {
            CrucialAuthManager.instance = new CrucialAuthManager();
        }
        return CrucialAuthManager.instance;
    }

    /**
     * Store a request that requires crucial auth and navigate to auth screen
     */
    requireCrucialAuth(config: any): Promise<any> {
        return new Promise((resolve, reject) => {
            if (this.isAuthInProgress) {
                reject(new Error('Crucial authentication already in progress'));
                return;
            }

            this.pendingRequest = { config, resolve, reject };
            this.isAuthInProgress = true;

            // Get current path for return navigation
            const currentPath = this.getCurrentPath();
            console.log('🔐 Requiring crucial auth, current path:', currentPath);
            ModalEmitter.hideLoading();

            router.push({
                pathname: '/(verification)/crucial_auth',
                params: {
                    callbackData: JSON.stringify({
                        returnPath: currentPath,
                        params: {}
                    })
                }
            });
        });
    }

    /**
     * Handle successful verification and retry the original request
     */
    async handleVerificationSuccess(httpClient: any): Promise<void> {
        if (!this.pendingRequest) {
            console.warn('No pending request found for crucial auth success');
            return;
        }

        console.log('✅ Crucial auth successful, retrying original request');

        try {
            ModalEmitter.showLoading("Processing request...");
            // Add a header to indicate this is a retry after crucial auth
            const retryConfig = {
                ...this.pendingRequest.config,
                headers: {
                    ...this.pendingRequest.config.headers,
                    'X-Crucial-Verified': 'true'
                }
            };

            // Retry the original request
            const response = await httpClient.axiosInstance.request(retryConfig);
            ModalEmitter.hideLoading();
            this.pendingRequest.resolve(response.data);
            console.log('✅ Original request completed successfully after crucial auth');
        } catch (error) {
            console.error('❌ Original request failed after crucial auth:', error);
            ModalEmitter.hideLoading();
            this.pendingRequest.reject(error);
        } finally {
            this.cleanup();
        }
    }

    /**
     * Handle verification failure
     */
    handleVerificationFailure(): void {
        if (!this.pendingRequest) {
            console.warn('No pending request found for crucial auth failure');
            return;
        }

        console.log('❌ Crucial auth failed or cancelled');
        ModalEmitter.hideLoading();
        this.pendingRequest.reject(new Error('Crucial verification cancelled'));
        this.cleanup();
    }

    /**
     * Check if there's a pending request
     */
    hasPendingRequest(): boolean {
        return this.pendingRequest !== null;
    }

    /**
     * Cleanup
     */
    private cleanup(): void {
        this.pendingRequest = null;
        this.isAuthInProgress = false;
        console.log('🧹 Crucial auth manager cleaned up');
    }

    /**
     * Get current path using global navigation context
     */
    private getCurrentPath(): string {
        const currentPath = getGlobalCurrentPath();
        console.log('📍 Current path from navigation context:', currentPath);

        // Return the current path or a sensible default
        return currentPath || '/(main)';
    }
}

export const crucialAuthManager = CrucialAuthManager.getInstance();
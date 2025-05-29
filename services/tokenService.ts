import { DecodedJWT } from "@/types/auth";
import * as SecureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode";
import { refreshTokens } from "./tokenRefreshService";

class TokenService {
    private static instance: TokenService;
    private accessToken: string | null = null;
    private refreshToken: string | null = null;
    private decoded: DecodedJWT | null = null;

    static getInstance() {
        if (!TokenService.instance) {
            TokenService.instance = new TokenService();
        }
        return TokenService.instance;
    }

    private isExpired(token: DecodedJWT): boolean {
        return Date.now() >= (token.exp - 300) * 1000; // 5min buffer
    }

    async storeTokens(accessToken: string, refreshToken: string, email: string): Promise<void> {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.decoded = jwtDecode(accessToken);

        await Promise.all([
            SecureStore.setItemAsync("access_token", accessToken),
            SecureStore.setItemAsync("refresh_token", refreshToken),
            SecureStore.setItemAsync("user_email", email),
            // Store decoded JWT data
            SecureStore.setItemAsync("user_uuid", this.decoded!.uuid),
            SecureStore.setItemAsync("user_permissions", JSON.stringify(this.decoded!.permissions)),
            SecureStore.setItemAsync("decoded_jwt", JSON.stringify(this.decoded)),
        ]);
    }

    async loadTokens(): Promise<boolean> {
        try {
            const [accessToken, refreshToken, decodedJWT] = await Promise.all([
                SecureStore.getItemAsync("access_token"),
                SecureStore.getItemAsync("refresh_token"),
                SecureStore.getItemAsync("decoded_jwt"),
            ]);

            if (!accessToken || !refreshToken) return false;

            this.accessToken = accessToken;
            this.refreshToken = refreshToken;
            
            // Load decoded JWT from secure store if available
            if (decodedJWT) {
                this.decoded = JSON.parse(decodedJWT);
            } else {
                // Fallback to decoding the token
                this.decoded = jwtDecode(accessToken);
            }
            
            return true;
        } catch {
            return false;
        }
    }

    async getValidToken(): Promise<string | null> {
        try {
            if (!this.accessToken) {
                if (!(await this.loadTokens())) return null;
            }

            if (this.decoded && this.isExpired(this.decoded)) {
                if (!(await this.refreshAccessToken())) return null;
            }

            return this.accessToken;
        } catch {
            return null;
        }
    }

    private async refreshAccessToken(): Promise<boolean> {
        try {
            if (!this.refreshToken) return false;

            const response = await refreshTokens(this.refreshToken);
            
            if (response.access_token) {
                this.accessToken = response.access_token;
                this.decoded = jwtDecode(response.access_token);
                
                // Update stored tokens and decoded data
                await Promise.all([
                    SecureStore.setItemAsync("access_token", response.access_token),
                    SecureStore.setItemAsync("user_uuid", this.decoded!.uuid),
                    SecureStore.setItemAsync("user_permissions", JSON.stringify(this.decoded!.permissions)),
                    SecureStore.setItemAsync("decoded_jwt", JSON.stringify(this.decoded)),
                ]);
                
                return true;
            }
            return false;
        } catch (error) {
            console.error('Token refresh failed:', error);
            return false;
        }
    }

    async clearTokens(): Promise<void> {
        this.accessToken = null;
        this.refreshToken = null;
        this.decoded = null;

        await Promise.all([
            SecureStore.deleteItemAsync("access_token").catch(() => {}),
            SecureStore.deleteItemAsync("refresh_token").catch(() => {}),
            SecureStore.deleteItemAsync("user_email").catch(() => {}),
            SecureStore.deleteItemAsync("user_uuid").catch(() => {}),
            SecureStore.deleteItemAsync("user_permissions").catch(() => {}),
            SecureStore.deleteItemAsync("decoded_jwt").catch(() => {}),
        ]);
    }

    getDecodedToken(): DecodedJWT | null {
        return this.decoded;
    }

    hasPermission(permission: string): boolean {
        return this.decoded?.permissions.includes(permission) || false;
    }

    getUserId(): string | null {
        return this.decoded?.uuid || null;
    }

    getUserEmail(): string | null {
        return this.decoded?.sub || null;
    }

    isTokenExpired(): boolean {
        return this.decoded ? this.isExpired(this.decoded) : true;
    }

    getUser(): DecodedJWT | null {
        return this.decoded;
    }

    // New helper methods to get data directly from secure store
    async getStoredUuid(): Promise<string | null> {
        try {
            return await SecureStore.getItemAsync("user_uuid");
        } catch {
            return null;
        }
    }

    async getStoredPermissions(): Promise<string[]> {
        try {
            const permissions = await SecureStore.getItemAsync("user_permissions");
            return permissions ? JSON.parse(permissions) : [];
        } catch {
            return [];
        }
    }
}

export const tokenService = TokenService.getInstance();
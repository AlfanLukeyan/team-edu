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
        return Date.now() >= (token.exp - 300) * 1000;
    }

    async storeTokens(accessToken: string, refreshToken: string, email: string): Promise<void> {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.decoded = jwtDecode(accessToken);

        const storeOperations = [
            SecureStore.setItemAsync("access_token", accessToken),
            SecureStore.setItemAsync("refresh_token", refreshToken),
            SecureStore.setItemAsync("user_email", email),
            SecureStore.setItemAsync("decoded_jwt", JSON.stringify(this.decoded)),
        ];

        const userId = this.decoded?.uuid || this.decoded?.sub;
        if (userId) {
            storeOperations.push(SecureStore.setItemAsync("user_uuid", userId));
        }

        if (this.decoded?.role_id !== undefined) {
            storeOperations.push(SecureStore.setItemAsync("user_role_id", this.decoded.role_id.toString()));
        }

        if (this.decoded?.permissions) {
            storeOperations.push(SecureStore.setItemAsync("user_permissions", JSON.stringify(this.decoded.permissions)));
        }

        await Promise.all(storeOperations);
    }

    async loadTokens(): Promise<boolean> {
        try {
            const [accessToken, refreshToken, decodedJWT, storedRoleId] = await Promise.all([
                SecureStore.getItemAsync("access_token"),
                SecureStore.getItemAsync("refresh_token"),
                SecureStore.getItemAsync("decoded_jwt"),
                SecureStore.getItemAsync("user_role_id"),
            ]);

            if (!accessToken || !refreshToken) return false;

            this.accessToken = accessToken;
            this.refreshToken = refreshToken;

            if (decodedJWT) {
                this.decoded = JSON.parse(decodedJWT);
                if (this.decoded && this.decoded.role_id === undefined && storedRoleId) {
                    this.decoded.role_id = parseInt(storedRoleId);
                }
            } else {
                this.decoded = jwtDecode(accessToken);
                if (this.decoded && this.decoded.role_id === undefined && storedRoleId) {
                    this.decoded.role_id = parseInt(storedRoleId);
                }
            }

            return true;
        } catch (error) {
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
        } catch (error) {
            return null;
        }
    }

    private async refreshAccessToken(): Promise<boolean> {
        try {
            if (!this.refreshToken) return false;

            const response = await refreshTokens(this.refreshToken);

            if (response.access_token) {
                const oldUuid = this.decoded?.uuid;
                const oldRoleId = this.decoded?.role_id;

                this.accessToken = response.access_token;
                this.decoded = jwtDecode(response.access_token);

                if (this.decoded && !this.decoded.uuid && oldUuid) {
                    this.decoded.uuid = oldUuid;
                }
                if (this.decoded && this.decoded.role_id === undefined && oldRoleId !== undefined) {
                    this.decoded.role_id = oldRoleId;
                }

                const updateOperations = [
                    SecureStore.setItemAsync("access_token", response.access_token),
                    SecureStore.setItemAsync("decoded_jwt", JSON.stringify(this.decoded)),
                ];

                const userId = this.decoded?.uuid || this.decoded?.sub;
                if (userId) {
                    updateOperations.push(SecureStore.setItemAsync("user_uuid", userId));
                }

                if (this.decoded?.role_id !== undefined) {
                    updateOperations.push(SecureStore.setItemAsync("user_role_id", this.decoded.role_id.toString()));
                }

                if (this.decoded?.permissions) {
                    updateOperations.push(SecureStore.setItemAsync("user_permissions", JSON.stringify(this.decoded.permissions)));
                }

                await Promise.all(updateOperations);
                return true;
            }
            return false;
        } catch (error) {
            return false;
        }
    }

    async clearTokens(): Promise<void> {
        this.accessToken = null;
        this.refreshToken = null;
        this.decoded = null;

        await Promise.all([
            SecureStore.deleteItemAsync("access_token").catch(() => { }),
            SecureStore.deleteItemAsync("refresh_token").catch(() => { }),
            SecureStore.deleteItemAsync("user_email").catch(() => { }),
            SecureStore.deleteItemAsync("user_uuid").catch(() => { }),
            SecureStore.deleteItemAsync("user_role_id").catch(() => { }),
            SecureStore.deleteItemAsync("user_permissions").catch(() => { }),
            SecureStore.deleteItemAsync("decoded_jwt").catch(() => { }),
        ]);
    }

    getUserRole(): number {
        return this.decoded?.role_id || 4;
    }

    async getStoredRole(): Promise<number> {
        try {
            const storedRole = await SecureStore.getItemAsync("user_role_id");
            return storedRole ? parseInt(storedRole) : this.getUserRole();
        } catch {
            return this.getUserRole();
        }
    }

    isAdmin(): boolean {
        return this.getUserRole() === 1;
    }

    isTeacher(): boolean {
        return this.getUserRole() === 2;
    }

    isStudent(): boolean {
        return this.getUserRole() === 3;
    }

    isGuest(): boolean {
        return this.getUserRole() === 4;
    }

    hasTeacherPermissions(): boolean {
        return this.isAdmin() || this.isTeacher();
    }

    canCreateContent(): boolean {
        return this.hasTeacherPermissions();
    }

    canManageClass(): boolean {
        return this.isAdmin() || this.isTeacher();
    }

    canManageUsers(): boolean {
        return this.isAdmin();
    }

    getUserId(): string | null {
        return this.decoded?.uuid || this.decoded?.sub || null;
    }

    getUserEmail(): string | null {
        return this.decoded?.sub || null;
    }

    getDecodedToken(): DecodedJWT | null {
        return this.decoded;
    }

    getUser(): DecodedJWT | null {
        return this.decoded;
    }

    hasPermission(permission: string): boolean {
        return this.decoded?.permissions?.includes(permission) || false;
    }

    getPermissions(): string[] {
        return this.decoded?.permissions || [];
    }

    isTokenExpired(): boolean {
        return this.decoded ? this.isExpired(this.decoded) : true;
    }

    isAuthenticated(): boolean {
        return !!(this.accessToken && this.decoded && !this.isExpired(this.decoded));
    }

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

    async getStoredEmail(): Promise<string | null> {
        try {
            return await SecureStore.getItemAsync("user_email");
        } catch {
            return null;
        }
    }

    getRoleText(): string {
        const role = this.getUserRole();
        switch (role) {
            case 1: return 'Admin';
            case 2: return 'Teacher';
            case 3: return 'Student';
            case 4: return 'Guest';
            default: return 'Guest';
        }
    }

    async debugTokenInfo(): Promise<void> { }
}

export const tokenService = TokenService.getInstance();

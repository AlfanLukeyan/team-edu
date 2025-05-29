import { UserProfile } from "@/types/user";
import { userApi } from "./api/userApi";

interface UpdateProfileRequest {
    name: string;
    phone: string;
}

class UserService {
    private static instance: UserService;

    static getInstance() {
        if (!UserService.instance) {
            UserService.instance = new UserService();
        }
        return UserService.instance;
    }

    async getProfile(): Promise<UserProfile> {
        try {
            const profile = await userApi.getProfile();
            return profile;
        } catch (error) {
            throw error;
        }
    }

    async updateProfile(data: UpdateProfileRequest): Promise<any> {
        try {
            return await userApi.updateProfile(data);
        } catch (error) {
            throw error;
        }
    }

    async updateEmail(email: string): Promise<any> {
        try {
            return await userApi.updateEmail(email);
        } catch (error) {
            throw error;
        }
    }

    async updateProfilePicture(formData: FormData): Promise<any> {
        try {
            return await userApi.updateProfilePicture(formData);
        } catch (error) {
            throw error;
        }
    }

    getRoleText(roleId?: number): string {
        switch (roleId) {
            case 1: return 'Admin';
            case 2: return 'Teacher';
            case 3: return 'Student';
            case 4: return 'Guest';
            default: return 'Guest';
        }
    }

    formatJoinDate(createdAt: string): string {
        return new Date(createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    isProfileComplete(profile: UserProfile): boolean {
        return !!(profile.name && profile.email && profile.phone);
    }
}

export const userService = UserService.getInstance();
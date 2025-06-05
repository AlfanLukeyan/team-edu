import { ModalEmitter } from "@/services/modalEmitter";
import { userService } from "@/services/userService";
import { Role, UserByRole } from "@/types/api";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";

export const useUserManagement = () => {
    const router = useRouter();
    const params = useLocalSearchParams();

    const [users, setUsers] = useState<UserByRole[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
    const [filterRole, setFilterRole] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedUserForActions, setSelectedUserForActions] = useState<UserByRole | null>(null);
    const [changingRoleUserId, setChangingRoleUserId] = useState<string | null>(null);

    const fetchRoles = useCallback(async () => {
        try {
            const rolesData = await userService.getAllRoles();
            setRoles(rolesData);
        } catch (err: any) {
            console.error('Failed to fetch roles:', err);
            ModalEmitter.showError('Failed to fetch roles');
        }
    }, []);

    const fetchUsers = useCallback(async (isRefresh: boolean = false, search?: string, roleFilter?: number | null) => {
        try {
            setError(null);
            if (isRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            let allUsers: UserByRole[] = [];

            if (search) {
                // Use backend search
                const searchParams: { name?: string; role_id?: number } = { name: search };
                if (roleFilter) {
                    searchParams.role_id = roleFilter;
                }
                allUsers = await userService.searchUsers(searchParams);
            } else if (roleFilter) {
                // Filter by role only
                allUsers = await userService.getUsersByRole(roleFilter);
            } else {
                // Get all users
                allUsers = await userService.getAllUsers();
            }

            setUsers(allUsers);
        } catch (err: any) {
            console.error('Failed to fetch users:', err);
            setError(err.message || 'Failed to fetch users');
            ModalEmitter.showError(err.message || 'Failed to fetch users');
        } finally {
            setLoading(false);
            setRefreshing(false);
            setIsSearching(false);
        }
    }, []);

    const refetchUsers = useCallback(() => {
        fetchUsers(true, searchQuery, filterRole);
    }, [fetchUsers, searchQuery, filterRole]);

    // Simple input handler - only updates local state
    const handleInputChange = useCallback((text: string) => {
        setSearchInput(text);
    }, []);

    // Execute search only when user submits
    const handleSearch = useCallback(async (query: string) => {
        console.log('Executing search for:', query);
        setSearchQuery(query);
        setIsSearching(true);
        await fetchUsers(false, query, filterRole);
    }, [fetchUsers, filterRole]);

    const toggleSearch = useCallback(() => {
        const newShowSearch = !showSearch;
        setShowSearch(newShowSearch);

        if (!newShowSearch && (searchQuery || searchInput)) {
            setSearchQuery('');
            setSearchInput('');
            fetchUsers(false, '', filterRole);
        }
    }, [showSearch, searchQuery, searchInput, filterRole, fetchUsers]);

    const clearSearch = useCallback(() => {
        setSearchInput('');
        setSearchQuery('');
        fetchUsers(false, '', filterRole);
    }, [filterRole, fetchUsers]);

    const handleFilterRole = useCallback((roleId: number | null) => {
        setFilterRole(roleId);
        setSelectedUsers(new Set());
        // Re-fetch with current search query and new role filter
        fetchUsers(false, searchQuery, roleId);
    }, [searchQuery, fetchUsers]);

    const handleUserSelect = useCallback((userId: string) => {
        setSelectedUsers(prev => {
            const newSet = new Set(prev);
            if (newSet.has(userId)) {
                newSet.delete(userId);
            } else {
                newSet.add(userId);
            }
            return newSet;
        });
    }, []);

    const handleSelectAll = useCallback(() => {
        if (selectedUsers.size === users.length) {
            setSelectedUsers(new Set());
        } else {
            setSelectedUsers(new Set(users.map(user => user.uuid)));
        }
    }, [users, selectedUsers.size]);

    const handleClearSelection = useCallback(() => {
        setSelectedUsers(new Set());
    }, []);

    const handleUserPress = useCallback((userId: string) => {
        console.log('User pressed:', userId);
    }, []);

    const handleRoleChange = useCallback(async (userId: string, newRoleId: string) => {
        try {
            setChangingRoleUserId(userId);

            await userService.modifyUserRole(userId, newRoleId);

            // Update local state
            setUsers(prev => prev.map(user =>
                user.uuid === userId
                    ? { ...user, role_id: parseInt(newRoleId) }
                    : user
            ));

            ModalEmitter.showSuccess('User role updated successfully');
        } catch (error: any) {
            console.error('Failed to update user role:', error);
            ModalEmitter.showError(error.message || 'Failed to update user role');
        } finally {
            setChangingRoleUserId(null);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
        fetchRoles();
    }, [fetchUsers, fetchRoles]);

    const handleMoreActions = useCallback((user: UserByRole) => {
        setSelectedUserForActions(user);
    }, []);

    const handleDeleteUser = useCallback(async (userId: string) => {
        try {
            await userService.deleteUser(userId);

            setUsers(prev => prev.filter(user => user.uuid !== userId));
            ModalEmitter.showSuccess('User deleted successfully');
        } catch (error: any) {
            console.error('Failed to delete user:', error);
            ModalEmitter.showError(error.message || 'Failed to delete user');
        }
    }, []);

    const handleInjectCrucialToken = useCallback(async (userIndex: number) => {
        try {
            const response = await userService.injectCrucialToken(userIndex);
            ModalEmitter.showSuccess(response.message || 'Crucial token injected successfully');
        } catch (err: any) {
            console.error('Failed to inject crucial token:', err);
            ModalEmitter.showError(err.message || 'Failed to inject crucial token');
        }
    }, []);

    const handleDeleteCrucialToken = useCallback(async (userIndex: number) => {
        try {
            const response = await userService.deleteCrucialToken(userIndex);
            ModalEmitter.showSuccess(response.message || 'Crucial token deleted successfully');
        } catch (err: any) {
            console.error('Failed to delete crucial token:', err);
            ModalEmitter.showError(err.message || 'Failed to delete crucial token');
        }
    }, []);

    const handleVerifyEmailUser = useCallback(async (uuid: string) => {
        try {
            const response = await userService.verifyEmailUser(uuid);

            // Update local state to reflect email verification
            setUsers(prev => prev.map(user =>
                user.uuid === uuid
                    ? { ...user, is_verified: true }
                    : user
            ));

            ModalEmitter.showSuccess(response.message || 'User email verified successfully');
        } catch (err: any) {
            console.error('Failed to verify user email:', err);
            ModalEmitter.showError(err.message || 'Failed to verify user email');
        }
    }, []);


    return {
        users,
        roles,
        loading,
        refreshing,
        error,
        selectedUsers,
        filterRole,
        searchQuery,
        searchInput,
        showSearch,
        isSearching,
        selectedUserForActions,
        changingRoleUserId,
        refetchUsers,
        handleInputChange,
        handleSearch,
        toggleSearch,
        clearSearch,
        handleFilterRole,
        handleUserSelect,
        handleSelectAll,
        handleClearSelection,
        handleUserPress,
        handleRoleChange,
        handleMoreActions,
        handleDeleteUser,
        setSelectedUserForActions,
        handleInjectCrucialToken,
        handleDeleteCrucialToken,
        handleVerifyEmailUser,
    };
};
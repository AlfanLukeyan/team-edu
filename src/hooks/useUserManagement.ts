import { ModalEmitter } from "@/services/modalEmitter";
import { userService } from "@/services/userService";
import { UserByRole } from "@/types/api";
import { useCallback, useEffect, useState } from "react";

export const useUserManagement = () => {
    const [users, setUsers] = useState<UserByRole[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
    const [filterRole, setFilterRole] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchUsers = useCallback(async (isRefresh: boolean = false) => {
        try {
            setError(null);
            if (isRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            let allUsers: UserByRole[] = [];

            if (filterRole) {
                allUsers = await userService.getUsersByRole(filterRole);
            } else {
                const [admins, teachers, students] = await Promise.all([
                    userService.getAdmins(),
                    userService.getTeachers(),
                    userService.getStudents()
                ]);
                allUsers = [...admins, ...teachers, ...students];
            }

            if (searchQuery) {
                allUsers = allUsers.filter(user =>
                    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    user.email.toLowerCase().includes(searchQuery.toLowerCase())
                );
            }

            setUsers(allUsers);
        } catch (err: any) {
            console.error('Failed to fetch users:', err);
            setError(err.message || 'Failed to fetch users');
            ModalEmitter.showError(err.message || 'Failed to fetch users');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [filterRole, searchQuery]);

    const refetchUsers = useCallback(() => {
        fetchUsers(true);
    }, [fetchUsers]);

    const handleSearch = useCallback((query: string) => {
        setSearchQuery(query);
    }, []);

    const handleFilterRole = useCallback((roleId: number | null) => {
        setFilterRole(roleId);
        setSelectedUsers(new Set());
    }, []);

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

    const getFilteredUsers = useCallback(() => {
        return users;
    }, [users]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    return {
        users: getFilteredUsers(),
        loading,
        refreshing,
        error,
        selectedUsers,
        filterRole,
        searchQuery,
        refetchUsers,
        handleSearch,
        handleFilterRole,
        handleUserSelect,
        handleSelectAll,
        handleClearSelection,
        handleUserPress,
    };
};
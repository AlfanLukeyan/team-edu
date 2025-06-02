import React from 'react';
import ActionMenu, { ActionMenuItem } from './ActionMenu';

interface ProfileActionMenuProps {
    visible: boolean;
    onClose: () => void;
    onEditProfile: () => void;
    onChangeFaceReference: () => void;
    onLogout: () => void;
    isLoggingOut: boolean;
}

const ProfileActionMenu: React.FC<ProfileActionMenuProps> = ({
    visible,
    onClose,
    onEditProfile,
    onChangeFaceReference,
    onLogout,
    isLoggingOut
}) => {
    const menuItems: ActionMenuItem[] = [
        {
            id: 'edit-profile',
            title: 'Edit Profile',
            icon: 'create-outline',
            onPress: onEditProfile,
        },
        {
            id: 'change-face-reference',
            title: 'Change Face Reference',
            icon: 'camera-outline',
            onPress: onChangeFaceReference,
        },
        {
            id: 'logout',
            title: isLoggingOut ? 'Logging out...' : 'Log Out',
            icon: 'log-out-outline',
            onPress: onLogout,
            destructive: true,
            disabled: isLoggingOut,
        },
    ];

    return (
        <ActionMenu
            visible={visible}
            onClose={onClose}
            items={menuItems}
            position="top-right"
        />
    );
};

export default ProfileActionMenu;
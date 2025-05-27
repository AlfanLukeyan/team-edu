import React from 'react';
import ActionMenu, { ActionMenuItem } from './ActionMenu';

interface QuestionActionsMenuProps {
    visible: boolean;
    onClose: () => void;
    onEdit: () => void;
    onDelete: () => void;
    onSelectAll: () => void;
}

const QuestionActionsMenu: React.FC<QuestionActionsMenuProps> = ({
    visible,
    onClose,
    onEdit,
    onDelete,
    onSelectAll
}) => {
    const menuItems: ActionMenuItem[] = [
        {
            id: 'select-all',
            title: 'Select All',
            icon: 'checkmark-circle-outline',
            onPress: onSelectAll,
        },
        {
            id: 'edit',
            title: 'Edit',
            icon: 'create-outline',
            onPress: onEdit,
        },
        {
            id: 'delete',
            title: 'Delete',
            icon: 'trash-outline',
            onPress: onDelete,
            destructive: true,
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

export default QuestionActionsMenu;
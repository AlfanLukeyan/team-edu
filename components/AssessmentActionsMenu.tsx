import React from 'react';
import ActionMenu, { ActionMenuItem } from './ActionMenu';

interface AssessmentActionsMenuProps {
    visible: boolean;
    onClose: () => void;
    onDelete: () => void;
    onEdit: () => void;
    onSelectAll: () => void;
    selectedCount: number;
}

const AssessmentActionsMenu: React.FC<AssessmentActionsMenuProps> = ({
    visible,
    onClose,
    onDelete,
    onEdit,
    onSelectAll,
    selectedCount
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
            title: selectedCount === 1 ? 'Edit' : 'Edit Multiple',
            icon: 'create-outline',
            onPress: onEdit,
            disabled: selectedCount === 0,
        },
        {
            id: 'delete',
            title: 'Delete',
            icon: 'trash-outline',
            onPress: onDelete,
            destructive: true,
            disabled: selectedCount === 0,
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

export default AssessmentActionsMenu;
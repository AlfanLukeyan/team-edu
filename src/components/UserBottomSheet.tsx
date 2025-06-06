import { Button } from "@/components/Button";
import { Dropdown } from "@/components/Dropdown";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { userService } from "@/services/userService";
import { Role, UserByRole } from "@/types/api";
import {
    BottomSheetBackdrop,
    BottomSheetBackdropProps,
    BottomSheetModal,
    BottomSheetView,
    useBottomSheetModal,
} from "@gorhom/bottom-sheet";
import {
    forwardRef,
    useCallback,
    useImperativeHandle,
    useMemo,
    useRef,
    useState,
} from "react";
import { StyleSheet, View } from "react-native";

export interface UserBottomSheetRef {
    open: (user: UserByRole) => void;
    close: () => void;
}

interface UserBottomSheetProps {
    roles: Role[];
    onRoleChange: (userId: string, roleId: string) => void;
    onDeleteUser?: (userId: string) => void;
    onInjectCrucialToken?: (userIndex: number) => void;
    onDeleteCrucialToken?: (userIndex: number) => void;
    onVerifyEmailUser?: (userId: string) => void;
    onClose?: () => void;
    changingRoleUserId?: string | null;
}

const UserBottomSheet = forwardRef<
    UserBottomSheetRef,
    UserBottomSheetProps
>(({ roles, onRoleChange, onDeleteUser, onInjectCrucialToken, onDeleteCrucialToken, onVerifyEmailUser, onClose, changingRoleUserId }, ref) => {
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const { dismiss } = useBottomSheetModal();
    const theme = useColorScheme() || "light";
    const snapPoints = useMemo(() => ["25%", "50%"], []);

    const [selectedUser, setSelectedUser] = useState<UserByRole | null>(null);
    const isChangingRole = changingRoleUserId === selectedUser?.uuid;

    const handleClose = useCallback(() => {
        setSelectedUser(null);
        if (onClose) onClose();
        dismiss();
    }, [onClose, dismiss]);

    const handleOpen = useCallback((user: UserByRole) => {
        console.log("Opening user bottom sheet for:", user);
        setSelectedUser(user);
        bottomSheetModalRef.current?.present();
    }, []);

    const handleRoleSelect = useCallback((item: any) => {
        if (selectedUser && item.value !== selectedUser.role_id.toString()) {
            onRoleChange(selectedUser.uuid, item.value);
        }
    }, [selectedUser, onRoleChange]);

    const handleInjectCrucialToken = useCallback(() => {
        if (selectedUser && onInjectCrucialToken) {
            onInjectCrucialToken(selectedUser.id);
        }
    }, [selectedUser, onInjectCrucialToken]);

    const handleDeleteCrucialToken = useCallback(() => {
        if (selectedUser && onDeleteCrucialToken) {
            onDeleteCrucialToken(selectedUser.id);
        }
    }, [selectedUser, onDeleteCrucialToken]);

    const handleVerifyEmailUser = useCallback(() => {
        if (selectedUser && onVerifyEmailUser) {
            onVerifyEmailUser(selectedUser.uuid);
        }
    }, [selectedUser, onVerifyEmailUser]);

    const handleDeletePress = useCallback(() => {
        if (selectedUser && onDeleteUser) {
            onDeleteUser(selectedUser.uuid);
            handleClose();
        }
    }, [selectedUser, onDeleteUser, handleClose]);

    const renderBackdrop = useCallback(
        (props: BottomSheetBackdropProps) => (
            <BottomSheetBackdrop
                {...props}
                disappearsOnIndex={-1}
                appearsOnIndex={0}
                opacity={0.5}
            />
        ),
        []
    );

    const roleDropdownItems = useMemo(() =>
        roles.map(role => ({
            label: role.name.charAt(0).toUpperCase() + role.name.slice(1),
            value: role.id.toString(),
        })), [roles]
    );

    useImperativeHandle(ref, () => ({
        open: handleOpen,
        close: handleClose
    }));

    if (!selectedUser) return null;

    return (
        <BottomSheetModal
            ref={bottomSheetModalRef}
            index={1}
            snapPoints={snapPoints}
            backdropComponent={renderBackdrop}
            enablePanDownToClose
            handleIndicatorStyle={{
                backgroundColor: Colors[theme].text,
                opacity: 0.5,
            }}
            backgroundStyle={{
                backgroundColor: Colors[theme].background,
            }}
        >
            <BottomSheetView style={styles.contentContainer}>
                <View style={styles.innerContainer}>
                    <View style={styles.header}>
                        <ThemedText style={styles.headerTitle}>
                            User Actions
                        </ThemedText>
                        <ThemedText style={styles.headerSubtitle}>
                            {selectedUser.name}
                        </ThemedText>
                    </View>

                    <View style={styles.section}>
                        <ThemedText style={styles.sectionTitle}>Change Role</ThemedText>
                        <Dropdown
                            items={roleDropdownItems}
                            selectedValue={selectedUser.role_id.toString()}
                            onSelect={handleRoleSelect}
                            placeholder="Select role"
                            searchable={false}
                            disabled={isChangingRole}
                            loading={isChangingRole}
                        />
                    </View>

                    <View style={styles.section}>
                        <ThemedText style={styles.sectionTitle}>User Information</ThemedText>

                        <View style={styles.infoRow}>
                            <ThemedText style={styles.infoLabel}>Email:</ThemedText>
                            <ThemedText style={styles.infoValue} numberOfLines={1}>
                                {selectedUser.email}
                            </ThemedText>
                        </View>

                        <View style={styles.infoRow}>
                            <ThemedText style={styles.infoLabel}>Phone:</ThemedText>
                            <ThemedText style={styles.infoValue}>
                                {selectedUser.phone || "Not provided"}
                            </ThemedText>
                        </View>

                        <View style={styles.infoRow}>
                            <ThemedText style={styles.infoLabel}>Current Role:</ThemedText>
                            <ThemedText style={styles.infoValue}>
                                {userService.getRoleText(selectedUser.role_id)}
                            </ThemedText>
                        </View>

                        <View style={styles.infoRow}>
                            <ThemedText style={styles.infoLabel}>Status:</ThemedText>
                            <View style={styles.statusContainer}>
                                <ThemedText style={[
                                    styles.infoValue,
                                    { color: selectedUser.is_verified ? "#4CAF50" : "#FF9800" }
                                ]}>
                                    {selectedUser.is_verified ? "Verified" : "Unverified"}
                                </ThemedText>
                                {!selectedUser.is_verified && onVerifyEmailUser && (
                                    <Button
                                        type="secondary"
                                        onPress={handleVerifyEmailUser}
                                    >
                                        Verify Email
                                    </Button>
                                )}
                            </View>
                        </View>

                        <View style={styles.infoRow}>
                            <ThemedText style={styles.infoLabel}>Crutial Feature Token:</ThemedText>
                            <View style={styles.tokenButtonsContainer}>
                                <Button
                                    type="secondary"
                                    onPress={handleInjectCrucialToken}
                                    style={styles.tokenButton}
                                >
                                    Inject
                                </Button>
                                <Button
                                    type="delete"
                                    onPress={handleDeleteCrucialToken}
                                    style={styles.tokenButton}
                                >
                                    Delete
                                </Button>
                            </View>
                        </View>
                    </View>

                    {onDeleteUser && (
                        <View style={styles.section}>
                            <Button
                                type="delete"
                                onPress={handleDeletePress}
                                style={styles.deleteButton}
                            >
                                Delete User
                            </Button>
                        </View>
                    )}
                </View>
            </BottomSheetView>
        </BottomSheetModal>
    );
});

UserBottomSheet.displayName = 'UserBottomSheet';

const styles = StyleSheet.create({
    contentContainer: {
        flex: 1,
        padding: 0
    },
    innerContainer: {
        paddingHorizontal: 25,
        paddingBottom: 25,
    },
    header: {
        alignItems: "center",
        marginBottom: 24,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 14,
        opacity: 0.7,
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 12,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
        paddingVertical: 4,
    },
    infoLabel: {
        opacity: 0.7,
        minWidth: 80,
    },
    infoValue: {
        flex: 1,
        textAlign: 'right',
        marginLeft: 8,
    },
    deleteButton: {
        marginTop: 8,
    },

    tokenButtonsContainer: {
        flexDirection: 'row',
        gap: 8,
        flex: 1,
        justifyContent: 'flex-end',
    },
    tokenButton: {
        paddingHorizontal: 12,
    },
    tokenButtonText: {
        fontSize: 12,
        fontWeight: '500',
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        justifyContent: 'flex-end',
        gap: 8,
    },
});

export default UserBottomSheet;
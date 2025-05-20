import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Image, StyleSheet, View } from 'react-native';
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

interface StudentCardProps {
    user_id: string;
    user_name: string;
    user_profile_url: string;
}

export const StudentCard: React.FC<StudentCardProps> = ({
    user_id,
    user_name,
    user_profile_url,
}) => {
    const theme = useColorScheme() || "light";
    
    return (
        <ThemedView isCard={true} style={styles.container}>
            <Image
                source={{ uri: user_profile_url }}
                style={styles.profileImage}
            />
            <View style={styles.infoContainer}>
                <ThemedText type="defaultSemiBold">{user_name}</ThemedText>
                <ThemedText 
                    style={{ 
                        color: theme === "light" ? Colors.light.subtitle : Colors.dark.subtitle 
                    }}
                >
                    ID: {user_id}
                </ThemedText>
            </View>
        </ThemedView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 12,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8
    },
    profileImage: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginRight: 12
    },
    infoContainer: {
        flex: 1,
        justifyContent: 'center'
    }
});
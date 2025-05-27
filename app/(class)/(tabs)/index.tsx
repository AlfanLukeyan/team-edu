import { Button } from "@/components/Button";
import CreateWeeklySectionBottomSheet, {
    CreateWeeklySectionBottomSheetRef,
} from "@/components/teacher/CreateWeeklySectionBottomSheet";
import { ThemedView } from "@/components/ThemedView";
import { WeeklyCard } from "@/components/WeeklyCard";
import { response } from "@/data/response";
import { WeeklySectionFormData } from "@/types/common";
import React, { useCallback, useRef } from "react";
import { ScrollView, StyleSheet } from "react-native";

const WeeklyScreen = () => {
    const handleOpenWeeklySheet = useCallback(() => createSectionRef.current?.open(), []);
    const handleCreateSection = useCallback((data: WeeklySectionFormData) => {
        console.log("New section created:", data);
    }, []);
    const createSectionRef = useRef<CreateWeeklySectionBottomSheetRef>(null);
    return (
        <>
            <ThemedView style={styles.container}>
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.contentContainer}
                >
                    <Button onPress={handleOpenWeeklySheet}>Create Weekly Section</Button>

                    {response.getWeeklyContent.data.map((item) => (
                        <WeeklyCard
                            key={item.id}
                            count={item.count}
                            title={item.title}
                            description={item.description}
                            videoUrl={item.videoUrl}
                            attachment={{
                                name: item.attachment.name,
                                url: item.attachment.url,
                            }}
                            assignment={
                                item.assignment && {
                                    title: item.assignment.title,
                                    dueDate: item.assignment.dueDate,
                                    description: item.assignment.description,
                                }
                            }
                        />
                    ))}
                </ScrollView>
            </ThemedView>
            <CreateWeeklySectionBottomSheet
                ref={createSectionRef}
                onSubmit={handleCreateSection}
            />
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
        borderRadius: 15,
        margin: 16,
    },
    contentContainer: {
        gap: 16,
    },
    createButton: {
        marginBottom: 8,
    },
});

export default WeeklyScreen;

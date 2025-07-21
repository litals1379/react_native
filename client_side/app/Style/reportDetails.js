import { StyleSheet } from "react-native";


export const styles = StyleSheet.create({
    container: {
        direction: 'rtl', // תמיכה בעברית
        flex: 1,
        padding: 16,
        backgroundColor: '#FFF',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#65558F',
        textAlign: 'center',
        marginBottom: 16,
    },
    section: {
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        marginBottom: 4,
    },
    feedbackTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#65558F',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 12,
        marginBottom: 8,
    },
    paragraphBox: {
        backgroundColor: '#F0F0F0',
        padding: 12,
        marginBottom: 10,
        borderRadius: 8,
    },
    paragraphIndex: {
        fontWeight: 'bold',
    },
    paragraphText: {
        marginVertical: 4,
    },
    problematicWords: {
        color: '#C0392B',
    },
});

import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    item: {
        direction: 'rtl', // תמיכה בעברית
        backgroundColor: '#F9F9F9',
        padding: 14,
        marginBottom: 12,
        borderRadius: 10,
        borderColor: '#ddd',
        borderWidth: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#65558F',
        textAlign: 'center',
        marginBottom: 16,
    },
    noReports: {
        textAlign: 'center',
        fontSize: 18,
        color: '#888',
        marginTop: 20,
    },
});
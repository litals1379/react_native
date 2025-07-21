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
        backgroundColor: 'white',
        fontWeight: 'bold',
        color: '#65558F',
        textAlign: 'center',
        marginBottom: 10,
        padding: 10,

    },
    noReports: {
        textAlign: 'center',
        fontSize: 18,
        color: '#888',
        marginTop: 20,
    },
    storyCover: {
        width: 100,
        height: 150,
        borderRadius: 8,
        marginTop: 10,
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});
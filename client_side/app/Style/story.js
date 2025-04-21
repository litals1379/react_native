import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#F8F8F8',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    paragraph: {
        textAlign: 'right',
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 16,
        flexWrap: 'wrap',
    },
    errorText: {
        color: 'red',
        fontSize: 16,
        textAlign: 'center',
    },
    image: {
        width: '100%',
        height: 400,
        borderRadius: 12,
        marginBottom: 16,
    },
    navigation: {
        marginTop: 24,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    progressContainer: {
        alignItems: 'center',
    },
    progressText: {
        marginBottom: 4,
        fontSize: 14,
    },
    progressRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    emoji: {
        fontSize: 20,
        marginLeft: 8,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 12,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalSubtitle: {
        fontSize: 16,
        marginBottom: 10,
    },
    starsRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
    },
    confetti: {
        width: '100%',
        height: '100%',
    },
    endButton: {
        width: '80%',
        alignSelf: 'center',
        backgroundColor: '#B3E7F2',
        borderWidth: 1,
        borderColor: '#65558F',
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 10,
        marginVertical: 20,
    },
    endButtonText: {
        fontSize: 18,
        color: '#65558F',
        fontWeight: 'bold',
        textAlign: 'center',
        writingDirection: 'rtl',
    }
});

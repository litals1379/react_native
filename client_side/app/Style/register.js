import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#F8F8F8',
    },
    title: {
        textAlign: 'center',
        fontSize: 32,
        fontWeight: 'bold',
        color: '#65558F',
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        color: '#65558F',
        marginBottom: 8,
        textAlign: 'right',
    },
    input: {
        width: '100%',
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        backgroundColor: '#fff',
        paddingHorizontal: 10,
        marginBottom: 20,
        textAlign: 'right',
    },
    passwordContainer: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    eyeIconContainer: {
        position: 'absolute',
        left: 10,
        top: 10,
    },
    button: {
        backgroundColor: '#B3E7F2',
        borderWidth: 1,
        borderColor: '#65558F',
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 30,
        marginVertical: 10,
    },
    buttonText: {
        fontSize: 18,
        color: '#65558F',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginBottom: 10,
        textAlign: 'right',
    },
    loginLinkContainer: {
        flexDirection: 'row-reverse',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 16,
    },
    loginText: {
        fontSize: 16,
        color: '#333',
        marginLeft: 6,
        textAlign: 'right',
    },
    loginLink: {
        fontSize: 16,
        color: '#007bff',
        textDecorationLine: 'underline',
        textAlign: 'right',
    },
});

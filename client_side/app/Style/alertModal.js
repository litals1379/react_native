import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    modalOverlay: {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 999,
      },
      
      modalContainer: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 20,
        alignItems: 'center',
        elevation: 10,
      },
      
      modalSuccess: {
        borderColor: '#27AE60',
        borderWidth: 2,
      },
      
      modalError: {
        borderColor: '#E74C3C',
        borderWidth: 2,
      },
      
      modalEmoji: {
        fontSize: 40,
        marginBottom: 10,
      },
      
      modalText: {
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 10,
        color: '#333',
      },
      
      modalClose: {
        fontSize: 16,
        color: '#65558F',
        fontWeight: 'bold',
        marginTop: 10,
      },
      

});
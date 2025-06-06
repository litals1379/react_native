import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flexGrow: 1,

    padding: 16,
    backgroundColor: '#F8F8F8',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#65558F',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    color: '#65558F',
    marginBottom: 5,
    textAlign: 'right',
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    backgroundColor: '#EEE',
    paddingHorizontal: 10,
    marginBottom: 20,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  dateButton: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#65558F',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    flexDirection: 'row-reverse',
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
  error: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
});

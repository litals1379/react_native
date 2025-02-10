import { useState } from "react";
import { StyleSheet, Text, View, TextInput, Button } from "react-native";

export default function Index() {
  const [txtSayHello, setSayHello] = useState("Useless Text");
  const [text, setText] = useState(""); // Initialize text state

  const btnSayHello = () => {
    setSayHello('Hello ' + text); // Add a space and use the correct state variable
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>React Native</Text>
      <TextInput
        style={styles.input}
        onChangeText={setText}
        value={text}
        placeholder="Type something..."
      />
      <Button title="Say Hello" onPress={btnSayHello} /> {/* Corrected button text */}
      <Text style={styles.textDisplay}>Text: {text}</Text>
      <Text style={styles.textDisplay}>Hello Text: {txtSayHello}</Text> {/* More descriptive label */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#eaeaea",
  },
  title: {
    marginBottom: 16,
    paddingVertical: 8,
    borderWidth: 4,
    borderColor: "#20232a",
    borderRadius: 6,
    backgroundColor: "#61dafb",
    color: "#20232a",
    textAlign: "center",
    fontSize: 30,
    fontWeight: "bold",
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: "80%",
    borderRadius: 4,
    backgroundColor: "#fff",
  },
  textDisplay: {
    marginTop: 20,
    fontSize: 18,
    color: "#20232a",
  },
});
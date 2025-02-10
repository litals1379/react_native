import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

const Login = () => {
  const router = useRouter();
  const [usernameFocused, setUsernameFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  
  // Move hands when password is focused
  const handMovement = passwordFocused ? { top: '32%', left: '35%' } : { top: '40%', left: '10%' };
  
  return (
    <View style={styles.container}>
      {/* Form */}
      <View style={styles.form}>
        <TextInput
          style={[styles.input, usernameFocused && styles.focusedInput]}
          placeholder="שם משתמש"
          onFocus={() => setUsernameFocused(true)}
          onBlur={() => setUsernameFocused(false)}
        />
        <TextInput
          style={[styles.input, passwordFocused && styles.focusedInput]}
          placeholder="סיסמה"
          secureTextEntry
          onFocus={() => setPasswordFocused(true)}
          onBlur={() => setPasswordFocused(false)}
        />
        <TouchableOpacity style={styles.button} onPress={() => router.push('./characters')}>
          <Text style={styles.buttonText}>כניסה</Text>
        </TouchableOpacity>
      </View>

      {/* Panda Face */}
      <View style={styles.pandaFace}>
        <View style={styles.earL} />
        <View style={styles.earR} />
        <View style={styles.eyeL}>
          <View style={styles.eyeball} />
        </View>
        <View style={styles.eyeR}>
          <View style={styles.eyeball} />
        </View>
        <View style={styles.nose} />
        <View style={styles.mouth} />
        <View style={styles.cheekL} />
        <View style={styles.cheekR} />
      </View>

      {/* Panda Hands */}
      <View style={[styles.hand, styles.handL, handMovement]} />
      <View style={[styles.hand, styles.handR, handMovement]} />

     {/* Panda Legs */}
     <View style={[styles.leg, styles.legL]}>
        <View style={styles.paw} />
        <View style={styles.toe} />
        <View style={[styles.toe, styles.toeLeft]} />
        <View style={[styles.toe, styles.toeMiddle]} />
        <View style={[styles.toe, styles.toeRight]} />
      </View>
      <View style={[styles.leg, styles.legR]}>
        <View style={styles.paw} />
        <View style={styles.toe} />
        <View style={[styles.toe, styles.toeLeft]} />
        <View style={[styles.toe, styles.toeMiddle]} />
        <View style={[styles.toe, styles.toeRight]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  form: {
    width: 240,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 15,
    borderColor: '#65558F',
    borderWidth: 1, // Added border width
    borderStyle: 'solid', // Added border style (solid, dashed, dotted, etc.)
    alignItems: 'center',
    zIndex: 1,
  },
  input: {
    width: '100%',
    height: 40,
    marginBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: '#3f3554',
    paddingLeft: 10,
    fontSize: 16,
  },
  focusedInput: {
    borderBottomColor: '#f4c531',
  },
  button: {
    backgroundColor: '#B3E7F2',
    borderWidth: 2,
    borderColor: '#65558F',
    borderRadius: 15,
    paddingVertical: 12,
    paddingHorizontal: 25,
    marginVertical: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#65558F',
    fontSize: 18,
    fontWeight: 'bold',
  },
  pandaFace: {
    width: 140,
    height: 130,
    backgroundColor: '#fff',
    borderRadius: 70,
    borderColor: '#2e0d30',
    borderWidth: 2,
    position: 'absolute',
    top: '18%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  earL: {
    position: 'absolute',
    top: -25,
    left: -25,
    width: 50,
    height: 50,
    backgroundColor: '#2e0d30',
    borderRadius: 30,
  },
  earR: {
    position: 'absolute',
    top: -25,
    right: -25,
    width: 50,
    height: 50,
    backgroundColor: '#2e0d30',
    borderRadius: 30,
  },
  eyeL: {
    position: 'absolute',
    top: 20,
    left: 20,
    width: 35,
    height: 35,
    backgroundColor: '#3f3554',
    borderRadius: 20,
  },
  eyeR: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 35,
    height: 35,
    backgroundColor: '#3f3554',
    borderRadius: 20,
  },
  eyeball: {
    width: 14,
    height: 14,
    backgroundColor: '#fff',
    borderRadius: 7,
    position: 'absolute',
    top: 8,
    left: 10,
  },
  nose: {
    width: 22,
    height: 18,
    backgroundColor: '#3f3554',
    borderRadius: 12,
    position: 'absolute',
    top: 55,
  },
  mouth: {
    width: 30,
    height: 12,
    borderBottomWidth: 3,
    borderBottomColor: '#3f3554',
    position: 'absolute',
    top: 80,
    borderRadius: 10,
  },
  cheekL: {
    position: 'absolute',
    top: 45,
    left: 5,
    width: 18,
    height: 18,
    backgroundColor: '#f4a3a3',
    borderRadius: 15,
  },
  cheekR: {
    position: 'absolute',
    top: 45,
    right: 5,
    width: 18,
    height: 18,
    backgroundColor: '#f4a3a3',
    borderRadius: 15,
  },
  hand: {
    width: 50,
    height: 50,
    backgroundColor: '#3f3554',
    borderRadius: 10,
    position: 'absolute',
  },
  handL: {
    left: '10%',
  },
  handR: {
    right: '10%',
  },
  leg: {
    width: 50,
    height: 50,
    backgroundColor: '#3f3554',
    borderRadius: 10,
    position: 'absolute',
    top: '60%',  
  },
  legL: {
    left: '10%',
  },
  legR: {
    right: '10%',
  },
  paw: {
    width: 20,
    height: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    position: 'absolute',
    bottom: 5,
    left: 15,
  },
  toe: {
    width: 10,
    height: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    position: 'absolute',
    top: 5,
  },
  toeLeft: {
    left: 5,
  },
  toeRight: {
    right: 5,
  },
  toeMiddle: {
    left: '50%',  // מיקום במרכז
    transform: [{ translateX: -5 }], // הסטה קלה למרכז
  },
});

export default Login;

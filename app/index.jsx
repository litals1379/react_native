
import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View, Image, TouchableOpacity, Button } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Audio } from 'expo-av';

export default function HomeScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const [imageIndex, setImageIndex] = useState(0);
  const [textIndex, setTextIndex] = useState(0); // New state for text cycling
  const unicornImages = [
    require('../assets/images/unicorn1.png'),
    require('../assets/images/unicorn2.png'),
    require('../assets/images/unicorn3.png')
  ];
  const texts = ['ללמוד', 'לקרוא', '!להנות']; // Text array to match images
  const [showLogo, setShowLogo] = useState(false);
  const [showMainImage, setShowMainImage] = useState(false);
  const [showStoryTime, setShowStoryTime] = useState(false); // New state for showing story time

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < unicornImages.length) {
        setImageIndex(index);
        setTextIndex(index); // Set text according to the current image
        index++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setShowLogo(true);
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }).start(() => {
            setShowMainImage(true);
            Animated.timing(slideAnim, {
              toValue: 0,
              duration: 1500,
              useNativeDriver: true,
            }).start(() => {
              setShowStoryTime(true); // Show story time after the logo
            });
          });
        }, 750);
      }
    }, 750);

    async function playLaugh() {
      const { sound } = await Audio.Sound.createAsync(
        require('../assets/sounds/kids-laugh.mp3')
      );
      await sound.playAsync();
    }

    playLaugh();

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <View style={styles.container}>
      {/* Display the unicorn images with texts */}
      {!showLogo ? (
        <>
          <Image source={unicornImages[imageIndex]} style={styles.unicornImage} />
          <Text style={styles.title}>{texts[textIndex]}</Text>
        </>
      ) : (
        <Animated.View style={{ opacity: fadeAnim }}>
          <TouchableOpacity onPress={() => router.push('/home')}>
            <Image source={require('../assets/images/logo.png')} style={styles.logo} />
          </TouchableOpacity>
        </Animated.View>
      )}

      {showMainImage && (
        <Animated.View style={{ transform: [{ translateY: slideAnim }] }}>
          <TouchableOpacity onPress={() => router.push('/info')}>
            <Image source={require('../assets/images/HomePage.png')} style={styles.image} />
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* Display the "story time" text once logo is shown */}
      {showStoryTime && <Text style={styles.title}>story time</Text>}

      {/* Display buttons only when the logo is shown */}
      {showLogo && (
        <>
          <TouchableOpacity style={styles.button} onPress={() => router.push('/login')}>
            <Text style={styles.buttonText}>התחבר</Text>
          </TouchableOpacity>

          <Button title="לא נרשמת? הירשם עכשיו" onPress={() => router.push('/register')} />

          <TouchableOpacity style={styles.googleButton}>
            <Image source={require('../assets/images/google-icon.png')} style={styles.googleIcon} />
            <Text style={styles.googleText}>המשך עם Google</Text>
          </TouchableOpacity>

          
        
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8EDEB',
  },
  unicornImage: {
    width: 400,
    height: 400,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  logo: {
    width: 300,
    height: 200,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#65558F',
  },
  image: {
    width: 300,
    height: 200,
    marginBottom: 30,
    resizeMode: 'contain',
  },
  button: {
    backgroundColor: '#B3E7F2',
    borderWidth: 1,
    borderColor: '#65558F',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 10,
    alignItems: 'center',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#AAA',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  googleIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  googleText: {
    fontSize: 16,
    color: '#555',
  },
  buttonText: {
    color: '#65558F',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

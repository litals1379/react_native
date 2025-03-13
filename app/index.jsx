import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View, Image, TouchableOpacity, Button } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Audio, Video } from 'expo-av';

export default function HomeScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const [imageIndex, setImageIndex] = useState(0);
  const [textIndex, setTextIndex] = useState(0);
  const unicornImages = [
    require('../assets/images/unicorn1.png'),
    require('../assets/images/unicorn2.png'),
    require('../assets/images/unicorn3.png')
  ];
  const texts = ['ללמוד', 'לקרוא', 'להנות!'];
  const [showLogo, setShowLogo] = useState(false);
  const [showMainImage, setShowMainImage] = useState(false);
  const [showStoryTime, setShowStoryTime] = useState(false);
  const video = useRef(null);
  const [status, setStatus] = useState({});

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < unicornImages.length) {
        setImageIndex(index);
        setTextIndex(index);
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
              setShowStoryTime(true);
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
      <Video
        ref={video}
        style={styles.video}
        source={require('../assets/videos/background_video.mp4')} 
        useNativeControls={false}
        resizeMode="cover"
        isLooping
        shouldPlay
        onPlaybackStatusUpdate={status => setStatus(() => status)}
      />
      {!showLogo ? (
        <>
          <Image source={unicornImages[imageIndex]} style={styles.unicornImage} />
          <Text style={styles.title}>{texts[textIndex]}</Text>
        </>
      ) : (
        <Animated.View style={styles.logoContainer}> 
          <TouchableOpacity onPress={() => router.push('/home')}>
            <Image source={require('../assets/images/logo.png')} style={styles.logo} />
          </TouchableOpacity>
          {showStoryTime && <Text style={styles.storyTimeText}>Story Time</Text>} 
        </Animated.View>
      )}

      {showMainImage && (
        <Animated.View style={{ transform: [{ translateY: slideAnim }] }}>
          <TouchableOpacity onPress={() => router.push('/info')}>
            <Image source={require('../assets/images/HomePage.png')} style={styles.image} />
          </TouchableOpacity>
        </Animated.View>
      )}

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
  },
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    zIndex: -1,
  },
  unicornImage: {
    width: 400,
    height: 400,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  logo: {
    width: 400,
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
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  storyTimeText: {
    position: 'absolute',
    fontSize: 40,
    fontWeight: 'bold',
    color: '#65558F',
    top: 130,
  },
});
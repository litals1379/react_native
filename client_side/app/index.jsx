import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Audio, Video } from 'expo-av';
import {styles} from './Style/index'; // Assuming you have a styles file for this component

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
            <Image source={require('../assets/images/logo.png')} style={styles.logo} />
          {showStoryTime && <Text style={styles.storyTimeText}>Story Time</Text>} 
        </Animated.View>
      )}

      {showMainImage && (
        <Animated.View style={{ transform: [{ translateY: slideAnim }] }}>
            <Image source={require('../assets/images/HomePage.png')} style={styles.image} />
        </Animated.View>
      )}

      {showLogo && (
        <>
          <TouchableOpacity style={styles.button} onPress={() => router.push('/login')}>
            <Text style={styles.buttonText}>התחבר</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/register')}>
            <Text style={styles.registerText}>לא נרשמת? הירשם עכשיו</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.googleButton} onPress={() => router.push('/googleAuth')}>
            <Image source={require('../assets/images/google-icon.png')} style={styles.googleIcon} />
            <Text style={styles.googleText}>המשך עם Google</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.button} onPress={() => router.push('/pn')}>
            <Text style={styles.buttonText}>Push Notifications </Text>
          </TouchableOpacity>

        </>
      )}
    </View>
  );
}

import React, { useRef, useState } from 'react';
import { Text, View, Image, TouchableOpacity, FlatList } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Video } from 'expo-av';
import { styles } from './Style/characters';

const charactersData = [
  { id: 1, name: 'מיקו', image: require('../assets/images/mico.jpg'), video: require('../assets/sounds/cat.mp4') },
  { id: 2, name: 'נבי', image: require('../assets/images/navi.png'), video: require('../assets/sounds/navi.mp4') },
  // { id: 3, name: 'יוני', image: require('../assets/images/yoni.png'), video: require('../assets/sounds/yoni.mp4') },
// { id: 4, name: 'ארנבת', image: require('../assets/images/rabbit.png'), video: require('../assets/sounds/rabbit.mp4') },

];

export default function Characters() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const childID = params.childID;

  const [playingCharacterID, setPlayingCharacterID] = useState(null);
  const videoRef = useRef(null);

  const handleCharacterSelect = async (item) => {
    if (playingCharacterID === item.id) {
      // לחיצה שנייה על אותה דמות – דלג על הסרטון
      if (videoRef.current) {
        await videoRef.current.stopAsync();
      }
      setPlayingCharacterID(null);
      router.push({
        pathname: './subjects',
        params: { childID: childID, characterID: item.id },
      });
    } else {
      // דמות אחרת נלחצה – עצור את הקודמת
      if (videoRef.current) {
        await videoRef.current.stopAsync();
      }
      setPlayingCharacterID(item.id);
    }
  };

  const renderCharacter = ({ item }) => (
    <TouchableOpacity
      style={styles.characterButton}
      onPress={() => handleCharacterSelect(item)}
    >
      {playingCharacterID === item.id ? (
        <Video
          ref={videoRef}
          source={item.video}
          shouldPlay
          resizeMode="contain"
          style={{ width: 100, height: 100 }}
          onPlaybackStatusUpdate={(status) => {
            if (status.didJustFinish) {
              setPlayingCharacterID(null);
              router.push({
                pathname: './subjects',
                params: { childID: childID, characterID: item.id },
              });
            }
          }}
        />
      ) : (
        <>
          <Image source={item.image} style={styles.characterImage} />
          <Text style={styles.characterName}>{item.name}</Text>
        </>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>בחר דמות</Text>

      <FlatList
        data={charactersData}
        renderItem={renderCharacter}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.characterGrid}
      />
    </View>
  );
}

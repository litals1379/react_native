import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import * as Speech from 'expo-speech';
import {styles} from './Style/quiz'; // Assuming you have a styles file for this component

export default function Quiz() {
  const TOTAL_ROUNDS = 5;
  const [words, setWords] = useState([]);
  const [spokenWord, setSpokenWord] = useState('');
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [error, setError] = useState(null);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (!gameOver) {
      fetchNewWords();
    }
  }, [round]);

  const fetchNewWords = () => {
    fetch('http://www.storytimetestsitetwo.somee.com/api/randomwords')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch words');
        }
        return response.json();
      })
      .then((data) => {
        const selectedWords = data.slice(0, 3);
        setWords(selectedWords);
        const randomIndex = Math.floor(Math.random() * selectedWords.length);
        const wordToSpeak = selectedWords[randomIndex];
        setSpokenWord(wordToSpeak);
        Speech.speak(wordToSpeak, { language: 'he-IL' });
      })
      .catch((err) => {
        console.error(err);
        setError('שגיאה בטעינת מילים');
      });
  };

  const handleWordPress = (selectedWord) => {
    const isCorrect = selectedWord === spokenWord;
  
    if (isCorrect) {
      Alert.alert('כל הכבוד! 🎉', 'ניחשת נכון!');
      setScore((prev) => prev + 1);
    } else {
      Alert.alert('אופס!', 'נסה שוב');
    }
  
    if (round < TOTAL_ROUNDS) {
      setTimeout(() => {
        setRound((prev) => prev + 1);
      }, 800); // זמן המתנה קטן כדי לתת לילד זמן לקרוא את ההודעה
    } else {
      setGameOver(true);
      setTimeout(() => {
        Alert.alert(
          'סיום המשחק 🎉',
          `ענית נכון על ${isCorrect ? score + 1 : score} מתוך ${TOTAL_ROUNDS} סבבים`
        );
      }, 1000);
    }
  };
  
  const repeatWord = () => {
    if (spokenWord) {
      console.log('Repeating word:', spokenWord);
      Speech.speak(spokenWord, { language: 'he-IL' });
    }
  };

  const restartGame = () => {
    setRound(1);
    setScore(0);
    setGameOver(false);
    setError(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>משחק זיהוי מילים 🧠</Text>

      {gameOver ? (
        <>
          <Text style={styles.score}>התוצאה שלך: {score} / {TOTAL_ROUNDS}</Text>
          <TouchableOpacity style={styles.restartButton} onPress={restartGame}>
            <Text style={styles.restartText}>🔁 שחק שוב</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.subtitle}>סבב {round} מתוך {TOTAL_ROUNDS}</Text>
          <Text style={styles.instruction}>בחר את המילה שנאמרה:</Text>

          {error ? (
            <Text style={styles.error}>{error}</Text>
          ) : (
            <View style={styles.buttonsContainer}>
              {words.map((word, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.wordButton}
                  onPress={() => handleWordPress(word)}
                >
                  <Text style={styles.wordText}>{word}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <TouchableOpacity style={styles.repeatButton} onPress={repeatWord}>
            <Text style={styles.repeatText}>🔊 האזן שוב</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}


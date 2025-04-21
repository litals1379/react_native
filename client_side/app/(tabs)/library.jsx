import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {styles} from './tabsStyle/library'; // סגנונות

export default function Library() {
  const [books, setBooks] = useState([]);
  const [error, setError] = useState(null);
  const router = useRouter();
  const params = useLocalSearchParams();
  const child = params.child ? JSON.parse(params.child) : null;

  const fetchBooksReadByChild = async (childID) => {
    const apiUrl = `http://www.storytimetestsitetwo.somee.com/api/Story/GetBooksReadByChild/${childID}`;
    console.log('Fetching books for child ID:', childID);

    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      console.log('API response status:', response.status);

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      console.log('Books fetched from API:', data);

      // שומרים רק title ו־coverImg מכל ספר
      const simplifiedBooks = data.map(book => ({
        id: book.id, // הוספתי את ה-id של הספר
        title: book.title,
        coverImg: book.coverImg,
      }));

      console.log('Simplified books:', simplifiedBooks);
      setBooks(simplifiedBooks);
    } catch (err) {
      console.error('Error fetching books:', err);
      setError(err.message);
    }
  };

  useEffect(() => {
    if (params.child) {
      const parsedChild = JSON.parse(params.child);
      console.log('Child object:', parsedChild);
      fetchBooksReadByChild(parsedChild.id);
    } else {
      Alert.alert("לא נבחר ילד");
    }
  }, [params.child]);

  return (
    <View style={styles.container}>
      {error && <Text style={styles.error}>{error}</Text>}

      <Text style={styles.header}>הספרייה של: {child?.firstName}</Text>

      {books.length > 0 ? (
        <ScrollView style={styles.booksList}>
          {books.map((book, index) => (
            <TouchableOpacity
              key={index}
              style={styles.bookItem}
              onPress={() => router.push({ pathname: 'storyFromLibrary', params: { storyId: book.id } })} // שולחים את ה-`storyId` כפרמטר
            >
              {book.coverImg ? (
                <Image
                  source={{ uri: book.coverImg }}
                  style={styles.bookImage}
                />
              ) : null}
              <Text style={styles.bookTitle}>{book.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : (
        <Text style={styles.text}>לא נמצאו סיפורים</Text>
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push({ pathname: '../subjects', params: { childID: child?.id } })}
      >
        <Text style={styles.buttonText}>צור סיפור חדש</Text>
      </TouchableOpacity>
    </View>
  );
}


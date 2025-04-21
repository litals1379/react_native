import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';

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
    if (child && child.id && books.length === 0) {
      console.log('Child object:', child);
      fetchBooksReadByChild(child.id);
    }
  }, [child, books]);

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
    alignItems: 'center',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#65558F',
  },
  booksList: {
    marginTop: 20,
    width: '100%',
  },
  bookItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    shadowColor: '#aaa',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  bookImage: {
    width: 90,
    height: 90,
    resizeMode: 'cover',
    borderRadius: 5,
    marginRight: 15,
  },
  bookTitle: {
    alignContent: 'flex-start',
    flex: 1,
    textAlign: 'right',
    fontSize: 16,
    color: '#333',
    flexShrink: 1,
  },
  noBooksText: {
    marginTop: 20,
    color: '#777',
  },
  error: {
    color: 'red',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#B3E7F2',
    borderWidth: 1,
    borderColor: '#65558F',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 20,
  },
  buttonText: {
    color: '#65558F',
    fontSize: 18,
    fontWeight: 'bold',
  },
  text:{
    fontSize: 16,
    margin: 5,
  }
});

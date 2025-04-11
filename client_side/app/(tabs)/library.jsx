import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function Library() {
  const [books, setBooks] = useState([]);
  const [error, setError] = useState(null);
  const router = useRouter();
  const params = useLocalSearchParams();
  const child = params.child ? JSON.parse(params.child) : null; // המרה חזרה לאובייקט


  // פונקציה שתציג את הספרים שהילד קרא
  const fetchBooksReadByChild = async (childID) => {
    const apiUrl = `http://www.storytimetestsitetwo.somee.com/api/Story/GetBooksReadByChild/${childID}`;

    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      setBooks(data);
    } catch (err) {
      setError(err.message);
    }
  };

  // קריאה לפונקציה עם טעינת הרכיב
  useEffect(() => {
    if (child && child.id) { // בדיקה שהאובייקט קיים ושיש לו id
      fetchBooksReadByChild(child.id);
    }
  }, [child]);

  return (
    <View style={styles.container}>
      {/* הצגת הודעת שגיאה במידה ויש */}
      {error && <Text style={styles.error}>{error}</Text>}

      {/* הצגת רשימת הספרים שהילד קרא */}
      <Text style={styles.header}>הספרייה של: {child.firstName}</Text>
      {books.length > 0 ? (
        books.map((book, index) => (
          <Text key={index} style={styles.bookItem}>{book}</Text>
        ))
      ) : (
        <Text>No books found.</Text>
      )}

      {/* כפתור יצירת סיפור חדש */}
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
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#65558F'
  },
  bookItem: {
    fontSize: 16,
    marginTop: 5,
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
    marginVertical: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#65558F',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
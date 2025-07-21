import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { styles } from './Style/allReports'; // Import styles

const allReports = () => {
  const { childId, userId } = useLocalSearchParams();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch(
          `http://192.168.1.75:5022/api/ReadingSessionReport/filter?userId=${userId}&childId=${childId}`
        );
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'שגיאה בטעינת הדוחות');
        setReports(data);
      } catch (err) {
        Alert.alert('שגיאה', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [childId, userId]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() =>
        router.push({
          pathname: '/reportDetails',
          params: { report: JSON.stringify(item) }
        })
      }
    >
      <Text style={styles.title}>📖 סיפור: {item.storyId}</Text>
      <Text>🗓️ {new Date(item.startTime).toLocaleDateString()} | שגיאות: {item.totalErrors}</Text>
      <Text>{item.summary?.emoji || ''} {item.summary?.feedbackType}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 40 }} size="large" color="#65558F" />;
  }

  return (
   //render a title for the screen
    <View style={styles.container}>
        <Text style={styles.title}>דוחות קריאה</Text>    

    <FlatList
      data={reports}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      contentContainerStyle={{ padding: 16 }}
      ListEmptyComponent={<Text style={styles.noReports}>לא נמצאו דוחות</Text>}
    />
        </View>

  );
};

export default allReports;


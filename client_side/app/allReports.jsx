import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert, StyleSheet, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { styles } from './Style/allReports'; // Import your style file
import { API_SOMEE_READING_SESSION_REPORT_FILTER, API_SOMEE_STORY_GET_BY_ID } from './Config/config';

const allReports = () => {
  const { childId, childName, userId } = useLocalSearchParams();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch(
          `${API_SOMEE_READING_SESSION_REPORT_FILTER}?userId=${userId}&childId=${childId}`
        );
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'שגיאה בטעינת הדוחות');

        // Optionally: fetch story info for each report
        const reportsWithStories = await Promise.all(
          data.map(async (report) => {
            try {
              const storyResponse = await fetch(`${API_SOMEE_STORY_GET_BY_ID}${report.storyId}`);
              const storyData = await storyResponse.json();
              return { ...report, storyTitle: storyData.title, storyCover: storyData.coverImg };
            } catch (e) {
              console.warn('⚠️ לא ניתן לטעון פרטי סיפור עבור', report.storyId);
              return { ...report };
            }
          })
        );

        // Sort by startTime descending (newest first)
        reportsWithStories.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));

        setReports(reportsWithStories);
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
          params: { report: JSON.stringify(item), storyTitle: item.storyTitle },
        })
      }
    >
      <Text style={styles.storyTitle}>
        📖 סיפור: {item.storyTitle || item.storyId}
      </Text>
      <Text>🗓️ {new Date(item.startTime).toLocaleDateString()} | שגיאות: {item.totalErrors}</Text>
      <Text>⏱️ זמן קריאה: {Math.round((new Date(item.endTime) - new Date(item.startTime)) / 60000)} דקות</Text>
      <Text>{item.summary?.emoji || ''} {item.summary?.feedbackType}</Text>
      {item.storyCover && (
        <Image source={{ uri: item.storyCover }} style={styles.storyCover} />
      )}
    </TouchableOpacity>
  );

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 40 }} size="large" color="#65558F" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>דוחות הקריאה של {childName}</Text>
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

import React, { useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { styles } from './Style/reportDetails'; // Import styles
import { use } from 'react';



const ReportDetails = () => {
  const { report } = useLocalSearchParams();
  const data = JSON.parse(report);


  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>דוח קריאה</Text>

      <View style={styles.section}>
        <Text style={styles.label}>ילד: {data.childId}</Text>
        <Text style={styles.label}>סיפור: {data.storyId}</Text>
        <Text style={styles.label}>שגיאות: {data.totalErrors}</Text>
        <Text style={styles.label}>התחלה: {new Date(data.startTime).toLocaleString()}</Text>
        <Text style={styles.label}>סיום: {new Date(data.endTime).toLocaleString()}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.feedbackTitle}>{data.summary.emoji} {data.summary.feedbackType}</Text>
        <Text>{data.summary.comment}</Text>
      </View>

      <Text style={styles.sectionTitle}>פסקאות:</Text>
      {data.paragraphs.map((p, index) => (
        <View key={index} style={styles.paragraphBox}>
          <Text style={styles.paragraphIndex}>פסקה {p.paragraphIndex + 1}</Text>
          <Text style={styles.paragraphText}>{p.text}</Text>
          <Text style={{ color: p.wasSuccessful ? '#2ECC71' : '#E74C3C' }}>
            {p.wasSuccessful ? 'היגוי תקין ✅' : 'שגיאה ❌'}
          </Text>
          {p.problematicWords?.length > 0 && (
            <Text style={styles.problematicWords}>
              מילים בעייתיות: {p.problematicWords.join(', ')}
            </Text>
          )}
        </View>
      ))}
    </ScrollView>
  );
};

export default ReportDetails;


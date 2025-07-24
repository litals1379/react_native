import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { styles } from './Style/reportDetails';

const ReportDetails = () => {
  const { report, storyTitle } = useLocalSearchParams();
  const data = JSON.parse(report);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.title}>📘 דוח קריאה</Text>

      <View style={styles.section}>
        <Text style={styles.label}>📖 סיפור: <Text style={styles.value}>{storyTitle}</Text></Text>
        <Text style={styles.label}>❌ שגיאות: <Text style={styles.value}>{data.totalErrors}</Text></Text>
        <Text style={styles.label}>⏱️ התחלה: <Text style={styles.value}>{new Date(data.startTime).toLocaleString()}</Text></Text>
        <Text style={styles.label}>🏁 סיום: <Text style={styles.value}>{new Date(data.endTime).toLocaleString()}</Text></Text>
      </View>

      <View style={[styles.section, styles.feedbackBox]}>
        <Text style={styles.feedbackTitle}>{data.summary.emoji} {data.summary.feedbackType}</Text>
        <Text style={styles.feedbackComment}>{data.summary.comment}</Text>
      </View>

      <Text style={styles.sectionTitle}>📝 פסקאות:</Text>

      {data.paragraphs.map((p, index) => (
        <View key={index} style={styles.paragraphBox}>
          <Text style={styles.paragraphIndex}>פסקה {p.paragraphIndex + 1}</Text>
          <Text style={styles.paragraphText}>{p.text}</Text>
          <Text style={p.wasSuccessful ? styles.successText : styles.errorText}>
            {p.wasSuccessful ? '✅ היגוי תקין' : '❌ שגיאה'}
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

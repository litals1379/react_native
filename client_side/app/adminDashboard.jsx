import React, { useContext, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { UserContext } from './Context/userContextProvider'; // קונטקסט לניהול רשימת המשתמשים
import UserCard from './Components/userCard'; // קומפוננטה להצגת משתמש בודד
import EditUserModal from './Components/editUserModal'; // קומפוננטה לעריכת משתמש

export default function AdminDashboard() {
  const { users, DeleteUser, EditUser } = useContext(UserContext); // שליפת הפונקציות והנתונים מה-Context
  const [editingUser, setEditingUser] = useState(null); // המשתמש שנערך כרגע
  const [updatedUserData, setUpdatedUserData] = useState({}); // המידע המעודכן בטופס העריכה

  // פעולה שמופעלת כשלוחצים על "ערוך"
  const handleEdit = (user) => {
    setEditingUser(user); // מציג את הטופס
    setUpdatedUserData({ ...user }); // ממלא את הטופס עם פרטי המשתמש
  };

  // פעולה לשמירת השינויים
  const handleSave = () => {
    EditUser(updatedUserData); // שליחה לעדכון דרך ה-Context
    setEditingUser(null); // סגירת הטופס
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>משתמשים רשומים</Text>

      {/* רשימת המשתמשים */}
      <FlatList
        data={users} // הנתונים
        keyExtractor={(item) => item.id} // מפתח ייחודי לכל שורה
        renderItem={({ item }) => (
          <UserCard
            user={item}
            onEdit={handleEdit}
            onDelete={DeleteUser}
          />
        )}
        ListEmptyComponent={<Text>לא נמצאו משתמשים</Text>} // תצוגה כאשר הרשימה ריקה
      />

      {/* טופס עריכת משתמש */}
      {editingUser && (
        <EditUserModal
          visible={!!editingUser} // האם המודל מוצג
          user={updatedUserData} // הנתונים בתוך הטופס
          setUser={setUpdatedUserData} // עדכון הנתונים
          onClose={() => setEditingUser(null)} // סגירת המודל
          onSave={handleSave} // שמירה
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 12,
    color: '#65558F',
  },
});

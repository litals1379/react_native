import React, { useContext, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { UserContext } from './Context/userContextProvider';
import UserCard from './Components/userCard';
import EditUserModal from './Components/editUserModal';

export default function AdminDashboard() {
  const { users, DeleteUser, EditUser } = useContext(UserContext);
  const [editingUser, setEditingUser] = useState(null);
  const [updatedUserData, setUpdatedUserData] = useState({});

  const handleEdit = (user) => {
    setEditingUser(user);
    setUpdatedUserData({ ...user });
  };

  const handleSave = () => {
    EditUser(updatedUserData);
    setEditingUser(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>משתמשים רשומים</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <UserCard user={item} onEdit={handleEdit} onDelete={DeleteUser} />
        )}
        ListEmptyComponent={<Text>לא נמצאו משתמשים</Text>}
      />

      {editingUser && (
        <EditUserModal
          visible={!!editingUser}
          user={updatedUserData}
          setUser={setUpdatedUserData}
          onClose={() => setEditingUser(null)}
          onSave={handleSave}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  header: { fontSize: 22, textAlign: 'center', marginVertical: 12 },
});

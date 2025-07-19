import React, { createContext, useState, useEffect } from 'react';
import AlertModal from '../Components/AlertModal';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [users, setUsers] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [modalEmoji, setModalEmoji] = useState('');
    const [modalType, setModalType] = useState('success');

    // שליפה מהשרת
    const fetchUsers = async () => {
        try {
            const response = await fetch('http://www.storytimetestsitetwo.somee.com/api/User/all');
            if (!response.ok) throw new Error('שגיאה בשליפה');
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error('שגיאה בשליפת משתמשים:', error);
        }
    };

    // מחיקה מהשרת
    const DeleteUser = async (userId) => {
        try {
            const response = await fetch(`http://www.storytimetestsitetwo.somee.com/api/User/DeleteUser/${userId}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('שגיאה במחיקה');
            setModalMessage('המשתמש נמחק בהצלחה!');
            setModalEmoji('🗑️');
            setModalType('success');
            setModalVisible(true);
            // הסרה מהסטייט
            setUsers((prev) => prev.filter((user) => user.id !== userId));
        } catch (error) {
            console.error('שגיאה במחיקת משתמש:', error);
        }
    };

    // עריכה בשרת
    const EditUser = async (updatedUser) => {
        console.log("Editing user:", updatedUser);
        try {
            const response = await fetch(`http://www.storytimetestsitetwo.somee.com/api/User/UpdateUser/${updatedUser.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedUser),
            });

            if (!response.ok) throw new Error('שגיאה בעדכון');
            setModalMessage('המשתמש עודכן בהצלחה!');
            setModalEmoji('✅');
            setModalType('success');
            setModalVisible(true);

            // עדכון בסטייט
            setUsers((prev) =>
                prev.map((user) =>
                    user.id === updatedUser.id ? updatedUser : user
                )
            );
        } catch (error) {
            console.error('שגיאה בעריכת משתמש:', error);
        }
    };

    // שליפת משתמשים מהשרת כשיש שינוי בסטייט
    useEffect(() => {
        fetchUsers();
    }, [users]);

    return (
        <UserContext.Provider value={{ users, DeleteUser, EditUser }}>
            {children}
            <AlertModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                message={modalMessage}
                emoji={modalEmoji}
                type={modalType}
            />
        </UserContext.Provider>
    );
};

import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [users, setUsers] = useState([]);

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
            const response = await fetch(`https://localhost:7209/api/users/DeleteUser/${userId}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('שגיאה במחיקה');

            // הסרה מהסטייט
            setUsers((prev) => prev.filter((user) => user.id !== userId));
        } catch (error) {
            console.error('שגיאה במחיקת משתמש:', error);
        }
    };

    // עריכה בשרת
    const EditUser = async (updatedUser) => {
        try {
            const response = await fetch(`https://your-api.com/api/users/${updatedUser.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedUser),
            });

            if (!response.ok) throw new Error('שגיאה בעדכון');

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

    // שליפה ראשונית
    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <UserContext.Provider value={{ users, DeleteUser, EditUser }}>
            {children}
        </UserContext.Provider>
    );
};

import React, { createContext, useContext, useState } from 'react';

// יצירת הקונטקסט
const ChildContext = createContext();

// ה-hook לשימוש בקונטקסט
export  const useChildContext = () => {
    return useContext(ChildContext);
};

// Provider שמספק את הפונקציה
export const ChildProvider = ({ children }) => {
    const [childrenList, setChildrenList] = useState([]);

    const handleAddChild = (childData) => {
        setChildrenList([...childrenList, childData]);
        console.log('Child added:', childData);
    };

    return (
        <ChildContext.Provider value={{ childrenList, handleAddChild }}>
            {children}
        </ChildContext.Provider>
    );
};
export default ChildProvider;
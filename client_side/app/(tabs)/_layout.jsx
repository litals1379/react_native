import { Tabs } from 'expo-router';
import Icon from 'react-native-vector-icons/FontAwesome';
import {styles} from '../tabsStyle/layout'; 

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: '#65558F',
        tabBarInactiveTintColor: '#8E8E93',
      }}
    >
      <Tabs.Screen
        name="userProfile"
        options={{
          title: 'פרופיל',
          headerShown:false,
          tabBarIcon: ({ color, size }) => <Icon name="user" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          title: 'ספריה',
          headerShown:false,
          tabBarIcon: ({ color, size }) => <Icon name="book" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
      name="options"
      options={{
        title: 'אפשרויות',
        headerShown: false,
        tabBarIcon: ({ color, size }) => <Icon name="cog" size={size} color={color} />, // cog = גלגל שיניים
        }}
      />
    </Tabs>
  );
}



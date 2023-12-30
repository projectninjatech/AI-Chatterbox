import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import ChatScreen from '../screens/ChatScreen'
import SettingsScreen from '../screens/SettingsScreen'
import ImageScreen from '../screens/ImageScreen'
import Icon from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
    return (
        <Tab.Navigator screenOptions={{ tabBarActiveTintColor: '#999', tabBarInactiveBackgroundColor: '#343541', tabBarActiveBackgroundColor: '#883EF8' }}>
            <Tab.Screen name='ChatScreen' component={ChatScreen} options={{ headerShown: false, tabBarShowLabel: false, tabBarIcon: ({ color, size }) => (<Icon name="chatbubbles" size={30} color="white" />) }}></Tab.Screen>
            <Tab.Screen name='ImageScreen' component={ImageScreen} options={{ headerShown: false, tabBarShowLabel: false, tabBarIcon: ({ color, size }) => (<Icon name="images" size={30} color="white" />) }}></Tab.Screen>
            <Tab.Screen name='SettingsScreen' component={SettingsScreen} options={{ headerShown: false, tabBarShowLabel: false, tabBarIcon: ({ color, size }) => (<Icon name="settings" size={30} color="white" />) }}></Tab.Screen>
        </Tab.Navigator>
    )
}
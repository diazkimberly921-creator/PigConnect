// src/navigation/AppStack.js
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";

// Screens
import HomeScreen from "../screens/HomeScreen";
import AddNoteScreen from "../screens/AddNoteScreen";
import EditNoteScreen from "../screens/EditNoteScreen";
import NotesScreen from "../screens/NotesScreen";
import ProfileScreen from "../screens/ProfileScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// ✅ Notes stack to handle Add/Edit
const NotesStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="NotesMain" component={NotesScreen} />
    <Stack.Screen name="AddNote" component={AddNoteScreen} />
    <Stack.Screen name="EditNote" component={EditNoteScreen} />
  </Stack.Navigator>
);

const AppStack = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#FF4D85",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopWidth: 0,
          elevation: 4,
          paddingTop: 6,
        },
      }}
    >
      {/* ✅ Home is the landing page after login */}
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
      />

      <Tab.Screen
        name="Notes"
        component={NotesStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="note-text" color={color} size={size} />
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" color={color} size={size} />
          ),
        }}
      />

      {/* ✅ Logout tab */}
      <Tab.Screen
        name="Logout"
        component={ProfileScreen} // dummy, not actually used
        listeners={{
          tabPress: (e) => {
            e.preventDefault(); // stop navigation
            signOut(auth); // log out user
          },
        }}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="logout" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default AppStack;

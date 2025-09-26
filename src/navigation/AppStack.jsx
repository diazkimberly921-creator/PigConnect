// src/navigation/AppStack.js
import React from "react";
import { Alert, Platform } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons as Icon } from "@expo/vector-icons";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";

// Screens
import HomeScreen from "../screens/HomeScreen";
import NotesScreen from "../screens/NotesScreen";
import EditNoteScreen from "../screens/EditNoteScreen";
import AddNoteScreen from "../screens/AddNoteScreen";
import ProfileScreen from "../screens/ProfileScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// ✅ Notes stack
function NotesStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="NotesHome"
        component={NotesScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="EditNote" component={EditNoteScreen} />
      <Stack.Screen name="AddNote" component={AddNoteScreen} />
    </Stack.Navigator>
  );
}

// ✅ Dummy screen for Logout
const DummyScreen = () => null;

export default function AppStack() {
  const handleLogout = () => {
    if (Platform.OS === "web") {
      // Web → fallback to browser alert
      if (window.confirm("Are you sure you want to log out?")) {
        signOut(auth).catch((error) => {
          console.error("Logout error:", error);
          window.alert("❌ Error: Could not log out.");
        });
      }
    } else {
      // Mobile → use React Native Alert
      Alert.alert(
        "Confirm Logout",
        "Are you sure you want to log out?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Yes",
            onPress: async () => {
              try {
                await signOut(auth);
              } catch (error) {
                console.error("Logout error:", error);
                Alert.alert("❌ Error", "Something went wrong while logging out.");
              }
            },
          },
        ],
        { cancelable: true }
      );
    }
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: "#FF4D85",
        tabBarInactiveTintColor: "gray",
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "Home") iconName = "home-outline";
          else if (route.name === "Notes") iconName = "document-text-outline";
          else if (route.name === "Profile") iconName = "person-outline";
          else if (route.name === "Logout") iconName = "log-out-outline";
          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Notes" component={NotesStack} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen
        name="Logout"
        component={DummyScreen}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            handleLogout();
          },
        }}
      />
    </Tab.Navigator>
  );
}

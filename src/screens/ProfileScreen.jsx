// src/screens/ProfileScreen.jsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";

const ProfileScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Profile</Text>
      <Text style={styles.subtitle}>Welcome to your profile page 🎉</Text>
      {/* Later you can add user info, edit profile, logout, etc. */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF0F5",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#FF4D85",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
  },
});

export default ProfileScreen;

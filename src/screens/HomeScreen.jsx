// src/screens/HomeScreen.jsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Features</Text>

      <View style={styles.featureRow}>
        {/* Notes Feature */}
        <TouchableOpacity
          style={styles.featureCard}
          onPress={() => navigation.navigate("Notes")}
        >
          <MaterialCommunityIcons
            name="note-text"
            size={42}
            color="#FF4D85"
            style={styles.icon}
          />
          <Text style={styles.featureText}>Notes</Text>
        </TouchableOpacity>

        {/* Profile Feature */}
        <TouchableOpacity
          style={styles.featureCard}
          onPress={() => navigation.navigate("Profile")}
        >
          <MaterialCommunityIcons
            name="account-circle"
            size={42}
            color="#FF4D85"
            style={styles.icon}
          />
          <Text style={styles.featureText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#FFF0F5" },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#FF4D85",
    textAlign: "center",
    marginBottom: 40,
    marginTop: 40,
  },
  featureRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 20,
  },
  featureCard: {
    backgroundColor: "#fff",
    paddingVertical: 25,
    paddingHorizontal: 20,
    borderRadius: 18,
    alignItems: "center",
    width: 130,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  icon: {
    marginBottom: 10,
  },
  featureText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FF4D85",
    textAlign: "center",
  },
});

export default HomeScreen;

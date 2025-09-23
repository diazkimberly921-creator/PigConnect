// src/screens/AddNoteScreen.jsx
import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from "react-native";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

const AddNoteScreen = ({ navigation }) => {
  const [text, setText] = useState("");

  const handleAddNote = async () => {
    if (text.trim() === "") return;

    try {
      await addDoc(collection(db, "notes"), { text }); // ✅ save to Firestore
      navigation.goBack(); // go back → NotesScreen will auto-refresh
    } catch (error) {
      console.error("Error adding note: ", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Note</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter your note..."
        value={text}
        onChangeText={setText}
        multiline
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleAddNote}>
        <Text style={styles.saveText}>Save Note</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFE4EC",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FF4D85",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    fontSize: 16,
    color: "#333",
    minHeight: 120,
    textAlignVertical: "top",
  },
  saveButton: {
    backgroundColor: "#FF4D85",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  saveText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default AddNoteScreen;

// src/screens/EditNoteScreen.jsx
import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from "react-native";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

const EditNoteScreen = ({ route, navigation }) => {
  const { note } = route.params;
  const [text, setText] = useState(note.text);

  const handleUpdate = async () => {
    try {
      const noteRef = doc(db, "notes", note.id);
      await updateDoc(noteRef, { text });
      navigation.goBack(); // go back → NotesScreen will auto-refresh
    } catch (error) {
      console.error("Error updating note: ", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Note</Text>

      <TextInput
        style={styles.input}
        value={text}
        onChangeText={setText}
        multiline
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleUpdate}>
        <Text style={styles.saveText}>Save Changes</Text>
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

export default EditNoteScreen;

// src/screens/NotesScreen.jsx
import React, { useState, useCallback } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useFocusEffect } from "@react-navigation/native";


const NotesScreen = ({ navigation }) => {
  const [notes, setNotes] = useState([]);

  // fetch notes from Firestore
  const fetchNotes = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "notes"));
      const notesData = querySnapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      setNotes(notesData);
    } catch (error) {
      console.error("Error fetching notes: ", error);
    }
  };

  // delete note
  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "notes", id));
      fetchNotes(); // refresh
    } catch (error) {
      console.error("Error deleting note: ", error);
    }
  };

  // refresh every time screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchNotes();
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Notes</Text>

      <FlatList
        data={notes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.noteCard}
            onPress={() => navigation.navigate("EditNote", { note: item })}
          >
            <Text style={styles.noteText}>{item.text}</Text>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDelete(item.id)}
            >
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 20, color: "gray" }}>
            No notes yet. Add one!
          </Text>
        }
      />

      {/* Add Note button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("AddNote")}
      >
        <Text style={styles.addButtonText}>Add Note</Text>
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
    marginVertical: 15,
  },
  noteCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  noteText: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  deleteButton: {
    backgroundColor: "#FF4D85",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginLeft: 10,
  },
  deleteText: {
    color: "#fff",
    fontWeight: "600",
  },
  addButton: {
    backgroundColor: "#FF4D85",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 15,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default NotesScreen;

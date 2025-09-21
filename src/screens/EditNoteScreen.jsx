import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, SafeAreaView } from 'react-native';

const EditNoteScreen = ({ navigation, route }) => {
  const { note, index, onEditNote } = route.params;
  const [editedNote, setEditedNote] = useState(note);

  const handleSave = () => {
    if (editedNote.trim() === '') return;

    onEditNote(index, editedNote);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        style={styles.input}
        value={editedNote}
        onChangeText={setEditedNote}
        multiline
      />

      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveText}>Save Changes</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: '#FFF0F5', 
    justifyContent: 'flex-start',
  },
  input: { 
    borderWidth: 1, 
    borderColor: '#FFB3C6', 
    backgroundColor: '#fff', 
    borderRadius: 12, 
    padding: 14, 
    fontSize: 16, 
    minHeight: 150, 
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  saveBtn: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#FF4D85',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default EditNoteScreen;

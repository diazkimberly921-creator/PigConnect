import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, SafeAreaView } from 'react-native';

const AddNoteScreen = ({ navigation, route }) => {
  const [note, setNote] = useState('');

  const handleAddNote = () => {
    if (note.trim() === '') return;

    if (route.params?.onAddNote) {
      route.params.onAddNote(note);
    }

    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.centerContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter note"
          value={note}
          onChangeText={setNote}
          multiline
        />

        <TouchableOpacity style={styles.saveBtn} onPress={handleAddNote}>
          <Text style={styles.saveText}>Save Note</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FFF0F5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center', // center vertically
    paddingHorizontal: 20,
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

export default AddNoteScreen;

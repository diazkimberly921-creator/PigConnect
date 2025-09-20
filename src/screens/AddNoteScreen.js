import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';

const AddNoteScreen = ({ navigation, route }) => {
  const [note, setNote] = useState('');

  const handleAddNote = () => {
    if (note.trim() === '') return;

    // send the new note back to Home
    if (route.params?.onAddNote) {
      route.params.onAddNote(note);
    }

    navigation.goBack(); // go back to Home
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter note"
        value={note}
        onChangeText={setNote}
      />
      <Button title="Save Note" onPress={handleAddNote} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', marginBottom: 10, padding: 10 },
});

export default AddNoteScreen;
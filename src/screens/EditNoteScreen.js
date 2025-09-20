import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';

const EditNoteScreen = ({ navigation, route }) => {
  const { note, index, onEditNote } = route.params; // index = Firestore ID
  const [editedNote, setEditedNote] = useState(note);

  const handleSave = () => {
    if (editedNote.trim() === '') return;
    onEditNote(index, editedNote); // update note in Firestore
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={editedNote}
        onChangeText={setEditedNote}
      />
      <Button title="Save Changes" onPress={handleSave} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', marginBottom: 10, padding: 10 },
});

export default EditNoteScreen;
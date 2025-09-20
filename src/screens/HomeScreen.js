import React, { useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

const HomeScreen = ({ navigation }) => {
  const [notes, setNotes] = useState([]);

  const addNote = (newNote) => {
    setNotes((prevNotes) => [...prevNotes, newNote]);
  };

  const editNote = (index, newNote) => {
    setNotes((prevNotes) =>
      prevNotes.map((n, i) => (i === index ? newNote : n))
    );
  };

  const deleteNote = (index) => {
    setNotes((prevNotes) => prevNotes.filter((_, i) => i !== index));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Notes</Text>

      <FlatList
        data={notes}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.noteContainer}>
            {/* Tap the text to edit */}
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('EditNote', {
                  note: item,
                  index: index,
                  onEditNote: editNote,
                })
              }
            >
              <Text style={styles.note}>{item}</Text>
            </TouchableOpacity>

            {/* Delete button */}
            <Button
              title="Delete"
              color="red"
              onPress={() => deleteNote(index)}
            />
          </View>
        )}
      />

      <Button
        title="Add Note"
        onPress={() => navigation.navigate('AddNote', { onAddNote: addNote })}
      />

      <View style={{ marginTop: 20 }}>
        <Button
          title="Logout"
          color="red"
          onPress={() => navigation.replace('Login')}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, marginBottom: 10, textAlign: 'center' },
  noteContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  note: { fontSize: 16, flex: 1 },
});

export default HomeScreen;
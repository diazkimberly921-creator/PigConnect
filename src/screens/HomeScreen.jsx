// src/screens/HomeScreen.jsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TextInput,
  Picker,
} from "react-native";
import { db } from "../firebase/firebaseConfig";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";

const HomeScreen = () => {
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("All");

  useEffect(() => {
    const postsRef = collection(db, "posts");
    const q = query(postsRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedPosts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(fetchedPosts);
    });

    return () => unsubscribe();
  }, []);

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.text?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLocation =
      locationFilter === "All" || post.location === locationFilter;

    return matchesSearch && matchesLocation;
  });

  const renderPost = ({ item }) => (
    <View style={styles.postCard}>
      <Text style={styles.user}>{item.author || "Anonymous"}</Text>
      <Text style={styles.content}>{item.text}</Text>
      {item.image ? (
        <Image source={{ uri: item.image }} style={styles.postImage} />
      ) : null}
      {item.location ? (
        <Text style={styles.location}>📍 {item.location}</Text>
      ) : null}
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredPosts}
        keyExtractor={(item) => item.id}
        renderItem={renderPost}
        contentContainerStyle={styles.feed}
        ListHeaderComponent={() => (
          <View style={styles.headerContainer}>
            <Text style={styles.title}>🐷 PigConnect Feed</Text>

            {/* 🔍 Search Bar */}
            <TextInput
              style={styles.searchInput}
              placeholder="Search posts..."
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />

            {/* 📍 Location Picker */}
            <Picker
              selectedValue={locationFilter}
              style={styles.picker}
              onValueChange={(value) => setLocationFilter(value)}
            >
              <Picker.Item label="🌍 All Locations" value="All" />
              <Picker.Item label="🏠 Manila" value="Manila" />
              <Picker.Item label="🏡 Cebu" value="Cebu" />
              <Picker.Item label="🌴 Davao" value="Davao" />
            </Picker>
          </View>
        )}
        stickyHeaderIndices={[0]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF0F5",
  },
  headerContainer: {
    backgroundColor: "#FFF0F5",
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#FFD6E8",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#FF4D85",
    textAlign: "center",
    paddingVertical: 12,
  },
  searchInput: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#FFD6E8",
    fontSize: 14,
  },
  picker: {
    marginHorizontal: 12,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#FFD6E8",
  },
  feed: {
    paddingHorizontal: 12,
    paddingBottom: 24,
  },
  postCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  user: {
    fontWeight: "bold",
    fontSize: 15,
    color: "#FF4D85",
  },
  content: {
    fontSize: 14,
    color: "#333",
    marginVertical: 6,
  },
  postImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginTop: 8,
  },
  location: {
    fontSize: 12,
    color: "#555",
    marginTop: 6,
  },
});

export default HomeScreen;

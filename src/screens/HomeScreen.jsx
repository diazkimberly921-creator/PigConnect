// src/screens/HomeScreen.jsx
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, Image } from "react-native";
import { db } from "../firebase/firebaseConfig";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";

const HomeScreen = () => {
  const [posts, setPosts] = useState([]);

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

  const renderPost = ({ item }) => (
    <View style={styles.postCard}>
      <Text style={styles.user}>{item.user}</Text>
      <Text style={styles.content}>{item.content}</Text>
      {item.price ? <Text style={styles.price}>₱{item.price}</Text> : null}
      {item.image ? (
        <Image source={{ uri: item.image }} style={styles.postImage} />
      ) : null}
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={renderPost}
        contentContainerStyle={styles.feed}
        // ✅ Sticky header
        ListHeaderComponent={() => (
          <Text style={styles.title}>🐷 PigConnect Feed</Text>
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
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FF4D85",
    textAlign: "center",
    paddingVertical: 16,
    paddingTop: 28, // push header a bit lower
    backgroundColor: "#FFF0F5", // ensures header background covers while sticky
    borderBottomWidth: 1,
    borderBottomColor: "#FFD6E8",
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
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#28a745",
    marginTop: 4,
  },
  postImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginTop: 8,
  },
});

export default HomeScreen;

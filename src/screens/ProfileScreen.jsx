// src/screens/ProfileScreen.jsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  TextInput,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { auth, db, storage } from "../firebase/firebaseConfig";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const ProfileScreen = () => {
  const [profile, setProfile] = useState({
    name: auth.currentUser?.email || "Pig Farmer",
    location: "Toledo, Cebu",
    avatar: null,
  });
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");
  const [price, setPrice] = useState("");
  const [postImage, setPostImage] = useState(null);

  useEffect(() => {
    const postsRef = collection(db, "posts");
    const q = query(postsRef, where("uid", "==", auth.currentUser?.uid));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedPosts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(fetchedPosts);
    });

    return () => unsubscribe();
  }, []);

  const pickAvatar = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: [ImagePicker.MediaType.Image],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      const imgUri = result.assets[0].uri;

      const imgRef = ref(storage, `avatars/${auth.currentUser.uid}.jpg`);
      const response = await fetch(imgUri);
      const blob = await response.blob();

      await uploadBytes(imgRef, blob);
      const downloadURL = await getDownloadURL(imgRef);

      setProfile({ ...profile, avatar: downloadURL });
    }
  };

  const pickPostImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: [ImagePicker.MediaType.Image],
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      setPostImage(result.assets[0].uri);
    }
  };

  const addPost = async () => {
    if (!content && !postImage) return;

    let imageUrl = null;
    if (postImage) {
      const imgRef = ref(
        storage,
        `posts/${Date.now()}-${auth.currentUser.uid}.jpg`
      );
      const response = await fetch(postImage);
      const blob = await response.blob();
      await uploadBytes(imgRef, blob);
      imageUrl = await getDownloadURL(imgRef);
    }

    await addDoc(collection(db, "posts"), {
      uid: auth.currentUser.uid,
      user: profile.name,
      content,
      price,
      image: imageUrl,
      createdAt: serverTimestamp(),
    });

    setContent("");
    setPrice("");
    setPostImage(null);
  };

  // ✅ Delete post
  const handleDelete = async (id) => {
    Alert.alert("Delete Post", "Are you sure you want to delete this post?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Yes, Delete",
        onPress: async () => {
          await deleteDoc(doc(db, "posts", id));
        },
      },
    ]);
  };

  // ✅ Edit post
  const handleEdit = async (id, oldContent, oldPrice) => {
    Alert.prompt(
      "Edit Post",
      "Update your post content:",
      async (newContent) => {
        if (!newContent) return;
        await updateDoc(doc(db, "posts", id), {
          content: newContent,
          price: oldPrice,
        });
      },
      "plain-text",
      oldContent
    );
  };

  const renderPost = ({ item }) => (
    <View style={styles.postCard}>
      <Text style={styles.postUser}>{item.user}</Text>
      <Text style={styles.postContent}>{item.content}</Text>
      {item.price ? <Text style={styles.postPrice}>₱{item.price}</Text> : null}
      {item.image ? (
        <Image source={{ uri: item.image }} style={styles.postImage} />
      ) : null}

      {/* ✅ Edit + Delete Buttons */}
      <View style={styles.postActions}>
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: "#FFD700" }]}
          onPress={() => handleEdit(item.id, item.content, item.price)}
        >
          <Text style={styles.actionText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: "#FF4D85" }]}
          onPress={() => handleDelete(item.id)}
        >
          <Text style={styles.actionText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Profile Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={pickAvatar}>
          {profile.avatar ? (
            <Image source={{ uri: profile.avatar }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>+</Text>
            </View>
          )}
        </TouchableOpacity>
        <Text style={styles.name}>{profile.name}</Text>
        <Text style={styles.location}>{profile.location}</Text>
      </View>

      {/* Post Form */}
      <View style={styles.postForm}>
        <TextInput
          style={styles.input}
          placeholder="What's new about your pigs? 🐷"
          value={content}
          onChangeText={setContent}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter price (₱)"
          keyboardType="numeric"
          value={price}
          onChangeText={setPrice}
        />
        <View style={styles.formActions}>
          <TouchableOpacity style={styles.button} onPress={pickPostImage}>
            <Text style={styles.buttonText}>Upload Image</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={addPost}>
            <Text style={styles.buttonText}>Post</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* User Posts */}
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={renderPost}
        contentContainerStyle={styles.feed}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF0F5" },
  header: { alignItems: "center", padding: 20 },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 10 },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#FF4D85",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: { fontSize: 32, color: "#fff" },
  name: { fontSize: 22, fontWeight: "bold", color: "#FF4D85" },
  location: { fontSize: 14, color: "#666" },
  postForm: {
    padding: 15,
    backgroundColor: "#fff",
    margin: 10,
    borderRadius: 10,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginBottom: 10,
    padding: 8,
  },
  formActions: { flexDirection: "row", justifyContent: "space-between" },
  button: {
    backgroundColor: "#FF4D85",
    padding: 8,
    borderRadius: 6,
    marginTop: 5,
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
  feed: { padding: 10 },
  postCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  postUser: { fontWeight: "bold", color: "#FF4D85" },
  postContent: { fontSize: 14, color: "#333", marginVertical: 4 },
  postPrice: { fontSize: 16, fontWeight: "bold", color: "#28a745" },
  postImage: { width: "100%", height: 200, borderRadius: 8, marginTop: 5 },
  postActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  actionBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginLeft: 8,
  },
  actionText: { color: "#fff", fontWeight: "bold" },
});

export default ProfileScreen;

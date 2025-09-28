// src/screens/ProfileScreen.jsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  FlatList,
  Picker,
} from "react-native";
import { auth, db } from "../firebase/firebaseConfig";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

export default function ProfileScreen() {
  const user = auth.currentUser;
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [newPost, setNewPost] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [editingName, setEditingName] = useState(false); // toggle edit mode
  const [tempName, setTempName] = useState(""); // temp name while editing

  // Fetch profile
  useEffect(() => {
    if (!user) return;
    const fetchProfile = async () => {
      try {
        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setProfile(snap.data());
        } else {
          const newProfile = {
            name: user.displayName || "Anonymous",
            email: user.email,
            photoURL:
              user.photoURL ||
              "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
          };
          await setDoc(ref, newProfile);
          setProfile(newProfile);
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  // Fetch user's posts
  const fetchPosts = async () => {
    if (!user) return;
    try {
      const postsRef = collection(db, "posts");
      const q = query(postsRef, where("uid", "==", user.uid));
      const querySnap = await getDocs(q);
      const userPosts = querySnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(userPosts);
    } catch (err) {
      console.error("Error fetching posts:", err);
    } finally {
      setLoadingPosts(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [user]);

  // Save updated username
  const saveUsername = async () => {
    if (!tempName.trim()) {
      setEditingName(false);
      return;
    }
    try {
      const ref = doc(db, "users", user.uid);
      await updateDoc(ref, { name: tempName });
      setProfile((prev) => ({ ...prev, name: tempName }));
    } catch (err) {
      console.error("Error updating name:", err);
    } finally {
      setEditingName(false);
    }
  };

  // Create Post
  const handleCreatePost = async () => {
    if (!newPost.trim()) return;

    if (!selectedLocation) {
      alert("Please choose a location before posting.");
      return;
    }

    try {
      await addDoc(collection(db, "posts"), {
        uid: user.uid,
        text: newPost,
        author: profile?.name || "Anonymous",
        location: selectedLocation,
        createdAt: serverTimestamp(),
      });
      setNewPost("");
      setSelectedLocation("");
      fetchPosts();
    } catch (err) {
      console.error("Error creating post:", err);
    }
  };

  // Edit post
  const handleEditPost = (postId, oldText) => {
    const newText = prompt("Update your post:", oldText);
    if (!newText || !newText.trim()) return;
    updateDoc(doc(db, "posts", postId), { text: newText })
      .then(() => {
        setPosts((prev) =>
          prev.map((p) => (p.id === postId ? { ...p, text: newText } : p))
        );
      })
      .catch((err) => console.error("Error editing post:", err));
  };

  // Delete post (⚡ instant delete, no confirmation)
  const handleDeletePost = async (postId) => {
    try {
      await deleteDoc(doc(db, "posts", postId));
      setPosts((prev) => prev.filter((p) => p.id !== postId));
    } catch (err) {
      console.error("Error deleting post:", err);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#FF4D85" />
        <Text>Loading profile...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Avatar */}
      <Image source={{ uri: profile.photoURL }} style={styles.avatar} />

      {/* Username inline edit */}
      {editingName ? (
        <TextInput
          style={[styles.name, { borderBottomWidth: 1, borderColor: "#FF4D85" }]}
          value={tempName}
          onChangeText={setTempName}
          autoFocus
          onBlur={saveUsername}
          onSubmitEditing={saveUsername}
        />
      ) : (
        <TouchableOpacity
          onPress={() => {
            setTempName(profile.name);
            setEditingName(true);
          }}
        >
          <Text style={styles.name}>{profile.name}</Text>
        </TouchableOpacity>
      )}

      <Text style={styles.email}>{profile.email}</Text>

      {/* Create Post */}
      <Text style={styles.label}>➕ Create Post</Text>
      <TextInput
        style={styles.input}
        placeholder="What's on your mind?"
        value={newPost}
        onChangeText={setNewPost}
      />

      {/* Location Picker */}
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedLocation}
          onValueChange={(itemValue) => setSelectedLocation(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Select Location" value="" />
          <Picker.Item label="Manila" value="Manila" />
          <Picker.Item label="Cebu" value="Cebu" />
          <Picker.Item label="Davao" value="Davao" />
        </Picker>
      </View>

      <TouchableOpacity style={styles.postBtn} onPress={handleCreatePost}>
        <Text style={styles.postText}>📤 Post</Text>
      </TouchableOpacity>

      {/* My Posts */}
      <Text style={styles.label}>📝 My Posts</Text>
      {loadingPosts ? (
        <ActivityIndicator size="small" color="#FF4D85" />
      ) : posts.length === 0 ? (
        <Text style={styles.value}>You haven’t posted anything yet.</Text>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.postCard}>
              <Text style={styles.postTextContent}>{item.text}</Text>
              <Text style={styles.postLocation}>📍 {item.location}</Text>
              <View style={styles.postActions}>
                <TouchableOpacity
                  style={styles.editBtn}
                  onPress={() => handleEditPost(item.id, item.text)}
                >
                  <Text style={styles.editText}>✏️ Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() => handleDeletePost(item.id)}
                >
                  <Text style={styles.deleteText}>🗑️ Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF0F5", alignItems: "center", padding: 20 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  avatar: { width: 120, height: 120, borderRadius: 60, marginTop: 40, marginBottom: 20, borderWidth: 3, borderColor: "#FF4D85" },
  name: { fontSize: 22, fontWeight: "bold", color: "#FF4D85", textAlign: "center" },
  email: { fontSize: 14, color: "gray", marginBottom: 20 },
  label: { fontSize: 16, marginTop: 15, color: "#333", fontWeight: "600" },
  input: { borderWidth: 1, borderColor: "#FF4D85", borderRadius: 8, padding: 10, width: "90%", marginTop: 10, backgroundColor: "#fff" },
  pickerContainer: { width: "90%", borderWidth: 1, borderColor: "#FF4D85", borderRadius: 8, marginTop: 10, backgroundColor: "#fff" },
  picker: { width: "100%" },
  postBtn: { marginTop: 10, backgroundColor: "#28a745", paddingVertical: 6, paddingHorizontal: 14, borderRadius: 8 },
  postText: { color: "#fff", fontWeight: "bold" },
  value: { fontSize: 16, marginBottom: 10, color: "#555" },
  postCard: { backgroundColor: "#fff", borderRadius: 8, padding: 12, marginVertical: 6, width: "100%" },
  postTextContent: { fontSize: 15, color: "#333" },
  postLocation: { fontSize: 13, color: "gray", marginTop: 4 },
  postActions: { flexDirection: "row", marginTop: 8 },
  editBtn: { backgroundColor: "#FF4D85", paddingVertical: 6, paddingHorizontal: 14, borderRadius: 8, marginRight: 5 },
  editText: { color: "#fff", fontWeight: "bold" },
  deleteBtn: { backgroundColor: "#dc3545", paddingVertical: 6, paddingHorizontal: 14, borderRadius: 8 },
  deleteText: { color: "#fff", fontWeight: "bold" },
});

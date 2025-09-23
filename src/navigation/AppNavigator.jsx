import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import AppStack from "./AppStack";
import AuthStack from "./AuthStack";
import { ActivityIndicator, View } from "react-native";

const AppNavigator = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
   const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);   // ✅ this allows login to work properly
    setLoading(false);
  });
  return unsubscribe;
  },
    []);




  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#FF4D85" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default AppNavigator;

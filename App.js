import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context"; // ✅ new safe area provider
import AppNavigator from "./src/navigation/AppNavigator";

export default function App() {
  return (
    <SafeAreaProvider>
      <AppNavigator />
    </SafeAreaProvider>
  );
}

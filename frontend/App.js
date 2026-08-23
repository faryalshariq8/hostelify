import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AppNavigator from "./src/navigation/AppNavigator";
import { AuthProvider } from "./src/context/AuthContext";
import ScreenWrapper from "./src/components/ScreenWrapper";

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <ScreenWrapper>
          <AppNavigator />
        </ScreenWrapper>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
import { Stack } from "expo-router";
import { StatusBar, setStatusBarHidden } from "expo-status-bar";
import { useEffect } from "react";
import { AppState } from "react-native";
import "./globals.css";

export default function RootLayout() {
  useEffect(() => {
    setStatusBarHidden(true, "slide");

    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active" || state === "inactive") {
        setStatusBarHidden(true, "slide");
      }
    });

    return () => sub.remove();
  }, []);

  return (
    <>
      <StatusBar hidden animated />
      <Stack
        screenOptions={{
          headerShown: false,
          statusBarHidden: true,
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="movies/[id]" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}

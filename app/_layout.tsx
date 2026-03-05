import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { useEffect } from "react";
import { useRouter } from "expo-router";
import { View, Text, ActivityIndicator } from "react-native";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { FlashCardProvider, useFlashCards } from "@/context/FlashCardContext";

export const unstable_settings = {
  initialRouteName: "(tabs)", // This might be needed depending on your setup
};

function RootNavigator() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const { isFirstLaunch, isLoading } = useFlashCards(); // Get both states

  useEffect(() => {
    console.log('isFirstLaunch:', isFirstLaunch, 'isLoading:', isLoading);
    
    // Only navigate when loading is complete and we have a definitive state
    if (!isLoading && isFirstLaunch !== null) {
      if (isFirstLaunch === true) {
        console.log("Navigating to intro");
        router.replace("/intro");
      } else {
        console.log("Navigating to tabs");
        router.replace("(tabs)");
      }
    }
  }, [isFirstLaunch, isLoading]);

  // Show loading indicator while checking first launch status
  if (isLoading || isFirstLaunch === null) {
    return (
     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colorScheme === 'dark' ? '#fff' : '#000'} />
        <Text style={{ marginTop: 10 }}>Loading...</Text>
      </View>
    );
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="intro" />
        <Stack.Screen name="(tabs)" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <FlashCardProvider>
      <RootNavigator />
    </FlashCardProvider>
  );
}
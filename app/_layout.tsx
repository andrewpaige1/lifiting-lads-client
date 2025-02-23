import React, { useEffect } from 'react';
import { ThemeProvider } from '@react-navigation/native';
import { DarkTheme, DefaultTheme } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { Button, View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';

import { useColorScheme } from '@/hooks/useColorScheme';
import { useAuth } from '@/hooks/useAuth';  // <-- Import the custom hook
import TopRightIcons from './TopRightIcons';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  
  // Use the custom hook
  const { userInfo, request, handleLogin } = useAuth();

  // Load fonts
  const [fontsLoaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  // Hide splash screen once fonts are loaded
  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null; // or a loading spinner
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <TopRightIcons />

      {!userInfo ? (
        <View style={styles.container}>
          <Button
            title="Login with Auth0"
            disabled={!request}
            onPress={handleLogin}
          />
        </View>
      ) : (
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="PRPostScreen" options={{ title: 'Post a PR' }} /> {/* 👈 Added this */}
          <Stack.Screen name="prePost" options={{ title: 'Preview Post' }} />
          <Stack.Screen name="CameraScreen" options={{ title: 'Post Your Lift' }} /> {/* 👈 Added this */}
          <Stack.Screen name="+not-found" />
        </Stack>
      )}

      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    // change the size of the buttons
    
  },
});

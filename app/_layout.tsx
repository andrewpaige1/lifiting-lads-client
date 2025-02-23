import React, { useEffect } from 'react';
import { ThemeProvider } from '@react-navigation/native';
import { DarkTheme, DefaultTheme } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { Button, View, Text, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';

import { useColorScheme } from '@/hooks/useColorScheme';
import { useAuth } from '@/hooks/useAuth'; 
import TopRightIcons from './TopRightIcons';
import UserProvider from '../Store';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <UserProvider>
      <RootLayoutContent />
    </UserProvider>
  );
}

function RootLayoutContent() {
  const colorScheme = useColorScheme();
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
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <TopRightIcons />

      {!userInfo ? (
        <View style={styles.container}>
          <Text style={styles.title}>Welcome to Lifting Lads</Text>
          <Text style={styles.subtitle}>
            Track your workouts, stay motivated, and see when your friends are at the gym.
          </Text>
          <Button
            title="Login to Get Started"
            disabled={!request}
            onPress={handleLogin}
          />
        </View>
      ) : (
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="PRPostScreen" options={{ title: 'Post a PR' }} />
          <Stack.Screen name="prePost" options={{ title: 'Preview Post' }} />
          <Stack.Screen name="CameraScreen" options={{ title: 'Post Your Lift' }} />
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
    paddingHorizontal: 20,
    backgroundColor: '#F5FCFF',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
});


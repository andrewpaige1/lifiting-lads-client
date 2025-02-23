import React from 'react';
import { Image, StyleSheet, Button, View } from 'react-native';

// If you already have a custom hook or function for logout, import it here:
import { useAuth } from '@/hooks/useAuth'; 

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import TopRightIcons from '../TopRightIcons';

export default function ProfileScreen() {
  // Get the logout handler from your auth hook
  const { handleLogout } = useAuth();

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/dumbbell.png')}
          style={styles.reactLogo}
        />
      }
    >
      {/* Optionally place icons at the top */}
      <TopRightIcons />

      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Post</ThemedText>
        <HelloWave />
      </ThemedView>

      {/* Add the Logout Button */}
      <View style={{ marginTop: 16 }}>
        <Button title="Logout" onPress={handleLogout} />
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});

// app/post.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from 'expo-router';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { router } from 'expo-router';
// Define route parameters
type RootStackParamList = {
  PRPostScreen: undefined;
  CameraScreen: undefined;
  PostReview: { imageUri: string };
  '(tabs)': undefined;
};

// Type for navigation prop
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const PostScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Create a New Post</Text>

      {/* Post a PR */}
      <TouchableOpacity style={styles.box} onPress={() => navigation.navigate('PRPostScreen')}>
        <Text style={styles.boxText}>Post a PR</Text>
      </TouchableOpacity>

      {/* Post Your Lift */}
      <TouchableOpacity style={styles.box} onPress={() => router.push('/CameraScreen')}>
        <Text style={styles.boxText}>Post Your Lift</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PostScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  box: {
    width: '100%',
    padding: 20,
    marginVertical: 10,
    backgroundColor: '#007bff',
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  boxText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
});

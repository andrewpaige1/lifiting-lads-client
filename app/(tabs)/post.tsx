// app/post.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from 'expo-router';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Define route parameters inline
type RootStackParamList = {
  MainPost: undefined;
  Camera: undefined;
  PRPost: undefined;
  PostReview: { imageUri: string };
  '(tabs)': undefined;
};

// Type for navigation prop
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const Post = () => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Create a New Post</Text>

      <TouchableOpacity style={styles.box} onPress={() => navigation.navigate('PRPost')}>
        <Text style={styles.boxText}>Post a PR</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.box} onPress={() => navigation.navigate('Camera')}>
        <Text style={styles.boxText}>Post Your Lift</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  box: {
    width: '80%',
    padding: 20,
    marginVertical: 10,
    backgroundColor: '#007bff',
    borderRadius: 10,
    alignItems: 'center',
  },
  boxText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
});

export default Post;

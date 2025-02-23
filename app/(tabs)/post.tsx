// app/post.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
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
    <View style={styles.safeArea}>
      {/* Header Section */}
      <View style={styles.headerBar}>
        <Text style={styles.headerText}>Create a New Post</Text>
        <Image
          source={{ uri: 'https://via.placeholder.com/40' }}
          style={styles.profilePic}
        />
      </View>

      {/* Decorative Line Under Header */}
      <View style={styles.headerLine} />

      <View style={styles.container}>
        {/* Post a PR */}
        <TouchableOpacity style={styles.box} onPress={() => navigation.navigate('PRPostScreen')}>
          <Text style={styles.boxText}>🏋️ Post a PR</Text>
        </TouchableOpacity>

      {/* Post Your Lift */}
      <TouchableOpacity style={styles.box} onPress={() => router.push('/LiftCam')}>
        <Text style={styles.boxText}>Post Your Lift</Text>
      </TouchableOpacity>
    </View>
    </View>
  );
};

export default PostScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },

  // Header Bar
  headerBar: {
    marginTop: 45, // Reduced space for tighter layout
    right: 10,
    marginBottom: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 8,
  },
  headerText: {
    fontSize: 25,
    fontWeight: '700',
    fontFamily: 'Poppins-Bold',
    color: '#37474f', // Modern gray for titles
    padding: 14,

  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#b0bec5',
  },

  // Decorative Line Under Header
  headerLine: {
    height: 4,
    backgroundColor: '#ddd', // Light gray to match other screens
    borderRadius: 2,
    marginHorizontal: 20,
    marginBottom: 10,
  },

  // Main Content Area
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#f0f2f5',
  },

  // Post Action Box
  box: {
    width: '100%',
    padding: 100,
    marginVertical: 12,
    backgroundColor: '#ffffff', // White card-style
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  boxText: {
    color: '#37474f',
    fontSize: 30,
    fontFamily: 'Poppins-SemiBold',
  },
});

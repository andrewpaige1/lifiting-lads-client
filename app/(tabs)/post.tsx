import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native';
import { useNavigation } from 'expo-router';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { router } from 'expo-router';

// Get screen dimensions
const { width, height } = Dimensions.get('window');

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
        {/* PR Post Button */}
        <TouchableOpacity style={styles.box} onPress={() => navigation.navigate('PRPostScreen')}>
          <Text style={styles.boxText}>🚨 PR Post</Text>
        </TouchableOpacity>

        {/* Live Lift Button */}
        <TouchableOpacity style={styles.box} onPress={() => router.push('/LiftCam')}>
          <Text style={styles.boxText}>🏋️ Live Lift</Text>
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
    marginTop: 30,
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
    fontSize: 28,
    fontWeight: '700',
    color: '#37474f',
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
    backgroundColor: '#ddd',
    borderRadius: 2,
    marginHorizontal: 20,
    marginBottom: 10,
  },

  // Main Content Area (Higher Position)
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: height * 0.02,
    backgroundColor: '#f0f2f5',
  },

  // Bigger Post Action Box
  box: {
    width: width * 0.95,
    paddingVertical: 65,
    marginVertical: 15,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },

  // Larger Button Text
  boxText: {
    color: '#37474f',
    fontSize: 34,
    fontWeight: '800',
  },
});

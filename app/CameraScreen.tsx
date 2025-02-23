// app/CameraScreen.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from 'expo-router';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';  // Import the route types

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'CameraScreen'>;

const CameraScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  const handleTakePicture = () => {
    Alert.alert('Take Picture', 'This is where users will take a picture.');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Post Your Lift</Text>

      <View style={styles.placeholder}>
        <Text style={styles.placeholderText}>Camera view will appear here</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleTakePicture}>
        <Text style={styles.buttonText}>Take Picture</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('(tabs)')}>
        <Text style={styles.buttonText}>Back to Post</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CameraScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  placeholder: {
    width: '100%',
    height: 300,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 20,
  },
  placeholderText: {
    color: '#666',
    fontSize: 16,
  },
  button: {
    padding: 15,
    backgroundColor: '#28a745',
    borderRadius: 10,
    alignItems: 'center',
    width: '80%',
    marginBottom: 10,
  },
  backButton: {
    padding: 15,
    backgroundColor: '#dc3545',
    borderRadius: 10,
    alignItems: 'center',
    width: '80%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

// app/PRPostScreen.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Video } from 'expo-av';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { Camera, CameraType } from 'expo-camera/next';


const PRPostScreen = () => {
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const navigation = useNavigation();

  const pickVideo = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setVideoUri(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Post a PR</Text>

      {/* Video Preview Box */}
      <View style={styles.previewBox}>
        {videoUri ? (
          <Video
            source={{ uri: videoUri }}
            style={styles.video}
            useNativeControls
            resizeMode="contain"
          />
        ) : (
          <Text style={styles.placeholderText}>Your selected video will appear here</Text>
        )}
      </View>

      {/* Pick from Camera Roll */}
      <TouchableOpacity style={styles.pickButton} onPress={pickVideo}>
        <Text style={styles.pickButtonText}>Select Video from Camera Roll</Text>
      </TouchableOpacity>

      {/* Go to Camera */}
      <TouchableOpacity
        style={styles.cameraButton}
        onPress={() => navigation.navigate('CameraScreen')}>
        <Text style={styles.pickButtonText}>Open Camera</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PRPostScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
    alignItems: 'center',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  previewBox: {
    width: '100%',
    height: 300,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderRadius: 10,
  },
  video: {
    width: '100%',
    height: '100%',
  },
  placeholderText: {
    color: '#666',
    fontSize: 16,
  },
  pickButton: {
    padding: 15,
    backgroundColor: '#007bff',
    borderRadius: 10,
    alignItems: 'center',
    width: '80%',
    marginBottom: 10,
  },
  cameraButton: {
    padding: 15,
    backgroundColor: '#28a745',
    borderRadius: 10,
    alignItems: 'center',
    width: '80%',
  },
  pickButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

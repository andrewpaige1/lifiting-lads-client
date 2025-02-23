import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import * as VideoThumbnails from 'expo-video-thumbnails';
import { useNavigation, useRoute } from '@react-navigation/native';
import { UserContext } from '@/Store';

const PrePostScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { videoUri } = route.params as { videoUri: string };
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [description, setDescription] = useState<string>('');
  const userContext = useContext(UserContext);
  const { userInfo } = userContext;

  // Generate the thumbnail
  useEffect(() => {
    const generateThumbnail = async () => {
      try {
        const { uri } = await VideoThumbnails.getThumbnailAsync(videoUri, { time: 1000 });
        setThumbnail(uri);
      } catch (error) {
        console.error('Failed to generate thumbnail:', error);
      }
    };

    if (videoUri) {
      generateThumbnail();
    }
  }, [videoUri]);

  // Handle post submission
  const handlePost = async () => {
    if (!description.trim()) {
      Alert.alert('Description Required', 'Please enter a description for your post.');
      return;
    }

    const formData = new FormData();
    formData.append("video", {
      uri: videoUri,
      type: "video/mp4",
      name: "upload.mp4",
    } as any); // Cast to any to avoid TypeScript errors
    formData.append('userInfo', JSON.stringify(userInfo));
    formData.append('description', description);

    try {
      const response = await fetch("https://lifting-lads-api.onrender.com/upload-video", {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert("Post Submitted");
        navigation.goBack();
      } else {
        Alert.alert("Upload Failed", result.error || "Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Error uploading video:", error);
      Alert.alert("Upload Failed", "An error occurred while uploading the video.");
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.innerContainer}>
          <Text style={styles.header}>Preview & Post</Text>

          {thumbnail ? (
            <Image source={{ uri: thumbnail }} style={styles.thumbnail} />
          ) : (
            <Text style={styles.placeholder}>Loading thumbnail...</Text>
          )}

          <TextInput
            style={styles.input}
            placeholder="Write a description for your lift..."
            placeholderTextColor="#444"
            multiline
            value={description}
            onChangeText={setDescription}
          />

          {/* Disclaimer for tagging */}
          <Text style={styles.disclaimer}>
            ⭐ Add tags related to your lift for easy discovery.
          </Text>

          <TouchableOpacity style={styles.postButton} onPress={handlePost}>
            <Text style={styles.postButtonText}>Post</Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default PrePostScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  innerContainer: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  thumbnail: {
    width: '100%',
    height: 300,
    borderRadius: 10,
    marginBottom: 20,
  },
  placeholder: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 120,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    textAlignVertical: 'top',
    marginBottom: 10,
  },
  disclaimer: {
    fontSize: 12,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  postButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  postButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
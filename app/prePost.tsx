import React, { useEffect, useState } from 'react';
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
} from 'react-native';
import * as VideoThumbnails from 'expo-video-thumbnails';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const PrePostScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { videoUri } = route.params as { videoUri: string };
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [description, setDescription] = useState<string>('');

  // Add Close Button to Header
  useEffect(() => {
    navigation.setOptions({
      headerTitle: '',
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
          <Ionicons name="close" size={36} color="gray" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

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
  const handlePost = () => {
    if (!description.trim()) {
      Alert.alert('Description Required', 'Please enter a description for your post.');
      return;
    }

    Alert.alert('Post Submitted', `Video: ${videoUri}\nDescription: ${description}`);
    navigation.goBack();
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.header}></Text>

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
          Add tags related to your lift for easy discovery!
        </Text>

        <TouchableOpacity style={styles.postButton} onPress={handlePost}>
          <Text style={styles.postButtonText}>Post</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default PrePostScreen;

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
    marginBottom: -30,
  },
  closeButton: {
    paddingLeft: 10,
  },
  thumbnail: {
    width: '100%',
    height: 500,
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

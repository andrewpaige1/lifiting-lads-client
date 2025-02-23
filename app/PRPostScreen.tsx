import React, { useEffect, useLayoutEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image, Alert } from 'react-native';
import { Video } from 'expo-av';
import * as MediaLibrary from 'expo-media-library';
import * as VideoThumbnails from 'expo-video-thumbnails';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const PRPostScreen = () => {
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [videos, setVideos] = useState<{ id: string; uri: string; thumbnail: string | null }[]>([]);
  const [permissionStatus, setPermissionStatus] = useState<string | null>(null);
  const navigation = useNavigation();

  // Request media permissions and load videos
  useEffect(() => {
    const getPermissionsAndVideos = async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      setPermissionStatus(status);

      if (status === 'granted') {
        loadVideos();
      } else {
        Alert.alert('Permission Required', 'Please enable media access in settings.');
      }
    };

    getPermissionsAndVideos();
  }, []);

  // Load videos and generate thumbnails
  const loadVideos = async () => {
    try {
      const media = await MediaLibrary.getAssetsAsync({
        mediaType: 'video',
        first: 30,
        sortBy: ['creationTime'],
      });

      const videosWithThumbnails = await Promise.all(
        media.assets.map(async (asset) => {
          const assetInfo = await MediaLibrary.getAssetInfoAsync(asset);
          const fileUri = assetInfo.localUri || asset.uri;
          const thumbnail = await generateThumbnail(fileUri);
          return { id: asset.id, uri: fileUri, thumbnail };
        })
      );

      setVideos(videosWithThumbnails);
    } catch (error) {
      console.error('Failed to load videos:', error);
    }
  };

  // Generate video thumbnail
  const generateThumbnail = async (uri: string) => {
    try {
      const { uri: thumbnailUri } = await VideoThumbnails.getThumbnailAsync(uri, {
        time: 1000,
      });
      return thumbnailUri;
    } catch (error) {
      console.error('Failed to generate thumbnail:', error);
      return null;
    }
  };

  // Update header with "Next" button
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: '',
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
          <Ionicons name="close" size={36} color="gray" />
        </TouchableOpacity>
      ),
      headerRight: () =>
        videoUri ? (
          <TouchableOpacity onPress={() => navigation.navigate('prePost', { videoUri })}>
            <Text style={styles.nextButton}>Next</Text>
          </TouchableOpacity>
        ) : null,
    });
  }, [navigation, videoUri]);

  // Select video from camera roll
  const selectVideo = (uri: string) => {
    setVideoUri(uri);
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
          <Text style={styles.placeholderText}>Select a video to preview it here</Text>
        )}
      </View>

      {/* Camera Roll Video Picker */}
      {permissionStatus === 'granted' ? (
        <View style={styles.cameraRollContainer}>
          <Text style={styles.subHeader}>Select a Video from Camera Roll</Text>

          <FlatList
            data={videos}
            keyExtractor={(item) => item.id}
            numColumns={3}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => selectVideo(item.uri)} style={styles.thumbnailWrapper}>
                {item.thumbnail ? (
                  <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
                ) : (
                  <View style={styles.thumbnailPlaceholder}>
                    <Text style={styles.errorText}>No Thumbnail</Text>
                  </View>
                )}
              </TouchableOpacity>
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.cameraRollContent}
          />
        </View>
      ) : (
        <Text style={styles.errorText}>Permission to access the camera roll is required.</Text>
      )}
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
  closeButton: {
    marginLeft: 10,
  },
  nextButton: {
    marginRight: 10,
    fontSize: 18,
    color: '#007bff',
    fontWeight: '600',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subHeader: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: '600',
    textAlign: 'left',
    width: '100%',
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
  cameraRollContainer: {
    flex: 1,
    width: '100%',
    marginTop: 10,
  },
  cameraRollContent: {
    paddingBottom: 100,
  },
  thumbnailWrapper: {
    margin: 5,
  },
  thumbnail: {
    width: 110,
    height: 110,
    borderRadius: 10,
    backgroundColor: '#ccc',
  },
  thumbnailPlaceholder: {
    width: 110,
    height: 110,
    borderRadius: 10,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
  },
});

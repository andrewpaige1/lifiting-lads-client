import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState, useRef } from 'react';
import { Button, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';

export default function App() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<any>(null);
  const [photo, setPhoto] = useState(null); // Store captured image

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  async function takePicture() {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync(); // Capture image
      setPhoto(photo.uri); // Save the image URI
      router.push({
        pathname: '/ViewPicture',
        params: { imageUri: photo.uri }, // Pass image URI to ViewPicture component
      });
    }
  }

  return (
    <View style={styles.container}>
      {photo ? (
        <View style={styles.previewContainer}>
          <Image source={{ uri: photo }} style={styles.preview} />
          <Button title="Retake" onPress={() => setPhoto(null)} />
        </View>
      ) : (
        <CameraView ref={cameraRef} style={styles.camera} facing={facing} />
      )}

      {/* Camera Controls positioned above the bottom tabs */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
          <Text style={styles.text}>Flip</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
          <Text style={styles.text}>📸</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  previewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  preview: {
    width: '100%',
    height: '100%',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 100, // Position above bottom tabs
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingVertical: 10,
  },
  button: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 30,
  },
  captureButton: {
    padding: 20,
    borderRadius: 50,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
});


import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ViewPicture() {
  const { imageUri } = useLocalSearchParams(); // Get image URI from navigation params
  const router = useRouter(); // For navigating back

  return (
    <View style={styles.container}>
      {imageUri ? (
        <Image source={{ uri: imageUri as string }} style={styles.image} />
      ) : (
        <Text style={styles.text}>No image found</Text>
      )}

      <TouchableOpacity style={styles.button} onPress={() => router.push('/')}>
        <Text style={styles.buttonText}>Retake Photo</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  image: {
    width: '90%',
    height: '70%',
    borderRadius: 10,
  },
  text: {
    fontSize: 18,
    color: 'white',
  },
  button: {
    marginTop: 20,
    backgroundColor: 'red',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
});
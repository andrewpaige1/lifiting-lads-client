import { useLocalSearchParams, useRouter } from 'expo-router';
import { 
  Image, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View, 
  TextInput, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { useState, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../Store';

export default function ViewPicture() {
  const userContext = useContext(UserContext);
  const { userInfo } = userContext;

  const { imageUri } = useLocalSearchParams(); // Get image URI from navigation params
  const router = useRouter(); // For navigating back
  const [text, setText] = useState(''); // State for the description input

  const handleSubmit = async () => {
    try {
      // Make sure imageUri is defined
      if (!imageUri) {
        alert('No image found to upload.');
        return;
      }

      // Build multipart form data
      const formData = new FormData();
      formData.append('image', {
        // The "uri" field is the local file path (e.g. file:///...)
        uri: imageUri,
        // The "type" should match the file mime-type, e.g. 'image/jpeg'
        type: 'image/jpeg',
        // A filename is required for Android uploads
        name: 'upload.jpg',
      } as any);

      // Append other fields
      formData.append('description', text);
      formData.append('userInfo', JSON.stringify(userInfo));

      const response = await axios.post(
        'http://172.23.36.208:3000/upload', 
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log('Response:', response.data);
      alert('Submitted successfully!');
    } catch (error) {
      console.error('Error:', error);
      alert('Submission failed');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {imageUri ? (
        <Image source={{ uri: imageUri as string }} style={styles.image} />
      ) : (
        <Text style={styles.text}>No image found</Text>
      )}

      <TextInput
        style={styles.input}
        placeholder="Enter description"
        placeholderTextColor="#aaa"
        value={text}
        onChangeText={setText}
      />

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => router.push('/')}>
        <Text style={styles.buttonText}>Retake Photo</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    paddingHorizontal: 20,
  },
  image: {
    width: '90%',
    height: '50%',
    borderRadius: 10,
  },
  text: {
    fontSize: 18,
    color: 'white',
    marginBottom: 10,
  },
  input: {
    width: '90%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    backgroundColor: '#222',
    color: 'white',
    marginTop: 20,
  },
  submitButton: {
    marginTop: 15,
    backgroundColor: 'blue',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  button: {
    marginTop: 15,
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

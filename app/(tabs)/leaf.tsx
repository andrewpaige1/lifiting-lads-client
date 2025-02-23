import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import * as Location from 'expo-location';
import axios from 'axios';
import Constants from 'expo-constants';

const LeafScreen = () => {
  const [gymLocation, setGymLocation] = useState('');
  const [carbonEmission, setCarbonEmission] = useState<string | null>(null);
  const [sustainabilityTip, setSustainabilityTip] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [factLoading, setFactLoading] = useState(false);

  // Get OpenAI API key from app.json
  const openaiApiKey = Constants.expoConfig?.extra?.openaiApiKey;

  // Get user's location
  const getUserLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Location permission is required.');
      return null;
    }

    const location = await Location.getCurrentPositionAsync({});
    return location.coords;
  };

  // Calculate carbon emission
  const calculateCarbonEmission = async () => {
    if (!gymLocation.trim()) {
      Alert.alert('Input Required', 'Please enter the gym location.');
      return;
    }

    setLoading(true);
    const userLocation = await getUserLocation();
    if (!userLocation) {
      setLoading(false);
      return;
    }

    try {
      const distance = 10; // Simulated distance (replace with real API)
      const emission = distance * 0.12;
      setCarbonEmission(`Estimated carbon emission: ${emission.toFixed(2)} kg CO₂`);
    } catch (error) {
      Alert.alert('Error', 'Failed to calculate emission.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch sustainability tip using OpenAI API
  const fetchSustainabilityTip = async () => {
    if (!openaiApiKey) {
      Alert.alert('Error', 'OpenAI API key is missing.');
      return;
    }

    setFactLoading(true);
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4',
          messages: [
            {
              role: 'user',
              content: 'Provide a fun fact about sustainability and carbon footprint awareness, with a cited source.',
            },
          ],
          temperature: 0.7,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${openaiApiKey}`,
          },
        }
      );

      const tip = response.data.choices?.[0]?.message?.content;
      if (tip) {
        setSustainabilityTip(tip);
      } else {
        Alert.alert('Error', 'No tip was generated.');
      }
    } catch (error: any) {
      console.error('API Error:', error.response?.data || error.message);
      Alert.alert('Error', `Failed to fetch sustainability tip: ${error.message}`);
    } finally {
      setFactLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header with Title and Profile Pic */}
      <View style={styles.headerWrapper}>
        <Text style={styles.header}>Climate Coach</Text>
        <TouchableOpacity>
          <Image
            source={{ uri: 'https://via.placeholder.com/40' }}
            style={styles.profilePic}
          />
        </TouchableOpacity>
      </View>

      {/* Decorative Line Under Header */}
      <View style={styles.headerLine} />

      {/* Main Content */}
      <ScrollView contentContainerStyle={styles.content}>
        <TextInput
          style={styles.input}
          placeholder="Enter gym location"
          value={gymLocation}
          onChangeText={setGymLocation}
        />

        <TouchableOpacity style={styles.button} onPress={calculateCarbonEmission} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Calculating...' : 'Calculate Emission'}</Text>
        </TouchableOpacity>

        {carbonEmission && (
          <View style={styles.resultBox}>
            <Text style={styles.resultText}>{carbonEmission}</Text>
          </View>
        )}

        {/* Generate Fun Fact Button */}
        <TouchableOpacity style={styles.factButton} onPress={fetchSustainabilityTip} disabled={factLoading}>
          {factLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Generate Fun Fact</Text>
          )}
        </TouchableOpacity>

        {sustainabilityTip && (
          <View style={styles.tipBox}>
            <Text style={styles.tipHeader}>🌍 Sustainability Fact:</Text>
            <Text style={styles.tipText}>{sustainabilityTip}</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default LeafScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },

  // Header Bar
  headerWrapper: {
    marginTop: -13, // Reduced space for tighter layout
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
  header: {
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
    backgroundColor: '#ddd',
    borderRadius: 2,
    marginHorizontal: 20,
    marginBottom: 10,
  },

  // Main Content
  content: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },

  input: {
    height: 50,
    borderColor: '#007bff',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    marginBottom: 15,
  },

  button: {
    padding: 15,
    backgroundColor: '#007bff',
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },

  factButton: {
    padding: 15,
    backgroundColor: '#28a745',
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },

  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },

  resultBox: {
    padding: 15,
    backgroundColor: '#e6f7ff',
    borderRadius: 10,
    marginBottom: 20,
  },

  resultText: {
    fontSize: 16,
    color: '#333',
  },

  tipBox: {
    padding: 15,
    backgroundColor: '#d4edda',
    borderRadius: 10,
    marginTop: 10,
  },

  tipHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#28a745',
    marginBottom: 5,
  },

  tipText: {
    fontSize: 16,
    color: '#333',
  },
});

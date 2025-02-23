import React, { useState, useEffect } from 'react';
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
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import * as Location from 'expo-location';
import axios from 'axios';
import Constants from 'expo-constants';
import { useNavigation } from '@react-navigation/native';

type LocationCoords = {
  latitude: number;
  longitude: number;
};

type Gym = {
  place_id: string;
  display_name: string;
  lat: string;
  lon: string;
};

const LeafScreen = () => {
  const [userLocation, setUserLocation] = useState<LocationCoords | null>(null);
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [gymSearch, setGymSearch] = useState<string>('');
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [selectedGym, setSelectedGym] = useState<Gym | null>(null);
  const [ecoImpact, setEcoImpact] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [funFact, setFunFact] = useState<string | null>(null);
  const [factLoading, setFactLoading] = useState(false);

  const openaiApiKey = Constants.expoConfig?.extra?.openaiApiKey;

  // 📍 Get User's Current Location
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required.');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      setUserLocation({ latitude, longitude });

      // Reverse Geocode to get user address
      try {
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
        );
        setUserAddress(response.data.display_name);
      } catch (error) {
        console.error('Failed to get address:', error);
      }
    })();
  }, []);

  // 🔍 Search Gyms Near User Location
  const searchGyms = async (query: string) => {
    setGymSearch(query);
    if (!query.trim() || !userLocation) {
      setGyms([]);
      return;
    }

    try {
      const { latitude, longitude } = userLocation;
      const response = await axios.get<Gym[]>('https://nominatim.openstreetmap.org/search', {
        params: {
          q: query,
          format: 'json',
          limit: 10,
          countrycodes: 'us',
          viewbox: `${longitude - 0.1},${latitude - 0.1},${longitude + 0.1},${latitude + 0.1}`,
          bounded: 1,
        },
      });

      setGyms(response.data);
    } catch (error) {
      console.error('Failed to fetch gym suggestions:', error);
    }
  };

  // 📏 Haversine Formula for Distance Calculation
  const haversineDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // 🏋️ Handle Gym Selection & Calculate Eco Impact
  const selectGym = (gym: Gym) => {
    setSelectedGym(gym);
    setGymSearch(gym.display_name);
    setGyms([]);

    if (userLocation) {
      const distance = haversineDistance(
        userLocation.latitude,
        userLocation.longitude,
        parseFloat(gym.lat),
        parseFloat(gym.lon)
      );

      const co2Emission = distance * 0.12;
      const fuelUsed = (distance / 12).toFixed(2);
      const tripTime = (distance / 50) * 60;

      setEcoImpact(
        `🌿 **Trip Eco Impact:**\n🚗 Distance: ${distance.toFixed(2)} km\n🌫️ CO₂ Emission: ${co2Emission.toFixed(2)} kg\n⛽ Fuel Used: ${fuelUsed} liters\n🕰️ Travel Time: ${tripTime.toFixed(0)} mins`
      );
    } else {
      Alert.alert('Error', 'Failed to get user location.');
    }
  };

  // 🌟 Fetch Sustainability Fun Fact
  const fetchFunFact = async () => {
    if (!openaiApiKey) {
      Alert.alert('Error', 'OpenAI API key is missing.');
      return;
    }

    setFactLoading(true);
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'user',
              content:
                'Provide a fun fact about sustainability and carbon footprint awareness with a cited source.',
            },
          ],
          temperature: 0.7,
          max_tokens: 150,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${openaiApiKey}`,
          },
        }
      );

      const tip = response.data.choices[0]?.message?.content;
      setFunFact(tip || 'No fact available at the moment.');
    } catch (error) {
      console.error('Failed to fetch fun fact:', error);
      Alert.alert('Error', 'Failed to fetch sustainability tip.');
    } finally {
      setFactLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerWrapper}>
        <Text style={styles.header}>🌿 Climate Coach</Text>
        <TouchableOpacity onPress={() => navigation.navigate('profile')}>
          <Image source={{ uri: 'https://via.placeholder.com/40' }} style={styles.profilePic} />
        </TouchableOpacity>
      </View>

      <View style={styles.headerLine} />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.content}>

          {/* 📍 User Location */}
          {userAddress ? (
            <View style={styles.locationBox}>
              <Text style={styles.locationText}>📍 Your Location: {userAddress}</Text>
            </View>
          ) : (
            <ActivityIndicator size="small" color="#007bff" />
          )}

          {/* 🏋️ Gym Search */}
          <TextInput
            style={styles.input}
            placeholder="Search nearby gyms (e.g., Planet Fitness, Crunch)..."
            value={gymSearch}
            onChangeText={searchGyms}
          />

          {/* Dropdown for Gym Suggestions */}
          {gyms.length > 0 && (
            <FlatList
              data={gyms}
              keyExtractor={(item) => item.place_id}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.suggestionItem} onPress={() => selectGym(item)}>
                  <Text style={styles.suggestionText}>{item.display_name}</Text>
                </TouchableOpacity>
              )}
            />
          )}

          {/* 🌿 Eco Impact Output */}
          {selectedGym && ecoImpact && (
            <View style={styles.resultBox}>
              <Text style={styles.resultText}>🏋️ Selected Gym: {selectedGym.display_name}</Text>
              <Text style={styles.resultText}>{ecoImpact}</Text>
            </View>
          )}

          {/* 🌟 Fun Fact Display */}
          {funFact && (
            <View style={styles.funFactBox}>
              <Text style={styles.funFactHeader}>🌍 Sustainability Tip</Text>
              <Text style={styles.funFactText}>{funFact}</Text>
            </View>
          )}
        </ScrollView>

        {/* 🌟 Fixed Fun Fact Button */}
        <View style={styles.bottomButtonWrapper}>
          <TouchableOpacity style={styles.factButton} onPress={fetchFunFact} disabled={factLoading}>
            {factLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.buttonText}>🌟 Generate Fun Fact</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LeafScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  headerWrapper: {
    marginTop: -13,
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
    color: '#37474f',
    fontFamily: 'Poppins-Bold',
    color: '#37474f',
    padding: 14,
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#b0bec5',
  },
  headerLine: {
    height: 4,
    backgroundColor: '#ddd',
    borderRadius: 2,
    marginHorizontal: 20,
    marginBottom: 10,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 80,
  },
  locationBox: {
    padding: 12,
    backgroundColor: '#e6f7ff',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  locationText: {
    fontSize: 16,
    color: '#007bff',
    fontWeight: '500',
  },
  input: {
    height: 50,
    borderColor: '#007bff',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    marginBottom: 12,
    fontSize: 16,
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 5,
  },
  suggestionText: {
    fontSize: 16,
    color: '#333',
  },
  resultBox: {
    padding: 15,
    backgroundColor: '#d4edda',
    borderRadius: 12,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  resultText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
    lineHeight: 22,
  },
  funFactBox: {
    padding: 15,
    backgroundColor: '#fff3cd',
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  funFactHeader: {
    fontSize: 18,
    fontWeight: '700',
    color: '#856404',
    marginBottom: 5,
  },
  funFactText: {
    fontSize: 16,
    color: '#6c757d',
    lineHeight: 22,
  },
  bottomButtonWrapper: {
    padding: 10,
    backgroundColor: '#f0f2f5',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  factButton: {
    padding: 30,
    backgroundColor: '#007bff',
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

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
const WORKER_URL = 'https://twilight-mountain-853c.wojcier2.workers.dev';

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
        `🌿 Trip Eco Impact:\n🚗 Distance: ${distance.toFixed(2)} km\n🌫️ CO₂ Emission: ${co2Emission.toFixed(2)} kg\n⛽ Fuel Used: ${fuelUsed} liters\n🕰️ Travel Time: ${tripTime.toFixed(0)} mins`
      );
    } else {
      Alert.alert('Error', 'Failed to get user location.');
    }
  };
// R937iL9pcBW8fplXc5IFfMx72lwl4Vm201DpU-BJ
  // 🌟 Fetch Sustainability Fun Fact from Cloudflare Worker

  async function run(model: string, input: any) {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/5f789daa18deaf45669138306e370b1d/ai/run/${model}`,
      {
        headers: { Authorization: "Bearer R937iL9pcBW8fplXc5IFfMx72lwl4Vm201DpU-BJ" },
        method: "POST",
        body: JSON.stringify(input),
      }
    );
    const result = await response.json();
    return result;
  }




  const fetchFunFact = async () => {
    setFactLoading(true);


    run("@cf/meta/llama-3-8b-instruct", {
      messages: [
        {
          role: "system",
          content: "You are a sustainability expert on the environment",
        },
        {
          role: "user",
          content:
            "Share a sustainability tip with a cited source.",
        },
      ],
    }).then((response) => {
      console.log(JSON.stringify(response));
      setFunFact(response.result.response);
      setFactLoading(false);


    });




    /*try {
        const response = await axios.post(
            WORKER_URL,
            { query: 'Share a sustainability tip with a cited source.' },
            { headers: { 'Content-Type': 'application/json' } }
        );

        const result = response.data?.response;
        if (result) {
            setFunFact(result);
        } else {
            setFunFact('No sustainability tip available at the moment.');
        }
    } catch (error) {
        console.error('Failed to fetch sustainability tip:', error);
        setFunFact('Failed to retrieve sustainability tip.');
    } finally {
        setFactLoading(false);
    }*/
};

  
  
  
  

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerWrapper}>
        <Text style={styles.header}>🌿 Climate Coach</Text>
        <TouchableOpacity>
          <Image source={{ uri: 'https://via.placeholder.com/40' }} style={styles.profilePic} />
        </TouchableOpacity>
      </View>

      <View style={styles.headerLine} />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.content}>
          {userAddress ? (
            <View style={styles.locationBox}>
              <Text style={styles.locationText}>📍 Your Location: {userAddress}</Text>
            </View>
          ) : (
            <ActivityIndicator size="small" color="#007bff" />
          )}

          <TextInput
            style={styles.input}
            placeholder="Search nearby gyms (e.g., Planet Fitness, Crunch)..."
            value={gymSearch}
            onChangeText={searchGyms}
          />

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

          {selectedGym && ecoImpact && (
            <View style={styles.resultBox}>
              <Text style={styles.resultText}>🏋️ Selected Gym: {selectedGym.display_name}</Text>
              <Text style={styles.resultText}>{ecoImpact}</Text>
            </View>
          )}

          {funFact && (
            <View style={styles.funFactBox}>
              <Text style={styles.funFactHeader}>🌍 Sustainability Tip</Text>
              <Text style={styles.funFactText}>{funFact.split('\n').map((line, index) => (
                <React.Fragment key={index}>
                  {line}
                  {'\n'}
                </React.Fragment>
              ))}</Text>
            </View>
          )}

        </ScrollView>

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
    paddingBottom: 150,
  },
  locationBox: {
    padding: 12,
    backgroundColor: '#e6f7ff',
    borderRadius: 12,
    marginBottom: 12,
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
  },
  resultText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
  funFactBox: {
    padding: 15,
    backgroundColor: '#fff3cd',
    borderRadius: 12,
    marginBottom: 20,
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
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  factButton: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    marginBottom: 40,
    backgroundColor: '#0077cc',
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

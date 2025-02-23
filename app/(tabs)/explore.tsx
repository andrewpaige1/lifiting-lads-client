import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';

// Sample data for search
const data = [
  { id: '1', name: 'Bench Press' },
  { id: '2', name: 'Deadlift' },
  { id: '3', name: 'Squat' },
  { id: '4', name: 'Overhead Press' },
  { id: '5', name: 'Bicep Curl' },
];

const ExploreScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState(data);
  const router = useRouter();

  // Handle search logic
  const handleSearch = (text: string) => {
    setSearchQuery(text);
    const filtered = data.filter((item) =>
      item.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredData(filtered);
  };

  return (
    <View style={styles.safeArea}>
      {/* Header with Title and Profile Pic */}
      <View style={styles.headerBar}>
        <Text style={styles.headerText}>Search for Lads</Text>
        <TouchableOpacity onPress={() => router.push('/profile')}>
          <Image
            source={{ uri: 'https://via.placeholder.com/40' }}
            style={styles.profilePic}
          />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.container}>
        <TextInput
          style={styles.searchInput}
          placeholder="Find your friends..."
          //italicize ???
          
          placeholderTextColor="#90a4ae"
          value={searchQuery}
          onChangeText={handleSearch}
        />

        {/* Search Results */}
        <FlatList
          data={filteredData}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.item}>
              <Text style={styles.itemText}>{item.name}</Text>
            </TouchableOpacity>
          )}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
};

export default ExploreScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f2f5', // Modern light background
  },

  // Header Bar
  headerBar: {
    marginTop: 45, // Reduced space for tighter layout
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
  headerText: {
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

  // Main Container
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#f0f2f5',
  },

  // Search Input
  searchInput: {
    height: 50,
    borderColor: '#1e88e5', // Deep blue accent
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    marginBottom: 20,
    backgroundColor: '#ffffff',
    fontSize: 16,
    fontFamily: 'Poppins-Italic',
  },

  // Search Item Card
  item: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  itemText: {
    fontSize: 18,
    fontFamily: 'Poppins-Medium',
    color: '#37474f',
  },

  // Button (if you add interactions)
  button: {
    backgroundColor: '#1e88e5', // Deep blue for contrast
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },

  // Fact Box for Highlights
  factBox: {
    padding: 16,
    backgroundColor: '#e8f5e9', // Soft green for sustainability
    borderRadius: 12,
    marginVertical: 10,
  },
  factText: {
    fontSize: 16,
    color: '#2e7d32',
    fontFamily: 'Poppins-Medium',
  },
});

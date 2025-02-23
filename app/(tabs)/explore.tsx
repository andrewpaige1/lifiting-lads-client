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
    const filtered = data.filter(item =>
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
          placeholder="Search..."
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
    backgroundColor: '#f8f8f8',
  },
  headerBar: {
    marginTop: 40, // Space below status bar
    marginBottom: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ccc',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#f8f8f8',
  },
  searchInput: {
    height: 50,
    borderColor: '#007bff',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
  },
  itemText: {
    fontSize: 18,
    color: '#333',
  },
});


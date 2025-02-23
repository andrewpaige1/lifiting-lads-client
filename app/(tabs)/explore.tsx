import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';

const API_URL = "https://lifting-lads-api.onrender.com"

const ExploreScreen = () => {
  type User = {
    _id: string;
    nickname: string;
    email: string;
  };
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Fetch users as they type
  useEffect(() => {
    const fetchUsers = async () => {
      if (searchQuery.length > 1) {
        setLoading(true);
        try {
          const response = await axios.get(`${API_URL}/search-users`, {
            params: { query: searchQuery },
          });
          setFilteredUsers(response.data);
        } catch (error) {
          console.error('Failed to fetch users:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setFilteredUsers([]);
      }
    };

    // Debounce: Avoid rapid requests
    const debounce = setTimeout(fetchUsers, 300);

    return () => clearTimeout(debounce);
  }, [searchQuery]);

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
          placeholderTextColor="#90a4ae"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        {/* Loading indicator */}
        {loading && <Text style={styles.loadingText}>Searching...</Text>}

        {/* Search Results */}
        <FlatList
          data={filteredUsers}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.item} onPress={() => (

            router.push({
            pathname: '/user-profile',
            params: { userId: item._id }, // Pass image URI to ViewPicture component
          })


            )}>
              <Text style={styles.itemText}>{item.nickname}</Text>
              <Text style={styles.emailText}>{item.email}</Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            !loading && searchQuery.length > 1 && filteredUsers.length === 0 ? (
              <Text style={styles.emptyText}>No users found</Text>
            ) : null
          }
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
    backgroundColor: '#f0f2f5',
  },
  headerBar: {
    marginTop: 45,
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
    color: '#37474f',
    padding: 14,
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#b0bec5',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#f0f2f5',
  },
  searchInput: {
    height: 50,
    borderColor: '#1e88e5',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    marginBottom: 20,
    backgroundColor: '#ffffff',
    fontSize: 16,
  },
  loadingText: {
    textAlign: 'center',
    color: '#1e88e5',
    marginBottom: 10,
  },
  emptyText: {
    textAlign: 'center',
    color: '#757575',
    marginTop: 10,
  },
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
    color: '#37474f',
    fontWeight: '600',
  },
  emailText: {
    fontSize: 14,
    color: '#757575',
    marginTop: 4,
  },
});

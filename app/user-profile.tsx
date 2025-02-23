import React, { useState, useEffect, useLayoutEffect, useContext } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import axios from 'axios';
import { UserContext } from '@/Store';

const API_URL = "https://lifting-lads-api.onrender.com";

// Define expected types
type UserPost = {
  id: number;
  type: 'pr' | 'live';
  content: string;
  tags: string[];
};

type User = {
  _id: string;
  nickname: string;
  bio?: string;
  posts: UserPost[];
};

type RootStackParamList = {
  UserProfile: { userId: string };
};

const UserProfile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [tagSearch, setTagSearch] = useState<string>('#');
  const [loading, setLoading] = useState<boolean>(true);

  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, 'UserProfile'>>();
  const { userId } = route.params;
  const userContext = useContext(UserContext);
  const { userInfo } = userContext;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 10 }}>
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>
      ),
      title: 'User Profile',
    });
  }, [navigation]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get<User>(`${API_URL}/user/${userId}`);
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  if (loading) {
    return (
      <SafeAreaView style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView style={styles.centeredContainer}>
        <Text style={styles.errorText}>User not found</Text>
      </SafeAreaView>
    );
  }

  // Filter posts based on tag search
  const filteredPosts = tagSearch.length > 1
    ? user.posts.filter((post) =>
        post.tags.some((tag) => tag.toLowerCase().includes(tagSearch.slice(1).toLowerCase()))
      )
    : user.posts;

  const addLiftingLad = async () => {
    try {
      console.log(user)
      const response = await axios.post(
        'https://lifting-lads-api.onrender.com/add-lifting-lad', 
        {
          requesterName: userInfo.nickname,
          requestedName: user.nickname,
          requesterPicture: userInfo.picture,
          friendType: "closeFriend"
        });

      //console.log('Response:', response.data);
      alert('Submitted successfully!');
    } catch (error) {
      //console.error('Error:', error);
      alert('You already submitted a friend request!');
    }
  }

  const addFriend = async () => {
    try {
      console.log(user)
      const response = await axios.post(
        'https://lifting-lads-api.onrender.com/add-lifting-lad', 
        {
          requesterName: userInfo.nickname,
          requestedName: user.nickname,
          requesterPicture: userInfo.picture,
          friendType: "friend"
        });

      console.log('Response:', response.data);
      alert('Submitted successfully!');
    } catch (error) {
      console.error('Error:', error);
      alert('Submission failed');
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.container}>
        {/* Profile Info */}
        <View style={styles.profilePictureContainer}>
          <View style={styles.profilePicture} />
        </View>

        <Text style={styles.username}>{user.nickname}</Text>
        <Text style={styles.bio}>{user.bio || "No bio available."}</Text>
{/* Add Friend and Add Lifting Lad Buttons */}
<View style={styles.buttonContainer}>
  <TouchableOpacity style={styles.button}>
    <Text style={styles.buttonText} onPress={addFriend}>Add Friend</Text>
  </TouchableOpacity>
  <TouchableOpacity style={styles.button} onPress={addLiftingLad}>
    <Text style={styles.buttonText}>Add Lifting Lad</Text>
  </TouchableOpacity>
</View>

        {/* Tag Search */}
        <View style={styles.searchWrapper}>
          <TextInput
            style={styles.searchInput}
            value={tagSearch}
            onChangeText={(text) =>
              setTagSearch(text.startsWith('#') ? text : `#${text}`)
            }
            placeholder="#Search posts by tag"
            placeholderTextColor="#999"
          />
          {tagSearch.length > 1 && (
            <TouchableOpacity onPress={() => setTagSearch('#')} style={styles.clearButton}>
              <Ionicons name="close-circle" size={24} color="#888" />
            </TouchableOpacity>
          )}
        </View>

        {/* Posts List */}
        <FlatList
          data={filteredPosts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View
              style={[
                styles.postBox,
                item.type === 'pr' ? styles.prPost : styles.liveLiftPost,
              ]}
            >
              <Text style={styles.postType}>
                {item.type === 'pr' ? '🚨 PR Post' : '🏋️ Live Lift'}
              </Text>
              <Text style={styles.postContent}>{item.content}</Text>
              <View style={styles.tagContainer}>
                {item.tags.map((tag) => (
                  <Text key={tag} style={styles.tag}>
                    {tag}
                  </Text>
                ))}
              </View>
            </View>
          )}
          ListEmptyComponent={<Text style={styles.emptyText}>No posts available</Text>}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.postsContainer}
        />
      </View>
    </SafeAreaView>
  );
};

export default UserProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profilePictureContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  profilePicture: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ddd',
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  bio: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
    position: 'relative',
  },
  searchInput: {
    flex: 1,
    height: 50,
    borderColor: '#007bff',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    fontSize: 18,
    backgroundColor: '#f8f8f8',
  },
  clearButton: {
    position: 'absolute',
    right: 10,
  },
  postsContainer: {
    paddingBottom: 20,
    width: '100%',
  },
  postBox: {
    width: '100%',
    marginBottom: 10,
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  prPost: {
    backgroundColor: '#ffebee',
  },
  liveLiftPost: {
    backgroundColor: '#e3f2fd',
  },
  postType: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#555',
  },
  postContent: {
    fontSize: 16,
    marginBottom: 5,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
  },
  tag: {
    backgroundColor: '#007bff',
    color: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 15,
    marginRight: 5,
    marginBottom: 5,
    fontSize: 14,
  },
  emptyText: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
    marginTop: 20,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 10,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },  
});

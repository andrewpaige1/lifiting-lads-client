import React, { useContext, useEffect, useState, useRef } from 'react';
import { 
  View, Text, Image, ScrollView, Pressable, StyleSheet, 
  TouchableOpacity, Animated, ActivityIndicator, RefreshControl
} from 'react-native';
import { Video } from 'expo-av';
import { useRouter } from 'expo-router';
import { UserContext } from '@/Store';

// Define Post Type
interface Post {
  id: string;
  type: string; // Can be "lift" (image) or "pr" (video)
  content: string;
  imageUrl: string; // URL for image or video
  tags: string[];
  createdAt: string;
  author: string;
}

export default function Home() {
  const router = useRouter();
  const scrollY = useRef(new Animated.Value(0)).current;
  const userContext = useContext(UserContext);
  const { userInfo } = userContext ?? {}; // Ensure context is not undefined

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false); // State for pull-to-refresh

  // Fetch friends' posts from backend
  const fetchPosts = async () => {
    if (!userInfo?.nickname) return;

    try {
      const response = await fetch(`https://lifting-lads-api.onrender.com/friends-posts/${userInfo.nickname}`);
      if (!response.ok) return;

      const data = await response.json();
      if (data.posts) {
        setPosts(data.posts);
      }
    } catch (error) {
      return error
    } finally {
      setLoading(false);
      setRefreshing(false); // Stop refreshing when done
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [userInfo?.nickname]);

  // Function to handle pull-to-refresh
  const onRefresh = () => {
    setRefreshing(true);
    fetchPosts();
  };

  // Interpolating the header opacity based on scroll position
  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, -100], 
    extrapolate: 'clamp',
  });

  const goToProfile = () => {
    router.push('/profile');
  };

  return (
    <View style={styles.container}>
      {/* Animated Header - Lifting Lads Title */}
      <Animated.View style={[styles.headerWrapper, { transform: [{ translateY: headerTranslateY }] }]}>
        <Text style={styles.title}>Lifting Lads</Text>

        <TouchableOpacity onPress={goToProfile}>
          <Image
            source={{ uri: userInfo?.picture || 'https://via.placeholder.com/40' }}
            style={styles.profilePic}
          />
        </TouchableOpacity>
      </Animated.View>

      {/* Scrollable Post List with Refresh Control */}
      <Animated.ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={{ paddingTop: 120 }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {loading ? (
          <ActivityIndicator size="large" color="#1e88e5" style={{ marginTop: 50 }} />
        ) : posts.length === 0 ? (
          <Text style={styles.noPostsText}>No posts from friends yet.</Text>
        ) : (
          posts.map((post) => (
            <Pressable key={post.id} style={styles.postContainer}>
              <View style={styles.postHeader}>
                <View style={styles.profileContainer}>
                  <Image
                    source={{ uri: post.imageUrl || 'https://via.placeholder.com/100' }}
                    style={styles.profileImage}
                  />
                  <Text style={styles.username}>{post.author || "Unknown"}</Text>
                </View>
                <Text style={styles.date}>{new Date(post.createdAt).toLocaleDateString()}</Text>
              </View>

              {/* Post Content: Image or Video */}
              <View style={styles.postContent}>
                {post.type === "pr" ? (
                  <Video
                    source={{ uri: post.imageUrl }}
                    style={styles.postVideo}
                    useNativeControls
                    shouldPlay
                    isLooping
                  />
                ) : (
                  <Image source={{ uri: post.imageUrl }} style={styles.postImage} />
                )}
              </View>

              <Text style={styles.description}>{post.content || "No description provided."}</Text>
            </Pressable>
          ))
        )}
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },

  // Header styling
  headerWrapper: {
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
  title: {
    fontSize: 25,
    fontWeight: '700',
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

  // Scroll area
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },

  // No posts text
  noPostsText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#90a4ae',
    marginTop: 50,
    fontFamily: 'Poppins-Medium',
  },

  // Post container with card effect
  postContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },

  // Post header (username, date)
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 10,
  },
  username: {
    fontWeight: '600',
    fontSize: 17,
    fontFamily: 'Poppins-Medium',
    color: '#37474f',
  },
  date: {
    fontSize: 14,
    fontFamily: 'Poppins-Light',
    color: '#90a4ae',
  },

  // Post content area
  postContent: {
    borderRadius: 12,
    marginBottom: 8,
    overflow: 'hidden',
  },
  postImage: {
    width: '100%',
    height: 250,
    borderRadius: 12,
  },
  postVideo: {
    width: '100%',
    height: 250,
    borderRadius: 12,
  },

  // Post description
  description: {
    fontSize: 15,
    color: '#455a64',
    lineHeight: 22,
    fontFamily: 'Poppins-Regular',
  },
});

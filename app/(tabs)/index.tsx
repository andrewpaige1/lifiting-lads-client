import React, { useRef } from 'react';
import { View, Text, Image, ScrollView, Pressable, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useRouter } from 'expo-router';

export default function Home() {
  const router = useRouter();
  const scrollY = useRef(new Animated.Value(0)).current;

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
            source={{ uri: 'https://via.placeholder.com/40' }}
            style={styles.profilePic}
          />
        </TouchableOpacity>
      </Animated.View>

      {/* Scrollable Post List */}
      <Animated.ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={{ paddingTop: 120 }} // Increased paddingTop to push posts down
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        {[...Array(10)].map((_, index) => (
          <Pressable
            key={index}
            onPressIn={() => console.log('Pressed in')}
            onPressOut={() => console.log('Pressed out')}
            style={styles.postContainer}
          >
            <View style={styles.postHeader}>
              <View style={styles.profileContainer}>
                <Image
                  source={{ uri: 'https://via.placeholder.com/50' }}
                  style={styles.profileImage}
                />
                <Text style={styles.username}>Username</Text>
              </View>
              <Text style={styles.date}>Feb 22, 2025</Text>
            </View>

            <View style={styles.postContent} />

            <Text style={styles.description}>Description goes here...</Text>
          </Pressable>
        ))}
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  headerWrapper: {
    position: 'absolute',
    top: 40, 
    left: 16,
    right: 16,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ccc',
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  postContainer: {
    backgroundColor: '#f3f3f3',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
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
    marginRight: 8,
  },
  username: {
    fontWeight: '600',
  },
  date: {
    color: '#888',
  },
  postContent: {
    height: 330,
    backgroundColor: '#ccc',
    borderRadius: 8,
    marginBottom: 8,
  },
  description: {
    color: '#666',
  },
});

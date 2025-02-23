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
    backgroundColor: '#f0f2f5', // Light modern background
  },

  // Header styling
  headerWrapper: {
    position: 'absolute',
    top: 40, // Reduced space from top
    left: 6,
    right: 16,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  title: {
    fontSize: 25,
    fontWeight: '700',
    fontFamily: 'Poppins-Bold', 
    color: '#37474f',
    padding: 15,
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
    paddingTop: 80, // Reduced padding for tighter layout
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
    height: 300,
    backgroundColor: '#cfd8dc',
    borderRadius: 12,
    marginBottom: 8,
    overflow: 'hidden',
  },

  // Post description
  description: {
    fontSize: 15,
    color: '#455a64',
    lineHeight: 22,
    fontFamily: 'Poppins-Regular',
  },

  // Buttons and interactions
  button: {
    backgroundColor: '#1e88e5', // New deep blue accent for contrast
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

  // Fact Box
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

  // Card-like input field
  input: {
    height: 50,
    borderColor: '#1e88e5', // Deep blue accent for focus
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    backgroundColor: '#ffffff',
    marginBottom: 15,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },

  // Card-like results
  resultBox: {
    padding: 16,
    backgroundColor: '#eceff1',
    borderRadius: 12,
    marginBottom: 16,
  },
  resultText: {
    fontSize: 16,
    color: '#37474f',
    fontFamily: 'Poppins-Medium',
  },
});

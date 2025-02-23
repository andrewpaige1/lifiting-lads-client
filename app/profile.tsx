import React, { useState, useLayoutEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Keyboard,
  Button
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '@/hooks/useAuth';

const Profile = () => {
  const [tagSearch, setTagSearch] = useState('#');
  const navigation = useNavigation();
  const { handleLogout } = useAuth()

  // Set header with back arrow
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 10 }}>
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>
      ),
      title: 'Your Profile',
    });
  }, [navigation]);

  // Sample posts with PR and Live Lift classifications
  const posts = [
    { id: 1, type: 'pr', content: 'Hit a new PR today!', tags: ['#pr', '#squat', '#fitness'] },
    { id: 2, type: 'live', content: 'Working on my form.', tags: ['#bench', '#form', '#strength'] },
    { id: 3, type: 'pr', content: '400lbs deadlift!!', tags: ['#deadlift', '#pr', '#powerlifting'] },
    { id: 4, type: 'live', content: 'Hang cleans for explosiveness.', tags: ['#hangclean', '#explosive', '#training'] },
    { id: 5, type: 'pr', content: 'High volume squat day.', tags: ['#squat', '#volume', '#grind'] },
    { id: 6, type: 'live', content: 'Bench press burnout set!', tags: ['#bench', '#burnout', '#fitness'] },
    { id: 7, type: 'live', content: 'Post-recovery stretch routine.', tags: ['#recovery', '#mobility', '#stretch'] },
    { id: 8, type: 'pr', content: 'Deadlifts felt amazing!', tags: ['#deadlift', '#gains', '#power'] },
    { id: 9, type: 'live', content: 'Push press PR! 185lbs!', tags: ['#pushpress', '#pr', '#strength'] },
    { id: 10, type: 'live', content: 'Cardio day: 5 miles done!', tags: ['#cardio', '#running', '#endurance'] },
  ];

  // Frequency count for tag suggestions
  const tagFrequency = posts
    .flatMap((post) => post.tags)
    .reduce((acc, tag) => {
      acc[tag] = (acc[tag] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  // Filtered posts based on search input
  const filteredPosts = tagSearch.length > 1
    ? posts.filter((post) =>
        post.tags.some((tag) =>
          tag.toLowerCase().includes(tagSearch.slice(1).toLowerCase())
        )
      )
    : posts;

  // Get matching tags by frequency
  const matchingTags = Object.keys(tagFrequency)
    .filter((tag) => tag.toLowerCase().includes(tagSearch.slice(1).toLowerCase()))
    .sort((a, b) => tagFrequency[b] - tagFrequency[a]);

  // Clear search but keep #
  const clearSearch = () => {
    setTagSearch('#');
  };

  // Render each post with classification
  const renderPostItem = ({ item }) => (
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
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.container}>
        {/* Profile Header */}
        <View style={styles.profilePictureContainer}>
          <View style={styles.profilePicture} />
        </View>

        <Text style={styles.username}>lifting_lad_123</Text>
        <Text style={styles.bio}>
          Passionate about lifting and hitting new PRs. Let’s get stronger together!
        </Text>
        <Button title="Log out" onPress={handleLogout}/>

        {/* Tag Search with Clear Button */}
        <View style={styles.searchWrapper}>
          <TextInput
            style={styles.searchInput}
            value={tagSearch}
            onChangeText={(text) =>
              setTagSearch(text.startsWith('#') ? text : `#${text}`)
            }
            placeholder="#Search by tag"
            placeholderTextColor="#999"
          />
          {tagSearch.length > 1 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <Ionicons name="close-circle" size={24} color="#888" />
            </TouchableOpacity>
          )}
        </View>

        {/* Tag Suggestions */}
        {tagSearch.length > 1 && (
          <View style={styles.tagSuggestions}>
            {matchingTags.map((tag) => (
              <TouchableOpacity
                key={tag}
                style={styles.suggestedTag}
                onPress={() => setTagSearch(tag)}
              >
                <Text style={styles.suggestedTagText}>
                  {tag} ({tagFrequency[tag]})
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Posts List */}
        <FlatList
          data={filteredPosts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderPostItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.postsContainer}
          keyboardShouldPersistTaps="handled" // Allows tapping outside the keyboard to dismiss
        />
      </View>
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
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
  tagSuggestions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
    width: '100%',
  },
  suggestedTag: {
    backgroundColor: '#007bff',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 5,
  },
  suggestedTagText: {
    color: '#fff',
    fontSize: 14,
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
    backgroundColor: '#ffebee', // Light red for PR posts
  },
  liveLiftPost: {
    backgroundColor: '#e3f2fd', // Light blue for Live Lifts
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
});

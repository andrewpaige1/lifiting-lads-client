import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  FlatList
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

const Profile = () => {
  const [open, setOpen] = useState(false);
  const [liftFilter, setLiftFilter] = useState(null);

  // Dropdown items for types of lifts (plus 'All Lifts').
  const [items, setItems] = useState([
    { label: 'All Lifts', value: 'all' },
    { label: 'Squat', value: 'squat' },
    { label: 'Bench', value: 'bench' },
    { label: 'Deadlift', value: 'deadlift' },
    { label: 'Hang Clean', value: 'hangclean' },
  ]);

  // 20 sample posts (ID 20 is the most recent).
  const [posts] = useState([
    { id: 20, type: 'squat', content: 'Another big PR attempt: 400 for a single!' },
    { id: 19, type: 'bench', content: 'Narrow grip bench: 185 x 8 reps.' },
    { id: 18, type: 'deadlift', content: 'Sumo deadlift day: 405 for a triple.' },
    { id: 17, type: 'hangclean', content: 'Working technique at 135, focusing on form.' },
    { id: 16, type: 'squat', content: 'Deload week: 225 for sets of 5.' },
    { id: 15, type: 'bench', content: 'Incline bench day, repping 155.' },
    { id: 14, type: 'deadlift', content: 'Paused deadlifts at 315—killer on the core!' },
    { id: 13, type: 'hangclean', content: 'Cleans from the hang, 5 sets of 3 at 135.' },
    { id: 12, type: 'squat', content: 'Speed work at 185, 8x3 focusing on explosiveness.' },
    { id: 11, type: 'bench', content: 'Flat bench, 205 for 3 sets of 6.' },
    { id: 10, type: 'deadlift', content: 'Pulled 435 for a double—feeling strong!' },
    { id: 9, type: 'squat', content: 'New PR! 365lbs for a single.' },
    { id: 8, type: 'bench', content: 'Benched 245 today, feeling strong!' },
    { id: 7, type: 'deadlift', content: 'Pulled 455 for 2 reps. PR!' },
    { id: 6, type: 'hangclean', content: 'Hit 200lbs clean today!' },
    { id: 5, type: 'squat', content: '5x5 with 275lbs. Solid session.' },
    { id: 4, type: 'bench', content: '3 sets of 10 at 185lbs.' },
    { id: 3, type: 'deadlift', content: 'Worked up to 405 for triples.' },
    { id: 2, type: 'hangclean', content: 'Practiced form at 155lbs.' },
    { id: 1, type: 'squat', content: 'High volume day with 225lbs.' },
  ]);

  // Filter logic based on dropdown value
  const filteredPosts =
    liftFilter === 'all' || liftFilter === null
      ? posts
      : posts.filter((p) => p.type === liftFilter);

  // Render each post as a box in the grid
  const renderPostItem = ({ item }) => (
    <View style={styles.postBox}>
      <Text style={styles.postType}>{item.type.toUpperCase()}</Text>
      <Text style={styles.postContent}>{item.content}</Text>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.container}>
        {/* Profile Picture Placeholder */}
        <View style={styles.profilePictureContainer}>
          <View style={styles.profilePicture} />
        </View>

        {/* Username */}
        <Text style={styles.username}>lifting_lad_123</Text>

        {/* Bio */}
        <Text style={styles.bio}>
          Passionate about lifting and hitting new PRs. Let’s get stronger together!
        </Text>

        {/* Dropdown Filter */}
        <View style={styles.dropdownWrapper}>
          <DropDownPicker
            open={open}
            value={liftFilter}
            items={items}
            setOpen={setOpen}
            setValue={setLiftFilter}
            setItems={setItems}
            placeholder="All Lifts"
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownContainer}
          />
        </View>

        {/* Posts Grid (2 columns) */}
        <FlatList
          data={filteredPosts}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          renderItem={renderPostItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.postsContainer}
        />
      </View>
    </SafeAreaView>
  );
};

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
    marginTop: 30,
    marginBottom: 10,
  },
  profilePicture: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ddd',
  },
  username: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  bio: {
    fontSize: 15,
    marginBottom: 35,
    textAlign: 'center',
  },
  dropdownWrapper: {
    width: '100%',
    marginBottom: 20,
  },
  dropdown: {
    borderColor: '#ccc',
    height: 40,
  },
  dropdownContainer: {
    borderColor: '#ccc',
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  postsContainer: {
    paddingBottom: 100, // extra space at bottom so last items aren't cut off
  },
  postBox: {
    backgroundColor: '#f0f0f0',
    width: '48%',
    marginBottom: 10,
    borderRadius: 8,
    alignItems: 'center',
    padding: 10,
  },
  postType: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  postContent: {
    fontSize: 14,
    textAlign: 'center',
  },
});

export default Profile;

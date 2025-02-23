import { View, Text, Image, ScrollView, Pressable, StyleSheet } from 'react-native';

export default function Home() {
  return (
    <ScrollView style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>Lifting Lads</Text>
      
      {/* Post List */}
      {[...Array(7)].map((_, index) => (
        <Pressable 
          key={index}
          onPressIn={() => console.log('Pressed in')}
          onPressOut={() => console.log('Pressed out')}
          style={styles.postContainer}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.profileContainer}>
              <View style={styles.placeholderProfile}></View>
              <Image 
                source={{ uri: 'https://via.placeholder.com/50' }} 
                style={styles.profileImage}
              />
              <Text style={styles.username}>Username</Text>
            </View>
            <Text style={styles.date}>Feb 22, 2025</Text>
          </View>
          
          {/* Post Content */}
          <View style={styles.postContent}></View>
          
          {/* Description */}
          <Text style={styles.description}>Description goes here...</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
    paddingTop: 48,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    marginTop: 16,
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  placeholderProfile: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#ccc',
    marginRight: 8,
  },
  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  username: {
    marginLeft: 8,
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

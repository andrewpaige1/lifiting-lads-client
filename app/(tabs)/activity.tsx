import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image
} from 'react-native';
import { useRouter } from 'expo-router';

// Sample activity data
const initialActivities = [
  { id: 1, type: 'REQUEST', user: 'Sarah', timestamp: '1m ago', timeValue: 1 },
  { id: 2, type: 'REQUEST', user: 'Jake', timestamp: '3m ago', timeValue: 3 },
  { id: 3, type: 'REQUEST', user: 'Emily', timestamp: '6m ago', timeValue: 6 },
  { id: 6, type: 'REQUEST', user: 'Lisa', timestamp: '9m ago', timeValue: 9 },
  { id: 7, type: 'REQUEST', user: 'Ben', timestamp: '13m ago', timeValue: 13 },
  { id: 8, type: 'REQUEST', user: 'Rita', timestamp: '15m ago', timeValue: 15 },
  { id: 4, type: 'ACCEPT', user: 'Stan', timestamp: '2m ago', timeValue: 2 },
  { id: 9, type: 'ACCEPT', user: 'Tina', timestamp: '4m ago', timeValue: 4 },
  { id: 10, type: 'ACCEPT', user: 'Rob', timestamp: '7m ago', timeValue: 7 },
  { id: 11, type: 'ACCEPT', user: 'Chelsea', timestamp: '12m ago', timeValue: 12 },
  { id: 5, type: 'PR', user: 'Dylan', timestamp: '5m ago', timeValue: 5, message: 'New clean & jerk record in the books!' },
  { id: 12, type: 'PR', user: 'Mindy', timestamp: '8m ago', timeValue: 8, message: 'First 315 squat ever!' },
  { id: 13, type: 'PR', user: 'Avery', timestamp: '10m ago', timeValue: 10, message: 'Benched 185 for reps!' },
  { id: 14, type: 'PR', user: 'Tyler', timestamp: '11m ago', timeValue: 11, message: 'Hang power clean PR!' },
  { id: 15, type: 'PR', user: 'Zoe', timestamp: '18m ago', timeValue: 18, message: 'Deadlift got me feeling unstoppable!' },
];

const ActivityFeed = () => {
  const [activities, setActivities] = useState(initialActivities);
  const router = useRouter();

  // Separate requests from others
  const requests = activities.filter((item) => item.type === 'REQUEST');
  const others = activities.filter((item) => item.type !== 'REQUEST');

  // Sort by timeValue (newer first)
  requests.sort((a, b) => a.timeValue - b.timeValue);
  others.sort((a, b) => a.timeValue - b.timeValue);

  const sortedActivities = [...requests, ...others];

  // Accept request
  const handleAccept = (item) => {
    const newList = activities.filter((act) => act.id !== item.id);
    const newAcceptId = Math.max(...activities.map((a) => a.id)) + 1;
    const newAcceptItem = {
      id: newAcceptId,
      type: 'ACCEPT',
      user: item.user,
      timestamp: 'Just now',
      timeValue: 0,
    };
    setActivities([...newList, newAcceptItem]);
  };

  // Reject request
  const handleReject = (item) => {
    const newList = activities.filter((act) => act.id !== item.id);
    setActivities(newList);
  };

  // Display user name
  const getDisplayName = (item) => {
    return item.type === 'PR' ? item.user : `${item.user}_user`;
  };

  // Generate activity message
  const getActivityMessage = (item) => {
    const displayName = getDisplayName(item);
    switch (item.type) {
      case 'REQUEST':
        return `${displayName} wants to be your lifting lad.`;
      case 'ACCEPT':
        return `${displayName} became your lad!`;
      case 'PR':
        return item.message ? `${displayName}: ${item.message}` : `${displayName} just hit a new PR!`;
      default:
        return 'Unknown activity.';
    }
  };

  // Render each activity item
  const renderActivityItem = ({ item }) => {
    const messageText = getActivityMessage(item);
    const isRequest = item.type === 'REQUEST';

    return (
      <View style={styles.itemContainer}>
        <View style={styles.row}>
          <View style={styles.profileImagePlaceholder} />

          <View style={styles.textColumn}>
            <Text style={styles.messageText}>{messageText}</Text>
            <Text style={styles.timestamp}>{item.timestamp}</Text>

            {isRequest && (
              <View style={styles.actionsRow}>
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: '#4caf50' }]}
                  onPress={() => handleAccept(item)}
                >
                  <Text style={styles.actionText}>✔</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: '#f44336' }]}
                  onPress={() => handleReject(item)}
                >
                  <Text style={styles.actionText}>✖</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header Title & Profile Pic */}
      <View style={styles.headerWrapper}>
        <Text style={styles.header}>Activity</Text>
        <TouchableOpacity onPress={() => router.push('/profile')}>
          <Image
            source={{ uri: 'https://via.placeholder.com/40' }}
            style={styles.profilePic}
          />
        </TouchableOpacity>
      </View>

      {/* Activity Feed */}
      <FlatList
        data={sortedActivities}
        renderItem={renderActivityItem}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
};

export default ActivityFeed;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerWrapper: {
    marginTop: 15, // Positioned below the status bar
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ccc',
  },
  listContent: {
    paddingBottom: 80,
  },
  itemContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    marginHorizontal: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  profileImagePlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ccc',
    marginRight: 12,
  },
  textColumn: {
    flex: 1,
  },
  messageText: {
    fontSize: 16,
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  actionsRow: {
    flexDirection: 'row',
    marginTop: 5,
  },
  actionButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionText: {
    color: '#fff',
    fontSize: 16,
  },
});

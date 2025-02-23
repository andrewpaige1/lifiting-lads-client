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

// Type definition for activity items
type Activity = {
  id: number;
  type: 'REQUEST' | 'ACCEPT' | 'PR';
  user: string;
  timestamp: string;
  timeValue: number;
  message?: string;
};

// Sample activity data
const initialActivities: Activity[] = [
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
  const [activities, setActivities] = useState<Activity[]>(initialActivities);
  const router = useRouter();

  // Separate requests from others
  const requests = activities.filter((item) => item.type === 'REQUEST');
  const others = activities.filter((item) => item.type !== 'REQUEST');

  // Sort by timeValue (newer first)
  requests.sort((a, b) => a.timeValue - b.timeValue);
  others.sort((a, b) => a.timeValue - b.timeValue);

  const sortedActivities = [...requests, ...others];

  // Accept request
  const handleAccept = (item: Activity) => {
    const newList = activities.filter((act) => act.id !== item.id);
    const newAcceptId = Math.max(...activities.map((a) => a.id)) + 1;
    const newAcceptItem: Activity = {
      id: newAcceptId,
      type: 'ACCEPT',
      user: item.user,
      timestamp: 'Just now',
      timeValue: 0,
    };
    setActivities([...newList, newAcceptItem]);
  };

  // Reject request
  const handleReject = (item: Activity) => {
    const newList = activities.filter((act) => act.id !== item.id);
    setActivities(newList);
  };

  // Display user name
  const getDisplayName = (item: Activity): string => {
    return item.type === 'PR' ? item.user : `${item.user}_user`;
  };

  // Generate activity message
  const getActivityMessage = (item: Activity): string => {
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

  // Render each activity item with proper typing
  const renderActivityItem = ({ item }: { item: Activity }) => {
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

      {/* Decorative Line Under Header */}
      <View style={styles.headerLine} />

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
    backgroundColor: '#f0f2f5',
  },

  // Header Bar
  headerWrapper: {
    marginTop: -13, // Reduced space for tighter layout
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
  header: {
    fontSize: 25,
    fontWeight: '700',
    fontFamily: 'Poppins-Bold',
    color: '#37474f', // Modern gray for titles
    padding: 14,

  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#b0bec5',
  },

  // Decorative Line Under Header
  headerLine: {
    height: 4,
    backgroundColor: '#ddd',
    borderRadius: 2,
    marginHorizontal: 20,
    marginBottom: 10,
  },

  // Activity List
  listContent: {
    paddingBottom: 80,
  },

  // Activity Item
  itemContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  profileImagePlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ddd',
    marginRight: 12,
  },

  textColumn: {
    flex: 1,
  },

  messageText: {
    fontSize: 16,
    color: '#37474f',
    fontFamily: 'Poppins-Medium',
    marginBottom: 4,
  },

  timestamp: {
    fontSize: 14,
    color: '#90a4ae',
    fontFamily: 'Poppins-Light',
    marginBottom: 8,
  },

  // Action Buttons (Accept/Reject)
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

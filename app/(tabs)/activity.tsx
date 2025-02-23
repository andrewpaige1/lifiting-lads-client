import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '@/Store';
import axios from 'axios';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
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

// ActivityFeed Component
const ActivityFeed = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const router = useRouter();
  const userContext = useContext(UserContext);
  const { userInfo } = userContext;

  useEffect(() => {
    if (userInfo?.nickname) {
      fetchUserRequests(userInfo.nickname);
    }
  }, [userInfo]);

  // Fetch user's lifting lad requests
  const fetchUserRequests = async (nickname: string) => {
    try {
      const response = await axios.get(`https://lifting-lads-api.onrender.com/lifting-lad-requests/${nickname}`);
      const requests = response.data.requests.map((req: any, index: number) => ({
        id: index + 1, // Assigning temporary ID
        type: 'REQUEST',
        user: req.requesterName,
        timestamp: 'Just now', // Backend should ideally send this
        timeValue: 0, // Defaulting for now
      }));

      setActivities(requests);
    } catch (error) {
      console.error('Error fetching lifting lad requests:', error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.headerWrapper}>
        <Text style={styles.header}>Activity</Text>
        <TouchableOpacity onPress={() => router.push('/profile')}>
          <Image source={{ uri: 'https://via.placeholder.com/40' }} style={styles.profilePic} />
        </TouchableOpacity>
      </View>

      {/* Activity Feed */}
      <FlatList
        data={activities}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.messageText}>{item.user} wants to be your lifting lad.</Text>
            <Text style={styles.timestamp}>{item.timestamp}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </SafeAreaView>
  );
};

export default ActivityFeed;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f0f2f5' },
  headerWrapper: {
    marginBottom: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  header: { fontSize: 25, fontWeight: '700', color: '#37474f' },
  profilePic: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#b0bec5' },
  itemContainer: { backgroundColor: '#ffffff', padding: 16, marginBottom: 10, marginHorizontal: 16 },
  messageText: { fontSize: 16, color: '#37474f' },
  timestamp: { fontSize: 14, color: '#90a4ae' },
});

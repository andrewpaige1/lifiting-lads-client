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
  RefreshControl,
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
  friendType: string;
  picture: string;
};

// ActivityFeed Component
const ActivityFeed = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false); // State for pull-to-refresh
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
    setRefreshing(true); // Show refresh indicator
    try {
      const response = await axios.get(`https://lifting-lads-api.onrender.com/lifting-lad-requests/${nickname}`);
      const requests = response.data.requests.map((req: any, index: number) => ({
        id: index + 1, // Assigning temporary ID
        type: 'REQUEST',
        user: req.requesterName,
        timestamp: 'Just now', // Backend should ideally send this
        timeValue: 0, // Defaulting for now
        friendType: req.friendType,
        picture: req.requesterPicture
      }));

      setActivities(requests);
    } catch (error) {
      console.error('Error fetching lifting lad requests:', error);
    } finally {
      setRefreshing(false); // Stop refresh indicator
    }
  };

  // Function to handle pull-to-refresh
  const onRefresh = () => {
    if (userInfo?.nickname) {
      fetchUserRequests(userInfo.nickname);
    }
  };

  // Handle Accept Request
  const handleAccept = async (id: number, user: string, friendType: string, picture: string) => {
    try {
      const response = await axios.post("https://lifting-lads-api.onrender.com/accept-lifting-lad", {
        requesterName: user,
        requestedName: userInfo.nickname,
        requesterPicture: picture,
        friendType: friendType
      });

      if (response.status === 200) {
        console.log(`Accepted request from ${user}`);
        setActivities((prev) => prev.filter((item) => item.id !== id));
      }
    } catch (error) {
      console.error("Error accepting lifting lad request:", error);
    }
  };

  // Handle Ignore Request
  const handleIgnore = async (id: number, user: string) => {
    try {
      const response = await axios.post("https://lifting-lads-api.onrender.com/ignore-lifting-lad", {
        requesterName: user,
        requestedName: userInfo.nickname,
      });

      if (response.status === 200) {
        console.log(`Ignored request from ${user}`);
        setActivities((prev) => prev.filter((item) => item.id !== id));
      }
    } catch (error) {
      console.error("Error ignoring lifting lad request:", error);
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

      {/* Activity Feed with Pull-to-Refresh */}
      <FlatList
        data={activities}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.messageText}>{item.user} wants to be your lifting lad.</Text>
            <Text style={styles.timestamp}>{item.timestamp}</Text>
            <Text style={styles.timestamp}>{item.friendType}</Text>
            
            {/* Accept & Ignore Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity onPress={() => handleAccept(item.id, item.user, item.friendType, item.picture)} style={styles.acceptButton}>
                <Text style={styles.icon}>✔️</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleIgnore(item.id, item.user)} style={styles.ignoreButton}>
                <Text style={styles.icon}>❌</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
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
  itemContainer: { 
    backgroundColor: '#ffffff', 
    padding: 16, 
    marginBottom: 10, 
    marginHorizontal: 16, 
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  messageText: { fontSize: 16, color: '#37474f', flex: 1 },
  timestamp: { fontSize: 14, color: '#90a4ae', marginRight: 10 },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  acceptButton: { marginLeft: 10 },
  ignoreButton: { marginLeft: 10 },
  icon: { fontSize: 20 },
});

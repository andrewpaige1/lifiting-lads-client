// tabs/TopRightIcons.tsx
import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

const TopRightIcons = () => {
  const colorScheme = useColorScheme();
  return (
    <View
      style={{
        position: 'absolute',
        top: 50,
        left: 0,
        right: 0,
        height: 60, // adjust the height to your liking
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: Colors[colorScheme ?? 'light'].background, // match the background color of the bottom tabs
        borderBottomWidth: 1,
        borderBottomColor: Colors[colorScheme ?? 'light'].tint, // match the tint color of the bottom tabs
      }}
    >
      <TouchableOpacity style={{ marginRight: 16 }}>
        <IconSymbol size={28} name="bell.fill" color={Colors[colorScheme ?? 'light'].tint} />
        <Text style={{ color: Colors[colorScheme ?? 'light'].tint }}>Activity</Text>
      </TouchableOpacity>
      <TouchableOpacity style={{ marginRight: 16 }}>
        <IconSymbol size={28} name="person.crop.circle.fill" color={Colors[colorScheme ?? 'light'].tint} />
        <Text style={{ color: Colors[colorScheme ?? 'light'].tint }}>Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

export default TopRightIcons;

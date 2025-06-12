import React from 'react';
import { Platform } from 'react-native';

// Platform-specific imports
let CommunityMapComponent: React.ComponentType<any>;

if (Platform.OS === 'web') {
  // Use web-compatible version
  const { CommunityMapWeb } = require('./CommunityMapWeb');
  CommunityMapComponent = CommunityMapWeb;
} else {
  // Use native version with react-native-maps
  const { CommunityMap } = require('./CommunityMap');
  CommunityMapComponent = CommunityMap;
}

// Export the appropriate component
export const CommunityMap = CommunityMapComponent; 
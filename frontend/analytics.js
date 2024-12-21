import amplitude from 'amplitude';
import { AMPLITUDE_API_KEY } from '.env';

// Initialize Amplitude
amplitude.getInstance().init(AMPLITUDE_API_KEY, null, {
  fetchRemoteConfig: true,
  autocapture: {
    elementInteractions: true
  }
});

// Function to identify users
export function identifyUser(userId, userTraits = {}) {
  const identify = new amplitude.Identify();

  // Add user traits
  Object.entries(userTraits).forEach(([key, value]) => {
    identify.set(key, value);
  });

  // Identify the user
  amplitude.getInstance().identify(identify);
  amplitude.getInstance().setUserId(userId);
} 
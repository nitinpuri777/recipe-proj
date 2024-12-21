import { init, Identify } from '@amplitude/analytics-browser';

// Fetch the API key from the backend
async function getAmplitudeApiKey() {
  const response = await fetch('/api/env');
  const data = await response.json();
  return data.AMPLITUDE_API_KEY;
}

async function initializeAmplitude() {
  const AMPLITUDE_API_KEY = await getAmplitudeApiKey();

  // Initialize Amplitude
  init(AMPLITUDE_API_KEY, null, {
    fetchRemoteConfig: true,
    autocapture: {
      elementInteractions: true
    }
  });
}

initializeAmplitude();

// Function to identify users
export function identifyUser(userId, userTraits = {}) {
  const identify = new Identify();

  // Add user traits
  Object.entries(userTraits).forEach(([key, value]) => {
    identify.set(key, value);
  });

  // Identify the user
  amplitude.identify(identify);
  amplitude.setUserId(userId);
}

export default {
  identifyUser
}; 
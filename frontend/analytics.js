import amplitude from 'amplitude';

// Fetch the API key from the backend
async function getAmplitudeApiKey() {
  const response = await fetch('/api/env');
  const data = await response.json();
  return data.AMPLITUDE_API_KEY;
}

(async () => {
  const AMPLITUDE_API_KEY = await getAmplitudeApiKey();

  // Initialize Amplitude
  amplitude.getInstance().init(AMPLITUDE_API_KEY, null, {
    fetchRemoteConfig: true,
    autocapture: {
      elementInteractions: true
    }
  });
})();

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
export function html(...strings) {
  return (strings.join(''));
}

export function parseHostname(url) {
  try {
    const urlObject = new URL(url);
    const hostname = urlObject.hostname; // Extracts the hostname part of the URL

    // Split the hostname into parts
    const parts = hostname.split('.').reverse(); // Reverse to start from the TLD

    if (parts.length >= 2) {
      // Most common case: example.com
      return parts[1] + '.' + parts[0];
    }

    return hostname; // Return the full hostname if it doesn't follow common patterns
  } catch (e) {
    console.error("Invalid URL");
    return null; // or handle as needed
  }
}

export function capitalizeFirstLetter(string) {
  if (!string) return string;  // Return the original string if it's empty or undefined
  return string.charAt(0).toUpperCase() + string.slice(1);
}

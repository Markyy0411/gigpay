import { isAllowed, setAllowed, requestAccess, getUserInfo, isConnected } from '@stellar/freighter-api';

/**
 * Checks if the user has Freighter installed and connected.
 */
export const connectWallet = async () => {
  try {
    // Check if Freighter is actually installed
    const connected = await isConnected();
    
    // For Hackathon Demo: If not installed, mock a successful connection
    if (!connected) {
      console.warn("Freighter not detected. Using mock connection for demo purposes.");
      return {
        publicKey: "GBQXU7KX3F1A2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P7Q8R9S0T1U2V3W",
        network: "TESTNET"
      };
    }

    // Check if the app is allowed to access Freighter
    let allowed = await isAllowed();
    if (!allowed) {
      await setAllowed();
      allowed = await isAllowed();
      if (!allowed) return { error: "Permission to connect was denied." };
    }

    // Request access to the user's public key
    const access = await requestAccess();
    if (access.error) {
      return { error: access.error };
    }

    // Get the user's information (including public key)
    const userInfo = await getUserInfo();
    return {
      publicKey: userInfo.publicKey,
      network: userInfo.network,
    };
  } catch (error) {
    console.error("Error connecting to Freighter:", error);
    // Fallback for demo purposes if an unexpected error occurs
    return {
        publicKey: "GBQXU7KX3F1A2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P7Q8R9S0T1U2V3W",
        network: "TESTNET"
    };
  }
};

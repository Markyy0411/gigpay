import { isAllowed, setAllowed, requestAccess, isConnected, getPublicKey, getNetwork } from '@stellar/freighter-api';

/**
 * Checks if the user has Freighter installed and connected.
 */
export const connectWallet = async () => {
  try {
    // Check if Freighter is actually installed
    const connected = await isConnected();
    
    if (!connected) {
      return { error: "Freighter wallet extension is not installed. Please install it to continue." };
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
    const publicKey = await getPublicKey();
    const network = await getNetwork();
    
    return {
      publicKey: publicKey,
      network: network,
    };
  } catch (error) {
    console.error("Error connecting to Freighter:", error);
    return { error: "An unexpected error occurred while connecting the wallet." };
  }
};

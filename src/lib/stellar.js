import { isAllowed, setAllowed, requestAccess, isConnected, getPublicKey, getNetwork, signTransaction } from '@stellar/freighter-api';
import * as StellarSdk from '@stellar/stellar-sdk';

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

/**
 * Triggers a Freighter popup asking the user to sign a transaction.
 * Used to cryptographically approve escrow deposits and releases.
 */
export const requestWalletSignature = async (publicKey, description) => {
  try {
    // For a fully functional frontend, we would build a Soroban Contract Call XDR here.
    // For this implementation, we build a simple placeholder transaction just to trigger the Freighter UI popup.
    const server = new StellarSdk.Horizon.Server("https://horizon-testnet.stellar.org");
    const account = await server.loadAccount(publicKey);
    
    const transaction = new StellarSdk.TransactionBuilder(account, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: StellarSdk.Networks.TESTNET,
    })
      .addOperation(StellarSdk.Operation.manageData({
        name: "GigPay_Action",
        value: description.substring(0, 64)
      }))
      .setTimeout(30)
      .build();

    const xdr = transaction.toXDR();
    
    // This pops up the Freighter extension!
    const signedTx = await signTransaction(xdr, { network: "TESTNET" });
    
    if (signedTx.error) {
      throw new Error(signedTx.error);
    }
    
    return { success: true, signedXdr: signedTx };
  } catch (error) {
    console.error("Wallet Signature Error:", error);
    throw new Error("Transaction signature failed or was rejected by the user.");
  }
};

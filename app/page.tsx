"use client";

/**
 * Main Page Component
 * 
 * This is the entry point for the LazorKit passkey authentication example.
 * It wraps the PasskeyAuthFlow component with the LazorkitProvider, which
 * provides the necessary context and configuration for LazorKit to work.
 * 
 * Configuration:
 * - rpcUrl: Solana network RPC endpoint (devnet in this example)
 * - portalUrl: LazorKit portal service URL for authentication
 * - paymasterConfig: Optional paymaster service for gasless transactions
 */

import { LazorkitProvider } from "@lazorkit/wallet";
import { PasskeyAuthFlow } from "../components/passkey_auth_flow";

// LazorKit configuration object
// For production, consider moving these to environment variables
const CONFIG = {
  rpcUrl: "https://api.devnet.solana.com", // Solana devnet RPC endpoint
  portalUrl: "https://portal.lazor.sh", // LazorKit portal URL
  paymasterConfig: {
    paymasterUrl: "https://kora.devnet.lazorkit.com", // Paymaster service for gasless transactions
  },
};

export default function Page() {
  return (
    <LazorkitProvider {...CONFIG}>
      <PasskeyAuthFlow />
    </LazorkitProvider>
  );
}

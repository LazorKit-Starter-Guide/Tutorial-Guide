## Step-by-Step Tutorial: Building a Passkey-Based Wallet

If you want to integrate LazorKit passkey authentication into your own project (rather than using this starter template), follow these steps. This tutorial assumes you're starting with a Next.js project, but the concepts apply to any React application.

### Step 1: Install Required Dependencies

First, install the LazorKit wallet SDK and required Solana packages:

```bash
npm install @lazorkit/wallet @coral-xyz/anchor @solana/web3.js
```

You may also need additional dependencies depending on your setup:

```bash
npm install @solana/kora @solana-program/token @solana/kit @solana/wallet-adapter-base @wallet-standard/wallet --legacy-peer-deps
```

### Step 2: Set Up the Provider

Create or update your root layout/page component to wrap your app with `LazorkitProvider`. This provider makes the wallet context available throughout your application.

**For Next.js App Router** (`app/layout.tsx` or `app/page.tsx`):

```typescript
"use client";

import { LazorkitProvider } from "@lazorkit/wallet";

const CONFIG = {
  rpcUrl: "https://api.devnet.solana.com",
  portalUrl: "https://portal.lazor.sh",
  paymasterConfig: {
    paymasterUrl: "https://kora.devnet.lazorkit.com",
  },
};

export default function RootLayout({ children }) {
  return (
    <LazorkitProvider {...CONFIG}>
      {children}
    </LazorkitProvider>
  );
}
```

**For Next.js Pages Router** (`pages/_app.tsx`):

```typescript
import { LazorkitProvider } from "@lazorkit/wallet";

const CONFIG = {
  rpcUrl: "https://api.devnet.solana.com",
  portalUrl: "https://portal.lazor.sh",
  paymasterConfig: {
    paymasterUrl: "https://kora.devnet.lazorkit.com",
  },
};

function MyApp({ Component, pageProps }) {
  return (
    <LazorkitProvider {...CONFIG}>
      <Component {...pageProps} />
    </LazorkitProvider>
  );
}

export default MyApp;
```

**For Create React App or Vite:**

Wrap your root component similarly:

```typescript
import { LazorkitProvider } from "@lazorkit/wallet";

function App() {
  return (
    <LazorkitProvider {...CONFIG}>
      {/* Your app components */}
    </LazorkitProvider>
  );
}
```

### Step 3: Create a Login Component

Create a component that uses the `useWallet` hook to handle authentication:

```typescript
"use client";

import { useWallet } from "@lazorkit/wallet";
import { useState } from "react";

export function LoginComponent() {
  const { connect, disconnect, isConnected, isConnecting, smartWalletPubkey } = useWallet();
  const [error, setError] = useState<string | null>(null);

  const handleConnect = async () => {
    try {
      setError(null);
      await connect();
    } catch (err) {
      setError("Failed to connect. Please try again.");
      console.error(err);
    }
  };

  const handleDisconnect = async () => {
    await disconnect();
  };

  if (isConnected) {
    return (
      <div>
        <p>Connected! Wallet: {smartWalletPubkey?.toString()}</p>
        <button onClick={handleDisconnect}>Disconnect</button>
      </div>
    );
  }

  return (
    <div>
      <button onClick={handleConnect} disabled={isConnecting}>
        {isConnecting ? "Connecting..." : "Connect with Passkey"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
```

### Step 4: Handle Buffer Polyfill (Browser Compatibility)

LazorKit and Solana libraries require Node.js `Buffer`, which isn't available in browsers. Add a polyfill:

**For Next.js** (`app/layout.tsx` or `pages/_app.tsx`):

```typescript
if (typeof window !== 'undefined') {
  window.Buffer = window.Buffer || require('buffer').Buffer;
}
```

**For Vite or Create React App**, install buffer and add to your entry file:

```bash
npm install buffer
```

```typescript
import { Buffer } from 'buffer';
window.Buffer = Buffer;
```

### Step 5: Configure Your Network

Update the configuration based on your needs:

- **Development**: Use devnet (as shown in examples)
- **Production**: Switch to mainnet-beta and update RPC URL
- **Custom RPC**: Use your own Solana RPC provider for better performance

```typescript
const CONFIG = {
  rpcUrl: process.env.NEXT_PUBLIC_RPC_URL || "https://api.devnet.solana.com",
  portalUrl: process.env.NEXT_PUBLIC_PORTAL_URL || "https://portal.lazor.sh",
  paymasterConfig: {
    paymasterUrl: process.env.NEXT_PUBLIC_PAYMASTER_URL, // Optional
  },
};
```

### Step 6: Add Error Handling

Implement proper error handling for different scenarios:

```typescript
const handleConnect = async () => {
  try {
    await connect();
  } catch (error) {
    if (error.message.includes("user cancelled")) {
      // User dismissed the passkey prompt
      console.log("Authentication cancelled");
    } else if (error.message.includes("not supported")) {
      // Browser doesn't support WebAuthn
      alert("Your browser doesn't support passkeys. Please use a modern browser.");
    } else {
      // Other errors
      console.error("Connection error:", error);
      alert("Failed to connect. Please try again.");
    }
  }
};
```

### Step 7: Access Wallet State Throughout Your App

Once the provider is set up, you can use `useWallet()` in any component:

```typescript
import { useWallet } from "@lazorkit/wallet";

function MyComponent() {
  const { isConnected, smartWalletPubkey, wallet } = useWallet();

  if (!isConnected) {
    return <p>Please connect your wallet first</p>;
  }

  return (
    <div>
      <p>Your wallet: {smartWalletPubkey?.toString()}</p>
      {/* Use wallet for transactions, etc. */}
    </div>
  );
}
```

### Step 8: Test the Integration

1. Start your development server
2. Navigate to your app
3. Click the connect button
4. Approve the passkey prompt (biometric or PIN)
5. Verify the wallet address is displayed
6. Test disconnecting and reconnecting

### Common Implementation Patterns

**Loading State:**
```typescript
const { isConnecting } = useWallet();

if (isConnecting) {
  return <Spinner />;
}
```

**Conditional Rendering:**
```typescript
const { isConnected } = useWallet();

return (
  <>
    {isConnected ? <AuthenticatedView /> : <LoginView />}
  </>
);
```

**Wallet Address Display:**
```typescript
const { smartWalletPubkey } = useWallet();

const address = smartWalletPubkey?.toString();
const shortAddress = address 
  ? `${address.slice(0, 4)}...${address.slice(-4)}`
  : "Not connected";
```

### What Happens Behind the Scenes

When a user clicks "Connect with Passkey":

1. **WebAuthn Prompt**: The browser shows a passkey/biometric prompt
2. **Authentication**: User authenticates with their device
3. **Key Generation**: LazorKit generates cryptographic keys securely
4. **Wallet Creation**: A smart wallet is created on Solana (if first time)
5. **Session Management**: The wallet session is stored securely
6. **State Update**: Your app receives the wallet address and connection status

The smart wallet is automatically managed by LazorKit - you don't need to handle seed phrases, private keys, or wallet files. Everything is secured by the user's device passkey.

### Next Steps After Integration

Once you have basic authentication working:

1. **Send Transactions**: Use the wallet to sign and send SOL or SPL tokens
2. **Interact with Programs**: Connect to Solana programs and smart contracts
3. **Add Features**: Implement token swaps, NFT operations, or DeFi interactions
4. **Customize UI**: Style the authentication flow to match your app
5. **Handle Edge Cases**: Add retry logic, offline handling, etc.

## Understanding the Code

### Basic Usage Pattern

```typescript
import { useWallet } from "@lazorkit/wallet";

function MyComponent() {
  const { connect, disconnect, isConnected, smartWalletPubkey } = useWallet();

  const handleLogin = async () => {
    await connect(); // Triggers passkey prompt
  };

  return (
    <div>
      {isConnected ? (
        <p>Wallet: {smartWalletPubkey?.toString()}</p>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  );
}
```

### Common Patterns

**Checking Connection Status:**
```typescript
const { isConnected, isConnecting } = useWallet();

if (isConnecting) {
  // Show loading state
}
if (isConnected) {
  // User is authenticated
}
```

**Accessing Wallet Address:**
```typescript
const { smartWalletPubkey, wallet } = useWallet();

// Both work:
const address = smartWalletPubkey?.toString();
const address = wallet?.smartWallet;
```

**Disconnecting:**
```typescript
const { disconnect } = useWallet();

await disconnect(); // Clears session and wallet state
```


Now that you have the basic flow working, you can:

1. **Send Transactions**: Use the wallet to sign and send Solana transactions
2. **Interact with Programs**: Connect to Solana programs and smart contracts
3. **Customize UI**: Modify the components to match your app's design
4. **Add Features**: Implement token transfers, NFT interactions, or DeFi operations
5. **Deploy**: Build and deploy your application to production

## Resources

- [LazorKit Documentation](https://docs.lazor.sh) - Official LazorKit docs
- [Solana Web3.js Docs](https://solana-labs.github.io/solana-web3.js/) - Solana JavaScript API
- [Next.js Documentation](https://nextjs.org/docs) - Next.js framework guide
- [WebAuthn Guide](https://webauthn.guide/) - Understanding WebAuthn/passkeys

## Support

If you encounter issues or have questions:

1. Check the browser console for error messages
2. Review the LazorKit documentation
3. Ensure your configuration matches the examples
4. Verify all dependencies are up to date

## License

This starter template is provided as-is for educational and development purposes.

---

**Happy Building!** 🚀

If you found this starter helpful, consider sharing it with other developers who want to integrate passkey authentication into their Solana applications.
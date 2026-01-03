# API Reference

Complete reference for the LazorKit wallet API and hooks.

## useWallet Hook

The `useWallet` hook is your main interface for interacting with LazorKit. It provides wallet state and methods.

### Import

```typescript
import { useWallet } from "@lazorkit/wallet";
```

### Usage

```typescript
function MyComponent() {
  const {
    connect,
    disconnect,
    isConnected,
    isConnecting,
    wallet,
    smartWalletPubkey,
  } = useWallet();

  // Use the wallet state and methods
}
```

### Returns

#### Methods

- **`connect()`**: `Promise<void>`
  - Initiates the passkey authentication flow
  - Triggers the browser's WebAuthn prompt
  - Creates a smart wallet if this is the first login
  - Throws an error if authentication fails

- **`disconnect()`**: `Promise<void>`
  - Clears the wallet session
  - Resets wallet state
  - Logs the user out

#### State

- **`isConnected`**: `boolean`
  - `true` when the user is authenticated and wallet is ready
  - `false` when the user is not connected

- **`isConnecting`**: `boolean`
  - `true` during the authentication process
  - `false` when not connecting

- **`wallet`**: `Wallet | null`
  - Full wallet object with all properties
  - `null` when not connected
  - Contains `smartWallet` property with the wallet address

- **`smartWalletPubkey`**: `PublicKey | null`
  - Public key of the smart wallet (Solana PublicKey object)
  - `null` when not connected
  - Use `.toString()` to get the address string

## LazorkitProvider

The provider component that wraps your application and provides LazorKit context.

### Import

```typescript
import { LazorkitProvider } from "@lazorkit/wallet";
```

### Props

```typescript
interface LazorkitProviderProps {
  rpcUrl: string;
  portalUrl: string;
  paymasterConfig?: {
    paymasterUrl?: string;
  };
  children: React.ReactNode;
}
```

### Usage

```typescript
const CONFIG = {
  rpcUrl: "https://api.devnet.solana.com",
  portalUrl: "https://portal.lazor.sh",
  paymasterConfig: {
    paymasterUrl: "https://kora.devnet.lazorkit.com",
  },
};

function App() {
  return (
    <LazorkitProvider {...CONFIG}>
      {/* Your app components */}
    </LazorkitProvider>
  );
}
```

### Requirements

- Must wrap any component that uses `useWallet()`
- Should be placed at the root of your application
- All child components can access the wallet context

## Common Patterns

### Basic Connection Flow

```typescript
const { connect, disconnect, isConnected, smartWalletPubkey } = useWallet();

const handleConnect = async () => {
  try {
    await connect();
  } catch (error) {
    console.error("Connection failed:", error);
  }
};

if (isConnected) {
  return <div>Connected: {smartWalletPubkey?.toString()}</div>;
}

return <button onClick={handleConnect}>Connect</button>;
```

### Loading State

```typescript
const { isConnecting } = useWallet();

if (isConnecting) {
  return <Spinner />;
}
```

### Conditional Rendering

```typescript
const { isConnected } = useWallet();

return (
  <>
    {isConnected ? <AuthenticatedView /> : <LoginView />}
  </>
);
```

### Wallet Address Display

```typescript
const { smartWalletPubkey } = useWallet();

const address = smartWalletPubkey?.toString();
const shortAddress = address 
  ? `${address.slice(0, 4)}...${address.slice(-4)}`
  : "Not connected";
```

### Error Handling

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
      alert("Your browser doesn't support passkeys.");
    } else {
      // Other errors
      console.error("Connection error:", error);
      alert("Failed to connect. Please try again.");
    }
  }
};
```

### Accessing Wallet Throughout App

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

## Type Definitions

### Wallet Object

```typescript
interface Wallet {
  smartWallet: string; // Wallet address as string
  // Additional wallet properties
}
```

### PublicKey

The `smartWalletPubkey` is a Solana `PublicKey` object. You can:

- Convert to string: `smartWalletPubkey.toString()`
- Access raw bytes: `smartWalletPubkey.toBytes()`
- Use in Solana transactions

## What Happens Behind the Scenes

When `connect()` is called:

1. **WebAuthn Prompt**: The browser shows a passkey/biometric prompt
2. **Authentication**: User authenticates with their device
3. **Key Generation**: LazorKit generates cryptographic keys securely
4. **Wallet Creation**: A smart wallet is created on Solana (if first time)
5. **Session Management**: The wallet session is stored securely
6. **State Update**: Your app receives the wallet address and connection status

The smart wallet is automatically managed by LazorKit - you don't need to handle seed phrases, private keys, or wallet files. Everything is secured by the user's device passkey.


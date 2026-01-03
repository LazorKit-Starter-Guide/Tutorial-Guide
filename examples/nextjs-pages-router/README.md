# Next.js Pages Router Example

This example demonstrates how to integrate LazorKit with Next.js using the Pages Router (traditional Next.js structure).

## Setup

This example shows the setup for Next.js Pages Router, which uses `pages/_app.tsx` instead of `app/layout.tsx`.

## Key Files

### `pages/_app.tsx`

This file sets up the provider and Buffer polyfill:

```typescript
import type { AppProps } from "next/app";
import { LazorkitProvider } from "@lazorkit/wallet";

// Polyfill Buffer for browser compatibility
if (typeof window !== 'undefined') {
  window.Buffer = window.Buffer || require('buffer').Buffer;
}

const CONFIG = {
  rpcUrl: "https://api.devnet.solana.com",
  portalUrl: "https://portal.lazor.sh",
  paymasterConfig: {
    paymasterUrl: "https://kora.devnet.lazorkit.com",
  },
};

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <LazorkitProvider {...CONFIG}>
      <Component {...pageProps} />
    </LazorkitProvider>
  );
}

export default MyApp;
```

### `pages/index.tsx`

Your main page component:

```typescript
import { useWallet } from "@lazorkit/wallet";
import { useState } from "react";

export default function Home() {
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

## Installation

1. Install dependencies:

```bash
npm install @lazorkit/wallet @coral-xyz/anchor @solana/web3.js
```

2. Create `pages/_app.tsx` with the provider and polyfill setup.

## Running

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the example.

## Important Notes

### Client-Side Execution

**Next.js usually handles module resolution automatically, but you must ensure wallet logic runs on the client-side.**

- Pages Router components are client-side by default, but ensure wallet operations run in the browser
- Wallet operations (connect, disconnect, etc.) must run in the browser, not during server-side rendering
- Any page component using `useWallet()` will automatically be client-side in Pages Router

### Buffer Polyfill

If you encounter Buffer errors, add this polyfill to your `pages/_app.tsx` or provider file:

```typescript
// _app.tsx or providers.tsx
if (typeof window !== 'undefined') {
    window.Buffer = window.Buffer || require('buffer').Buffer;
}
```

**Key Points:**
- Buffer polyfill goes in `pages/_app.tsx` (or your provider file)
- The `typeof window !== 'undefined'` check ensures it only runs in the browser
- Provider wraps all pages in `_app.tsx`


# Next.js App Router Example

This example demonstrates how to integrate LazorKit with Next.js using the App Router (Next.js 13+).

## Setup

This is the default setup used in the main project. The example includes:

- `LazorkitProvider` configuration in `app/page.tsx`
- Buffer polyfill in `app/layout.tsx`
- Complete authentication flow component

## Key Files

### `app/layout.tsx`

Contains the Buffer polyfill required for browser compatibility:

```typescript
// Polyfill Buffer for browser compatibility
if (typeof window !== 'undefined') {
    window.Buffer = window.Buffer || require('buffer').Buffer;
}
```

### `app/page.tsx`

Configures and wraps the app with `LazorkitProvider`. **Note: Must use `"use client"` directive:**

```typescript
"use client"; // Required for client-side wallet operations

import { LazorkitProvider } from "@lazorkit/wallet";

const CONFIG = {
  rpcUrl: "https://api.devnet.solana.com",
  portalUrl: "https://portal.lazor.sh",
  paymasterConfig: {
    paymasterUrl: "https://kora.devnet.lazorkit.com",
  },
};

export default function Page() {
  return (
    <LazorkitProvider {...CONFIG}>
      <PasskeyAuthFlow />
    </LazorkitProvider>
  );
}
```

## Installation

1. Install dependencies:

```bash
npm install @lazorkit/wallet @coral-xyz/anchor @solana/web3.js
```

2. The Buffer polyfill in `app/layout.tsx` will automatically handle browser compatibility.

## Running

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the example.

## Important Notes

### Client-Side Execution

**Next.js usually handles module resolution automatically, but you must ensure wallet logic runs on the client-side.**

- **Always use `"use client"` directive** for any component that uses `useWallet()` hook
- Wallet operations (connect, disconnect, etc.) must run in the browser, not during server-side rendering
- The `LazorkitProvider` and any components using `useWallet()` must be client components

### Buffer Polyfill

If you encounter Buffer errors, add this polyfill to your `app/layout.tsx` or provider file:

```typescript
// layout.tsx or providers.tsx
if (typeof window !== 'undefined') {
    window.Buffer = window.Buffer || require('buffer').Buffer;
}
```

**Key Points:**
- Buffer polyfill must be in the root layout (`app/layout.tsx`)
- The `typeof window !== 'undefined'` check ensures it only runs in the browser
- Provider can be in `app/page.tsx` or `app/layout.tsx` depending on your needs


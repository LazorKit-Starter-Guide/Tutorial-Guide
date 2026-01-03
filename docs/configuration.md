# Configuration Guide

This guide covers all configuration options for LazorKit in your application.

## SDK Configuration

The LazorKit SDK is configured in your root component or layout. Here's what each configuration option does:

```typescript
const CONFIG = {
  rpcUrl: "https://api.devnet.solana.com",        // Solana RPC endpoint
  portalUrl: "https://portal.lazor.sh",           // LazorKit portal URL
  paymasterConfig: {
    paymasterUrl: "https://kora.devnet.lazorkit.com",  // Paymaster service URL
  },
};
```

### Configuration Options Explained

- **rpcUrl**: The Solana network RPC endpoint. This example uses devnet. For production, you'd use mainnet-beta.
- **portalUrl**: LazorKit's portal service URL for managing authentication and wallet operations.
- **paymasterConfig.paymasterUrl**: Optional paymaster service for gasless transactions (powered by Kora).

### For Production

When deploying to production, you'll want to:

1. Switch `rpcUrl` to a mainnet endpoint (or use your own RPC provider)
2. Update `portalUrl` to the production portal URL
3. Configure your paymaster settings if using gasless transactions

## Environment Variables

While this starter doesn't require environment variables, you might want to externalize configuration for different environments. Create a `.env.local` file:

```env
NEXT_PUBLIC_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_PORTAL_URL=https://portal.lazor.sh
NEXT_PUBLIC_PAYMASTER_URL=https://kora.devnet.lazorkit.com
```

Then update your configuration to use these variables:

```typescript
const CONFIG = {
  rpcUrl: process.env.NEXT_PUBLIC_RPC_URL || "https://api.devnet.solana.com",
  portalUrl: process.env.NEXT_PUBLIC_PORTAL_URL || "https://portal.lazor.sh",
  paymasterConfig: {
    paymasterUrl: process.env.NEXT_PUBLIC_PAYMASTER_URL || "https://kora.devnet.lazorkit.com",
  },
};
```

## Network Configuration

### Development

For development and testing, use Solana devnet:

```typescript
const CONFIG = {
  rpcUrl: "https://api.devnet.solana.com",
  portalUrl: "https://portal.lazor.sh",
  paymasterConfig: {
    paymasterUrl: "https://kora.devnet.lazorkit.com",
  },
};
```

### Production

For production applications, switch to mainnet:

```typescript
const CONFIG = {
  rpcUrl: "https://api.mainnet-beta.solana.com", // Or your own RPC provider
  portalUrl: "https://portal.lazor.sh", // Production portal URL
  paymasterConfig: {
    paymasterUrl: "https://kora.mainnet.lazorkit.com", // Production paymaster
  },
};
```

### Custom RPC Providers

For better performance and reliability, consider using your own RPC provider:

```typescript
const CONFIG = {
  rpcUrl: "https://your-rpc-provider.com", // Your custom RPC endpoint
  portalUrl: "https://portal.lazor.sh",
  paymasterConfig: {
    paymasterUrl: "https://kora.devnet.lazorkit.com",
  },
};
```

## Browser Compatibility

LazorKit requires certain polyfills for browser compatibility. See the [examples directory](../examples/) for environment-specific setup instructions.

### Buffer Polyfill

LazorKit and Solana libraries require Node.js `Buffer`, which isn't available in browsers. Add this polyfill to your layout or provider file:

**For Next.js App Router** (`app/layout.tsx` or `app/page.tsx`):

```typescript
// layout.tsx or providers.tsx
if (typeof window !== 'undefined') {
    window.Buffer = window.Buffer || require('buffer').Buffer;
}
```

**For Next.js Pages Router** (`pages/_app.tsx`):

```typescript
// _app.tsx
if (typeof window !== 'undefined') {
    window.Buffer = window.Buffer || require('buffer').Buffer;
}
```

**Important:** 
- The `typeof window !== 'undefined'` check ensures the polyfill only runs in the browser
- Make sure the `buffer` package is installed: `npm install buffer`
- Each example in the `examples/` directory includes the appropriate polyfill configuration

### Client-Side Execution (Next.js)

**Next.js usually handles module resolution automatically, but you must ensure wallet logic runs on the client-side.**

- **App Router**: Always use `"use client"` directive for components using `useWallet()`
- **Pages Router**: Components are client-side by default, but ensure wallet operations run in the browser
- Wallet operations (connect, disconnect, etc.) must run in the browser, not during server-side rendering

## Security Considerations

1. **Never expose private keys** - LazorKit handles key management securely
2. **Use HTTPS in production** - WebAuthn requires HTTPS (or localhost for development)
3. **Validate configuration** - Ensure your RPC and portal URLs are correct
4. **Environment variables** - Use environment variables for sensitive configuration

## Advanced Configuration

### Custom Paymaster Configuration

If you're using a custom paymaster service:

```typescript
const CONFIG = {
  rpcUrl: "https://api.devnet.solana.com",
  portalUrl: "https://portal.lazor.sh",
  paymasterConfig: {
    paymasterUrl: "https://your-paymaster.com",
    // Additional paymaster options can be added here
  },
};
```

### Multiple Environment Support

For managing multiple environments, create separate configuration files:

**config/development.ts:**
```typescript
export const CONFIG = {
  rpcUrl: "https://api.devnet.solana.com",
  portalUrl: "https://portal.lazor.sh",
  paymasterConfig: {
    paymasterUrl: "https://kora.devnet.lazorkit.com",
  },
};
```

**config/production.ts:**
```typescript
export const CONFIG = {
  rpcUrl: "https://api.mainnet-beta.solana.com",
  portalUrl: "https://portal.lazor.sh",
  paymasterConfig: {
    paymasterUrl: "https://kora.mainnet.lazorkit.com",
  },
};
```

Then import the appropriate config based on your environment:

```typescript
import { CONFIG } from "@/config/development"; // or production
```


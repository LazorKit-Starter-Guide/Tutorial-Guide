# LazorKit Passkey Login Flow - Starter Guide

A complete starter template for integrating LazorKit's passkey-based authentication with smart wallet functionality on Solana. This project demonstrates how to implement passwordless login using WebAuthn passkeys, with automatic smart wallet creation and seamless Solana integration.

## What is LazorKit?

LazorKit is a powerful SDK that simplifies Web3 authentication and wallet management on Solana. Instead of traditional seed phrases or browser extensions, LazorKit uses passkeys (WebAuthn) to provide a secure, user-friendly authentication experience. When users authenticate with their device passkey, a smart wallet is automatically created and managed for them.

## Project Overview

This starter project showcases the simplest implementation of LazorKit's passkey authentication flow. It includes:

- **Passkey-based authentication** - Users authenticate using their device's biometric or PIN
- **Automatic smart wallet creation** - A Solana smart wallet is created on first login
- **Wallet state management** - Easy access to wallet address and connection status
- **Clean, modern UI** - Dark mode interface with smooth transitions

The example demonstrates the core workflow: connect → authenticate → access wallet. Perfect for developers who want to understand how to integrate LazorKit into their own applications.

## Prerequisites

Before you begin, make sure you have:

- **Node.js** 18.x or higher installed
- **npm**, **yarn**, **pnpm**, or **bun** package manager
- A modern browser with WebAuthn support (Chrome, Firefox, Safari, Edge)
- Basic familiarity with React and Next.js

## Installation

### Step 1: Clone or Download the Project

If you're starting from this template, you can clone it or download the files to your local machine.

### Step 2: Install Dependencies

Navigate to the project directory and install all required packages:

```bash
npm install
```

This will install:
- `@lazorkit/wallet` - The main LazorKit SDK for wallet management
- `next` - Next.js framework
- `react` & `react-dom` - React libraries
- `@solana/web3.js` - Solana blockchain interaction
- `tailwindcss` - Styling framework
- And other supporting dependencies

### Step 3: Verify Installation

After installation completes, you should see a `node_modules` folder in your project directory. If you encounter any errors, make sure your Node.js version is compatible (18.x or higher).

## Configuration

### SDK Configuration

The LazorKit SDK is configured in `app/page.tsx`. Here's what each configuration option does:

```typescript
const CONFIG = {
  rpcUrl: "https://api.devnet.solana.com",        // Solana RPC endpoint
  portalUrl: "https://portal.lazor.sh",           // LazorKit portal URL
  paymasterConfig: {
    paymasterUrl: "https://kora.devnet.lazorkit.com",  // Paymaster service URL
  },
};
```

**Configuration Options Explained:**

- **rpcUrl**: The Solana network RPC endpoint. This example uses devnet. For production, you'd use mainnet-beta.
- **portalUrl**: LazorKit's portal service URL for managing authentication and wallet operations.
- **paymasterConfig.paymasterUrl**: Optional paymaster service for gasless transactions (powered by Kora).

**For Production:**

When deploying to production, you'll want to:
1. Switch `rpcUrl` to a mainnet endpoint (or use your own RPC provider)
2. Update `portalUrl` to the production portal URL
3. Configure your paymaster settings if using gasless transactions

### Environment Variables (Optional)

While this starter doesn't require environment variables, you might want to externalize configuration for different environments. Create a `.env.local` file:

```env
NEXT_PUBLIC_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_PORTAL_URL=https://portal.lazor.sh
NEXT_PUBLIC_PAYMASTER_URL=https://kora.devnet.lazorkit.com
```

Then update `app/page.tsx` to use these variables:

```typescript
const CONFIG = {
  rpcUrl: process.env.NEXT_PUBLIC_RPC_URL || "https://api.devnet.solana.com",
  portalUrl: process.env.NEXT_PUBLIC_PORTAL_URL || "https://portal.lazor.sh",
  paymasterConfig: {
    paymasterUrl: process.env.NEXT_PUBLIC_PAYMASTER_URL || "https://kora.devnet.lazorkit.com",
  },
};
```

## Running the Project

### Development Mode

Start the development server:

```bash
npm run dev
```

The application will start on [http://localhost:3000](http://localhost:3000). Open this URL in your browser to see the passkey authentication flow.

**What to expect:**
- You'll see a welcome screen with a "Continue with Passkey" button
- Clicking the button will trigger your device's passkey prompt (biometric or PIN)
- After authentication, a smart wallet address will be displayed
- You can disconnect and reconnect to test the flow

### Building for Production

To create an optimized production build:

```bash
npm run build
```

Then start the production server:

```bash
npm start
```

### Linting

Check your code for issues:

```bash
npm run lint
```

## Project Structure

```
passkeyflow/
├── app/
│   ├── layout.tsx          # Root layout with providers and metadata
│   ├── page.tsx            # Main page with LazorKit configuration
│   └── globals.css         # Global styles and dark mode theme
├── components/
│   ├── passkey_auth_folow.tsx  # Main authentication flow component
│   └── ui/                 # Reusable UI components (Button, Card)
├── lib/
│   └── utils.ts            # Utility functions (cn helper)
├── public/                 # Static assets
├── package.json            # Dependencies and scripts
└── README.md              # This file
```

## How It Works

### The Authentication Flow

1. **Initial State**: User sees the login button
2. **Connection**: User clicks "Continue with Passkey"
3. **Authentication**: Browser prompts for device passkey (fingerprint, face ID, or PIN)
4. **Wallet Creation**: LazorKit automatically creates a smart wallet if this is the first login
5. **Connected State**: Wallet address is displayed, user can interact with Solana

### Key Components

**LazorkitProvider** (`app/page.tsx`)
- Wraps the application and provides LazorKit context
- Configures RPC, portal, and paymaster settings
- Must wrap any component that uses `useWallet()`

**PasskeyAuthFlow** (`components/passkey_auth_folow.tsx`)
- Main UI component demonstrating the authentication flow
- Uses `useWallet()` hook to access wallet state and methods
- Handles connection, disconnection, and displays wallet information

**useWallet Hook**
- Provides: `connect()`, `disconnect()`, `isConnected`, `isConnecting`, `wallet`, `smartWalletPubkey`
- This is your main interface for interacting with LazorKit

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

## Troubleshooting

### Passkey Prompt Not Appearing

- Make sure you're using HTTPS (or localhost for development)
- Check that your browser supports WebAuthn (Chrome, Firefox, Safari, Edge)
- Verify your device has passkey/biometric authentication enabled

### Wallet Not Connecting

- Check browser console for errors
- Verify your RPC URL is accessible
- Ensure portal URL is correct
- Check network connectivity

### Build Errors

- Make sure all dependencies are installed: `npm install`
- Check Node.js version: `node --version` (should be 18+)
- Clear cache and reinstall: `rm -rf node_modules package-lock.json && npm install`

### Module Resolution Errors

Sometimes during installation or when running the project, you might encounter "Module not found" errors for certain Solana-related packages. This typically happens when peer dependencies aren't automatically installed or when there are version conflicts. Here are the common errors and how to fix them:

**Error: `Module not found: Can't resolve '@solana/kora'`**

This package is required for paymaster functionality. Install it with:

```bash
npm install @solana/kora
```

**Error: `Module not found: Can't resolve '@solana-program/token'`**

This package provides token program utilities. Install it with the `--legacy-peer-deps` flag to handle peer dependency conflicts:

```bash
npm install @solana-program/token --legacy-peer-deps
```

**Error: `Module not found: Can't resolve '@solana/kit'`**

The Solana Kit package is needed for wallet operations. Install it with:

```bash
npm install @solana/kit --legacy-peer-deps
```

**Error: `Module not found: Can't resolve '@solana/wallet-adapter-base'`**

This is a base package for Solana wallet adapters. Install it with:

```bash
npm install @solana/wallet-adapter-base --legacy-peer-deps
```

**Error: `Module not found: Can't resolve '@wallet-standard/wallet'`**

This package implements the Wallet Standard specification. Install it with:

```bash
npm install @wallet-standard/wallet --legacy-peer-deps
```

**Why `--legacy-peer-deps`?**

Some of these packages have peer dependency requirements that might conflict with npm's strict dependency resolution. The `--legacy-peer-deps` flag tells npm to use the legacy (npm v6) peer dependency resolution algorithm, which is more permissive and often resolves these conflicts.

**Quick Fix: Install All Missing Dependencies**

If you're encountering multiple module errors, you can install all of them at once:

```bash
npm install @solana/kora @solana-program/token @solana/kit @solana/wallet-adapter-base @wallet-standard/wallet --legacy-peer-deps
```

After installing these packages, restart your development server. If errors persist, try clearing your Next.js cache:

```bash
rm -rf .next
npm run dev
```

### Origin Mismatch Error (Development)

**Error: `origins don't match "https://portal.lazor.sh" "http://localhost:3000"`**

You might see this error in the browser console when running the app locally. This is a CORS/origin validation warning that occurs because:

- Your app is running on `http://localhost:3000` (development)
- LazorKit's portal service expects requests from `https://portal.lazor.sh` (production)

**Is this a problem?**

In most cases, **no**. This is typically a warning rather than a blocking error. The authentication flow should still work correctly despite this message appearing in the console.

**What to do:**

1. **Test the functionality first**: Try completing the passkey authentication flow. If it works (you can connect and see your wallet address), you can safely ignore this warning.

2. **Check if it's actually blocking**: If authentication fails completely, then it might be a real issue. Otherwise, it's just a development warning.

3. **For production**: This error won't occur in production when your app is deployed to a proper domain with HTTPS, as the origin will match the expected configuration.

**Why does this happen?**

LazorKit's portal service performs origin validation as a security measure. During development on localhost, the origin doesn't match the portal's expected origin, which triggers this warning. The SDK is designed to handle this gracefully in development environments.

**If authentication is actually failing:**

- Make sure you're accessing the app via `http://localhost:3000` (not `127.0.0.1`)
- Check that your browser allows WebAuthn/passkey prompts on localhost
- Verify your network connection is stable
- Try clearing browser cache and cookies for localhost
- Check the browser console for any additional error messages

**Note:** If you see this error coming from a browser extension (like in the call stack showing `chrome-extension://`), it might be a browser extension interfering. Try disabling extensions temporarily to see if that's the source of the issue.

## Next Steps

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

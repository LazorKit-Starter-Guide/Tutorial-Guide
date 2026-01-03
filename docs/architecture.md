# Architecture Overview

Understanding how the LazorKit passkey authentication flow works.

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
├── docs/                   # Documentation files
├── examples/               # Environment-specific examples
├── public/                 # Static assets
├── package.json            # Dependencies and scripts
└── README.md              # Main readme file
```

## Component Architecture

### Root Layout (`app/layout.tsx`)

The root layout component sets up:
- Font configuration (Geist Sans and Geist Mono)
- Global CSS styles
- Buffer polyfill for browser compatibility
- Dark mode enabled by default
- Page metadata

**Key Features:**
- Buffer polyfill is essential for Solana/Web3 libraries
- Must be configured before any Web3 code runs

### Main Page (`app/page.tsx`)

The main page component:
- Configures LazorKit with RPC, portal, and paymaster settings
- Wraps the app with `LazorkitProvider`
- Renders the `PasskeyAuthFlow` component

**Configuration:**
- RPC URL: Solana network endpoint
- Portal URL: LazorKit authentication service
- Paymaster: Optional gasless transaction service

### PasskeyAuthFlow Component (`components/passkey_auth_folow.tsx`)

The main authentication component demonstrates:
- Three UI states: idle, connecting, connected
- Integration with `useWallet()` hook
- Error handling
- Wallet address display

**State Management:**
- Uses `useWallet()` for wallet state
- Local state for UI flow stages
- Syncs local state with wallet connection status

## Authentication Flow

### Step-by-Step Process

1. **Initial State**: User sees the login button
2. **Connection**: User clicks "Continue with Passkey"
3. **Authentication**: Browser prompts for device passkey (fingerprint, face ID, or PIN)
4. **Wallet Creation**: LazorKit automatically creates a smart wallet if this is the first login
5. **Connected State**: Wallet address is displayed, user can interact with Solana

### Behind the Scenes

When a user clicks "Connect with Passkey":

1. **WebAuthn Prompt**: The browser shows a passkey/biometric prompt
2. **Authentication**: User authenticates with their device
3. **Key Generation**: LazorKit generates cryptographic keys securely
4. **Wallet Creation**: A smart wallet is created on Solana (if first time)
5. **Session Management**: The wallet session is stored securely
6. **State Update**: Your app receives the wallet address and connection status

## Key Concepts

### LazorkitProvider

The provider component that:
- Wraps the application and provides LazorKit context
- Configures RPC, portal, and paymaster settings
- Must wrap any component that uses `useWallet()`

### useWallet Hook

Provides access to:
- `connect()`: Initiates passkey authentication
- `disconnect()`: Clears wallet session
- `isConnected`: Connection status
- `isConnecting`: Loading state
- `wallet`: Full wallet object
- `smartWalletPubkey`: Wallet public key

### Smart Wallet

The smart wallet is:
- Automatically created on first login
- Secured by the user's device passkey
- Managed entirely by LazorKit
- No seed phrases or private keys to handle

## Data Flow

```
User Action
    ↓
PasskeyAuthFlow Component
    ↓
useWallet Hook
    ↓
LazorkitProvider
    ↓
LazorKit SDK
    ↓
WebAuthn API
    ↓
Device Authentication
    ↓
Smart Wallet Creation/Retrieval
    ↓
State Update
    ↓
UI Update
```

## Security Considerations

1. **No Private Keys**: LazorKit handles all key management
2. **Device Security**: Keys are secured by device passkey
3. **HTTPS Required**: WebAuthn requires HTTPS (or localhost)
4. **Session Management**: Sessions are securely stored
5. **Origin Validation**: Portal validates request origins

## Extension Points

### Custom UI

You can customize the UI by:
- Modifying `PasskeyAuthFlow` component
- Creating your own components using `useWallet()`
- Styling with Tailwind CSS or your preferred framework

### Additional Features

After basic authentication works, you can:
- Send transactions using the wallet
- Interact with Solana programs
- Implement token transfers
- Add NFT operations
- Build DeFi interactions

## Best Practices

1. **Error Handling**: Always wrap `connect()` in try-catch
2. **Loading States**: Show loading indicators during connection
3. **User Feedback**: Provide clear feedback for all states
4. **Configuration**: Use environment variables for different environments
5. **Testing**: Test on multiple browsers and devices


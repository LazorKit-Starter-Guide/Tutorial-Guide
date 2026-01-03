# Getting Started

Welcome to the LazorKit Passkey Login Flow starter template! This guide will help you get up and running quickly.

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

## Next Steps

Now that you have the basic flow working, you can:

1. **Explore the Examples** - Check out the [examples directory](../examples/) for different framework setups
2. **Read the Configuration Guide** - Learn about [configuring LazorKit](./configuration.md)
3. **Understand the API** - Review the [API reference](./api-reference.md)
4. **Customize Your App** - Modify the components to match your design

## Resources

- [LazorKit Documentation](https://docs.lazor.sh) - Official LazorKit docs
- [Solana Web3.js Docs](https://solana-labs.github.io/solana-web3.js/) - Solana JavaScript API
- [Next.js Documentation](https://nextjs.org/docs) - Next.js framework guide
- [WebAuthn Guide](https://webauthn.guide/) - Understanding WebAuthn/passkeys

## Support

If you encounter issues or have questions:

1. Check the browser console for error messages
2. Review the [Troubleshooting Guide](./troubleshooting.md)
3. Review the LazorKit documentation
4. Ensure your configuration matches the examples


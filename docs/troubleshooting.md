# Troubleshooting Guide

Common issues and solutions when working with LazorKit.

## Passkey Prompt Not Appearing

**Symptoms:**
- Clicking "Connect" doesn't show a passkey prompt
- No authentication dialog appears

**Solutions:**
- Make sure you're using HTTPS (or localhost for development)
- Check that your browser supports WebAuthn (Chrome, Firefox, Safari, Edge)
- Verify your device has passkey/biometric authentication enabled
- Check browser console for WebAuthn-related errors
- Ensure you're not in an iframe (some browsers block WebAuthn in iframes)

## Wallet Not Connecting

**Symptoms:**
- Authentication prompt appears but connection fails
- Error messages in console
- Wallet state doesn't update after authentication

**Solutions:**
- Check browser console for errors
- Verify your RPC URL is accessible
- Ensure portal URL is correct
- Check network connectivity
- Verify all dependencies are installed correctly
- Try clearing browser cache and cookies

## Build Errors

**Symptoms:**
- `npm run build` fails
- Module resolution errors
- Type errors during build

**Solutions:**
- Make sure all dependencies are installed: `npm install`
- Check Node.js version: `node --version` (should be 18+)
- Clear cache and reinstall: `rm -rf node_modules package-lock.json && npm install`
- Check for TypeScript errors: `npm run lint`
- Verify `tsconfig.json` is properly configured

## Module Resolution Errors

Sometimes during installation or when running the project, you might encounter "Module not found" errors for certain Solana-related packages. This typically happens when peer dependencies aren't automatically installed or when there are version conflicts.

### Common Module Errors

**Error: `Module not found: Can't resolve '@solana/kora'`**

This package is required for paymaster functionality. Install it with:

```bash
npm install @solana/kora
```

**Error: `Module not found: Can't resolve '@solana-program/token'`**

This package provides token program utilities. Install it with the `--legacy-peer-deps` flag:

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

### Why `--legacy-peer-deps`?

Some of these packages have peer dependency requirements that might conflict with npm's strict dependency resolution. The `--legacy-peer-deps` flag tells npm to use the legacy (npm v6) peer dependency resolution algorithm, which is more permissive and often resolves these conflicts.

### Quick Fix: Install All Missing Dependencies

If you're encountering multiple module errors, you can install all of them at once:

```bash
npm install @solana/kora @solana-program/token @solana/kit @solana/wallet-adapter-base @wallet-standard/wallet --legacy-peer-deps
```

After installing these packages, restart your development server. If errors persist, try clearing your Next.js cache:

```bash
rm -rf .next
npm run dev
```

## Origin Mismatch Error (Development)

**Error: `origins don't match "https://portal.lazor.sh" "http://localhost:3000"`**

You might see this error in the browser console when running the app locally. This is a CORS/origin validation warning that occurs because:

- Your app is running on `http://localhost:3000` (development)
- LazorKit's portal service expects requests from `https://portal.lazor.sh` (production)

### Is this a problem?

In most cases, **no**. This is typically a warning rather than a blocking error. The authentication flow should still work correctly despite this message appearing in the console.

### What to do:

1. **Test the functionality first**: Try completing the passkey authentication flow. If it works (you can connect and see your wallet address), you can safely ignore this warning.

2. **Check if it's actually blocking**: If authentication fails completely, then it might be a real issue. Otherwise, it's just a development warning.

3. **For production**: This error won't occur in production when your app is deployed to a proper domain with HTTPS, as the origin will match the expected configuration.

### Why does this happen?

LazorKit's portal service performs origin validation as a security measure. During development on localhost, the origin doesn't match the portal's expected origin, which triggers this warning. The SDK is designed to handle this gracefully in development environments.

### If authentication is actually failing:

- Make sure you're accessing the app via `http://localhost:3000` (not `127.0.0.1`)
- Check that your browser allows WebAuthn/passkey prompts on localhost
- Verify your network connection is stable
- Try clearing browser cache and cookies for localhost
- Check the browser console for any additional error messages

**Note:** If you see this error coming from a browser extension (like in the call stack showing `chrome-extension://`), it might be a browser extension interfering. Try disabling extensions temporarily to see if that's the source of the issue.

## Buffer Polyfill Issues

**Symptoms:**
- `Buffer is not defined` errors
- Build errors related to Buffer
- Runtime errors in browser
- "Cannot find module 'buffer'" errors

**Solutions:**

### For Next.js App Router

Add the Buffer polyfill to `app/layout.tsx`:

```typescript
// layout.tsx
if (typeof window !== 'undefined') {
    window.Buffer = window.Buffer || require('buffer').Buffer;
}
```

**Important:**
- Ensure `buffer` package is installed: `npm install buffer`
- The `typeof window !== 'undefined'` check ensures it only runs in the browser
- Must be in the root layout file

### For Next.js Pages Router

Add the Buffer polyfill to `pages/_app.tsx`:

```typescript
// _app.tsx
if (typeof window !== 'undefined') {
    window.Buffer = window.Buffer || require('buffer').Buffer;
}
```

### General Troubleshooting

- Ensure Buffer polyfill is properly configured for your environment
- See the [examples directory](../examples/) for environment-specific setup
- Verify `buffer` package is installed: `npm install buffer`
- Check that the polyfill runs before any wallet code executes
- Restart your development server after adding the polyfill

## Client-Side Execution Issues (Next.js)

**Symptoms:**
- "useWallet must be used within LazorkitProvider" errors
- Wallet operations not working
- Server-side rendering errors
- "window is not defined" errors

**Solutions:**

### For Next.js App Router

**Always use `"use client"` directive** for components using wallet hooks:

```typescript
"use client"; // Required!

import { useWallet } from "@lazorkit/wallet";

export function MyComponent() {
  const { connect } = useWallet();
  // ...
}
```

### For Next.js Pages Router

- Pages Router components are client-side by default
- Ensure wallet operations run in the browser, not during SSR
- If using `getServerSideProps`, ensure wallet logic is in client components

### General Tips

- Next.js usually handles module resolution automatically
- Ensure wallet logic runs on the client-side
- Wallet operations (connect, disconnect, etc.) must run in the browser
- Check that `LazorkitProvider` wraps your app correctly

## TypeScript Errors

**Symptoms:**
- Type errors in IDE
- Build fails with TypeScript errors

**Solutions:**
- Ensure `@types/node` is installed
- Check `tsconfig.json` configuration
- Verify all imports are correct
- Check that types are properly exported from `@lazorkit/wallet`

## Still Having Issues?

If you're still experiencing problems:

1. **Check the browser console** - Look for detailed error messages
2. **Review the examples** - Compare your setup with the working examples
3. **Check LazorKit documentation** - Visit [docs.lazor.sh](https://docs.lazor.sh)
4. **Verify your configuration** - Ensure all URLs and settings are correct
5. **Test in a different browser** - Rule out browser-specific issues
6. **Clear all caches** - Clear npm cache, Next.js cache, and browser cache


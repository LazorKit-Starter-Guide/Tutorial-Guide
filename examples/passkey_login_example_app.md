# LazorKit Passkey Wallet Tutorial (Next.js)

## Overview

This guide walks you through building a **Next.js app with passkey authentication** (biometrics instead of passwords).
When a user authenticates, a **Solana smart wallet** is automatically created or restored using **LazorKit**.

**What you’ll build:**

* Passwordless login using WebAuthn (passkeys)
* Automatic Solana smart wallet creation
* Simple, state-driven authentication UI

---

## Tech Stack

* **Next.js (App Router)**
* **React + TypeScript**
* **LazorKit Wallet SDK**
* **Tailwind CSS**
* **Solana Devnet**

---

## Final File Structure

```
your-project/
├── app/
│   ├── layout.tsx        # Global layout, fonts, Buffer polyfill
│   └── page.tsx          # LazorKit provider + main page
├── components/
│   └── passkey_auth_flow.tsx
├── styles/
│   └── globals.css
└── package.json
```

---

## 1. Create a Next.js Project

Create a new Next.js app using the App Router and TypeScript.

```bash
npx create-next-app@latest lazorkit-passkey-demo
cd lazorkit-passkey-demo
```

When prompted:

* TypeScript: **Yes**
* App Router: **Yes**
* Tailwind CSS: **Yes**
* ESLint: **Yes**

Start the dev server to confirm setup:

```bash
npm run dev
```

---

## 2. Install LazorKit & Dependencies

Install LazorKit and required browser polyfills.

```bash
npm install @lazorkit/wallet buffer
```

> **Why buffer?**
> Solana libraries expect Node’s `Buffer`, which doesn’t exist in browsers by default.

---

## 3. Global Layout (`app/layout.tsx`)

This file runs once and wraps your entire application.

**Responsibilities:**

* Load fonts
* Apply global styles
* Polyfill `Buffer` for Solana compatibility

Replace `app/layout.tsx` with:

```ts
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Fonts
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Solana Buffer polyfill (critical)
if (typeof window !== "undefined") {
  window.Buffer = window.Buffer || require("buffer").Buffer;
}

export const metadata: Metadata = {
  title: "LazorKit Passkey Auth",
  description: "Passkey-based Solana smart wallet authentication",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
```

### Why this matters

* **Without the Buffer polyfill, Solana SDKs will crash**
* Fonts are loaded once and reused everywhere

---

## 4. Wallet Provider (`app/page.tsx`)

This page wraps your app with `LazorkitProvider`, making wallet state available to all components.

Replace `app/page.tsx` with:

```ts
"use client";

import { LazorkitProvider } from "@lazorkit/wallet";
import { PasskeyAuthFlow } from "@/components/passkey_auth_flow";

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

### Key idea

`LazorkitProvider` is a **React context provider**.
Anything inside it can access wallet state via `useWallet()`.

---

## 5. Passkey Authentication UI

Create `components/passkey_auth_flow.tsx`.

This component:

* Initiates passkey login
* Tracks authentication state
* Displays wallet info once connected

### Complete Component

```ts
"use client";

import { useWallet } from "@lazorkit/wallet";
import { useEffect, useState } from "react";

export function PasskeyAuthFlow() {
  const {
    connect,
    disconnect,
    isConnected,
    isConnecting,
    wallet,
    smartWalletPubkey,
  } = useWallet();

  const [step, setStep] = useState<"idle" | "connecting" | "connected">("idle");

  // Keep UI state in sync with wallet state
  useEffect(() => {
    setStep(isConnected ? "connected" : "idle");
  }, [isConnected]);

  const login = async () => {
    setStep("connecting");
    try {
      await connect();
    } catch (err) {
      console.error(err);
      setStep("idle");
    }
  };

  const logout = async () => {
    await disconnect();
    setStep("idle");
  };

  return (
    <div className="max-w-xl mx-auto mt-16 p-8 border rounded-xl space-y-6">
      {step === "idle" && (
        <>
          <h1 className="text-3xl font-bold text-center">
            Passkey Authentication
          </h1>
          <button
            onClick={login}
            disabled={isConnecting}
            className="w-full py-3 bg-blue-600 text-white rounded-lg"
          >
            Continue with Passkey
          </button>
        </>
      )}

      {step === "connecting" && (
        <p className="text-center">Authenticating… approve the passkey prompt</p>
      )}

      {step === "connected" && (
        <>
          <h2 className="text-xl font-bold text-center">
            Wallet Connected
          </h2>

          <div className="p-4 bg-gray-100 rounded-lg">
            <code className="text-sm break-all">
              {wallet?.smartWallet ||
                smartWalletPubkey?.toString()}
            </code>
          </div>

          <button
            onClick={logout}
            className="w-full py-2 bg-red-600 text-white rounded-lg"
          >
            Log Out
          </button>
        </>
      )}
    </div>
  );
}
```

---

## 6. How the Authentication Flow Works

### 1. Page Load

* `layout.tsx` initializes fonts and Buffer
* `page.tsx` mounts `LazorkitProvider`
* UI renders login state

### 2. User Clicks “Continue with Passkey”

* `connect()` triggers WebAuthn
* Browser shows native biometric prompt
* LazorKit creates or restores the wallet

### 3. Successful Login

* `isConnected` becomes `true`
* UI switches to connected state
* Wallet address is displayed

### 4. Logout

* `disconnect()` clears session
* UI resets to idle state

---

## Common Issues

### “Buffer is not defined”

**Cause:** Missing polyfill
**Fix:** Ensure the Buffer code exists in `layout.tsx`

---

### Passkey prompt doesn’t appear

**Cause:** Non-HTTPS domain
**Fix:**

* `localhost` is fine for dev
* Production must use HTTPS

---

### Wallet not connecting

**Cause:** RPC or network issue
**Fix:**

* Use Solana **devnet**
* Check console errors

---

## Core Concepts Recap

* **LazorkitProvider** → exposes wallet context
* **useWallet()** → connect, disconnect, wallet state
* **WebAuthn** → browser-native passkeys
* **Smart Wallets** → created automatically, no seed phrases
* **State-driven UI** → reflects wallet connection status

---

## Next Steps

Once this works, you can:

* Fetch wallet balances
* Send SOL or tokens
* Add transaction signing
* Integrate with other Solana dApps
* Add account recovery logic
* Improve UX with skeleton loaders

---

## Final Thought

You’ve just built a **passwordless Solana onboarding flow** with:

* No seed phrases
* No browser extensions
* No gas management for users

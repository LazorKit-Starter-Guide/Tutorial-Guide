# Session Persistence Across Devices Tutorial

## 📋 Overview

This tutorial explains how to add **session persistence across browser tabs and page refreshes** to your LazorKit passkey authentication flow. The implementation uses `sessionStorage` to maintain wallet information during a single browsing session.

## 🎯 What We Added

### Key Updates to the `PasskeyAuthFlow` Component:

#### 1. **New State Variable**
```typescript
// Added: State to hold stored wallet data from session
const [storedWallet, setStoredWallet] = useState<{
  smartWallet?: string;
  smartWalletPubkey?: string;
} | null>(null);
```

#### 2. **Session Loading on Component Mount**
```typescript
// Added: Load stored wallet from session on mount
useEffect(() => {
  const stored = sessionStorage.getItem('wallet');
  if (stored) {
    setStoredWallet(JSON.parse(stored));
  }
}, []);
```

#### 3. **Automatic Session Saving**
```typescript
// Added: Store wallet in session when connected
useEffect(() => {
  if (isConnected && wallet) {
    const walletData = {
      smartWallet: wallet.smartWallet,
      smartWalletPubkey: smartWalletPubkey?.toString()
    };
    sessionStorage.setItem('wallet', JSON.stringify(walletData));
    setStoredWallet(walletData);
  }
}, [isConnected, wallet, smartWalletPubkey]);
```

#### 4. **Enhanced Login Step Logic**
```typescript
// Modified: Now checks for stored wallet too
useEffect(() => {
  if (isConnected || storedWallet) {  // ← Changed this line
    setLoginStep("connected");
  } else {
    setLoginStep("idle");
  }
}, [isConnected, storedWallet]);
```

#### 5. **Smart Login Handler**
```typescript
// Modified: Checks session first
const handleLogin = async () => {
  if (storedWallet) {  // ← New check
    // If session wallet exists, show connected state
    setLoginStep("connected");
    return;
  }
  setLoginStep("connecting");
  try {
    await connect();
  } catch (error) {
    console.error("Login error:", error);
    setLoginStep("idle");
  }
};
```

#### 6. **Updated Wallet Display**
```typescript
// Modified: Uses stored wallet as primary source
<code className="text-sm font-mono break-all">
  {storedWallet?.smartWallet ||  // ← New: checks stored wallet first
   wallet?.smartWallet ||
   smartWalletPubkey?.toString() ||
   "Loading..."}
</code>
```

## 🔧 How It Works

### Flow Diagram:
```
User Opens App → Check sessionStorage → Found? → Show Connected State
        ↓                           ↓
    Not Found?                  Auto-login
        ↓
    Show Login Button
        ↓
    User Authenticates
        ↓
Save to sessionStorage → Persists across page refreshes
```


## 📊 Storage Details

### What Gets Stored:
```json
{
  "smartWallet": "0xabc123...",
  "smartWalletPubkey": "PubKeyString..."
}
```

### Storage Location:
- **Browser**: `sessionStorage`
- **Duration**: Until browser tab is closed
- **Scope**: Same origin only

## 📝 Complete Updated Code

Here's the complete `passkey-auth-flow.tsx` with session persistence:

```typescript
"use client";

import { useWallet } from "@lazorkit/wallet";
import { Card } from "@/components/ui/card";
import { Fingerprint, CheckCircle2, Loader2, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";

export function PasskeyAuthFlow() {
  const {
    connect,
    disconnect,
    isConnected,
    isConnecting,
    wallet,
    smartWalletPubkey,
  } = useWallet();

  const [loginStep, setLoginStep] = useState<
    "idle" | "connecting" | "connected"
  >("idle");

  // NEW: State to hold stored wallet data from session
  const [storedWallet, setStoredWallet] = useState<{
    smartWallet?: string;
    smartWalletPubkey?: string;
  } | null>(null);

  // NEW: Load stored wallet from session on mount
  useEffect(() => {
    const stored = sessionStorage.getItem('wallet');
    if (stored) {
      setStoredWallet(JSON.parse(stored));
    }
  }, []);

  // NEW: Store wallet in session when connected
  useEffect(() => {
    if (isConnected && wallet) {
      const walletData = {
        smartWallet: wallet.smartWallet,
        smartWalletPubkey: smartWalletPubkey?.toString()
      };
      sessionStorage.setItem('wallet', JSON.stringify(walletData));
      setStoredWallet(walletData);
    }
  }, [isConnected, wallet, smartWalletPubkey]);

  // UPDATED: Now checks storedWallet too
  useEffect(() => {
    if (isConnected || storedWallet) {
      setLoginStep("connected");
    } else {
      setLoginStep("idle");
    }
  }, [isConnected, storedWallet]);

  // UPDATED: Checks session first
  const handleLogin = async () => {
    if (storedWallet) {
      setLoginStep("connected");
      return;
    }
    setLoginStep("connecting");
    try {
      await connect();
    } catch (error) {
      console.error("Login error:", error);
      setLoginStep("idle");
    }
  };

  const handleLogout = async () => {
    await disconnect();
    setLoginStep("idle");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header remains same */}
      <div className="text-center space-y-4 mt-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-500 text-sm font-medium">
          <Fingerprint className="w-4 h-4" />
          <span>Passkey Login Example</span>
        </div>
        <h1 className="text-4xl font-bold">Simple Authentication Flow</h1>
        <p className="text-muted-foreground text-lg">
          This example demonstrates how to implement passkey-based
          authentication with automatic smart wallet creation.
        </p>
      </div>

      <Card className="p-8">
        {loginStep === "idle" && (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <Fingerprint className="w-10 h-10 text-primary" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Get Started</h2>
              <p className="text-muted-foreground">
                Click the button below to authenticate with your device passkey.
                A smart wallet will be created automatically.
              </p>
            </div>
            <Button
              onClick={handleLogin}
              disabled={isConnecting}
              className="h-12 px-8 text-base"
            >
              {isConnecting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Fingerprint className="w-5 h-5 mr-2" />
                  Continue with Passkey
                </>
              )}
            </Button>
          </div>
        )}

        {loginStep === "connecting" && (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Authenticating...</h2>
              <p className="text-muted-foreground">
                Please approve the passkey prompt on your device.
              </p>
            </div>
          </div>
        )}

        {loginStep === "connected" && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-10 h-10 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold mb-2">
                Successfully Authenticated!
              </h2>
              <p className="text-muted-foreground">
                Your smart wallet has been created and you're ready to use
                Solana.
              </p>
            </div>

            <div className="space-y-4 p-6 bg-secondary rounded-lg">
              <div>
                <label className="text-sm text-muted-foreground">
                  Smart Wallet Address
                </label>
                {/* UPDATED: Uses stored wallet first */}
                <div className="mt-1 p-3 bg-background rounded-md border border-border">
                  <code className="text-sm font-mono break-all">
                    {storedWallet?.smartWallet ||
                      wallet?.smartWallet ||
                      smartWalletPubkey?.toString() ||
                      "Loading..."}
                  </code>
                </div>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Status</label>
                <div className="mt-1 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-sm font-medium">Connected</span>
                </div>
              </div>
            </div>

            <Button onClick={handleLogout} className="w-full">
              <LogOut className="w-4 h-4 mr-2" />
              Log Out
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
```

## 🎯 Summary

You've successfully added **session persistence** to your LazorKit authentication flow with just a few key changes:

1. ✅ **Added stored wallet state** to track session data
2. ✅ **Implemented session loading** on component mount
3. ✅ **Added automatic session saving** on connection
4. ✅ **Updated login logic** to check sessions first
5. ✅ **Modified UI** to display stored wallet data

**Result**: Users no longer need to re-authenticate on every page refresh within the same browsing session!

---

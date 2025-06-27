"use client";

import React, { useContext } from "react";
import { storeContext } from "@/context/storeContext";

export default function ConnectWalletButton() {
    const { connectWallet, disconnect, account, isLoading } = useContext(storeContext)

    return (
        <button
            onClick={account ? disconnect : connectWallet}
            disabled={isLoading}
            className={`bg-neonPurple px-6 py-3 rounded-lg hover:bg-purple-700 transition-all duration-300 font-semibold ${isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
        >
            {isLoading ? (
                <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Connecting...
                </span>
            ) : account ? (
                <span className="flex items-center">
                    Disconnect {`${account.slice(0, 6)}...${account.slice(-4)}`}
                </span>
            ) : (
                "Connect Wallet"
            )}
        </button>
    );
}

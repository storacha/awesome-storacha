"use client";

import { useState, useRef, useEffect } from "react";
import { ArrowRight, Loader2, Copy, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function RequestDelegationPage() {
    const [agentDID, setAgentDID] = useState("");
    const [isRequestingDelegation, setIsRequestingDelegation] = useState(false);
    const [delegationSuccessful, setDelegationSuccessful] = useState(false);
    const [copied, setCopied] = useState(false);
    const inputRef = useRef(null);
    const router = useRouter();

    useEffect(() => {
        const storedDID = localStorage.getItem('agentDID');
        if (storedDID) {
            setAgentDID(storedDID);
        }
    }, []);

    const handleRequestDelegation = async () => {
        if (!agentDID.trim()) {
            toast.error("Please paste your Agent DID.");
            return;
        }

        setIsRequestingDelegation(true);
        toast.loading("Requesting delegation...", { id: "delegation-toast" });

        try {
            const response = await fetch(
                `/api/request-delegation`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ clientDID: agentDID }),
                }
            );

            const result = await response.json();
            console.log("Delegation response:", result);
            const isOk = typeof result === "boolean" ? result : result.ok;

            if (response.ok && isOk) {
                const delegationProofBase64 = result.delegationProof;
                if (delegationProofBase64) {
                    localStorage.setItem('delegationProof', delegationProofBase64);
                    setDelegationSuccessful(true);
                    toast.success("Delegation successful!", { id: "delegation-toast" });
                } else {
                    throw new Error("Delegation proof not returned by backend.");
                }
            }

            if (response.ok && isOk) {
                setDelegationSuccessful(true);
                toast.success("Delegation successful!", { id: "delegation-toast" });
            } else {
                // Handle server-side errors or `archive.ok` being false
                const errorData = result.error || "Failed to get delegation.";
                toast.error(`Delegation failed: ${errorData}`, {
                    id: "delegation-toast",
                });
                setDelegationSuccessful(false);
                console.error("Delegation request failed:", errorData);
            }
        } catch (error) {
            console.error("Error during delegation request:", error);
            toast.error("Network error or unexpected response.", {
                id: "delegation-toast",
            });
            setDelegationSuccessful(false);
        } finally {
            setIsRequestingDelegation(false);
        }
    };

    const copyToClipboard = () => {
        if (inputRef.current) {
            inputRef.current.select();
            navigator.clipboard.writeText(inputRef.current.value);
            setCopied(true);
            toast.success("Agent DID copied!", {
                position: "bottom-center",
                duration: 1500,
            });
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleProceedToUpload = () => {
        router.push("/upload");
    };

    const handleProceedToIssue = () => {
        router.push("/issue");
    };

    return (
        <div className="w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 max-w-md mx-auto my-10 border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Request Delegation
            </h2>

            <div className="mb-6">
                <label
                    htmlFor="agentDidInput"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                    Paste your Agent DID
                </label>
                <div className="relative">
                    <input
                        type="text"
                        id="agentDidInput"
                        ref={inputRef}
                        value={agentDID}
                        onChange={(e) => setAgentDID(e.target.value)}
                        placeholder="did:key:z..."
                        className="w-full p-3 pr-10 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm"
                    />
                    {agentDID && (
                        <button
                            onClick={copyToClipboard}
                            className={`absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full transition-colors duration-200 ${copied
                                ? "bg-green-500 text-white"
                                : "bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-600 dark:text-gray-300"
                                }`}
                            aria-label="Copy Agent DID"
                        >
                            {copied ? (
                                <CheckCircle size={20} />
                            ) : (
                                <Copy size={20} />
                            )}
                        </button>
                    )}
                </div>
            </div>

            <button
                onClick={handleRequestDelegation}
                disabled={isRequestingDelegation}
                className={`w-full py-3 px-4 rounded-md text-white font-medium transition-colors duration-200 mb-4 flex items-center justify-center space-x-2 ${isRequestingDelegation
                    ? "bg-indigo-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                    }`}
            >
                {isRequestingDelegation ? (
                    <>
                        <Loader2 size={20} className="animate-spin" />
                        <span>Requesting...</span>
                    </>
                ) : (
                    "Request Delegation"
                )}
            </button>

            {delegationSuccessful && (
                <>
                    <button
                        onClick={handleProceedToUpload}
                        className="w-full py-3 px-4 my-4 rounded-md bg-green-600 text-white font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 flex items-center justify-center space-x-2 transition-colors duration-200"
                    >
                        <span>Proceed to Upload</span>
                        <ArrowRight size={20} />
                    </button>
                    <button
                        onClick={handleProceedToIssue}
                        className="w-full py-3 px-4 rounded-md bg-green-600 text-white font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 flex items-center justify-center space-x-2 transition-colors duration-200"
                    >
                        <span>Proceed to Share a Secret</span>
                        <ArrowRight size={20} />
                    </button>
                </>
            )}
        </div>
    );
}

"use client";

import { useState } from "react";
import { Copy, CheckCircle, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import * as Client from '@web3-storage/w3up-client'

export default function InstantiateAgentDID() {
  const [agentDID, setAgentDID] = useState(null);
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const generateAgentDID = async () => {
    setIsLoading(true);
    try {
      const client = await Client.create()
      const agent = client.agent.did();

      setAgentDID(agent);
      console.log("Generated Agent DID:", agent);
      toast.success("Agent DID generated successfully!");
    } catch (error) {
      console.error("Error generating Agent DID:", error);
      toast.error("Failed to generate Agent DID. Please try again.");
      setAgentDID(null);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (agentDID) {
      navigator.clipboard.writeText(agentDID);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleNext = () => {
    router.push("/delegation");
  };

  return (
    <div className="w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 max-w-md mx-auto my-10 border border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
        Generate Agent DID
      </h2>

      {!agentDID ? (
        <button
          onClick={generateAgentDID}
          disabled={isLoading}
          className={`w-full py-3 px-4 rounded-md text-white font-medium transition-colors duration-200 ${isLoading
              ? "bg-indigo-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            }`}
        >
          {isLoading ? "Generating..." : "Generate Agent DID"}
        </button>
      ) : (
        <>
          <div className="relative p-4 mb-4 bg-gray-100 dark:bg-gray-700 rounded-md break-all text-gray-800 dark:text-gray-200 text-sm flex items-center justify-between">
            <span className="flex-grow pr-2">{agentDID}</span>
            <button
              onClick={copyToClipboard}
              className={`flex-shrink-0 p-2 rounded-full transition-colors duration-200 ${copied
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
          </div>

          <button
            onClick={handleNext}
            className="w-full py-3 px-4 rounded-md bg-green-600 text-white font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 flex items-center justify-center space-x-2 transition-colors duration-200"
          >
            <span>Next</span>
            <ArrowRight size={20} />
          </button>
        </>
      )}
    </div>
  );
}
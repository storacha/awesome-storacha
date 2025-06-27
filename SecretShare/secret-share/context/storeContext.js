'use client'

import { createContext, useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import { ethers } from "ethers";
import { decryptData, encryptData } from '@/lib/encrypt'

// eslint-disable-next-line react-refresh/only-export-components
export const storeContext = createContext(null);

const SUPPORTED_NETWORKS = {
  CALIBRATION: {
    chainId: "0x4cb2f",
    chainName: "Filecoin Calibration",
    rpcUrls: ["https://api.calibration.node.glif.io/rpc/v1"],
    nativeCurrency: {
      name: "tFIL",
      symbol: "tFIL",
      decimals: 18,
    },
    blockExplorerUrls: ["https://calibration.filfox.info/en"]
  },
  LINEA_SEPOLIA: {
    chainId: "0xe705",
    chainName: "Linea Sepolia",
    rpcUrls: ["https://rpc.sepolia.linea.build"],
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
    blockExplorerUrls: ["https://sepolia.lineascan.build"]
  },
  BASE_SEPOLIA: {
    chainId: "0x14a34",
    chainName: "Base Sepolia",
    rpcUrls: ["https://sepolia.base.org"],
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
    blockExplorerUrls: ["https://sepolia.basescan.org"]
  },
  OPTIMISM_SEPOLIA: {
    chainId: "0xaa37dc",
    chainName: "Optimism Sepolia",
    rpcUrls: ["https://sepolia.optimism.io"],
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
    blockExplorerUrls: ["https://sepolia-optimism.etherscan.io"]
  },
  OPTIMISM: {
    chainId: "0xa",
    chainName: "Optimism",
    rpcUrls: ["https://rpc.ankr.com/optimism"],
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
    blockExplorerUrls: ["https://optimistic.etherscan.io/"]
  },
  FILECOIN: {
    chainId: "0x13a",
    chainName: "Filecoin Mainnet",
    rpcUrls: ["https://api.node.glif.io"],
    nativeCurrency: {
      name: "FIL",
      symbol: "FIL",
      decimals: 18,
    },
    blockExplorerUrls: ["https://filfox.info/"]
  },
  POLYGON_AMOY: {
    chainId: "0x13882",
    chainName: "Polygon Amoy",
    rpcUrls: ["https://rpc-amoy.polygon.technology"],
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18,
    },
    blockExplorerUrls: ["https://www.oklink.com/amoy"]
  },
  CELO_ALFAJORES: {
    chainId: "0xaef3",
    chainName: "Celo Alfajores",
    rpcUrls: ["https://alfajores-forno.celo-testnet.org"],
    nativeCurrency: {
      name: "CELO",
      symbol: "CELO",
      decimals: 18,
    },
    blockExplorerUrls: ["https://alfajores.celoscan.io"]
  }
};

const StoreContextProvider = (props) => {

  const [isLoading, setIsLoading] = useState(false);
  const [account, setAccount] = useState(null);
  const [chainType, setChainType] = useState(null);
  const [chainID, setChainID] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [signer, setSigner] = useState(null);
  const [secret, setSecret] = useState('')
  const [encryptedSecret, setEncryptedSecret] = useState('')
  const [cipherSecret, setCipherSecret] = useState('')
  const [accessConditions, setAccessConditions]= useState('');


  const handleAccountsChanged = useCallback((accounts) => {
    if (accounts.length > 0) {
      setAccount(accounts[0]);
      localStorage.setItem("connectedAccount", accounts[0]);
      toast.success(`Account changed to: ${accounts[0]}`);
    } else {
      setAccount(null);
      localStorage.removeItem("connectedAccount");
      toast.info("Wallet Disconnected");
    }
  }, []);

  // Helper function to get chain type from chain ID : 'ethereum' | 'polygon' | 'mumbai' | 'arbitrum' | 'optimism'
  function getChainType(chainId) {
    switch (chainId) {
      case 1: // Ethereum Mainnet
      case 5: // Goerli
      case 11155111: // Sepolia
        return 'ethereum';
      case 137: // Polygon Mainnet
        return 'polygon';
      case 80001: // Mumbai
        return 'mumbai';
      case 42161: // Arbitrum One
        return 'arbitrum';
      case 10: // Optimism
        return 'optimism';
      default:
        return 'ethereum'; // Default to ethereum if chain not recognized
    }
  }

  const connectWallet = async () => {
    setIsLoading(true);
    try {
      if (!window.ethereum) {
        throw new Error("Please install MetaMask to proceed!");
      }

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      const provider = new ethers.providers.Web3Provider(window.ethereum);

      const network = await provider.getNetwork();
      const netSigner = provider.getSigner();
      setSigner(netSigner)
      const netWallet = await netSigner.getAddress();
      setWallet(netWallet)
      const netChainId = network.chainId;
      setChainID(netChainId)
      const netChainType = getChainType(netChainId);
      setChainType(netChainType)

      // Check if current network is supported
      const currentNetwork = Object.values(SUPPORTED_NETWORKS).find(
        network => parseInt(network.chainId, 16) === netChainId
      );

      if (!currentNetwork) {
        // Switch to Filecoin network by default
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ netChainId: SUPPORTED_NETWORKS.FILECOIN.chainId }],
        });
      }

      setAccount(accounts[0]);
      localStorage.setItem("connectedAccount", accounts[0]);
      toast.success(`Connected: ${accounts[0]}`);

    } catch (err) {
      if (err.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [SUPPORTED_NETWORKS.FILECOIN],
          });
        } catch (addError) {
          console.error("Failed to add network:", addError);
          toast.error("Failed to add network");
        }
      } else {
        console.error("Connection error:", err);
        toast.error(err.message || "Failed to connect wallet");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          const storedAccount = localStorage.getItem("connectedAccount");
          if (storedAccount) {
            const accounts = await window.ethereum.request({
              method: "eth_accounts",
            });

            if (accounts.length > 0) {
              if (accounts.includes(storedAccount)) {
                setAccount(storedAccount);
              } else {
                setAccount(accounts[0]);
                localStorage.setItem("connectedAccount", accounts[0]);
              }
            } else {
              localStorage.removeItem("connectedAccount");
              setAccount(null);
            }
          }
        } catch (error) {
          console.error("Error checking wallet connection:", error);
          localStorage.removeItem("connectedAccount");
          setAccount(null);
        }
      }
    };

    checkConnection();

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", () => {
        toast.info("Network changed. Reloading...");
        window.location.reload();
      });

      return () => {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
        window.ethereum.removeListener("chainChanged", () => { });
      };
    }
  }, [handleAccountsChanged]);

  const disconnect = async () => {
    try {
      setAccount(null);
      localStorage.removeItem("connectedAccount");
      toast.info("Wallet disconnected");
    } catch (err) {
      console.error("Failed to disconnect:", err);
      toast.error("Failed to disconnect wallet");
    }
  };

  const handleEncryption = async () => {
      try {
        if (!wallet || !chainID) {
          toast.error(`Couldnt connect wallet. Kindly disconnect and try again!`)
        }
        const encryptedData = await encryptData(secret, chainType, wallet, chainID);
        const encryptSecret = encryptedData.dataToEncryptHash;
        const cipherText = encryptedData.ciphertext;
        const accessText = encryptedData.accessControlConditions
        localStorage.setItem(`cipherText`, cipherText)
        localStorage.setItem(`accessText`, accessText)
        localStorage.setItem(`encryptSecret`, encryptSecret)
        setAccessConditions(accessText)
        setCipherSecret(cipherText)
        setEncryptedSecret(encryptSecret)
        return encryptSecret
  
      } catch (error) {
        setIsLoading(false)
        console.log("Encryption handler failed:", error);
      }
    }

    const handleDecryption = async () => {
      try {
        setIsLoading(true)
        if (!wallet || !chainID) {
          toast.error(`Kindly connect wallet to proceed!`)
        } else if(!cipherSecret || !encryptedSecret){
          toast.warn(`Couldnt get the encrypted secret key. Try again later!`)
        }

        const savedCipherText= localStorage.getItem(`cipherText`)
        const savedAccessText = localStorage.getItem(`accessText`)
        const savedEncryptSecret= localStorage.getItem(`encryptSecret`)
        const response = await decryptData(chainType, wallet, chainID, signer, savedCipherText, savedEncryptSecret, savedAccessText );
        setIsLoading(false)
        console.log(`decryption context result=`, response)
        return response
  
      } catch (error) {
        setIsLoading(false)
        console.log("Decryption handler failed:", error);
        toast.info(`Unknown Error occured. Couldnt Decrypt!`)
      }
    }

  

  const contextValue = {
    connectWallet,
    disconnect,
    account,
    isLoading,
    handleEncryption,
    handleDecryption,
    setIsLoading,
    secret,
    setSecret,
    setChainType,
    chainType,
    chainID,
    signer,
    wallet
  };

  return (
    <storeContext.Provider value={contextValue}>{props.children}</storeContext.Provider>
  );
};

export default StoreContextProvider;
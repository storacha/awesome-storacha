import { LitNodeClient } from '@lit-protocol/lit-node-client';
import { encryptString, decryptToString } from '@lit-protocol/encryption';
import { LIT_NETWORK } from '@lit-protocol/constants';
let litNodeClient;

export async function getLitClient() {

  if (!litNodeClient) {
    litNodeClient = new LitNodeClient({
      litNetwork: LIT_NETWORK.DatilDev,
      debug: true
    });
    await litNodeClient.connect();
    console.log(`connected!`)
  }
  return litNodeClient;
}

export async function encryptData(data, chainType, wallet, chainId) {
  const litClient = await getLitClient();

  // Get the user's wallet from MetaMask
  if (!window.ethereum) {
    throw new Error('MetaMask not installed');
  }

  const accessControlConditions = [
    {
      contractAddress: '',
      standardContractType: '',
      chain: chainType,
      method: '',
      parameters: [':userAddress'],
      returnValueTest: {
        comparator: '=',
        value: wallet
      }
    }
  ];

  const { ciphertext, dataToEncryptHash } = await encryptString(
    {
      dataToEncrypt: data,
      accessControlConditions
    },
    litClient
  );
  // console.log(`encryption result=`, ciphertext);
  // console.log(`encryption hash=`, dataToEncryptHash);

  return {
    ciphertext,
    dataToEncryptHash,
    accessControlConditions,
    chainId
  };
}

export async function decryptData(
  chainType, wallet, chainId, signer,
  ciphertext,
  dataToEncryptHash,
  accessControlConditions,
) {
  try {
    const litClient = await getLitClient();

    // Get the user's wallet from MetaMask
    if (!window.ethereum) {
      throw new Error('MetaMask not installed');
    }

    // Create SIWE message
    const domain = 'SecretShare';
    const origin = 'https://secret-share-lilac.vercel.app/'; // 'https://localhost';
    const statement = 'Decrypting file from IPFS';
    const uri = origin;
    const version = '1';
    const nonce = Math.random().toString(36).substring(2, 15);
    const issuedAt = new Date().toISOString();
    const expirationTime = new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(); // 24 hour from now

    const message = `${domain} wants you to sign in with your Ethereum account:\n${wallet}\n\n${statement}\n\nURI: ${uri}\nVersion: ${version}\nChain ID: ${chainId}\nNonce: ${nonce}\nIssued At: ${issuedAt}\nExpiration Time: ${expirationTime}`;

    // Get auth sig using MetaMask
    const signature = await signer.signMessage(message);

    const authSig = {
      sig: signature,
      derivedVia: 'web3.eth.personal.sign',
      signedMessage: message,
      address: wallet
    };

    // Update access control conditions to match the current wallet and chain
    const updatedAccessControlConditions = [
      {
        ...accessControlConditions[0],
        chain: chainType,
        parameters: [':userAddress'],
        returnValueTest: {
          comparator: '=',
          value: wallet
        }
      }
    ];

    // Decrypt the data
    const decryptedString = await decryptToString(
      {
        accessControlConditions: updatedAccessControlConditions,
        ciphertext,
        dataToEncryptHash,
        authSig,
        chain: chainType
      },
      litClient
    );
    console.log(`decryption successfull=`, JSON.parse(decryptedString));
    return JSON.parse(decryptedString);
  } catch (error) {
    console.error('Decryption error:', error);
    throw error;
  }
} 

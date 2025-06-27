import * as DID from '@ipld/dag-ucan/did'
import * as Delegation from '@ucanto/core/delegation'
import { initStorachaClient } from './storacha';
import * as Link from 'multiformats/link'
import * as Proof from "@web3-storage/w3up-client/proof";

export const createUCANDelegation = async ({
  recipientDID,
  expiresInMinutes = 10,
  usageLimit = 1,
}) => {
  try {
    const client = await initStorachaClient();
    const expiration = Math.floor(Date.now() / 1000) + expiresInMinutes * 60;
    const spaceDID = client.agent.did();
    const audience = DID.parse(recipientDID);
    const agent = client.agent;

    const baseCapabilities = ['store/remove', 'store/add'];

    const capabilities = baseCapabilities.map(cap => ({
      with: `${spaceDID}`,
      can: cap,
      nb: {
        usage: usageLimit,
        expiration,
      },
    }));

    const ucan = await Delegation.delegate({
      issuer: agent.issuer,
      audience,
      capabilities
    })
    const cid = await ucan.cid;
    const archive = await ucan.archive();

    if (!archive.ok) {
      throw new Error('Failed to create delegation archive');
    }

    // console.log('Delegation archive created successfully', archive.ok);
    return archive.ok
  } catch (err) {
    console.error('Error creating UCAN delegation:', err);
    throw err;
  }
};


export async function validateAccess(encodedDelegation) {
  try {
    const buffer = Buffer.from(encodedDelegation, 'base64');
    const delegation = await Delegation.extract(buffer);
    if (!delegation.ok) {
      return { valid: false, reason: 'invalid' }
    }
    const capability = delegation.ok.capabilities()[0];

    // Checking expiry and usage
    const now = Math.floor(Date.now() / 1000);
    if (now > capability.nb.expiration) {
      console.warn('UCAN delegation has expired');
      return { valid: false, reason: 'expired' };
    }

    return {
      valid: true,
      expiration: capability.nb.expiration,
      remainingUses: capability.nb.usage
    };
  } catch (err) {
    return { valid: false, reason: 'invalid' };
  }
}


export async function RevokeAccess(secretCID) {
  try {
    const client = await initStorachaClient();
    const parsedCidToBeRemoved = Link.parse(secretCID);
    console.log("Parsed CID to be removed:", parsedCidToBeRemoved);
    if (!parsedCidToBeRemoved) {
      throw new Error("Invalid CID format");
    }

    // Define the capability to revoke
    const caps = [{
      with: `${client.agent.did()}`,
      can: 'access/secret',
    }];

    // Retrieve the corresponding proofs for the capability
    const proofs = client.proofs(caps);
    const parseDelegatedProofs = await Promise.all(proofs.map(async (proof) => {
      try {
        return await Proof.parse(proof); 
      } catch (error) {
        console.error("Error parsing proof:", error);
      }
    }
    ))

    // Revoke the delegation using the appropriate proofs
    await client.revokeDelegation(parsedCidToBeRemoved, {
      shards: true,
      proofs: parseDelegatedProofs,
    });

    // const validateRevoke = client.getReceipt(secretCID)
    // .then((receipt) => {
    //   console.log("Revoke Access Receipt:", receipt);
    //   if (!receipt) {
    //     throw new Error("No receipt found for the revoked CID");
    //   }
    //   return receipt;
    // }).catch((error) => {
    //   console.error("Error retrieving receipt for revoked CID:", error);
    //   return null;
    // })
    console.log("Revoked Delgations for CID:", secretCID);
    return true
  } catch (error) {
    console.error("Error revoking delegations:", error);
    return false;
  }
}

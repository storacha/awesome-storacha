import * as DID from '@ipld/dag-ucan/did'
import { initStorachaClient } from '@/lib/storacha'

export async function POST(req) {
    try {
        const { clientDID } = await req.json();

        if (!clientDID) {
            return NextResponse.json({ error: "Agent DID is required" }, { status: 400 });
        }

        const client = await initStorachaClient();

        // Create a delegation for a client DID
        const audience = DID.parse(clientDID)
        const abilities = ['space/blob/add', 'space/index/add', 'store/add', 'filecoin/offer', 'upload/add'] //'space/content/decrypt' 'access/claim',
        const expiration = Math.floor(Date.now() / 1000) + (60 * 60 * 24) // 24 hours from now
        const delegation = await client.createDelegation(audience, abilities, { expiration })

        const archive = await delegation.archive()
        if (!archive.ok) {
            console.error('Failed to create delegation archive:', archive.error);
            return new Response(JSON.stringify({ ok: false, error: 'Failed to create delegation archive', details: archive.error.message || 'Unknown error' }, { status: 500 }));
        }
        const delegationProofBase64 = Buffer.from(archive.ok).toString('base64');
        return new Response(JSON.stringify({ ok: true, delegationProof: delegationProofBase64 }), { status: 200 });

    } catch (error) {
        console.error("Error in GET request:", error);
        return new Response(JSON.stringify({ error: `${error}` }), { status: 500 });

    }
}
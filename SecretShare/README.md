# 🔐 SecretShare 🔃
SecretShare is a secure way to delegate time-limited or usage-limited access to sensitive credentials, secrets, or API tokens without revealing them outright. It is like sharing 1-time access to an API key or password vault item without giving away full control.

## Live : [SecretShare](https://secret-share-lilac.vercel.app/)

![Screenshot (607)](https://github.com/user-attachments/assets/fcf8f5e4-b286-4065-8116-ba96fca4ee71)


## 📖 About

**SecretShare** empowers you to:
- 🔄 Share secrets like API keys **once** or for a **short duration**.
- 🕓 Limit access by **time or usage count**.
- 🧾 Delegate access **without transferring full ownership**.
- 📁 Store secrets securely via [Storacha](https://docs.storacha.network).
- 🪪 Leverage UCANs for secure, verifiable delegation.

> Think of it as "one-time vault links for devs and teams."

---

## Demo 

**Video**: https://www.loom.com/share/795e1161ca0443c8a2ed488e512889f8?sid=b03c2e6e-34de-4fee-8364-5befcf12bd24

**Blog**: [Medium link](https://medium.com/@akashjana663/secretshare-secure-one-time-access-to-secrets-built-with-ucans-storacha-%EF%B8%8F-6f01867cc9f0)

---

# Potentials and Features

**💡 1. Clear Problem-Solution Fit (10/10)**
- Addressing a painfully common devops/security issue: sharing secrets temporarily without leakage.
- Real-life scenario clarity: “10 minutes to access an API key” is simple, relatable, and urgent.
- Scoped UCANs as a mechanism is the perfect fit: decentralized, granular, and revocable.

**🛠️ 2. Use of Web3 Stack Appropriately (9.5/10)**
- Storacha + UCANs is not just hype here — they directly provide features traditional systems can’t.
- Use of DIDs, capability-based delegation, and CID-level scoping shows you're thinking security-first.

**🧑‍💻 3. Practical UX Thinking (9/10)**
- Password-protected access on top of UCANs shows real understanding of layered access security.
- Dashboards showing "who accessed when", and usage count = great for observability.
- Shareable links as an access mechanism = familiar UX, low friction for onboarding.

**🔐 4. Security-First Architecture (9.5/10)**
- Usage-limited + time-limited delegation = strong ephemeral access model.
- Secret not exposed until all checks pass.
- Great fit for compliance-heavy environments (finance, infra, health).

---
# Workflow of SecretShare
![image](https://github.com/user-attachments/assets/69bfed75-4916-4716-bc75-efc1e493e74f)

<!-- ## 📽️ Live Demo

[🔗 Watch the 2-min demo on YouTube](https://youtu.be/demo-secretshare)  
[🌐 Try Live Now](https://secretshare.vercel.app)

--> 

## ⚙️ How It Works

1. **Issuer uploads secret to Storacha**
   - Simple text-based data (e.g., API keys, tokens)
   - Receives a CID after upload

2. **Generates UCAN delegation**
   - Specifies:
     - secrets/credentials
     - Recipient DID
     - Expiry time
     - Usage count (e.g., one-time use)
   - Delegation signed with issuer’s key

3. **Recipient visits `ipfs gateway url`**
   - UCAN is parsed and validated
   - If valid and not expired/used:
     - Retrieves, Decrypts and then reveals secret
   - If invalid:
     - Displays "Access Denied"

---

## 🧰 Tech Stack

| Layer        | Stack                                      |
|--------------|--------------------------------------------|
| Frontend     | Next.js (App Router), TailwindCSS, Lucide  |
| SDK & Logic  | Storacha SDK, UCAN (`@ucanto/core`)        |
| State Mgmt   | React hooks, local state                   |
| Deployment   | Vercel                                     |

---

## 🚀 Quickstart

```bash
# 1. Clone the repo
git clone https://github.com/yourhandle/secretshare.git
cd secretshare

# 2. Install dependencies
npm install

# 3. Set environment variables
touch .env
# Add:
# NEXT_PUBLIC_STORACHA_PRIVATE_KEY=
# NEXT_PUBLIC_STORACHA_DELEGATION=

# 4. Run locally
npm run dev
```

## Resources: ⚡🔥💲

**Storacha UCANS**: https://github.com/storacha/ucanto

**Storacha Upload-Service Capabilities**: https://github.com/storacha/upload-service/tree/main/packages/capabilities

**LIT Encryption Protocol Guide**: https://github.com/storacha/upload-service/tree/main/packages/encrypt-upload-client

**Implementation Guide**: https://github.com/seetadev/Invoice-PPT-Subscribe-Storacha-Storage/tree/lit-encryption

Feel free to ping me in case of any issues or feedback! Happy coding! :rachaheart ♥🔥

# Melodify

A full-stack **Music NFT Marketplace** built with **React (Vite)**, **Ethers.js v6**, **Pinata/IPFS**, and **Solidity**. Users can mint, list, buy, and resell music NFTs with cover art and audio metadata stored immutably via IPFS.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Setup & Installation](#setup--installation)
- [Environment Variables](#environment-variables)
- [Smart Contract Details](#smart-contract-details)
- [Frontend Usage](#frontend-usage)
- [Pinata & IPFS Integration](#pinata--ipfs-integration)
- [Troubleshooting](#troubleshooting)
- [Future Improvements](#future-improvements)
- [License](#license)

---

## Features

- **Mint Music NFTs** – Upload audio and cover art, mint with metadata via IPFS.
- **Marketplace Listing** – Pay a listing fee to showcase NFTs.
- **Buy & Resell** – Purchase NFTs and relist them seamlessly.
- **Dashboard Views** – View your owned NFTs and listings.
- **Pinata Integration** – Secure file and metadata handling through IPFS.

---

## Tech Stack

- **Smart Contract**: Solidity (ERC-721 with marketplace logic)
- **Frontend**: React (Vite)
- **Blockchain Interaction**: Ethers.js v6
- **Storage**: Pinata SDK + Dedicated IPFS Gateway
- **Wallet**: MetaMask (via BrowserProvider)

---

## Project Structure

```

src/
├── context/
│   └── NFTContext.jsx       # Wallet & contract context
├── components/              # Reusable UI components
├── pages/                   # Route-based screens (Home, Create, My NFTs, etc.)
└── utils/
├── Ethers.js            # Ethers.js provider and contract setup
└── pinata.js            # IPFS upload and fetch utilities

````

---

## Prerequisites

- Node.js (v16+)
- MetaMask extension
- Pinata account (for JWT and IPFS gateway)
- Access to an Ethereum-compatible network (e.g., Sepolia testnet)

---

## Setup & Installation

1. **Clone the repo & install dependencies:**

   ```bash
   git clone https://github.com/hatim85/Melodify.git
   cd Melodify
   npm install
    ```

2. **Create `.env` based on `.env.sample`:**

   ```bash
   VITE_PINATA_JWT=Bearer <YOUR_PINATA_JWT>
   VITE_PINATA_GATEWAY=https://<your-gateway>.mypinata.cloud/ipfs/
   VITE_PROVIDER_URL=<RPC_PROVIDER_URL>
   ```

3. **Run the development server:**

   ```bash
   npm run dev
   ```

---

## Environment Variables

| Variable              | Description                                         |
| --------------------- | --------------------------------------------------- |
| `VITE_PINATA_JWT`     | Pinata JWT for authenticated API access             |
| `VITE_PINATA_GATEWAY` | Dedicated IPFS gateway URL (must end with `/ipfs/`) |
| `VITE_PROVIDER_URL`   | Ethereum RPC provider URL (e.g., Alchemy or Infura) |

---

## Smart Contract Details

Located in `contracts/NFTMarketplace.sol`, the contract allows:

* Minting + listing NFTs (`createToken`)
* Reselling (`resellToken`)
* Purchasing (`createMarketSale`)
* Querying marketplace items, owned items, and listings

Ensure the contract address and ABI are correctly configured in `Ethers.js`.

---

## Frontend Usage

* **Wallet Integration**: Connect with MetaMask and check network.
* **NFT Context**: Mint, fetch, resend events with robust logging.
* **Views**: Home page, Create NFT, My NFTs, Listed NFTs, NFT Details, Resell.
* **Fetch Utilities**: Use `ethers.parseUnits` and `ethers.utils.formatUnits` per Ethers v6 standards.

---

## Pinata & IPFS Integration

* **File Metadata**: Cover art and audio uploaded using Pinata.
* **Metadata Upload**: JSON created with metadata and pinned to IPFS.
* **Fetch**: IPFS content fetched via your dedicated gateway without double `/ipfs/`.
* Configure CORS and access controls via Pinata dashboard to support browser fetches.

---

## Troubleshooting

* **CORS Errors**: Make sure your gateway is set up to accept `localhost:5173` origin.
* **BigNumberish Errors**: Use `ethers.parseUnits("0.01", "ether")` for sale prices.
* **Missing FormatUtils**: Use `ethers.utils.formatUnits()`—correct for Ethers.js v6.
* **Incorrect Gateway URL**: Avoid duplicate `/ipfs/`—format your fetch URL correctly.

---

## Future Improvements

* Search, pagination, and filtering with The Graph
* Support for ERC-2615 royalties or fractionalized NFTs
* Audio previews and enhanced UI/UX
* Mainnet deployment with CI/CD (Vercel/Netlify)

---

## License

MIT License. See [LICENSE](LICENSE) for full details.

---

Thanks for checking out this Music NFT Marketplace! Contributions, feedback, or questions are all welcome!

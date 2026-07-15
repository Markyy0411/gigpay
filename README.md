# GigPay: The Decentralized Escrow for Freelancers

**APAC Stellar Hackathon Submission**  
**Track:** Payment & Consumer Applications

---

## 🛑 The Problem

The global freelance economy is booming, but the financial infrastructure supporting it is broken. Today, cross-border freelance payments are plagued by:
1. **Exorbitant Fees:** Traditional platforms (like Upwork or Fiverr) take a massive 20% cut of freelancer earnings, plus hidden withdrawal and foreign exchange fees.
2. **Slow Settlement:** International wire transfers and bank withdrawals can take anywhere from 3 to 7 business days to clear.
3. **Lack of Trust:** Freelancers often fear doing work without upfront payment, while clients fear paying upfront without seeing the work.

## 🌟 Our Vision & Solution

**GigPay** is a decentralized, Web3-native escrow platform designed to eliminate middlemen and empower the gig economy. 

Our vision is a world where anyone, anywhere, can work freely and get paid their full value instantly. By leveraging the Stellar network and Soroban Smart Contracts, we provide:
- **Instant Finality:** Payments settle in under 5 seconds cross-border.
- **Zero Middleman Fees:** By operating as a decentralized protocol, we eliminate the 20% platform tax. Freelancers keep what they earn.
- **Trustless Escrow:** Funds are securely locked in a smart contract. Clients fund the contract upfront, proving they have the money. Freelancers work knowing the funds are guaranteed. Once work is approved, funds are released instantly.

## ✨ Key Features

1. **Role-Based Portals:** Dedicated dashboards for **Clients** (to post tasks and fund escrows) and **Freelancers** (to browse available work, accept tasks, and get paid).
2. **Soroban Smart Contract Escrow:** Seamless integration with Stellar smart contracts to lock USDC during the work phase and release it upon completion.
3. **Freighter Wallet Integration:** Securely sign transactions directly from the browser using the Freighter wallet extension.
4. **Real-Time Updates:** Powered by Supabase, task statuses update in real-time across all clients without needing to refresh. Push notifications alert users when tasks are accepted or funds are released.
5. **Modern 3D UI:** A sleek, responsive, and animated user interface built with React, Vite, and Framer Motion for a premium Web3 experience.

## 🛠 Tech Stack

- **Frontend:** React, Vite, Tailwind CSS (via custom styling), Framer Motion, Lucide React
- **Backend / Database:** Supabase (PostgreSQL, Auth, Realtime Subscriptions)
- **Blockchain / Web3:** Stellar Network (Testnet), Soroban Smart Contracts, `@stellar/freighter-api`

## 🔗 Smart Contract Details

**Important:** The GigPay escrow contract is deployed on the Stellar Testnet.

- **Network:** Stellar Testnet
- **Contract Address:** `CBRTDAFRUCLVRVYTDMRYM26RPMXC67VO7VMY7ZNVBBR2NVARLOF2KYMH`
- **Deployer Wallet Address:** `GAATY4U2IOYKFY2IAZ3W5VRZQME4UD2Z3TAVLOE5ONEICGXZX7HRX7D3`
- **Source Code Location:** `/contracts/gigpay_escrow/src/lib.rs` (Note: mocked for frontend integration via Freighter wallet signatures).

## 🚀 Running Locally

Want to try GigPay yourself? Follow these steps:

### Prerequisites
- Node.js (v18+)
- A Supabase account and project
- [Freighter Wallet](https://www.freighter.app/) browser extension installed and set to Stellar Testnet.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Markyy0411/gigpay.git
   cd gigpay
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env` file in the root directory and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Initialize Database:**
   Run the `supabase_schema.sql` script in your Supabase SQL Editor to generate the necessary tables, policies, and auth triggers.

5. **Start the development server:**
   ```bash
   npm run dev
   ```

6. **Interact:**
   Open `http://localhost:5173` in your browser. Create an account, connect your Freighter wallet, and try posting or accepting a task!

# 🌿 CarbonKiwi – Blockchain-Based Carbon Credit Trading System

> A Web3 Hackathon project solving carbon emissions challenges in New Zealand through blockchain, smart contracts, and IoT technology.

---

## 📌 Why This Project Matters

New Zealand has committed to achieving **carbon neutrality by 2050**. However, the current Emissions Trading Scheme (ETS) faces several key issues:
- ❌ Lack of transparency and trust
- ❌ Manual reporting prone to **data manipulation**
- ❌ High entry barriers for small/medium businesses
- ❌ Difficulty verifying actual emissions reductions

---

## 🔗 Our Web3-Based Solution

### ✅ 1. Record Emissions & Credits on the Blockchain
- Company emissions are recorded **automatically** using smart contracts.
- Carbon credits are **tokenized** (ERC-20) and stored immutably.

### ✅ 2. P2P Carbon Credit Marketplace
- Companies can **buy/sell carbon credits** via smart contracts—no middlemen.
- Transactions are verified and executed **automatically**.

### ✅ 3. Real-Time IoT Monitoring
- IoT sensors track CO₂ emissions in **real time**.
- Data is securely saved on the **blockchain ledger**, ensuring verifiability.

---

## 💡 Why Web3?

| Traditional Problem | Web3 Solution |
|----------------------|-----------------------------|
| Manual & falsifiable reports | Immutable smart contracts |
| Centralized & opaque | Transparent decentralized ledger |
| High trading fees & delays | P2P smart contract automation |
| Hard to verify reductions | Real-time IoT + Blockchain data |

---

## 🚀 MVP Features

- ✅ Record emissions on-chain
- ✅ Automatically issue carbon credits
- ✅ Trade credits using smart contracts
- ✅ Simple React UI for user interactions
- ✅ Dashboard to track emissions

---

## ⚙️ Tech Stack

| Layer | Technology |
|-------|------------|
| 🧠 Smart Contracts | Solidity + Hardhat |
| 🌐 Blockchain Network | Polygon (L2 for low gas) |
| 💻 Frontend | React.js + ethers.js + RainbowKit |
| 🔐 Auth | JWT + Role-based access |
| 🌡 IoT | Embedded sensor module (Python/Raspberry Pi) |
| 🗃 Backend (Optional) | Node.js + Express |
| 🗂 Storage | IPFS / AWS (hybrid optional) |

---

## 🔐 API Overview (Backend)

### 🔑 Auth
- `POST /api/auth/register` – Register company
- `POST /api/auth/login` – Login and receive token
- `GET /api/auth/profile` – Get user profile
- `POST /api/auth/change-password` – Update password

### 🏢 Companies
- `GET /api/companies` – List all (Gov)
- `POST /api/companies` – Create (Gov)
- `PUT /api/companies/approve/:id` – Approve company (Gov)

### 🌡 Sensors
- `POST /api/sensors` – Register sensor (Gov)
- `POST /api/sensors/report_reading` – Send data (Company)

**Authorization:**  
All protected routes require:


---
## Files

<img width="749" alt="Screenshot 2025-04-13 at 10 03 43 PM" src="https://github.com/user-attachments/assets/fa5c2321-2d2a-4525-8ad3-c0b51d88f4d9" />




## ⚙️ Setup & Run Locally

```bash
# 1. Clone the repo
git clone https://github.com/your-repo/carbonkiwi.git
cd carbonkiwi

# 2. Install dependencies
yarn install

# 3. Start local blockchain
yarn chain

# 4. Deploy contracts
yarn deploy

# 5. Start frontend
yarn start

# 6. (Optional) Start backend API
cd packages/backend
yarn start


```
---

## 👥 Our Team

| Name | Role | Background |
|------|------|------------|
| Nancy Kim | Core Infrastructure/Web3 | BSc/BCom - CompSci |
| Brendan Choi | Core Infrastructure/Web3 | BSc - CompSci |
| John Yang | Embedded Systems/Web3 | BEng - Mechatronics |
| Jinsol Hong | Embedded Systems/Web3 | BEng - Mechatronics |
| Phalidpol Zhu | Web Dev / Design | BSc/BCom - CompSci |
| Seungbeom Yang | Web Dev / Design | BSc/BDesign - CompSci |

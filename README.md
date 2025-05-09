# 💼 Maisha Pesa – Tenderpreneur Transaction Platform

A role-based full-stack system built with **React.js** and **Firebase**, designed to streamline the tenderpreneur funding lifecycle — from order creation and approval to investor bidding, sourcing, and client delivery tracking.

---

## 🚀 Live Demo

> [🔗 Click here to view the demo](#) *(optional link)*

---

## 📌 Features

- 🔐 Role-based access: Admin, Contractor, Broker, Investor, Sourcing Agent, Client
- 📜 Full tender order lifecycle with approvals, bids, and allocations
- 📈 Real-time updates via Firestore
- 🛡 Firebase Auth & Firestore Security Rules
- ✅ KYC Verification by Admin
- 💬 Chat system between Contractor and Broker

---

## 🧰 Tech Stack

- **Frontend**: React.js (with Context API and React Router)
- **Backend**: Firebase (Auth, Firestore, Firestore Rules)
- **UI**: Material UI
- **Notifications**: react-toastify

---

## 📁 Folder Structure

```

src/
├── components/          # Reusable UI components
├── pages/               # Route views (Login, Signup, Dashboard, etc.)
├── contexts/            # AuthContext and provider logic
├── utils/               # Static role constants
├── firebase.js          # Firebase config setup
├── App.jsx              # App routes
└── main.jsx             # Entry point

````

---

## ⚙️ Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/maisha-pesa.git
   cd maisha-pesa
````

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Firebase Setup**

   * Go to [Firebase Console](https://console.firebase.google.com/)
   * Enable:

     * **Authentication** (Email/Password)
     * **Firestore Database**
   * Copy your Firebase config and paste it into `src/firebase.js`

4. **.env File**
   Create a `.env` in root and include:

   ```
   # Firebase Configuration
    VITE_FIREBASE_API_KEY=your-api-key
    VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
    VITE_FIREBASE_PROJECT_ID=your-project-id
    VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
    VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
    VITE_FIREBASE_APP_ID=your-app-id
    VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id

   ```

5. **Run the app**

   ```bash
   npm run dev
   ```

---

## 🔐 Firestore Security Rules

Includes role-based access restrictions, ownership checks, and permission for:

* Viewing and updating user profile
* KYC verification by Admin
* Order access by assigned Contractor
* Bidding access by verified Investors
* Allocation by Sourcing Agent

> See `firestore.rules` file for full policy.

---

## 👤 User Role Flow

| Role               | Permissions                              |
| ------------------ | ---------------------------------------- |
| **Admin**          | Approves KYC, Manages users              |
| **Contractor**     | Approves/rejects orders, Tracks delivery |
| **Broker**         | Creates orders, Selects winning bid      |
| **Investor**       | Bids & Funds approved orders             |
| **Sourcing Agent** | Allocates items after funding            |
| **Client**         | Tracks order status                      |

---
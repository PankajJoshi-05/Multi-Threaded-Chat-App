# 💬 MERN Chat Application

A real-time, full-stack chat application built using the **MERN** stack (MongoDB, Express.js, React.js, Node.js) featuring secure messaging, file sharing, emojis, presence indicators, and modern UI with Tailwind CSS. This project demonstrates how modern messaging platforms are built from scratch, with scalable architecture and rich user interactions.

## 🚀 Features

- 🔐 **User Authentication** (JWT-based)
- 💬 **Real-Time Messaging** (WebSockets via Socket.IO)
- 🗂 **Media & File Sharing**
- 😊 **Emoji Picker Support**
- 👀 **Presence Detection** (Online/Offline Status)
- 🧠 **Message Encryption** (AES-256 with Crypto module)
- 📜 **Infinite Scroll & Lazy Loading**
- 🔄 **Typing Indicators**
- 🧵 **Background Processing** (with Node.js Worker Threads)
- 📂 **Modular Folder Structure (Frontend & Backend)**
- ⚙️ **State Management** with Zustand
- 🌙 **Dark Mode** & Responsive UI (Tailwind + DaisyUI)

## 🛠️ Technologies Used

**Frontend:**
- React.js
- Tailwind CSS + DaisyUI
- Zustand (State Management)
- Axios
- Emoji Picker
- React Router DOM
- Socket.IO Client

**Backend:**
- Node.js
- Express.js
- MongoDB & Mongoose
- JWT for Authentication
- Multer for File Uploads
- Nodemailer for Email
- Socket.IO (Real-Time WebSocket)
- Crypto (AES-256 Encryption)
- Worker Threads (for server-side encryption and decryption)
- Cloudinary (Media Storage)

## 🧾 Folder Structure

### 📟 Folder Structure

#### 📁 Frontend

```
src/
├── components/
│   ├── auth/
│   ├── chat/
│   ├── core/
│   ├── panels/
│   ├── skeleton/
│   └── ui/
├── constants/
├── hooks/
├── pages/
├── store/
└── App.jsx
```

#### 📁 Backend

```
src/
├── config/
│   └── db.js
├── constants/
├── controllers/
├── middleware/
├── models/
├── routes/
├── utils/
├── workers/
└── index.js
```



## 📦 Installation

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)
- Cloudinary Account
- `.env` file with required credentials

### Clone the Repo

```bash
git clone https://github.com/PankajJoshi-05/Multi-Threaded-Chat-App.git
cd Multi-Threaded-Chat-App
```

### Setup Backend

```bash
cd backend
npm install
# Create a .env file with MONGODB_URI, JWT_SECRET, CLOUDINARY keys, etc.
npm run dev
```

### Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

### 🌐 Environment Variables

> Create .env in /backend:
```bash
PORT=5000
MONGODB_URI=your_mongo_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
ENCRYPTION_SECRET=your_encryption_key
```

## 🧪 Testing
- Manual tests done across modules
- Use Postman for backend API

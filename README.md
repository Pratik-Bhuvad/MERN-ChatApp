# ChatApp (MERN Stack)

A real-time chat application built with the MERN stack (MongoDB, Express.js, React, Node.js) featuring authentication, user profiles, and instant messaging.

## Features
- User authentication (signup/login)
- Real-time messaging with Socket.io
- User profiles and avatars
- Responsive UI with modern design
- Error boundaries and skeleton loaders

## Tech Stack
- **Frontend:** React, Vite, Axios
- **Backend:** Node.js, Express.js, MongoDB, Socket.io
- **Other:** Cloudinary (image uploads), JWT (authentication)

## Getting Started

### Prerequisites
- Node.js & npm
- MongoDB

### Installation

1. **Clone the repository:**
   ```sh
   git clone <repo-url>
   cd ChatApp
   ```
2. **Install dependencies:**
   ```sh
   cd backend && npm install
   cd ../frontend && npm install
   ```
3. **Set up environment variables:**
   - Copy `.env.example` to `.env` in `backend/` and fill in your values.
4. **Run the backend:**
   ```sh
   cd backend
   npm start
   ```
5. **Run the frontend:**
   ```sh
   cd frontend
   npm run dev
   ```

## Folder Structure
- `backend/` - Express server, API routes, models, controllers
- `frontend/` - React app, components, pages, store

## License
This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

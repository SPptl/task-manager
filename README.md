# 🚀 MERN Task Manager

A modern full-stack Task Management Web Application built using the MERN stack with secure JWT authentication, project collaboration, task tracking, and a polished responsive UI.

## ✨ Features

### 🔐 Authentication & Security

* User Signup & Login
* JWT-based Authentication
* Protected Backend Routes
* Password Hashing using bcrypt
* Persistent Login using localStorage
* Email Validation
* Show/Hide Password Toggle

---

### 📁 Project Management

* Create Projects
* View All Projects
* Open Individual Project Pages
* Add Members to Projects
* Role-based Project Structure

---

### ✅ Task Management

* Create Tasks
* Assign Tasks to Members
* Update Task Status
* Task Priorities (High / Medium / Low)
* Task Status Workflow:

  * To Do
  * In Progress
  * Done

---

### 🎨 Modern UI/UX

* Fully Responsive Design
* Dark / Light Mode Toggle
* Beautiful Fluid Animations
* Modern Dashboard UI
* Interactive Task Cards
* Styled Status Dropdowns
* Clean Navbar & Navigation
* Hover Effects & Smooth Transitions
* Error & Success Alerts

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Vite
* Tailwind CSS
* React Router DOM
* Axios

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose

### Authentication & Security

* JWT (jsonwebtoken)
* bcrypt

---

## 📸 Screenshots

<img width="1920" height="1200" alt="Screenshot 2026-05-29 211245" src="https://github.com/user-attachments/assets/41722d69-b438-474f-8ac2-3a9a1bf21f89" />

### Login Page

<img width="1920" height="1200" alt="Screenshot 2026-05-29 211318" src="https://github.com/user-attachments/assets/5958e9e6-0e1e-4844-b831-0f22dc64ae00" />


### Dashboard

<img width="1920" height="1200" alt="Screenshot 2026-05-29 211347" src="https://github.com/user-attachments/assets/a98d9bd9-6718-441b-bd94-0a61e30dddef" />


### Project Page

<img width="1920" height="1200" alt="Screenshot 2026-05-29 211410" src="https://github.com/user-attachments/assets/76abd1f9-f6bc-4adb-b71d-cab34276fb92" />
<img width="1920" height="1200" alt="Screenshot 2026-05-29 211421" src="https://github.com/user-attachments/assets/1ad2e284-df5c-439f-9abc-c8193c721c03" />

---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository

```bash
git clone https://github.com/SPptl/task-manager.git
cd task-manager
```

---

### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

Create `.env` file inside backend:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Run backend:

```bash
npm run dev
```

---

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
```

Create `.env` file inside frontend:

```env
VITE_API_URL=${import.meta.env.VITE_API_URL}
```

Run frontend:

```bash
npm run dev
```

---

## 🔑 Environment Variables

### Backend `.env`

```env
PORT=
MONGO_URI=
JWT_SECRET=
```

### Frontend `.env`

```env
VITE_API_URL=
```

---

## 📂 Project Structure

```bash
task-manager/
│
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── App.jsx
│
└── README.md
```

---

## 🔒 Security Features

* Passwords stored in hashed format
* JWT route protection
* Secure authentication middleware
* Environment variables for secrets

---

## 🌗 UI Enhancements

* Tailwind CSS Dark Mode
* Responsive Layout
* Professional Dashboard Design
* Animated Cards & Buttons
* User-friendly Navigation

---

## 🚀 Future Improvements

* Real-time collaboration
* Drag & Drop task boards
* Notifications
* File uploads
* Team chat
* Activity logs

---

## 👨‍💻 Author

Built with dedication using the MERN stack.

If you like this project, feel free to ⭐ the repository.

---

## 📄 License

This project is licensed under the MIT License.

# 🏨 Lodging Management System

A full-stack lodging management system built with React (Frontend) and Node.js/Express (Backend).

## 🚀 Quick Start

### **Option 1: Run Both Frontend & Backend Together (Recommended)**
```bash
# Install all dependencies
npm run install:all

# Start both frontend and backend simultaneously
npm run dev
```

### **Option 2: Run Separately**
```bash
# Frontend only (runs on http://localhost:5173)
npm run dev:frontend

# Backend only (runs on http://localhost:3001)
npm run dev:backend
```

## 📁 Project Structure

```
lodging-management-system/
├── frontend/          # React + Vite application
│   ├── src/          # React source code
│   ├── public/       # Static assets
│   └── package.json  # Frontend dependencies
├── backend/          # Node.js + Express server
│   ├── routes/       # API routes
│   ├── controllers/  # Business logic
│   ├── config/       # Database configuration
│   └── package.json  # Backend dependencies
└── package.json      # Root package.json with concurrent scripts
```

## 🛠️ Available Scripts

### **Root Directory (Main Commands)**
- `npm run dev` - Start both frontend and backend
- `npm run dev:frontend` - Start only frontend
- `npm run dev:backend` - Start only backend
- `npm run install:all` - Install dependencies for all packages
- `npm run build` - Build frontend for production

### **Frontend Directory**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### **Backend Directory**
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server

## 🌐 Access URLs

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001/api

## 🗄️ Database

The backend uses SQLite database located at:
- **Development**: `D:\miresto\lodging.db`

## 📋 Features

### **Frontend (React + TypeScript)**
- Modern React 18 with TypeScript
- Vite for fast development
- Bootstrap 5 for UI components
- React Router for navigation
- Axios for API calls
- Mock data for development

### **Backend (Node.js + Express)**
- RESTful API endpoints
- SQLite database with better-sqlite3
- JWT authentication
- CORS enabled
- Security headers with Helmet
- Request logging with Morgan

### **Master Data Management**
- Countries
- States
- Districts
- Zones

## 🔧 Development

### **Adding New Dependencies**

**Frontend:**
```bash
cd frontend
npm install package-name
```

**Backend:**
```bash
cd backend
npm install package-name
```

### **Database Changes**
1. Update schema in `backend/config/database.js`
2. Restart backend server
3. Database will auto-initialize

## 🚀 Production Deployment

### **Build Frontend**
```bash
npm run build:frontend
```

### **Start Production Backend**
```bash
cd backend
npm start
```

## 📝 Environment Variables

### **Frontend (.env)**
```env
VITE_API_BASE_URL=http://localhost:3001/api
```

### **Backend (.env)**
```env
PORT=3001
DB_PATH=D:\miresto\lodging.db
JWT_SECRET=your-secret-key
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

ISC License 
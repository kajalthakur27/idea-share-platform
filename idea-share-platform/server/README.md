# Idea Share Platform - Backend

## 🚀 Complete Backend Setup

### 📁 Folder Structure
```
server/
├── controllers/
│   ├── authController.js      (Login/Register logic)
│   ├── ideaController.js      (Idea CRUD operations)
│   ├── likeController.js      (Like/Unlike functionality)
│   └── commentController.js   (Comment functionality)
├── middleware/
│   └── authMiddleware.js      (Token verification)
├── models/
│   ├── User.js                (User schema)
│   ├── Idea.js                (Idea schema)
│   ├── Like.js                (Like schema)
│   └── Comment.js             (Comment schema)
├── routes/
│   ├── authRoutes.js          (Auth endpoints)
│   ├── ideaRoutes.js          (Idea endpoints)
│   ├── likeRoutes.js          (Like endpoints)
│   └── commentRoutes.js       (Comment endpoints)
├── .env                       (Environment variables)
├── .gitignore
├── server.js                  (Main entry point)
└── package.json
```

## 🔧 Installation & Setup

### 1. Install MongoDB (Local)
```bash
# Ubuntu/Debian
sudo apt-get install mongodb

# macOS
brew install mongodb-community

# Start MongoDB
sudo systemctl start mongodb  # Linux
brew services start mongodb-community  # macOS
```

### 2. Configure Environment Variables
Edit `.env` file:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/idea-share-platform
JWT_SECRET=your_secret_key_here
```

### 3. Start Server
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

## 📡 API Endpoints

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/register` | Public | Register new user |
| POST | `/login` | Public | Login user |
| GET | `/me` | Private | Get current user |

**Register/Login Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "123456"
}
```

**Response:**
```json
{
  "_id": "user_id",
  "name": "John Doe",
  "email": "john@example.com",
  "token": "jwt_token_here"
}
```

### 💡 Ideas (`/api/ideas`)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/` | Public | Get all ideas |
| GET | `/:id` | Public | Get single idea |
| POST | `/` | Private | Create new idea |
| PUT | `/:id` | Private | Update own idea |
| DELETE | `/:id` | Private | Delete own idea |
| GET | `/my/all` | Private | Get my ideas |

**Create Idea Request:**
```json
{
  "title": "AI-Based Study Helper",
  "description": "An app that helps students study using AI",
  "tags": ["AI", "Education", "Technology"],
  "category": "Education"
}
```

### ❤️ Likes (`/api/likes`)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/:ideaId` | Public | Get all likes for idea |
| POST | `/:ideaId` | Private | Like an idea |
| DELETE | `/:ideaId` | Private | Unlike an idea |
| GET | `/:ideaId/check` | Private | Check if user liked |

### 💬 Comments (`/api/comments`)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/:ideaId` | Public | Get all comments |
| POST | `/:ideaId` | Private | Add comment |
| PUT | `/:commentId` | Private | Update comment |
| DELETE | `/:commentId` | Private | Delete comment |

**Add Comment Request:**
```json
{
  "text": "Great idea! I would love to use this."
}
```

## 🔒 Authentication Flow

1. **User registers** → Gets JWT token
2. **User logs in** → Gets JWT token
3. **Token sent in headers** for protected routes:
   ```
   Authorization: Bearer <token>
   ```
4. **Middleware verifies token** → Allows access

## 🗂️ Database Models

### User
- name (String, required)
- email (String, required, unique)
- password (String, required)

### Idea
- title (String, required)
- description (String, required)
- tags (Array of Strings)
- category (String)
- user (Reference to User)
- userName (String)
- likesCount (Number)
- commentsCount (Number)

### Like
- user (Reference to User)
- idea (Reference to Idea)
- Compound unique index on (user + idea)

### Comment
- text (String, required)
- user (Reference to User)
- userName (String)
- idea (Reference to Idea)

## 🎯 How Everything Connects

```
Client Request
    ↓
server.js (Main entry)
    ↓
Routes (authRoutes, ideaRoutes, etc.)
    ↓
Middleware (protect - checks JWT token)
    ↓
Controllers (Business logic)
    ↓
Models (Database interaction)
    ↓
MongoDB Database
    ↓
Response back to Client
```

## 📝 Key Concepts

### 1. **Models** (Database Schema)
- Define karta hai ki data kaisa hoga
- Mongoose schema use karte hain

### 2. **Controllers** (Business Logic)
- Actual kaam yaha hota hai
- Database se data fetch/update/delete karte hain

### 3. **Routes** (URL Endpoints)
- Client request ko controller tak pahunchate hain
- URL patterns define karte hain

### 4. **Middleware** (Protection)
- Request ko process karne se pehle check karta hai
- JWT token verify karta hai

### 5. **JWT Authentication**
- User login karta hai → Token milta hai
- Token ko headers me bhejte hain
- Server token verify karke user identify karta hai

## 🧪 Testing APIs (Using Postman/Thunder Client)

### Register User
```
POST http://localhost:5000/api/auth/register
Body: { "name": "Test", "email": "test@test.com", "password": "123456" }
```

### Login
```
POST http://localhost:5000/api/auth/login
Body: { "email": "test@test.com", "password": "123456" }
```

### Create Idea (Need Token)
```
POST http://localhost:5000/api/ideas
Headers: { "Authorization": "Bearer <your_token>" }
Body: { "title": "My Idea", "description": "Description here" }
```

## ⚡ Features Implemented

✅ User Registration & Login (Simple, No bcrypt)  
✅ JWT Token Authentication  
✅ Create, Read, Update, Delete Ideas  
✅ Like/Unlike Ideas  
✅ Add/Edit/Delete Comments  
✅ User can only edit/delete their own content  
✅ Public & Private routes  
✅ Auto-increment like/comment counts  
✅ Clean code with comments in Hindi/English  

## 🎓 Perfect for Hackathon!

- Easy to understand
- Well-commented code
- Basic level implementation
- All CRUD operations covered
- Authentication implemented
- Ready to integrate with React frontend

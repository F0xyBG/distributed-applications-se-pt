# Pet Finder - Course Work Implementations

## Project Overview
Pet Finder is a distributed web application for reporting and tracking lost pets.
It includes:
- **API** (`API/`): Node.js + Express REST backend with JWT authentication
- **Client** (`Client/`): React frontend for browsing posts, creating reports, and managing profile data
- **DB** (`DB/`): MySQL database (Docker Compose)

## How to Run
### 1) Install dependencies
```bash
cd API && npm install
cd ../Client && npm install
```

### 2) Configure environment files
```bash
cp API/.env.example API/.env
cp Client/.env.example Client/.env
```

### 3) Start backend API
```bash
cd ../API
npm start
```

### 4) Start frontend client (new terminal)
```bash
cd ../Client
npm start
```

### 5) Open the app
- Client: `http://localhost:3001`
- API: `http://localhost:3000`
- Swagger docs: `http://localhost:3000/api-docs`

## Authors
- Mehmed Yunuz — stu2401322028@uni-plovdiv.bg
- Simeon Teremkov — stu2401322016@uni-plovdiv.bg

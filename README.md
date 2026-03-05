# Records Manager

A full-stack CRUD application built with **Node.js**, **Express**, and **Firebase Firestore** on the backend, and vanilla **HTML/CSS/JavaScript** on the frontend.

---

## Features

- Create, read, update, and delete records via a clean UI
- Live search filtering by name, email, or role
- Form validation with inline error messages
- Toast notifications for all operations
- Delete confirmation modal
- Stats bar showing total records, admin count, and latest entry
- CORS-enabled REST API
- Organized by category using Firestore subcollections

---

## Tech Stack

| Layer     | Technology                        |
|-----------|-----------------------------------|
| Runtime   | Node.js                           |
| Framework | Express.js                        |
| Database  | Firebase Firestore                |
| Frontend  | HTML, CSS, Vanilla JavaScript     |
| Storage   | Cloudinary (for media/uploads)    |
| Dev Tool  | Nodemon                           |

---

## Project Structure

```
├── backend/
│   ├── config/
│   │   └── firebase.js          # Firestore initialization
│   ├── routes/
│   │   └── records.js           # CRUD route handlers
│   ├── services/
│   │   └── firestoreService.js  # Reusable Firestore methods
│   ├── .env                     # Environment variables (gitignored)
│   ├── package.json
│   └── server.js                # Express entry point
│
├── frontend/
│   ├── index.html               # Markup
│   ├── styles.css               # Styles
│   └── app.js                   # API calls, UI logic
│
├── .gitattributes
└── README.md
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- A [Firebase](https://firebase.google.com/) project with Firestore enabled

### 1. Clone the repository

```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo
```

### 2. Install dependencies

```bash
cd backend
npm install
```

### 3. Configure environment variables

Create a `.env` file inside the `backend/` folder:

```env
FIREBASE_TYPE=service_account
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY_ID=your_private_key_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your_client_email
FIREBASE_CLIENT_ID=your_client_id
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
FIREBASE_CLIENT_X509_CERT_URL=your_client_cert_url
FIREBASE_UNIVERSE_DOMAIN=googleapis.com

CLIENT_URL=http://localhost:5500
```

> You can find all Firebase values in your **Firebase Console → Project Settings → Service Accounts → Generate new private key**.

### 4. Run the backend

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

The API will be available at `http://localhost:3000`.

### 5. Run the frontend

Open `frontend/index.html` with [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) in VS Code, or any static file server.

> Make sure the `API_BASE` in `frontend/app.js` points to your backend URL:
> ```js
> const API_BASE = 'http://localhost:3000/api/records';
> ```

---

## API Endpoints

| Method | Endpoint              | Description          |
|--------|-----------------------|----------------------|
| GET    | `/api/v1/records`        | Get all records      |
| GET    | `/api/v1/records/:id`    | Get a single record  |
| POST   | `/api/v1/records`        | Create a new record  |
| PUT    | `/api/v1/records/:id`    | Update a record      |
| DELETE | `/api/v1/records/:id`    | Delete a record      |

### Example Request Body (POST / PUT)

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "role": "Admin",
  "phone": "+1 234 567 8900",
  "notes": "Optional notes here"
}
```

---

## Environment Variables Reference

| Variable                          | Description                              |
|-----------------------------------|------------------------------------------|
| `FIREBASE_PROJECT_ID`             | Your Firebase project ID                 |
| `FIREBASE_PRIVATE_KEY`            | Private key from service account JSON    |
| `FIREBASE_CLIENT_EMAIL`           | Client email from service account JSON   |
| `CLIENT_URL`                      | Allowed frontend origin for CORS         |

---

## Scripts

```bash
npm run dev     # Start with nodemon (auto-reload on file changes)
npm start       # Start without nodemon
```

---

## .gitignore

Make sure these are ignored:

```
node_modules/
.env
serviceAccountKey.json
```

---

## License

MIT
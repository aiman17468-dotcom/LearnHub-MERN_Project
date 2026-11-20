# LearnHub: MERN Stack Learning Management System

LearnHub is a full stack Learning Management System. Students can browse and enroll in courses, instructors can create and manage courses and lessons, and admins can manage users and see analytics.

**Technologies:** React JS (Vite), React Router, Axios, Node.js, Express.js, MongoDB, Mongoose, JWT, bcrypt (bcryptjs), CSS.

## Project structure

```
learnhub/
  server/                  Node.js + Express backend
    config/db.js           MongoDB connection
    models/                User, Course, Enrollment (Mongoose)
    controllers/           auth, course, enrollment, admin logic
    routes/                API routes
    middleware/            auth (JWT + roles), error handler
    utils/                 helpers
    seed.js                demo users and courses
    server.js              app entry point
    .env.example
  client/                  React frontend
    src/components/        Navbar, CourseCard, CourseForm, Alert
    src/pages/             Home, Courses, CourseDetail, Login, Register, dashboards
    src/services/          Axios API calls
    src/context/           AuthContext (login state)
    src/routes/            AppRoutes, ProtectedRoute
```

## Installation

You need Node.js and MongoDB (local MongoDB Community Server, or a free MongoDB Atlas cluster).

### 1. Backend
```
cd server
npm install
copy .env.example .env        (Mac/Linux: cp .env.example .env)
```
Open `.env` and set `MONGO_URI` and a long random `JWT_SECRET`. Then:
```
npm run seed                  (creates demo users and courses)
npm run dev                   (starts on http://localhost:5000)
```

### 2. Frontend (in a second terminal)
```
cd client
npm install
npm run dev                   (opens on http://localhost:5173)
```

## Demo accounts (created by `npm run seed`)

| Role       | Email                    | Password        |
|------------|--------------------------|-----------------|
| Admin      | admin@learnhub.com       | Admin@123       |
| Instructor | instructor@learnhub.com  | Instructor@123  |
| Student    | student@learnhub.com     | Student@123     |

These are for local testing only. Change them before any real deployment.

## Roles

| Role       | Can do |
|------------|--------|
| Student    | Browse courses, enroll, see enrolled courses, update progress |
| Instructor | Create, edit and delete their own courses, add and remove lessons |
| Admin      | Manage all users and courses, view analytics |

Public registration creates only Student or Instructor accounts. The admin is created with the seed script.

## API endpoints

| Method | Endpoint | Access |
|--------|----------|--------|
| POST   | /api/register | Public |
| POST   | /api/login | Public |
| GET    | /api/me | Logged in |
| GET    | /api/courses | Public (`?search=`) |
| GET    | /api/courses/:id | Public |
| GET    | /api/courses/mine | Instructor, Admin |
| POST   | /api/courses | Instructor, Admin |
| PUT    | /api/courses/:id | Owner instructor, Admin |
| DELETE | /api/courses/:id | Owner instructor, Admin |
| POST   | /api/courses/:id/lessons | Owner instructor, Admin |
| DELETE | /api/courses/:id/lessons/:lessonId | Owner instructor, Admin |
| POST   | /api/enroll | Student |
| GET    | /api/my-courses | Student |
| PUT    | /api/my-courses/:courseId/progress | Student |
| GET    | /api/admin/users | Admin |
| DELETE | /api/admin/users/:id | Admin |
| GET    | /api/admin/analytics | Admin |

Protected routes need the header `Authorization: Bearer <token>` (the token comes from login).

## Security

- Passwords are hashed with bcrypt before saving, and are never sent back to the frontend.
- The JWT secret, database address and other settings are in the `.env` file (not in the code, and `.env` is in `.gitignore`).
- Backend routes are protected with middleware (`protect` checks the token, `authorize` checks the role).
- Frontend pages are protected with `ProtectedRoute`.
- Users cannot make themselves admin while registering.

## Deployment / testing

1. Build the React app:
   ```
   cd client
   npm run build
   ```
2. Put `NODE_ENV=production` in `server/.env`, then start the backend:
   ```
   cd server
   npm start
   ```
3. Open http://localhost:5000. In production mode the backend serves the built React app and the API together.

To put it online (for example on Render with MongoDB Atlas):
- Build command: `cd client && npm install && npm run build && cd ../server && npm install`
- Start command: `cd server && npm start`
- Environment variables: `NODE_ENV=production`, `MONGO_URI` (Atlas address), `JWT_SECRET`
- Run `npm run seed` once (with the Atlas `MONGO_URI`) to create the admin and sample data.

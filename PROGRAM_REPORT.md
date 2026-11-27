# E-Learners Hub - Program Report

## 1. Purpose

E-Learners Hub is a browser-based learning platform prototype. It provides separate student, teacher, and administrator interfaces for browsing courses, managing learning tasks, viewing certificates, handling demo payments and referrals, creating assignments, and administering course access.

The application is primarily a frontend demonstration. It does not use a backend server or external database. Most records are static JavaScript data, and a few settings and accounts are saved in the browser's `localStorage`.

## 2. Technology Stack

- React 19 for user interface components and state management
- React Router DOM 7 for browser routes
- Vite 8 for development and production builds
- Tailwind CSS 4 for styling
- ESLint for source-quality checks

The package scripts are:

- `npm run dev` - start the Vite development server
- `npm run build` - create a production build in `dist/`
- `npm run preview` - preview the production build locally
- `npm run lint` - run ESLint

## 3. Application Startup

The startup flow is:

1. `src/main.jsx` obtains the `root` HTML element and mounts the React application.
2. `src/App.jsx` renders `MyRoutes`.
3. `src/MyRoutes.jsx` initializes `BrowserRouter`.
4. `/` opens the public and student layout.
5. `/admin` opens the administrator dashboard directly.

The application is wrapped in `StrictMode`, which can run certain development checks and lifecycle effects twice in development mode.

## 4. Main Routes

| Route | Component | Purpose |
|---|---|---|
| `/` | `Layout` and `Homepage` content | Login/signup screen and the logged-in student interface |
| `/admin` | `AdminPage` | Student, teacher, course, class, payment, and teacher-account administration |

The remaining interfaces are displayed as internal tabs or role views rather than separate URL routes.

## 5. Student Functionality

Student behavior is managed mainly in `src/components/layout/public/Layout.jsx`.

### Authentication

- The header provides Login and Sign Up buttons.
- Signup creates a student session in React state.
- Student login derives a display name from the entered email address.
- Teacher login checks credentials created through the admin teacher-account panel.
- Logout clears the session state and teacher information.
- Authentication and login state reset when the page is refreshed.

This is a UI-level demonstration, not secure authentication. Passwords used by teacher accounts are stored locally in browser storage.

### Student Navigation

After login, the sidebar provides:

- Courses
- Tasks
- Certificates
- Files
- Referrals
- Payment

The active tab is stored in React state. Selecting a tab updates the dynamic content panel without changing the browser URL.

### Courses

The course list comes from `src/pages/student/coursesData.js`.

Course pages allow the student to:

- View course details, instructor, duration, schedule, and materials
- Expand course videos
- View sample assignments
- See enabled or disabled course status

Admin changes to course availability are read from browser storage and applied to both student and teacher views.

### Tasks

The tasks page reads assignments from course data and displays them by course. A student can view assignment details and track whether sample assignments are complete.

### Certificates

The certificates page provides certificate information for available courses. Preparing a certificate creates a text file and adds it to the current session's Files tab.

### Files

Files exist only in React state during the current session. Certificate text files can be downloaded from this screen. Refreshing the page clears these generated files.

### Referrals

The referral screen provides a referral link and copy feedback. It is a frontend interaction and does not submit referrals to a server.

### Payment

The payment page shows static/demo payment records, calculated totals, and a card-ending summary. The "pay" action updates payment status and date in React state. These changes are not sent to a payment provider or permanently stored.

## 6. Teacher Functionality

After a successful teacher login, `Layout` replaces the student interface with `src/pages/teachers/TeacherPage.jsx`.

Teacher sections include:

- Classes
- Courses
- Students
- Assignments

Teachers can:

- Search courses and students
- View courses assigned to their account
- Select a class/course
- Add assignments with a title, course, due date, and details
- View and manage assignments from the assignments section

Teacher assignments are saved by teacher email in browser `localStorage` using a key such as `learners.teacherAssignments.<encoded-email>`.

Teacher accounts are created in the admin panel and include:

- Name
- Email
- Password
- Assigned course codes

The account records are stored in `localStorage` under `learners.teacherAccounts`.

## 7. Administrator Functionality

The admin dashboard is available at `/admin`.

It provides sections for:

- Students
- Teachers/Instructors
- Courses
- Classes
- Payment
- Teacher accounts

The dashboard:

- Builds student and teacher records from course data
- Filters table rows using the search field
- Displays paid and pending payment totals
- Allows administrators to enable or disable course access
- Saves disabled course codes under `learners.disabledCourseCodes`
- Creates and removes demo teacher accounts
- Assigns course codes to newly created teacher accounts

Course enable/disable changes are reflected by the student course and task interfaces.

## 8. Data and State

| Data | Storage location |
|---|---|
| Course records | Static `src/pages/student/coursesData.js` |
| Student login/session state | React state |
| Student tab selection | React state |
| Generated certificate files | React state |
| Demo payment updates | React state |
| Disabled course codes | `localStorage: learners.disabledCourseCodes` |
| Teacher accounts | `localStorage: learners.teacherAccounts` |
| Teacher assignments | `localStorage: learners.teacherAssignments.<email>` |

React state lasts only until a component is remounted or the page is refreshed. `localStorage` data remains in the browser unless it is removed or the browser storage is cleared.

## 9. Component Structure

```text
src/
  main.jsx                       React entry point
  App.jsx                        Top-level application component
  MyRoutes.jsx                   Route configuration
  components/layout/public/
    Layout.jsx                   Student authentication and tab state
    Header.jsx                   Login/logout and course controls
    Sidebar.jsx                  Student navigation
    Footer.jsx                   Footer
  pages/student/
    Homepage.jsx                 Basic landing content
    CoursesPage.jsx              Course browsing and details
    TasksPage.jsx                Course tasks
    CertificatesPage.jsx         Certificate display/download flow
    FilesPage.jsx                Generated file downloads
    ReferralPage.jsx             Referral link interaction
    PaymentPage.jsx              Demo payments
    coursesData.js               Static course dataset
    courseAvailability.js        Course enable/disable storage
  pages/teachers/
    TeacherPage.jsx              Teacher dashboard
    teacherAccounts.js           Teacher account storage/authentication
    teacherAssignments.js        Assignment storage
  pages/admin/
    AdminPage.jsx                Admin dashboard
```

## 10. How the Program Works

For a student:

1. The user opens `/`.
2. The layout shows login and signup controls.
3. After signup or login, `isLoggedIn` changes and the sidebar becomes visible.
4. The layout reads static course data and local course availability.
5. Selecting a sidebar item changes `activeTab`.
6. `renderTabContent()` switches to the corresponding page component.

For a teacher:

1. The user logs in from `/` and selects the Teacher role.
2. The layout calls `authenticateTeacher()` against local-storage accounts.
3. On success, `isLoggedIn` and `loginRole` change.
4. `Layout` renders `TeacherPage` instead of the student interface.
5. Assigned course codes filter the course and class data shown to the teacher.
6. New assignments are saved in local storage for that teacher.

For an administrator:

1. The user opens `/admin`.
2. The admin page reads static demo directories and saved course availability.
3. Selecting a navigation section updates `activeSection`.
4. The page filters or renders the relevant table/dashboard data.
5. Course or account changes update React state and browser storage.

## 11. Running the Project

From the project directory:

```powershell
npm install
npm run dev
```

Open the address printed by Vite, usually `http://localhost:5173/`. Use `/admin` for the administrator page.

For a production build:

```powershell
npm run build
npm run preview
```

## 12. Current Limitations

- There is no server-side authentication or authorization.
- Credentials are not secure and are not suitable for real user accounts.
- The admin route is not protected.
- Payment processing is simulated.
- Referrals are not submitted to a backend.
- Course and user directory data are demo/static data.
- Data refresh behavior is limited by browser `localStorage`.
- Student-created data is mostly held in memory and is lost on refresh.
- No automated test suite is currently included in the package scripts.


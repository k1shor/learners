import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import CertificatesPage from "./pages/CertificatesPage";
import CourseDetails from "./pages/CourseDetails";
import Homepage from "./pages/Homepage";
import SectionPage from "./pages/SectionPage";
import TasksPage from "./pages/TasksPage";
import Layout from "./components/layout/Layout";
import AdminStudentsPage from "./admin/AdminStudentsPage";
import AdminInstructorsPage from "./admin/AdminInstructorsPage";
import AdminCoursesPage from "./admin/AdminCoursesPage";
import AdminClassesPage from "./admin/AdminClassesPage";

const MyRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Homepage />} />
          <Route
            path="courses/:courseCode/:courseTitle"
            element={<CourseDetails />}
          />
          <Route path="tasks" element={<TasksPage />} />
          <Route path="certificates" element={<CertificatesPage />} />
          <Route path="referrals" element={<SectionPage title="Referrals" />} />
          <Route path="payments" element={<SectionPage title="Payments" />} />
          <Route path="admin/students" element={<AdminStudentsPage />} />
          <Route path="admin/instructors" element={<AdminInstructorsPage />} />
          <Route path="admin/courses" element={<AdminCoursesPage />} />
          <Route path="admin/classes" element={<AdminClassesPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default MyRoutes;

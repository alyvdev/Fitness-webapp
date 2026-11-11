import { lazy, Suspense, useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import ToastViewport from "./components/Toast.jsx";

// Route-level code splitting: each page is its own chunk.
const Landing = lazy(() => import("./pages/Landing.jsx"));
const Dashboard = lazy(() => import("./pages/Dashboard.jsx"));
const Equipment = lazy(() => import("./pages/Equipment.jsx"));
const EquipmentDetail = lazy(() => import("./pages/EquipmentDetail.jsx"));
const Students = lazy(() => import("./pages/Students.jsx"));
const StudentDetail = lazy(() => import("./pages/StudentDetail.jsx"));
const Programs = lazy(() => import("./pages/Programs.jsx"));
const ProgramBuilder = lazy(() => import("./pages/ProgramBuilder.jsx"));
const Schedule = lazy(() => import("./pages/Schedule.jsx"));
const StudentDemo = lazy(() => import("./pages/StudentDemo.jsx"));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<div className="min-h-dvh bg-frame" />}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/equipment" element={<Equipment />} />
            <Route path="/equipment/:id" element={<EquipmentDetail />} />
            <Route path="/students" element={<Students />} />
            <Route path="/students/:id" element={<StudentDetail />} />
            <Route path="/programs" element={<Programs />} />
            <Route path="/programs/new" element={<ProgramBuilder />} />
            <Route path="/schedule" element={<Schedule />} />
          </Route>
          <Route element={<Layout variant="student" />}>
            <Route path="/student-demo" element={<StudentDemo />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
      <ToastViewport />
    </>
  );
}

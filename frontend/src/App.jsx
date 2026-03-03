import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { useContext } from 'react';
import Landing from './pages/Landing';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import DirectorDashboard from './pages/DirectorDashboard';
import ObserverDashboard from './pages/ObserverDashboard';
import DashboardLayout from './layouts/DashboardLayout';

import ManageUsers from './pages/ManageUsers';
import ReviewExams from './pages/ReviewExams';
import AdminReports from './pages/AdminReports';
import SubmitExam from './pages/SubmitExam';
import ApprovedExams from './pages/ApprovedExams';
import UploadReport from './pages/UploadReport';
import MyReports from './pages/MyReports';
import ManageMembers from './pages/ManageMembers';
import Settings from './pages/Settings';
import Orders from './pages/Orders';
import Notifications from './pages/Notifications';
import AdminResources from './pages/AdminResources';
import Resources from './pages/Resources';
import AllMembers from './pages/AllMembers';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, token } = useContext(AuthContext);

  if (!token) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user?.role)) return <Navigate to="/unauthorized" replace />;

  return <DashboardLayout>{children}</DashboardLayout>;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['super_admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />

          <Route path="/admin/users" element={
            <ProtectedRoute allowedRoles={['super_admin']}>
              <ManageUsers />
            </ProtectedRoute>
          } />

          <Route path="/admin/exams" element={
            <ProtectedRoute allowedRoles={['super_admin']}>
              <ReviewExams />
            </ProtectedRoute>
          } />

          <Route path="/admin/resources" element={
            <ProtectedRoute allowedRoles={['super_admin']}>
              <AdminResources />
            </ProtectedRoute>
          } />

          <Route path="/admin/reports" element={
            <ProtectedRoute allowedRoles={['super_admin']}>
              <AdminReports />
            </ProtectedRoute>
          } />

          <Route path="/admin/all-members" element={
            <ProtectedRoute allowedRoles={['super_admin']}>
              <AllMembers />
            </ProtectedRoute>
          } />

          <Route path="/director" element={
            <ProtectedRoute allowedRoles={['director']}>
              <DirectorDashboard />
            </ProtectedRoute>
          } />

          <Route path="/director/exams" element={
            <ProtectedRoute allowedRoles={['director']}>
              <SubmitExam />
            </ProtectedRoute>
          } />

          <Route path="/director/approved-exams" element={
            <ProtectedRoute allowedRoles={['director']}>
              <ApprovedExams />
            </ProtectedRoute>
          } />

          <Route path="/director/reports" element={
            <ProtectedRoute allowedRoles={['director']}>
              <UploadReport />
            </ProtectedRoute>
          } />

          <Route path="/director/my-reports" element={
            <ProtectedRoute allowedRoles={['director']}>
              <MyReports />
            </ProtectedRoute>
          } />

          <Route path="/director/members" element={
            <ProtectedRoute allowedRoles={['director']}>
              <ManageMembers />
            </ProtectedRoute>
          } />

          <Route path="/director/settings" element={
            <ProtectedRoute allowedRoles={['director']}>
              <Settings />
            </ProtectedRoute>
          } />

          <Route path="/director/orders" element={
            <ProtectedRoute allowedRoles={['director']}>
              <Orders />
            </ProtectedRoute>
          } />

          <Route path="/director/resources" element={
            <ProtectedRoute allowedRoles={['director']}>
              <Resources />
            </ProtectedRoute>
          } />

          <Route path="/notifications" element={
            <ProtectedRoute allowedRoles={['super_admin', 'director']}>
              <Notifications />
            </ProtectedRoute>
          } />

          <Route path="/observer" element={
            <ProtectedRoute allowedRoles={['observer']}>
              <ObserverDashboard />
            </ProtectedRoute>
          } />

          <Route path="/observer/all-members" element={
            <ProtectedRoute allowedRoles={['observer']}>
              <AllMembers />
            </ProtectedRoute>
          } />

          <Route path="/" element={<Landing />} />
          <Route path="/unauthorized" element={<div className="p-10 text-center font-bold text-red-600">Unauthorized Access</div>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import SkipLink from './components/SkipLink';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CandidateLayout from './pages/candidate/CandidateLayout';
import Profile from './pages/candidate/Profile';
import CVUpload from './pages/candidate/CVUpload';
import JobSearch from './pages/candidate/JobSearch';
import RecruiterLayout from './pages/recruiter/RecruiterLayout';
import CreateJob from './pages/recruiter/CreateJob';
import ViewApplicants from './pages/recruiter/ViewApplicants';
import HiringManagerLayout from './pages/hiringmanager/HiringManagerLayout';
import ShortlistedCandidates from './pages/hiringmanager/ShortlistedCandidates';
import MyEvaluations from './pages/hiringmanager/MyEvaluations';
import AdminLayout from './pages/admin/AdminLayout';
import SystemAnalytics from './pages/admin/SystemAnalytics';
import UserManagement from './pages/admin/UserManagement';
import SystemLogs from './pages/admin/SystemLogs';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <SkipLink />
        <div className="min-h-screen flex flex-col" style={{ background: '#f3f2ef' }}>
          <Navbar />
          <main id="main-content" tabIndex="-1" style={{ flex: 1, padding: '1.5rem 0', outline: 'none' }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Candidate Routes - Protected */}
              <Route element={<ProtectedRoute allowedRoles={['Candidate']} />}>
                <Route path="/candidate" element={<CandidateLayout />}>
                  <Route path="jobs" element={<JobSearch />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="cv-upload" element={<CVUpload />} />
                </Route>
              </Route>

              {/* Recruiter / Employer Routes - Protected */}
              <Route element={<ProtectedRoute allowedRoles={['Recruiter', 'Admin']} />}>
                <Route path="/recruiter" element={<RecruiterLayout />}>
                  <Route path="applicants" element={<ViewApplicants />} />
                  <Route path="create-job" element={<CreateJob />} />
                </Route>
              </Route>

              {/* Hiring Manager Routes - Protected */}
              <Route element={<ProtectedRoute allowedRoles={['HiringManager']} />}>
                <Route path="/hiring-manager" element={<HiringManagerLayout />}>
                  <Route path="shortlist" element={<ShortlistedCandidates />} />
                  <Route path="evaluations" element={<MyEvaluations />} />
                </Route>
              </Route>

              {/* Admin Routes - Protected */}
              <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
                <Route path="/admin" element={<AdminLayout />}>
                  <Route path="analytics" element={<SystemAnalytics />} />
                  <Route path="users" element={<UserManagement />} />
                  <Route path="logs" element={<SystemLogs />} />
                </Route>
              </Route>
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

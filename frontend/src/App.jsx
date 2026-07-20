import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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

function App() {
  return (
    <Router>
      <SkipLink />
      <div className="bg-glow"></div>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main id="main-content" tabIndex="-1" style={{ flex: 1, padding: '2rem 0', outline: 'none' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/candidate" element={<CandidateLayout />}>
              <Route index element={<Navigate to="profile" replace />} />
              <Route path="profile" element={<Profile />} />
              <Route path="cv-upload" element={<CVUpload />} />
              <Route path="jobs" element={<JobSearch />} />
            </Route>
            <Route path="/recruiter" element={<RecruiterLayout />}>
              <Route index element={<Navigate to="create-job" replace />} />
              <Route path="create-job" element={<CreateJob />} />
              <Route path="applicants" element={<ViewApplicants />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

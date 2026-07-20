import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
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
      <div className="bg-glow"></div>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main style={{ flex: 1, padding: '2rem 0' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/candidate" element={<CandidateLayout />}>
              <Route path="profile" element={<Profile />} />
              <Route path="cv-upload" element={<CVUpload />} />
              <Route path="jobs" element={<JobSearch />} />
            </Route>
            <Route path="/recruiter" element={<RecruiterLayout />}>
              <Route path="create-job" element={<CreateJob />} />
              <Route path="applicants" element={<ViewApplicants />} />
            </Route>
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

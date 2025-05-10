
    import React from 'react';
    import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
    import { Toaster } from '@/components/ui/toaster';
    import LoginPage from '@/pages/LoginPage';
    import JobSeekerDashboardPage from '@/pages/JobSeekerDashboardPage';
    import ResumeAnalysisPage from '@/pages/ResumeAnalysisPage';
    import JobSuggestionsPage from '@/pages/JobSuggestionsPage';
    import JobApplicationPage from '@/pages/JobApplicationPage';
    import PostJobPage from '@/pages/PostJobPage';
    import JobFeedPage from '@/pages/JobFeedPage';
    import ProtectedRoute from '@/components/ProtectedRoute';
    import Layout from '@/components/Layout';

    function App() {
      return (
        <Router>
          <Layout>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route 
                path="/job-seeker-dashboard" 
                element={
                  <ProtectedRoute userType="jobSeeker">
                    <JobSeekerDashboardPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/resume-analysis" 
                element={
                  <ProtectedRoute userType="jobSeeker">
                    <ResumeAnalysisPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/job-suggestions" 
                element={
                  <ProtectedRoute userType="jobSeeker">
                    <JobSuggestionsPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/apply/:jobId" 
                element={
                  <ProtectedRoute userType="jobSeeker">
                    <JobApplicationPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/post-job" 
                element={
                  <ProtectedRoute userType="jobPoster">
                    <PostJobPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/job-feed" 
                element={
                  <ProtectedRoute userType="jobSeeker">
                    <JobFeedPage />
                  </ProtectedRoute>
                }
              />
              <Route path="/" element={<Navigate to="/login" />} />
            </Routes>
          </Layout>
          <Toaster />
        </Router>
      );
    }

    export default App;
  
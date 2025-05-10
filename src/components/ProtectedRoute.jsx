
    import React from 'react';
    import { Navigate, useLocation } from 'react-router-dom';
    import { useToast } from '@/components/ui/use-toast';

    const ProtectedRoute = ({ children, userType: requiredUserType }) => {
      const loggedInUserType = localStorage.getItem('userType');
      const location = useLocation();
      const { toast } = useToast();

      if (!loggedInUserType) {
        toast({
          title: "Access Denied",
          description: "You need to log in to access this page.",
          variant: "destructive",
        });
        return <Navigate to="/login" state={{ from: location }} replace />;
      }

      if (requiredUserType && loggedInUserType !== requiredUserType) {
         toast({
          title: "Unauthorized Access",
          description: `This page is for ${requiredUserType}s only. You are logged in as a ${loggedInUserType}.`,
          variant: "destructive",
        });
        // Redirect to a default page based on user type or login page
        const defaultPageRoute = loggedInUserType === 'jobSeeker' ? '/job-seeker-dashboard' : '/post-job';
        return <Navigate to={defaultPageRoute} replace />;
      }

      return children;
    };

    export default ProtectedRoute;
  
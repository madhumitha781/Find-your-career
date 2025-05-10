
    import React from 'react';
    import { Link, useNavigate, useLocation } from 'react-router-dom';
    import { Button } from '@/components/ui/button';
    import { Briefcase, User, LogOut } from 'lucide-react';
    import { useToast } from '@/components/ui/use-toast';

    const Logo = () => (
      <Link to="/" className="flex items-center space-x-2">
        <Briefcase className="h-8 w-8 text-primary" />
        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 text-transparent bg-clip-text">
          Find Your Career
        </h1>
      </Link>
    );

    const Layout = ({ children }) => {
      const navigate = useNavigate();
      const location = useLocation();
      const { toast } = useToast();
      const userType = localStorage.getItem('userType');
      const userEmail = localStorage.getItem('userEmail');

      const handleLogout = () => {
        localStorage.removeItem('userType');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('jobPosterData');
        localStorage.removeItem('jobSeekerData');
        toast({
          title: "Logged Out",
          description: "You have been successfully logged out.",
        });
        navigate('/login');
      };
      
      const showNav = location.pathname !== '/login';

      return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-gray-100">
          {showNav && (
            <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="container flex h-16 items-center justify-between">
                <Logo />
                <nav className="flex items-center space-x-4">
                  {userType === 'jobSeeker' && (
                    <>
                      <Button variant="ghost" onClick={() => navigate('/job-seeker-dashboard')}>Dashboard</Button>
                      <Button variant="ghost" onClick={() => navigate('/job-feed')}>Job Feed</Button>
                    </>
                  )}
                  {userType === 'jobPoster' && (
                    <Button variant="ghost" onClick={() => navigate('/post-job')}>Post a Job</Button>
                  )}
                   {userEmail && (
                    <div className="flex items-center space-x-2">
                      <User className="h-5 w-5 text-primary" />
                      <span className="text-sm font-medium">{userEmail}</span>
                    </div>
                  )}
                  <Button variant="outline" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" /> Logout
                  </Button>
                </nav>
              </div>
            </header>
          )}
          <main className="flex-grow container mx-auto px-4 py-8">
            {children}
          </main>
          <footer className="py-6 text-center text-sm text-muted-foreground border-t border-border/40">
            © {new Date().getFullYear()} Find Your Career. All rights reserved.
          </footer>
        </div>
      );
    };

    export default Layout;
  
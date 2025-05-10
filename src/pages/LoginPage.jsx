
    import React, { useState, useEffect } from 'react';
    import { useNavigate } from 'react-router-dom';
    import { motion } from 'framer-motion';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
    import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
    import { useToast } from '@/components/ui/use-toast';
    import { Briefcase, User, Mail, Building, MapPin, DollarSign, Users, FileText, CalendarDays } from 'lucide-react';

    const LoginPage = () => {
      const [email, setEmail] = useState('');
      const [userType, setUserType] = useState('jobSeeker');
      const [showVerification, setShowVerification] = useState(false);
      const [verificationCode, setVerificationCode] = useState('');
      
      const navigate = useNavigate();
      const { toast } = useToast();

      useEffect(() => {
        const loggedInUser = localStorage.getItem('userEmail');
        const loggedInUserType = localStorage.getItem('userType');
        if (loggedInUser && loggedInUserType) {
          if (loggedInUserType === 'jobSeeker') {
            navigate('/job-seeker-dashboard');
          } else if (loggedInUserType === 'jobPoster') {
            navigate('/post-job');
          }
        }
      }, [navigate]);

      const handleLogin = (e) => {
        e.preventDefault();
        if (!email) {
          toast({ title: "Error", description: "Please enter your email.", variant: "destructive" });
          return;
        }
        // Simulate sending verification code
        console.log(`Verification code sent to ${email} (simulated)`);
        setShowVerification(true);
        toast({ title: "Verification Code Sent", description: "A verification code has been sent to your email (simulated)." });
      };

      const handleVerify = (e) => {
        e.preventDefault();
        // Simulate code verification
        if (verificationCode === "123456") { // Dummy verification code
          localStorage.setItem('userEmail', email);
          localStorage.setItem('userType', userType);
          toast({ title: "Login Successful", description: `Welcome, ${email}!` });
          if (userType === 'jobSeeker') {
            navigate('/job-seeker-dashboard');
          } else {
            navigate('/post-job');
          }
        } else {
          toast({ title: "Verification Failed", description: "Invalid verification code.", variant: "destructive" });
        }
      };
      
      const cardVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
      };

      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
          <motion.div 
            className="flex items-center space-x-3 mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Briefcase className="h-16 w-16 text-purple-400" />
            <h1 className="text-5xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 text-transparent bg-clip-text">
              Find Your Career
            </h1>
          </motion.div>

          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="w-full max-w-md"
          >
            <Card className="bg-slate-800/50 backdrop-blur-md border-purple-500/30 shadow-2xl shadow-purple-500/20">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl font-bold text-gray-100">Welcome Back!</CardTitle>
                <CardDescription className="text-purple-300">Sign in to continue your journey.</CardDescription>
              </CardHeader>
              <CardContent>
                {!showVerification ? (
                  <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-300 flex items-center">
                        <Mail className="mr-2 h-4 w-4 text-purple-400" /> Email Address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-slate-700/50 border-purple-500/50 text-gray-100 placeholder-gray-400 focus:ring-purple-500"
                        required
                      />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-gray-300 flex items-center">
                        <User className="mr-2 h-4 w-4 text-purple-400" /> I am a...
                      </Label>
                      <RadioGroup
                        defaultValue="jobSeeker"
                        onValueChange={setUserType}
                        className="flex space-x-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="jobSeeker" id="jobSeeker" className="text-purple-400 border-purple-400 focus:ring-purple-500" />
                          <Label htmlFor="jobSeeker" className="text-gray-300">Job Seeker</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="jobPoster" id="jobPoster" className="text-purple-400 border-purple-400 focus:ring-purple-500" />
                          <Label htmlFor="jobPoster" className="text-gray-300">Job Poster</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 text-base">
                      Send Verification Code
                    </Button>
                  </form>
                ) : (
                  <form onSubmit={handleVerify} className="space-y-6">
                    <div className="space-y-2">
                       <Label htmlFor="verificationCode" className="text-gray-300 flex items-center">
                        <Mail className="mr-2 h-4 w-4 text-purple-400" /> Verification Code
                      </Label>
                      <Input
                        id="verificationCode"
                        type="text"
                        placeholder="Enter 6-digit code"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        className="bg-slate-700/50 border-purple-500/50 text-gray-100 placeholder-gray-400 focus:ring-purple-500"
                        required
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button type="submit" className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-semibold py-3 text-base">
                        Verify & Login
                      </Button>
                       <Button variant="outline" onClick={() => setShowVerification(false)} className="w-full border-purple-500 text-purple-400 hover:bg-purple-500/10">
                        Back
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
              <CardFooter className="flex justify-center">
                <p className="text-xs text-gray-400">
                  By signing in, you agree to our Terms and Conditions.
                </p>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      );
    };

    export default LoginPage;
  
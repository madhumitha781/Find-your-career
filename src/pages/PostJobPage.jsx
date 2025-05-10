
    import React, { useState, useEffect } from 'react';
    import { useNavigate } from 'react-router-dom';
    import { motion } from 'framer-motion';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { Textarea } from '@/components/ui/textarea';
    import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
    import { useToast } from '@/components/ui/use-toast';
    import { Building, MapPin, DollarSign, Users, FileText, CalendarDays, Briefcase, Send } from 'lucide-react';

    const PostJobPage = () => {
      const [jobDetails, setJobDetails] = useState({
        companyName: '',
        location: '',
        salaryPackage: '',
        jobDescription: '',
        workersNeeded: '',
        applicationDeadline: '',
        jobTitle: '',
      });
      const navigate = useNavigate();
      const { toast } = useToast();

      useEffect(() => {
        const posterData = JSON.parse(localStorage.getItem('jobPosterData'));
        if (posterData) {
          // Pre-fill if some data exists, e.g., company name from a profile
          // setJobDetails(prev => ({ ...prev, companyName: posterData.companyName || '' }));
        }
      }, []);

      const handleChange = (e) => {
        const { name, value } = e.target;
        setJobDetails(prev => ({ ...prev, [name]: value }));
      };

      const handleSubmit = (e) => {
        e.preventDefault();
        if (Object.values(jobDetails).some(field => field === '')) {
          toast({ title: "Incomplete Form", description: "Please fill all fields.", variant: "destructive" });
          return;
        }

        // Convert deadline to Date object for comparison
        const deadlineDate = new Date(jobDetails.applicationDeadline);
        const currentDate = new Date();
        currentDate.setHours(0,0,0,0); // Compare dates only

        if (deadlineDate < currentDate) {
          toast({ title: "Invalid Deadline", description: "Application deadline cannot be in the past.", variant: "destructive" });
          return;
        }

        const newJob = { ...jobDetails, id: Date.now().toString(), postedBy: localStorage.getItem('userEmail'), createdAt: new Date().toISOString() };
        const existingJobs = JSON.parse(localStorage.getItem('jobs')) || [];
        localStorage.setItem('jobs', JSON.stringify([...existingJobs, newJob]));
        
        toast({ title: "Job Posted!", description: `${jobDetails.jobTitle} has been successfully posted.` });
        setJobDetails({
          companyName: '', location: '', salaryPackage: '', jobDescription: '', workersNeeded: '', applicationDeadline: '', jobTitle: ''
        });
        // Optionally navigate to a "my posted jobs" page or dashboard
        // navigate('/job-poster-dashboard'); 
      };

      const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } },
      };
      const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 },
      };

      return (
        <motion.div 
          className="max-w-2xl mx-auto p-4 md:p-6"
          initial="hidden"
          animate="visible"
          variants={cardVariants}
        >
          <Card className="bg-slate-800/60 backdrop-blur-lg border-purple-500/40 shadow-xl shadow-purple-500/15">
            <CardHeader>
              <motion.div variants={itemVariants} className="flex items-center space-x-3 mb-2">
                <Briefcase className="h-8 w-8 text-purple-400" />
                <CardTitle className="text-3xl font-bold text-gray-100">Post a New Job</CardTitle>
              </motion.div>
              <motion.div variants={itemVariants}>
                <CardDescription className="text-purple-300">
                  Fill in the details below to find the perfect candidates.
                </CardDescription>
              </motion.div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div variants={itemVariants} className="space-y-2">
                    <Label htmlFor="jobTitle" className="text-gray-300 flex items-center">
                      <FileText className="mr-2 h-4 w-4 text-purple-400" /> Job Title
                    </Label>
                    <Input id="jobTitle" name="jobTitle" value={jobDetails.jobTitle} onChange={handleChange} placeholder="e.g., Senior Software Engineer" className="bg-slate-700/50 border-purple-500/50 text-gray-100 placeholder-gray-400 focus:ring-purple-500" />
                  </motion.div>
                  <motion.div variants={itemVariants} className="space-y-2">
                    <Label htmlFor="companyName" className="text-gray-300 flex items-center">
                      <Building className="mr-2 h-4 w-4 text-purple-400" /> Company Name
                    </Label>
                    <Input id="companyName" name="companyName" value={jobDetails.companyName} onChange={handleChange} placeholder="e.g., Tech Solutions Inc." className="bg-slate-700/50 border-purple-500/50 text-gray-100 placeholder-gray-400 focus:ring-purple-500" />
                  </motion.div>
                  <motion.div variants={itemVariants} className="space-y-2">
                    <Label htmlFor="location" className="text-gray-300 flex items-center">
                      <MapPin className="mr-2 h-4 w-4 text-purple-400" /> Location
                    </Label>
                    <Input id="location" name="location" value={jobDetails.location} onChange={handleChange} placeholder="e.g., New York, NY or Remote" className="bg-slate-700/50 border-purple-500/50 text-gray-100 placeholder-gray-400 focus:ring-purple-500" />
                  </motion.div>
                  <motion.div variants={itemVariants} className="space-y-2">
                    <Label htmlFor="salaryPackage" className="text-gray-300 flex items-center">
                      <DollarSign className="mr-2 h-4 w-4 text-purple-400" /> Salary Package
                    </Label>
                    <Input id="salaryPackage" name="salaryPackage" value={jobDetails.salaryPackage} onChange={handleChange} placeholder="e.g., $120,000 - $150,000 per year" className="bg-slate-700/50 border-purple-500/50 text-gray-100 placeholder-gray-400 focus:ring-purple-500" />
                  </motion.div>
                  <motion.div variants={itemVariants} className="space-y-2">
                    <Label htmlFor="workersNeeded" className="text-gray-300 flex items-center">
                      <Users className="mr-2 h-4 w-4 text-purple-400" /> Number of Workers Needed
                    </Label>
                    <Input id="workersNeeded" name="workersNeeded" type="number" min="1" value={jobDetails.workersNeeded} onChange={handleChange} placeholder="e.g., 3" className="bg-slate-700/50 border-purple-500/50 text-gray-100 placeholder-gray-400 focus:ring-purple-500" />
                  </motion.div>
                  <motion.div variants={itemVariants} className="space-y-2">
                    <Label htmlFor="applicationDeadline" className="text-gray-300 flex items-center">
                      <CalendarDays className="mr-2 h-4 w-4 text-purple-400" /> Application Deadline
                    </Label>
                    <Input id="applicationDeadline" name="applicationDeadline" type="date" value={jobDetails.applicationDeadline} onChange={handleChange} className="bg-slate-700/50 border-purple-500/50 text-gray-100 placeholder-gray-400 focus:ring-purple-500 appearance-none" />
                  </motion.div>
                </div>
                <motion.div variants={itemVariants} className="space-y-2">
                  <Label htmlFor="jobDescription" className="text-gray-300 flex items-center">
                    <FileText className="mr-2 h-4 w-4 text-purple-400" /> Job Description
                  </Label>
                  <Textarea id="jobDescription" name="jobDescription" value={jobDetails.jobDescription} onChange={handleChange} placeholder="Describe the role, responsibilities, and qualifications..." rows={6} className="bg-slate-700/50 border-purple-500/50 text-gray-100 placeholder-gray-400 focus:ring-purple-500" />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 text-base mt-4">
                    <Send className="mr-2 h-5 w-5" /> Post Job Opening
                  </Button>
                </motion.div>
              </form>
            </CardContent>
            <CardFooter className="text-center">
              <motion.p variants={itemVariants} className="text-xs text-gray-400">
                Ensure all information is accurate before posting.
              </motion.p>
            </CardFooter>
          </Card>
        </motion.div>
      );
    };

    export default PostJobPage;
  
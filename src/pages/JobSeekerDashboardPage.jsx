
    import React, { useState, useEffect } from 'react';
    import { useNavigate } from 'react-router-dom';
    import { motion } from 'framer-motion';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
    import { useToast } from '@/components/ui/use-toast';
    import { UploadCloud, FileText, CheckCircle, Search, Briefcase, User } from 'lucide-react';
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

    const JobSeekerDashboardPage = () => {
      const [resumeFile, setResumeFile] = useState(null);
      const [resumeName, setResumeName] = useState('');
      const [jobRole, setJobRole] = useState('');
      const navigate = useNavigate();
      const { toast } = useToast();

      useEffect(() => {
        const seekerData = JSON.parse(localStorage.getItem('jobSeekerData'));
        if (seekerData) {
          setJobRole(seekerData.jobRole || '');
          if (seekerData.resumeName) {
            setResumeName(seekerData.resumeName);
            setResumeFile({ name: seekerData.resumeName }); 
          }
        }
      }, []);

      const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
          if (file.type === "application/pdf" || file.type === "application/msword" || file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
            setResumeFile(file);
            setResumeName(file.name);
            toast({ title: "Resume Selected", description: `${file.name} is ready.` });
          } else {
            toast({ title: "Invalid File Type", description: "Please upload a PDF or Word document.", variant: "destructive" });
            setResumeFile(null);
            setResumeName('');
          }
        }
      };

      const handleSubmit = () => {
        if (!jobRole) {
          toast({ title: "Missing Information", description: "Please select a job role.", variant: "destructive" });
          return;
        }
        if (!resumeFile) {
          toast({ title: "Missing Resume", description: "Please upload your resume.", variant: "destructive" });
          return;
        }

        const jobSeekerData = {
          jobRole,
          resumeName: resumeFile.name,
        };
        localStorage.setItem('jobSeekerData', JSON.stringify(jobSeekerData));

        toast({ title: "Information Saved", description: "Your job role and resume are saved." });
        navigate('/resume-analysis');
      };

      const popularRoles = [
        "Software Engineer", "Data Scientist", "Product Manager", "UX/UI Designer", 
        "Marketing Specialist", "Sales Representative", "Project Manager", "Business Analyst"
      ];
      
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
          className="max-w-xl mx-auto p-4 md:p-6"
          initial="hidden"
          animate="visible"
          variants={cardVariants}
        >
          <Card className="bg-slate-800/60 backdrop-blur-lg border-purple-500/40 shadow-xl shadow-purple-500/15">
            <CardHeader>
              <motion.div variants={itemVariants} className="flex items-center space-x-3 mb-2">
                <User className="h-8 w-8 text-purple-400" />
                 <CardTitle className="text-3xl font-bold text-gray-100">Your Career Profile</CardTitle>
              </motion.div>
              <motion.div variants={itemVariants}>
                <CardDescription className="text-purple-300">
                  Tell us about your desired role and upload your resume to get started.
                </CardDescription>
              </motion.div>
            </CardHeader>
            <CardContent className="space-y-8">
              <motion.div variants={itemVariants} className="space-y-3">
                <Label htmlFor="jobRole" className="text-gray-300 flex items-center text-lg">
                  <Briefcase className="mr-2 h-5 w-5 text-purple-400" /> Desired Job Role
                </Label>
                <Select onValueChange={setJobRole} value={jobRole}>
                  <SelectTrigger className="w-full bg-slate-700/50 border-purple-500/50 text-gray-100 placeholder-gray-400 focus:ring-purple-500 py-3 text-base">
                    <SelectValue placeholder="Select your target job role" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-purple-500 text-gray-100">
                    {popularRoles.map(role => (
                      <SelectItem key={role} value={role} className="hover:bg-purple-600/50 focus:bg-purple-600/50">
                        {role}
                      </SelectItem>
                    ))}
                     <SelectItem value="Other" className="hover:bg-purple-600/50 focus:bg-purple-600/50">Other (Specify below)</SelectItem>
                  </SelectContent>
                </Select>
                {jobRole === "Other" && (
                   <Input 
                     type="text" 
                     placeholder="Specify other job role" 
                     onChange={(e) => setJobRole(e.target.value)}
                     className="mt-2 bg-slate-700/50 border-purple-500/50 text-gray-100 placeholder-gray-400 focus:ring-purple-500"
                   />
                )}
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-3">
                <Label htmlFor="resumeUpload" className="text-gray-300 flex items-center text-lg">
                  <FileText className="mr-2 h-5 w-5 text-purple-400" /> Upload Your Resume
                </Label>
                <div className="flex items-center space-x-3">
                  <Button asChild variant="outline" className="border-purple-500 text-purple-400 hover:bg-purple-500/10 hover:text-purple-300 flex-grow">
                    <Label htmlFor="resume" className="cursor-pointer">
                      <UploadCloud className="mr-2 h-5 w-5" /> Choose File
                    </Label>
                  </Button>
                  <Input id="resume" type="file" onChange={handleFileChange} className="hidden" accept=".pdf,.doc,.docx" />
                </div>
                {resumeName && (
                  <div className="mt-3 flex items-center text-sm text-green-400 bg-green-900/30 p-3 rounded-md border border-green-500/50">
                    <CheckCircle className="mr-2 h-5 w-5 text-green-400" />
                    <span>{resumeName} selected.</span>
                  </div>
                )}
                 <p className="text-xs text-gray-400">Accepted formats: PDF, DOC, DOCX. Max size: 5MB (simulated).</p>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Button onClick={handleSubmit} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 text-base">
                  <Search className="mr-2 h-5 w-5" /> Analyze Resume & Find Jobs
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      );
    };
    export default JobSeekerDashboardPage;
  
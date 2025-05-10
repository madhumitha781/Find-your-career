
    import React, { useState, useEffect } from 'react';
    import { useParams, useNavigate } from 'react-router-dom';
    import { motion } from 'framer-motion';
    import { Button } from '@/components/ui/button';
    import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
    import { Textarea } from '@/components/ui/textarea';
    import { Label } from '@/components/ui/label';
    import { useToast } from '@/components/ui/use-toast';
    import { Briefcase, Building, MapPin, DollarSign, FileText, Send, ExternalLink, CheckCircle, ArrowLeft } from 'lucide-react';

    const JobApplicationPage = () => {
      const { jobId } = useParams();
      const navigate = useNavigate();
      const { toast } = useToast();
      const [job, setJob] = useState(null);
      const [coverLetter, setCoverLetter] = useState('');
      const [isSubmitting, setIsSubmitting] = useState(false);
      const [isSubmitted, setIsSubmitted] = useState(false);

      useEffect(() => {
        // Attempt to load job from localStorage (set by JobSuggestionsPage or JobFeedPage)
        const selectedJob = JSON.parse(localStorage.getItem('selectedJobForApplication'));
        if (selectedJob && selectedJob.id === jobId) {
          setJob(selectedJob);
        } else {
          // Fallback: try to find job in the main jobs list if direct navigation
          const allJobs = JSON.parse(localStorage.getItem('jobs')) || [];
          const foundJob = allJobs.find(j => j.id === jobId);
          if (foundJob) {
            setJob(foundJob);
          } else {
            toast({ title: "Job Not Found", description: "The job you are trying to apply for could not be found.", variant: "destructive" });
            navigate('/job-feed'); 
          }
        }
      }, [jobId, navigate, toast]);

      const handleSubmitApplication = () => {
        if (!coverLetter.trim() && !job?.requiresCoverLetter === false) { // Assume cover letter is good to have unless specified otherwise
           toast({ title: "Missing Cover Letter", description: "Please write a brief cover letter or introduction.", variant: "destructive" });
           return;
        }
        
        setIsSubmitting(true);
        // Simulate application submission
        setTimeout(() => {
          const applicationData = {
            jobId: job.id,
            jobTitle: job.title,
            company: job.companyName || job.company,
            userEmail: localStorage.getItem('userEmail'),
            coverLetter: coverLetter,
            submittedAt: new Date().toISOString(),
            resumeName: JSON.parse(localStorage.getItem('jobSeekerData'))?.resumeName || 'N/A'
          };

          const existingApplications = JSON.parse(localStorage.getItem('jobApplications')) || [];
          localStorage.setItem('jobApplications', JSON.stringify([...existingApplications, applicationData]));
          
          setIsSubmitting(false);
          setIsSubmitted(true);
          toast({ title: "Application Submitted!", description: `Your application for ${job.title} has been sent (simulated).`, className: "bg-green-600 text-white" });
          
          // Optionally, remove selectedJobForApplication after successful submission
          localStorage.removeItem('selectedJobForApplication');

        }, 2000);
      };
      
      const cardVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
      };

      if (!job) {
        return <div className="flex justify-center items-center h-screen text-xl text-gray-100">Loading job details...</div>;
      }

      if (isSubmitted) {
        return (
          <motion.div 
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="max-w-lg mx-auto p-6 text-center"
          >
            <Card className="bg-slate-800/70 backdrop-blur-lg border-green-500/50 shadow-xl shadow-green-500/20">
                <CardHeader>
                    <CheckCircle className="w-20 h-20 text-green-400 mx-auto mb-4" />
                    <CardTitle className="text-3xl font-bold text-green-300">Application Sent!</CardTitle>
                    <CardDescription className="text-gray-300 mt-2">
                        Your application for <strong className="text-purple-300">{job.title}</strong> at <strong className="text-purple-300">{job.companyName || job.company}</strong> has been successfully submitted.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-gray-400">You will be notified if the job poster proceeds with your application. Good luck!</p>
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row justify-center gap-4">
                    <Button onClick={() => navigate('/job-feed')} className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 w-full sm:w-auto">
                        Find More Jobs
                    </Button>
                     <Button onClick={() => navigate('/job-seeker-dashboard')} variant="outline" className="border-purple-500 text-purple-300 hover:bg-purple-500/10 w-full sm:w-auto">
                        Back to Dashboard
                    </Button>
                </CardFooter>
            </Card>
          </motion.div>
        );
      }

      return (
        <motion.div 
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="max-w-2xl mx-auto p-4 md:p-6"
        >
          <Button onClick={() => navigate(-1)} variant="ghost" className="mb-6 text-purple-300 hover:text-purple-100 hover:bg-purple-500/10">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Job Listings
          </Button>
          <Card className="bg-slate-800/70 backdrop-blur-lg border-purple-500/50 shadow-xl shadow-purple-500/20">
            <CardHeader>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <CardTitle className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-red-400">
                    Apply for: {job.title || job.jobTitle}
                  </CardTitle>
                  <div className="flex items-center text-lg text-purple-300 mt-1">
                    <Building className="h-5 w-5 mr-2 " />{job.companyName || job.company}
                  </div>
                </div>
                <Briefcase className="h-10 w-10 text-purple-400 flex-shrink-0" />
              </div>
              <div className="flex items-center text-sm text-gray-400">
                <MapPin className="h-4 w-4 mr-2 text-purple-400" />{job.location}
              </div>
              {job.salaryPackage && (
                 <div className="flex items-center text-sm text-gray-400 mt-1">
                    <DollarSign className="h-4 w-4 mr-2 text-purple-400" />{job.salaryPackage}
                 </div>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-200 mb-2">Job Description</h3>
                <p className="text-gray-300 whitespace-pre-wrap text-sm leading-relaxed max-h-48 overflow-y-auto p-3 bg-slate-700/40 rounded-md border border-slate-600">
                  {job.jobDescription || "No detailed description provided. Please refer to the company website."}
                </p>
              </div>

              {job.companyUrl && (
                <div className="text-sm">
                  <a 
                    href={job.companyUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center text-purple-400 hover:text-purple-300 hover:underline"
                  >
                    Visit Company Website <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </div>
              )}

              <div>
                <Label htmlFor="coverLetter" className="text-lg font-medium text-gray-200 mb-2 block">
                  <FileText className="mr-2 h-5 w-5 inline text-purple-400" /> Your Cover Letter / Introduction (Optional)
                </Label>
                <Textarea
                  id="coverLetter"
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder={`Briefly introduce yourself and why you're a good fit for the ${job.title || job.jobTitle} role at ${job.companyName || job.company}...`}
                  rows={6}
                  className="bg-slate-700/50 border-purple-500/50 text-gray-100 placeholder-gray-400 focus:ring-purple-500"
                  disabled={isSubmitting}
                />
                 <p className="text-xs text-gray-400 mt-1">Your resume: <span className="font-medium text-purple-300">{JSON.parse(localStorage.getItem('jobSeekerData'))?.resumeName || 'Default Resume'}</span> will be attached.</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleSubmitApplication} 
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-semibold py-3 text-base"
              >
                {isSubmitting ? (
                  <motion.div className="flex items-center justify-center">
                    <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-t-white border-r-white border-b-transparent border-l-transparent rounded-full mr-2"
                    />
                    Submitting...
                  </motion.div>
                ) : (
                  <><Send className="mr-2 h-5 w-5" /> Submit Application</>
                )}
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      );
    };

    export default JobApplicationPage;
  

    import React, { useState, useEffect } from 'react';
    import { useNavigate } from 'react-router-dom';
    import { motion } from 'framer-motion';
    import { Button } from '@/components/ui/button';
    import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
    import { useToast } from '@/components/ui/use-toast';
    import { Briefcase, ExternalLink, Building, MapPin, Info, AlertTriangle, ArrowRight } from 'lucide-react';

    const dummyJobs = [
      { id: '101', title: 'Junior Marketing Assistant', company: 'Creative Solutions Ltd.', location: 'Remote', skills: ['social media', 'content creation', 'seo basics'], companyUrl: 'https://example.com/creative-solutions' },
      { id: '102', title: 'Customer Support Specialist', company: 'SupportPro Inc.', location: 'New York, NY', skills: ['communication', 'problem-solving', 'crm software'], companyUrl: 'https://example.com/supportpro' },
      { id: '103', title: 'Data Entry Clerk', company: 'DataFlow Corp.', location: 'Chicago, IL', skills: ['typing speed', 'attention to detail', 'microsoft excel'], companyUrl: 'https://example.com/dataflow' },
      { id: '104', title: 'Administrative Assistant', company: 'Office Helpers Co.', location: 'Austin, TX', skills: ['organization', 'scheduling', 'microsoft office'], companyUrl: 'https://example.com/office-helpers' },
    ];

    const JobSuggestionsPage = () => {
      const [suggestedJobs, setSuggestedJobs] = useState([]);
      const [isLoading, setIsLoading] = useState(true);
      const navigate = useNavigate();
      const { toast } = useToast();

      useEffect(() => {
        const seekerData = JSON.parse(localStorage.getItem('jobSeekerData'));
        
        setTimeout(() => {
          let filteredJobs = dummyJobs;
          if (seekerData && seekerData.resumeTextContent) {
            const resumeText = seekerData.resumeTextContent.toLowerCase();
            if (resumeText.includes("marketing") || resumeText.includes("social media")) {
                filteredJobs = dummyJobs.filter(job => job.skills.some(skill => resumeText.includes(skill) || job.title.toLowerCase().includes("marketing")));
            } else if (resumeText.includes("customer") || resumeText.includes("communication")) {
                filteredJobs = dummyJobs.filter(job => job.skills.some(skill => resumeText.includes(skill) || job.title.toLowerCase().includes("support")));
            }
          }

          setSuggestedJobs(filteredJobs.length > 0 ? filteredJobs : dummyJobs.slice(0,2));
          setIsLoading(false);
          if (seekerData?.atsScore < 50 && seekerData?.atsScore !== undefined) {
             toast({
                title: "General Job Suggestions",
                description: "Your resume's ATS score was low for your target role. Here are some jobs based on general skills detected or popular roles.",
                duration: 7000,
                variant: "default" 
             });
          } else {
             toast({
                title: "Job Suggestions",
                description: "Here are some job suggestions you might be interested in.",
             });
          }
        }, 1500);
      }, [toast]);

      const handleApply = (job) => {
        localStorage.setItem('selectedJobForApplication', JSON.stringify(job));
        navigate(`/apply/${job.id}`);
      };
      
      const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
      };

      const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
      };


      if (isLoading) {
        return (
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-gray-100">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-4 border-t-pink-500 border-r-pink-500 border-b-slate-700 border-l-slate-700 rounded-full mb-4"
            />
            <p className="text-lg font-semibold text-pink-300">Finding suitable job suggestions...</p>
          </div>
        );
      }

      return (
        <div className="max-w-4xl mx-auto p-4 md:p-6">
          <motion.div initial="hidden" animate="visible" variants={itemVariants} className="mb-8 text-center">
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 mb-2">
              Job Opportunities
            </h1>
            <p className="text-lg text-purple-300">
              { suggestedJobs.length > 0 ? "Explore roles that might be a good fit for you based on your profile." : "We couldn't find specific matches, but here are some general openings."}
            </p>
          </motion.div>

          {suggestedJobs.length === 0 && !isLoading && (
             <motion.div 
                variants={itemVariants}
                className="text-center p-10 bg-slate-800/50 rounded-xl border border-dashed border-purple-500/30"
              >
              <AlertTriangle className="mx-auto h-16 w-16 text-yellow-400 mb-4" />
              <h2 className="text-2xl font-semibold text-yellow-300 mb-2">No Specific Suggestions Found</h2>
              <p className="text-gray-400 mb-4">
                We couldn't find specific job suggestions based on your current profile or resume analysis.
                Consider broadening your search or updating your resume for more tailored results.
              </p>
              <Button onClick={() => navigate('/job-seeker-dashboard')} className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                Update Profile
              </Button>
            </motion.div>
          )}

          {suggestedJobs.length > 0 && (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {suggestedJobs.map((job) => (
                <motion.div key={job.id} variants={itemVariants}>
                  <Card className="h-full flex flex-col bg-slate-800/70 backdrop-blur-md border-purple-500/40 shadow-lg hover:shadow-purple-500/30 transition-shadow duration-300">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-xl font-semibold text-pink-300">{job.title}</CardTitle>
                        <Briefcase className="h-6 w-6 text-purple-400" />
                      </div>
                      <div className="flex items-center text-sm text-gray-400 mt-1">
                        <Building className="h-4 w-4 mr-2 text-purple-400" />{job.company}
                      </div>
                      <div className="flex items-center text-sm text-gray-400">
                        <MapPin className="h-4 w-4 mr-2 text-purple-400" />{job.location}
                      </div>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-sm text-gray-300 mb-3 line-clamp-3">
                        A promising role at {job.company} located in {job.location}. Key skills include {job.skills.join(', ')}. Visit the company website to learn more.
                      </p>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {job.skills.slice(0,3).map(skill => (
                           <span key={skill} className="text-xs bg-purple-700/50 text-purple-200 px-2 py-1 rounded-full">{skill}</span>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="flex flex-col sm:flex-row sm:justify-between items-stretch sm:items-center gap-3 pt-4 border-t border-purple-500/20">
                      <Button 
                        onClick={() => handleApply(job)} 
                        className="w-full sm:w-auto bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white"
                      >
                        <Info className="mr-2 h-4 w-4" /> View & Apply
                      </Button>
                      {job.companyUrl && (
                        <Button 
                          variant="outline" 
                          onClick={() => window.open(job.companyUrl, '_blank')}
                          className="w-full sm:w-auto border-purple-500 text-purple-300 hover:bg-purple-500/10 hover:text-purple-200"
                        >
                          Company Site <ExternalLink className="ml-2 h-4 w-4" />
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
           <motion.div variants={itemVariants} className="mt-12 text-center">
                <Button onClick={() => navigate('/job-feed')} variant="ghost" className="text-purple-300 hover:text-purple-100 hover:bg-purple-500/20 text-lg py-3 px-6">
                    Explore Full Job Feed <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
            </motion.div>
        </div>
      );
    };

    export default JobSuggestionsPage;
  
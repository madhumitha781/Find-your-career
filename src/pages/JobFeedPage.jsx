
    import React, { useState, useEffect, useMemo } from 'react';
    import { useNavigate } from 'react-router-dom';
    import { motion } from 'framer-motion';
    import { Button } from '@/components/ui/button';
    import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
    import { Input } from '@/components/ui/input';
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
    import { useToast } from '@/components/ui/use-toast';
    import { Briefcase, Building, MapPin, Search, ExternalLink, DollarSign, Filter, Info, FileText } from 'lucide-react';

    const JobFeedPage = () => {
      const [allJobs, setAllJobs] = useState([]);
      const [filteredJobs, setFilteredJobs] = useState([]);
      const [isLoading, setIsLoading] = useState(true);
      const [searchTerm, setSearchTerm] = useState('');
      const [locationFilter, setLocationFilter] = useState('');
      const [jobTypeFilter, setJobTypeFilter] = useState(''); // e.g. Full-time, Part-time (not in current data)
      const [salaryMinFilter, setSalaryMinFilter] = useState('');


      const navigate = useNavigate();
      const { toast } = useToast();

      useEffect(() => {
        const jobsFromStorage = JSON.parse(localStorage.getItem('jobs')) || [];
        const currentDate = new Date();
        
        // Filter out expired jobs
        const activeJobs = jobsFromStorage.filter(job => {
            if (!job.applicationDeadline) return true; // If no deadline, assume active
            const deadlineDate = new Date(job.applicationDeadline);
            return deadlineDate >= currentDate;
        });

        setAllJobs(activeJobs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))); // Sort by newest
        setFilteredJobs(activeJobs);
        setIsLoading(false);
      }, []);
      
      const uniqueLocations = useMemo(() => {
        const locations = new Set(allJobs.map(job => job.location).filter(Boolean));
        return Array.from(locations).sort();
      }, [allJobs]);

      useEffect(() => {
        let jobs = [...allJobs];
        if (searchTerm) {
          jobs = jobs.filter(job =>
            job.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.jobDescription.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
        if (locationFilter) {
          jobs = jobs.filter(job => job.location === locationFilter);
        }
        if (salaryMinFilter) {
          jobs = jobs.filter(job => {
            // This is a very basic salary filter. Real-world salary parsing is complex.
            // Assuming salaryPackage is like "$50,000 - $70,000" or "Up to $80,000" or "$60k"
            const salaryStr = String(job.salaryPackage).replace(/[^0-9\-]/g, ''); // extract numbers and hyphen
            const parts = salaryStr.split('-');
            const jobMinSalary = parseInt(parts[0], 10);
            return !isNaN(jobMinSalary) && jobMinSalary >= parseInt(salaryMinFilter, 10);
          });
        }
        setFilteredJobs(jobs);
      }, [searchTerm, locationFilter, salaryMinFilter, allJobs]);


      const handleApply = (job) => {
        localStorage.setItem('selectedJobForApplication', JSON.stringify(job));
        navigate(`/apply/${job.id}`);
      };

      const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
      };

      const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120 } },
      };

      if (isLoading) {
        return (
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-gray-100">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-4 border-t-purple-500 border-r-purple-500 border-b-slate-700 border-l-slate-700 rounded-full mb-4"
            />
            <p className="text-lg font-semibold text-purple-300">Loading job feed...</p>
          </div>
        );
      }

      return (
        <div className="max-w-6xl mx-auto p-4 md:p-6">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 text-center"
          >
            <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 mb-3">
              Discover Your Next Opportunity
            </h1>
            <p className="text-lg text-purple-300 max-w-2xl mx-auto">
              Browse through the latest job openings. Use the filters to narrow down your search.
            </p>
          </motion.div>

          {/* Filters Section */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8 p-6 bg-slate-800/50 backdrop-blur-md rounded-xl border border-purple-500/30 shadow-lg"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
              <div className="space-y-1">
                <label htmlFor="search" className="text-sm font-medium text-gray-300 flex items-center">
                    <Search className="mr-2 h-4 w-4 text-purple-400" /> Search
                </label>
                <Input
                  id="search"
                  type="text"
                  placeholder="Keywords, Title, Company..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-slate-700/60 border-purple-500/50 text-gray-100 placeholder-gray-400 focus:ring-purple-500"
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="location" className="text-sm font-medium text-gray-300 flex items-center">
                    <MapPin className="mr-2 h-4 w-4 text-purple-400" /> Location
                </label>
                <Select onValueChange={setLocationFilter} value={locationFilter}>
                  <SelectTrigger className="w-full bg-slate-700/60 border-purple-500/50 text-gray-100 focus:ring-purple-500">
                    <SelectValue placeholder="All Locations" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-purple-500 text-gray-100">
                    <SelectItem value="" className="hover:bg-purple-600/50 focus:bg-purple-600/50">All Locations</SelectItem>
                    {uniqueLocations.map(loc => (
                      <SelectItem key={loc} value={loc} className="hover:bg-purple-600/50 focus:bg-purple-600/50">{loc}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
               <div className="space-y-1">
                <label htmlFor="salaryMin" className="text-sm font-medium text-gray-300 flex items-center">
                    <DollarSign className="mr-2 h-4 w-4 text-purple-400" /> Min Salary (USD)
                </label>
                <Input
                  id="salaryMin"
                  type="number"
                  placeholder="e.g., 50000"
                  value={salaryMinFilter}
                  onChange={(e) => setSalaryMinFilter(e.target.value)}
                  className="bg-slate-700/60 border-purple-500/50 text-gray-100 placeholder-gray-400 focus:ring-purple-500"
                />
              </div>
              <Button 
                onClick={() => { setSearchTerm(''); setLocationFilter(''); setSalaryMinFilter(''); }}
                variant="outline"
                className="w-full border-purple-500 text-purple-300 hover:bg-purple-500/20 hover:text-purple-100"
              >
                <Filter className="mr-2 h-4 w-4" /> Reset Filters
              </Button>
            </div>
          </motion.div>

          {filteredJobs.length === 0 && !isLoading && (
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-16 px-6 bg-slate-800/50 rounded-xl border border-dashed border-purple-500/30"
            >
              <FileText className="mx-auto h-20 w-20 text-purple-400 mb-6 opacity-70" />
              <h2 className="text-3xl font-semibold text-gray-100 mb-3">No Jobs Match Your Criteria</h2>
              <p className="text-gray-400 mb-6 max-w-md mx-auto">
                Try adjusting your search terms or filters. New opportunities are added regularly!
              </p>
              <Button onClick={() => navigate('/job-seeker-dashboard')} className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                Update Your Profile
              </Button>
            </motion.div>
          )}

          {filteredJobs.length > 0 && (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredJobs.map((job) => (
                <motion.div key={job.id} variants={itemVariants}>
                  <Card className="h-full flex flex-col bg-slate-800/70 backdrop-blur-md border-purple-500/40 shadow-lg hover:shadow-purple-500/30 transition-shadow duration-300 hover:border-purple-400/60">
                    <CardHeader className="pb-4">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-xl font-semibold text-pink-300 hover:text-pink-200 transition-colors">{job.jobTitle}</CardTitle>
                        <Briefcase className="h-6 w-6 text-purple-400 flex-shrink-0 mt-1" />
                      </div>
                      <div className="flex items-center text-sm text-gray-400 mt-1">
                        <Building className="h-4 w-4 mr-2 text-purple-400" />{job.companyName}
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
                    <CardContent className="flex-grow pt-0 pb-4">
                      <p className="text-sm text-gray-300 line-clamp-3 leading-relaxed">
                        {job.jobDescription}
                      </p>
                    </CardContent>
                    <CardFooter className="flex flex-col sm:flex-row sm:justify-between items-stretch sm:items-center gap-3 pt-4 border-t border-purple-500/20">
                      <Button 
                        onClick={() => handleApply(job)} 
                        className="w-full sm:w-auto bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white font-semibold"
                      >
                        <Info className="mr-2 h-4 w-4" /> View & Apply
                      </Button>
                      {job.companyUrl && ( // Assuming job might have companyUrl like in suggestions
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
        </div>
      );
    };

    export default JobFeedPage;
  
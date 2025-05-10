
    import React, { useState, useEffect } from 'react';
    import { useNavigate } from 'react-router-dom';
    import { motion } from 'framer-motion';
    import { Button } from '@/components/ui/button';
    import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
    import { useToast } from '@/components/ui/use-toast';
    import { CheckCircle, XCircle, Edit3, Lightbulb, Search, ArrowRight, ArrowLeft } from 'lucide-react';
    import { Textarea } from '@/components/ui/textarea';

    const atsKeywordsDb = {
      "Software Engineer": ["java", "python", "javascript", "api", "cloud", "agile", "git", "react", "node.js", "sql", "nosql", "microservices", "algorithms", "data structures"],
      "Data Scientist": ["python", "r", "sql", "machine learning", "statistics", "data visualization", "tensorflow", "pytorch", "big data", "hadoop", "spark", "nlp"],
      "Product Manager": ["agile", "scrum", "roadmap", "user stories", "market research", "kpi", "jira", "product strategy", " stakeholder management", "go-to-market"],
      "UX/UI Designer": ["figma", "sketch", "adobe xd", "user research", "wireframing", "prototyping", "user testing", "design thinking", "usability", "interaction design", "visual design"],
    };

    const ResumeAnalysisPage = () => {
      const [analysisResult, setAnalysisResult] = useState(null);
      const [isLoading, setIsLoading] = useState(true);
      const [suggestedChanges, setSuggestedChanges] = useState([]);
      const [editedResumeText, setEditedResumeText] = useState('');
      const [showEditMode, setShowEditMode] = useState(false);

      const navigate = useNavigate();
      const { toast } = useToast();

      useEffect(() => {
        const seekerData = JSON.parse(localStorage.getItem('jobSeekerData'));
        if (!seekerData || !seekerData.resumeName || !seekerData.jobRole) {
          toast({ title: "Error", description: "Resume or job role not found. Please go back.", variant: "destructive" });
          navigate('/job-seeker-dashboard');
          return;
        }

        setTimeout(() => {
          const resumeTextContent = `This is a simulated resume for ${seekerData.jobRole}. It mentions skills like communication, teamwork, and problem-solving. Experience with ${seekerData.jobRole.toLowerCase().includes("engineer") ? "project leadership and some coding." : "customer interaction and data entry."}`; 
          setEditedResumeText(resumeTextContent); 

          const keywordsForRole = atsKeywordsDb[seekerData.jobRole] || [];
          let score = 0;
          const missingKeywords = [];
          
          keywordsForRole.forEach(keyword => {
            if (resumeTextContent.toLowerCase().includes(keyword)) {
              score += 100 / keywordsForRole.length;
            } else {
              missingKeywords.push(keyword);
            }
          });
          score = Math.min(Math.round(score), 100); 

          const newSuggestions = [];
          if (score < 70 && missingKeywords.length > 0) {
            newSuggestions.push(`Consider adding keywords relevant to ${seekerData.jobRole} such as: ${missingKeywords.slice(0, 3).join(', ')}.`);
          }
          if (!resumeTextContent.toLowerCase().includes("quantifiable results") && score < 80) {
             newSuggestions.push("Try to include quantifiable achievements (e.g., 'Increased sales by 15%').");
          }
          if (resumeTextContent.split(' ').length < 150) {
            newSuggestions.push("Your resume seems a bit short. Ensure you've detailed your experiences adequately.");
          }

          setAnalysisResult({
            score: score,
            status: score >= 70 ? "Good Fit" : "Needs Improvement",
            message: score >= 70 ? "Your resume seems well-aligned for this role!" : "Your resume could be optimized for Applicant Tracking Systems (ATS).",
            matchedKeywords: keywordsForRole.filter(kw => resumeTextContent.toLowerCase().includes(kw)),
            missingKeywords: missingKeywords,
          });
          setSuggestedChanges(newSuggestions);
          setIsLoading(false);
        }, 2000);
      }, [navigate, toast]);

      const handleAcceptSuggestion = (suggestionText) => {
        if (suggestionText.includes("keywords")) {
          const keywordsToAdd = analysisResult.missingKeywords.slice(0,2).join(', ');
          setEditedResumeText(prev => prev + `\n\nAdded based on suggestion: Key skills include ${keywordsToAdd}.`);
          toast({title: "Suggestion Applied", description: "Keywords added to resume text (simulated)."});
        } else if (suggestionText.includes("quantifiable")) {
          setEditedResumeText(prev => prev + `\n\nExample of quantifiable achievement: Successfully managed a project that resulted in a 10% cost reduction.`);
           toast({title: "Suggestion Applied", description: "Quantifiable example added (simulated)."});
        }
        setSuggestedChanges(prev => prev.filter(s => s !== suggestionText));
      };
      
      const handleProceed = () => {
        const seekerData = JSON.parse(localStorage.getItem('jobSeekerData')) || {};
        seekerData.resumeTextContent = editedResumeText; 
        seekerData.atsScore = analysisResult?.score;
        localStorage.setItem('jobSeekerData', JSON.stringify(seekerData));

        if (analysisResult?.score >= 50) { 
            toast({ title: "Proceeding to Job Matches", description: "Showing jobs based on your profile." });
            navigate('/job-feed');
        } else {
            toast({ title: "Resume Needs More Work", description: "Consider improving your resume further. Showing general job suggestions." });
            navigate('/job-suggestions'); 
        }
      };
      
      const cardVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
      };

      if (isLoading) {
        return (
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-gray-100">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-4 border-t-purple-500 border-r-purple-500 border-b-slate-700 border-l-slate-700 rounded-full mb-4"
            />
            <p className="text-xl font-semibold text-purple-300">Analyzing your resume...</p>
            <p className="text-gray-400">This might take a moment.</p>
          </div>
        );
      }

      if (!analysisResult) return null; 

      return (
        <motion.div 
          className="max-w-3xl mx-auto p-4 md:p-6"
          initial="hidden"
          animate="visible"
          variants={cardVariants}
        >
          <Card className="bg-slate-800/70 backdrop-blur-xl border-purple-500/50 shadow-2xl shadow-purple-500/20">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                {analysisResult.score >= 70 ? (
                  <CheckCircle className="w-16 h-16 text-green-400" />
                ) : (
                  <XCircle className="w-16 h-16 text-red-400" />
                )}
              </div>
              <CardTitle className={`text-3xl font-bold ${analysisResult.score >= 70 ? 'text-green-300' : 'text-red-300'}`}>
                Resume Analysis Complete
              </CardTitle>
              <CardDescription className="text-lg text-purple-300">
                ATS Compatibility Score: <span className="font-bold text-2xl">{analysisResult.score}%</span>
              </CardDescription>
              <p className="text-gray-400 mt-1">{analysisResult.message}</p>
            </CardHeader>
            <CardContent className="space-y-6">
              {suggestedChanges.length > 0 && (
                <div className="p-4 border border-yellow-500/50 rounded-lg bg-yellow-900/30">
                  <h4 className="text-xl font-semibold text-yellow-300 mb-3 flex items-center">
                    <Lightbulb className="mr-2 h-6 w-6" /> Suggestions for Improvement:
                  </h4>
                  <ul className="space-y-3 list-inside">
                    {suggestedChanges.map((suggestion, index) => (
                      <li key={index} className="text-yellow-200/90 text-sm flex justify-between items-start">
                        <span>- {suggestion}</span>
                        <Button size="sm" variant="ghost" onClick={() => handleAcceptSuggestion(suggestion)} className="ml-2 text-yellow-400 hover:text-yellow-200 hover:bg-yellow-500/20 px-2 py-1 h-auto">
                          Apply (Simulated)
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <Button onClick={() => setShowEditMode(!showEditMode)} variant="outline" className="w-full mb-2 border-purple-500 text-purple-400 hover:bg-purple-500/10">
                  <Edit3 className="mr-2 h-4 w-4" /> {showEditMode ? "Hide" : "Show/Edit Resume Text (Simulated)"}
                </Button>
                {showEditMode && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} transition={{ duration: 0.3 }}>
                    <Textarea 
                      value={editedResumeText}
                      onChange={(e) => setEditedResumeText(e.target.value)}
                      rows={10}
                      className="bg-slate-700/50 border-purple-500/50 text-gray-200 placeholder-gray-400 focus:ring-purple-500 w-full"
                      placeholder="Your resume text would appear here for editing..."
                    />
                    <Button size="sm" onClick={() => {
                       toast({title: "Resume Text Updated", description: "Changes to resume text saved locally (simulated)."});
                    }} className="mt-2 bg-green-600 hover:bg-green-700 text-white">Save Changes</Button>
                  </motion.div>
                )}
              </div>
              
              <div className="p-4 border border-blue-500/50 rounded-lg bg-blue-900/30">
                 <h4 className="text-lg font-semibold text-blue-300 mb-2">Keywords Analysis:</h4>
                 <p className="text-sm text-blue-200/90"><strong>Matched:</strong> {analysisResult.matchedKeywords.length > 0 ? analysisResult.matchedKeywords.join(', ') : 'None'}</p>
                 <p className="text-sm text-orange-300/90"><strong>Consider Adding:</strong> {analysisResult.missingKeywords.length > 0 ? analysisResult.missingKeywords.join(', ') : 'All relevant keywords found!'}</p>
              </div>

            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-4 pt-6">
              <Button onClick={() => navigate('/job-seeker-dashboard')} variant="outline" className="w-full sm:w-auto border-purple-500 text-purple-400 hover:bg-purple-500/10">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
              </Button>
              <Button onClick={handleProceed} className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-semibold">
                {analysisResult?.score >= 50 ? "Find Matching Jobs" : "See General Job Suggestions"} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      );
    };

    export default ResumeAnalysisPage;
  
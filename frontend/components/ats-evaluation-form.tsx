'use client';

import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, CheckCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from './ui/input';
import LinearProgress from '@mui/joy/LinearProgress';
import CircularProgress from '@mui/joy/CircularProgress';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Tooltip from '@mui/material/Tooltip';

interface EvaluationResult {
  ats_score: string;  // Assuming ats_score is a string in the response
  suggestions: string[];
}

export function ATSEvaluationForm() {
  const [jobDescription, setJobDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<EvaluationResult | null>(null);
  const [atsScore, setAtsScore] = useState<number | null>(null);  // Use number type for atsScore

  const onDrop = (acceptedFiles: File[]) => {
    setFile(acceptedFiles[0]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !jobDescription) return;

    setIsEvaluating(true);

    const formData = new FormData();
    formData.append('resume', file);
    formData.append('job_description', jobDescription);

    try {
      const response = await fetch('http://localhost:5000/resume/evaluate_resume', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error('Evaluation failed');

      const result = await response.json();
      setEvaluationResult(result);

      // Debug logs
      // console.log('Raw ATS Score:', result.ats_score);
      // console.log('Type of ATS Score:', typeof result.ats_score);
      
      // Try parsing with additional safeguards
      let parsedScore;
      if (typeof result.ats_score === 'number') {
        parsedScore = result.ats_score;
      } else if (typeof result.ats_score === 'string') {
        parsedScore = parseFloat(result.ats_score.replace(/[^0-9.]/g, ''));
      } else {
        parsedScore = 0;
      }
      console.log('Parsed Score:', parsedScore);
      
      setAtsScore(isNaN(parsedScore) ? 0 : Math.min(Math.max(parsedScore, 0), 100));

    } catch (error) {
      console.error('Evaluation error:', error);
      setAtsScore(0); // Set to 0 in case of error
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Upload Resume</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="jobDescription">Job Description</Label>
              <Input
                id="jobDescription"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Resume (PDF)</Label>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragActive ? 'border-[#2563EB] bg-[#2563EB]/10' : 'border-muted hover:border-[#2563EB]'
                }`}
              >
                <input {...getInputProps()} />
                {file ? (
                  <div className="flex items-center justify-center text-[#2563EB]">
                    <FileText className="mr-2 h-5 w-5" />
                    <span>{file.name}</span>
                  </div>
                ) : (
                  <div>
                    <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">
                      Drag & drop your resume here, or click to select file
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Supported format: PDF
                    </p>
                  </div>
                )}
              </div>
            </div>
            <Button
              type="submit"
              className="w-full bg-[#2563EB] hover:bg-[#2563EB]/90"
              disabled={!file || !jobDescription || isEvaluating}
            >
              {isEvaluating ? 'Evaluating...' : 'Evaluate Resume'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {evaluationResult && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="mr-2 h-5 w-5 text-[#2563EB]" />
                ATS Score
                <Tooltip title="Do not solely rely on our ATS score" arrow>
                  <InfoOutlinedIcon style={{ cursor: 'pointer', fontSize: '20px', color: '#2563EB' }} />
                </Tooltip>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <LinearProgress
                  determinate
                  value={atsScore ? atsScore : 0}  // Use atsScore for the progress bar
                />
                <span className="text-lg font-semibold text-[#2563EB]">
                  {atsScore ? atsScore.toFixed(2) : 0}%  {/* Display ATS score */}
                </span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Suggestions</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-muted-foreground list-disc pl-6">
                {evaluationResult.suggestions.map((suggestion, index) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}

      {!evaluationResult && !isEvaluating && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">
              Upload your resume to see the evaluation result
            </p>
          </CardContent>
        </Card>
      )}

      {isEvaluating && (
        <Card>
          <CardContent className="text-center py-8">
          <CircularProgress />
            <p className="text-[#2563EB]">Perp2pro is Evaluating your resume...</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from './ui/input';
import { Send, Bot, User, Loader2, Upload } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { toast } from "./ui/use-toast";

interface Message {
  role: 'system' | 'user' | 'interviewer';
  content: string;
  timestamp: Date;
}

interface InterviewSession {
  session_id: string;
  interviewer_response: Message[];
  error?: string;
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [domain, setDomain] = useState('SDE');
  const [interviewType, setInterviewType] = useState('TECHNICAL_1');
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeInterview = async () => {
    if (!file) {
      toast({
        title: "Error",
        description: "Please upload your resume first",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append('resume', file);
    formData.append('domain', domain);
    formData.append('type', interviewType);

    try {
      // First check if server is running
      try {
        await fetch('http://localhost:5000/');
      } catch {
        throw new Error(
          'Cannot connect to server. Please ensure that:\n' +
          '1. The backend server is running\n' +
          '2. It is accessible at http://localhost:5000\n' +
          '3. There are no network connectivity issues'
        );
      }

      const response = await fetch('http://localhost:5000/interview/initialize', {
        method: 'POST',
        body: formData,
      });

      try {
        const responseText = await response.text();
        console.log('Server response:', {
          status: response.status,
          contentType: response.headers.get("content-type"),
          text: responseText
        });

        const data: InterviewSession = JSON.parse(responseText);
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to initialize interview');
        }

        if (!data.session_id || !data.interviewer_response) {
          console.error('Invalid response structure:', data);
          throw new Error('Invalid response format from server - missing required fields');
        }

        setSessionId(data.session_id);
        
        const initialMessages = data.interviewer_response.map(msg => ({
          ...msg,
          timestamp: new Date()
        }));
        
        setMessages(initialMessages);
      } catch (error) {
        console.error('Response parsing error:', error);
        throw new Error('Failed to parse server response. Please check server logs.');
      }
    } catch (error) {
      console.error('Interview initialization error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to initialize interview';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading || !sessionId) return;

    const userMessage: Message = {
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    const formData = new FormData();
    formData.append('session_id', sessionId);
    formData.append('user_answer', userMessage.content);

    try {
      const response = await fetch('http://localhost:5000/interview/next_question', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        if (response.status === 408) {
          // Interview concluded
          const data = await response.json();
          const conclusionMessage: Message = {
            role: 'interviewer',
            content: data.message,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, conclusionMessage]);
          setSessionId(null); // End session
          
          // Get improvements
          const improvementsResponse = await fetch('http://localhost:5000/interview/improvements', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
              'session_id': data.session_id
            })
          });
          
          if (improvementsResponse.ok) {
            const improvementsData = await improvementsResponse.json();
            const improvementsMessage: Message = {
              role: 'system',
              content: "Interview Feedback:\n" + improvementsData.improvements,
              timestamp: new Date()
            };
            setMessages(prev => [...prev, improvementsMessage]);
          }
          return;
        }

        // Try to get error message from response
        let errorMessage = 'Failed to get response from server';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          console.error('Failed to parse error response:', e);
        }

        const systemMessage: Message = {
          role: 'system',
          content: errorMessage,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, systemMessage]);
        return;
      }

      const data = await response.json();
      
      if (!data.question) {
        throw new Error('Invalid response format - missing question');
      }

      const botMessage: Message = {
        role: 'interviewer',
        content: data.question,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Interview error:', error);
      const errorMessage: Message = {
        role: 'system',
        content: error instanceof Error ? error.message : "Sorry, I encountered an error. Please try again.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to process your response",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] w-full max-w-2xl mx-auto">
      <Card className="flex-1 bg-gray-800 border border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-100">AI Interview Assistant</CardTitle>
        </CardHeader>
        <CardContent className="p-4 h-full flex flex-col">
          {!sessionId ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-gray-200">Domain</label>
                  <select
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    className="w-full px-3 py-2 rounded-md bg-gray-700 border border-gray-600 text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="SDE">Software Development</option>
                    <option value="DS">Data Science</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-gray-200">Interview Type</label>
                  <select
                    value={interviewType}
                    onChange={(e) => setInterviewType(e.target.value)}
                    className="w-full px-3 py-2 rounded-md bg-gray-700 border border-gray-600 text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="TECHNICAL_1">Technical Round 1</option>
                    <option value="TECHNICAL">Technical</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-gray-200">Resume (PDF)</label>
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                    isDragActive ? 'border-purple-500 bg-purple-500/10' : 'border-gray-600 hover:border-purple-500'
                  }`}
                >
                  <input {...getInputProps()} />
                  {file ? (
                    <div className="flex items-center justify-center text-purple-400">
                      <Upload className="mr-2 h-5 w-5" />
                      <span>{file.name}</span>
                    </div>
                  ) : (
                    <div>
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-400">
                        Drag & drop your resume here, or click to select file
                      </p>
                    </div>
                  )}
                </div>
              </div>
              {error && (
                <div className="text-red-400 text-sm mt-2">
                  {error}
                </div>
              )}
              <Button
                onClick={initializeInterview}
                disabled={!file || isLoading}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  'Start Interview'
                )}
              </Button>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto space-y-4 pb-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex items-start gap-2.5 ${
                      message.role === 'user' ? 'flex-row-reverse' : ''
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      message.role === 'user' ? 'bg-purple-600' : 'bg-gray-600'
                    }`}>
                      {message.role === 'user' ? (
                        <User className="w-5 h-5 text-white" />
                      ) : (
                        <Bot className="w-5 h-5 text-white" />
                      )}
                    </div>
                    <div
                      className={`flex flex-col w-full max-w-[320px] leading-1.5 p-4 border-gray-700 ${
                        message.role === 'user'
                          ? 'bg-purple-600 rounded-s-xl rounded-ee-xl'
                          : 'bg-gray-700 rounded-e-xl rounded-es-xl'
                      }`}
                    >
                      <p className="text-sm font-normal text-gray-100 whitespace-pre-line">
                        {message.content}
                      </p>
                      <span className="text-xs text-gray-400 mt-2">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex items-center gap-2 text-purple-400">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Processing your response...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              
              <form onSubmit={handleSubmit} className="flex gap-2 mt-4">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Type your response..."
                  className="flex-1 bg-gray-700 border-gray-600 text-gray-100 placeholder:text-gray-400"
                />
                <Button
                  type="submit"
                  disabled={!inputMessage.trim() || isLoading}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </form>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 
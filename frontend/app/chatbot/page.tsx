import { ChatInterface } from '@/components/ChatInterface';

export default function InterviewPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold text-gray-100 mb-6">Technical Interview</h1>
      <ChatInterface />
    </div>
  );
}
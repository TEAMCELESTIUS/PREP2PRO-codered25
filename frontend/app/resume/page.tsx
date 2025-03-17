import { ATSEvaluationForm } from '../../components/ats-evaluation-form';

export default function Home() {
  return (
    <main style={{ backgroundColor: '#FFFFFF' }}className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-center">Resume Evaluation</h1>
        <ATSEvaluationForm />
      </div>
    </main>
  );
}



